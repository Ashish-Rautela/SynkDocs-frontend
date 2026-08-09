import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    // Response (200 OK):
    // { success: true, data: { userId: "...", email: "...", name: "...", bio: "..." } }
    const data = response.data?.data || response.data;
    return {
      ...data,
      id: data.userId || data.id,
      userId: data.userId || data.id,
    };
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put(API_ENDPOINTS.USER.PROFILE, {
      name: profileData.name,
      bio: profileData.bio,
    });
    // Response (200 OK):
    // { success: true, message: "Profile updated successfully", data: { name: "...", bio: "..." } }
    const data = response.data?.data || response.data;
    return data;
  },
};

