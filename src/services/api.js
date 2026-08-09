import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://synkapi.ashishrautela.in';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// JWT Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || tokenStorage.getAccessToken();
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh and Logout Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || '';

    // Do NOT attempt token refresh for login, register, or refresh-token requests
    const isAuthEndpoint =
      requestUrl.includes('/login') ||
      requestUrl.includes('/register') ||
      requestUrl.includes('/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken') || tokenStorage.getRefreshToken();
        if (!refreshToken) {
          // No refresh token — force logout and reject with the ORIGINAL error
          // so the calling code (e.g. documentSaga) sees the real 401/403/404 message,
          // not a misleading "No refresh token available" message.
          tokenStorage.clearAll();
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
          refreshToken,
        });

        const newAccessToken = data?.data?.accessToken || data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Session expired. Please log in again.');
        }

        tokenStorage.setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearAll();
        window.dispatchEvent(new Event('auth:logout'));
        // Reject with the original error if refresh failed, preserving the real status code
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
