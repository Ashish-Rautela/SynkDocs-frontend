import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const ensureArray = (resData) => {
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.collaborators)) return resData.collaborators;
    if (resData.data && typeof resData.data === 'object') {
      if (Array.isArray(resData.data.collaborators)) return resData.data.collaborators;
    }
  }
  return [];
};

export const sharingApi = {
  shareDocument: async ({ documentId, targetUserId, role = 'EDITOR' }) => {
    const isEmail = targetUserId && targetUserId.includes('@');
    const response = await apiClient.post(API_ENDPOINTS.SHARING.SHARE, {
      documentId,
      targetUserId,
      email: isEmail ? targetUserId : undefined,
      role,
    });
    const data = response.data?.data || response.data || {};
    return {
      ...data,
      id: data.userId || data.targetUserId || targetUserId,
      userId: data.userId || data.targetUserId || targetUserId,
      role: data.role || role,
    };
  },

  getCollaborators: async (documentId) => {
    const response = await apiClient.get(API_ENDPOINTS.SHARING.COLLABORATORS(documentId));
    const list = ensureArray(response.data);
    return list.map((collab) => ({
      ...collab,
      id: collab.userId || collab.id,
      userId: collab.userId || collab.id,
    }));
  },

  requestAccess: async ({ documentId, role = 'VIEWER' }) => {
    const response = await apiClient.post(API_ENDPOINTS.SHARING.REQUEST_ACCESS, {
      documentId,
      role,
    });
    return response.data?.data || response.data;
  },

  getPendingRequests: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SHARING.PENDING_REQUESTS);
    return ensureArray(response.data);
  },
};


