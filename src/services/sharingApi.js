import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const sharingApi = {
  shareDocument: async ({ documentId, email, role = 'VIEWER' }) => {
    if (USE_MOCK) {
      await mockDelay();
      return {
        id: `collab-${Date.now()}`,
        documentId,
        email,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        name: email.split('@')[0],
      };
    }
    const response = await apiClient.post(API_ENDPOINTS.DOCUMENTS.SHARE(documentId), { email, role });
    return response.data;
  },

  updatePermission: async ({ documentId, userId, role }) => {
    if (USE_MOCK) {
      await mockDelay(200);
      return { documentId, userId, role };
    }
    const response = await apiClient.put(API_ENDPOINTS.DOCUMENTS.SHARE(documentId), { userId, role });
    return response.data;
  },
};
