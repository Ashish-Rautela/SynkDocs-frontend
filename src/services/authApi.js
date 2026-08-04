import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials) => {
    if (USE_MOCK) {
      await mockDelay();
      const userName = credentials.email ? credentials.email.split('@')[0] : 'User';
      return {
        user: {
          id: `usr-${Date.now()}`,
          name: userName,
          email: credentials.email,
          avatarUrl: '',
          role: 'Member',
        },
        accessToken: `jwt_access_token_${Date.now()}`,
        refreshToken: `jwt_refresh_token_${Date.now()}`,
      };
    }
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    if (USE_MOCK) {
      await mockDelay();
      return {
        user: {
          id: `usr-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          avatarUrl: '',
          role: 'Member',
        },
        accessToken: `jwt_access_token_${Date.now()}`,
        refreshToken: `jwt_refresh_token_${Date.now()}`,
      };
    }
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    if (USE_MOCK) {
      await mockDelay(200);
      return null;
    }
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: async () => {
    if (USE_MOCK) {
      await mockDelay(200);
      return { success: true };
    }
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};
