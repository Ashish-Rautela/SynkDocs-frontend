import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authApi = {
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });

    const resData = response.data?.data || response.data || {};
    const tokensObj = resData.tokens || resData;

    if (tokensObj?.accessToken || tokensObj?.token) {
      const accessToken = tokensObj.accessToken || tokensObj.token;
      const refreshToken = tokensObj.refreshToken || accessToken;
      const userObj = resData.user || resData;
      return {
        user: {
          id: userObj.userId || userObj.id,
          userId: userObj.userId || userObj.id,
          email: userObj.email,
          name: userObj.name,
        },
        accessToken,
        refreshToken,
        token: accessToken,
      };
    }

    // Auto-login to obtain JWT access token after registration
    return await authApi.login({
      email: userData.email,
      password: userData.password,
    });
  },


  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });

    // Response structure from backend:
    // {
    //   "success": true,
    //   "message": "Login successful",
    //   "data": {
    //     "user": { "userId": "...", "email": "...", "name": "..." },
    //     "tokens": { "accessToken": "...", "refreshToken": "..." }
    //   }
    // }
    const resData = response.data?.data || response.data || {};
    const tokensObj = resData.tokens || resData;
    const userObj = resData.user || {};

    const accessToken = tokensObj.accessToken || tokensObj.token || resData.token;
    const refreshToken = tokensObj.refreshToken || resData.refreshToken;

    return {
      user: {
        id: userObj.userId || userObj.id,
        userId: userObj.userId || userObj.id,
        email: userObj.email,
        name: userObj.name,
      },
      accessToken,
      refreshToken,
      token: accessToken,
    };
  },



  refreshToken: async (refreshTokenStr) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken: refreshTokenStr,
    });
    return response.data?.data || response.data;
  },

  healthCheck: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.HEALTH);
    return response.data;
  },

  logout: async () => {
    return { success: true };
  },
};

