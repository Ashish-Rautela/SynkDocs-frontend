import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileApi = {
  getProfile: async () => {
    if (USE_MOCK) {
      await mockDelay();
      return {
        id: '',
        name: '',
        email: '',
        bio: '',
        avatarUrl: '',
        role: '',
        preferences: {
          theme: 'light',
          autoSaveFrequency: 3000,
          emailNotifications: true,
        },
      };
    }
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      await mockDelay();
      return {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.put(API_ENDPOINTS.USER.PROFILE, profileData);
    return response.data;
  },
};
