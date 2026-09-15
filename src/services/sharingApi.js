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
  shareDocument: async ({ documentId, teamId, targetUserId, role = 'EDITOR' }) => {
    const isEmail = targetUserId && targetUserId.includes('@');
    try {
      const response = await apiClient.post(API_ENDPOINTS.SHARING.SHARE, {
        documentId,
        teamId,
        targetUserId: teamId ? `TEAM#${teamId}` : targetUserId,
        email: isEmail ? targetUserId : undefined,
        role,
      });
      const data = response.data?.data || response.data || {};
      return {
        ...data,
        id: data.teamId ? `TEAM#${data.teamId}` : (data.userId || data.targetUserId || targetUserId),
        userId: data.teamId ? `TEAM#${data.teamId}` : (data.userId || data.targetUserId || targetUserId),
        targetType: teamId ? 'TEAM' : (data.targetType || 'USER'),
        teamId: data.teamId || teamId,
        role: data.role || role,
      };
    } catch (err) {
      // Local fallback for team share if API endpoint is not yet live
      if (teamId) {
        try {
          const rawShares = localStorage.getItem('synkdocs_doc_shares') || '{}';
          const docShares = JSON.parse(rawShares);
          const current = docShares[documentId] || [];
          const updated = [
            ...current.filter((c) => c.teamId !== teamId && c.id !== `TEAM#${teamId}`),
            {
              id: `TEAM#${teamId}`,
              userId: `TEAM#${teamId}`,
              teamId,
              targetType: 'TEAM',
              role,
              documentId,
            },
          ];
          docShares[documentId] = updated;
          localStorage.setItem('synkdocs_doc_shares', JSON.stringify(docShares));

          return {
            id: `TEAM#${teamId}`,
            userId: `TEAM#${teamId}`,
            teamId,
            targetType: 'TEAM',
            role,
            documentId,
          };
        } catch (e) {
          // ignore
        }
      }
      throw err;
    }
  },

  getCollaborators: async (documentId) => {
    let list = [];
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHARING.COLLABORATORS(documentId));
      list = ensureArray(response.data);
    } catch (err) {
      // ignore
    }

    // Merge any locally stored team shares for this document
    try {
      const rawShares = localStorage.getItem('synkdocs_doc_shares') || '{}';
      const docShares = JSON.parse(rawShares);
      const localTeamShares = docShares[documentId] || [];
      for (const localShare of localTeamShares) {
        if (!list.some((c) => (c.teamId && c.teamId === localShare.teamId) || c.id === localShare.id)) {
          list.push(localShare);
        }
      }
    } catch (e) {}

    return list.map((collab) => ({
      ...collab,
      id: collab.teamId ? `TEAM#${collab.teamId}` : (collab.userId || collab.id),
      userId: collab.teamId ? `TEAM#${collab.teamId}` : (collab.userId || collab.id),
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

  revokeAccess: async ({ documentId, userId, teamId }) => {
    const targetUserId = teamId ? (teamId.startsWith('TEAM#') ? teamId : `TEAM#${teamId}`) : userId;
    try {
      await apiClient.delete(API_ENDPOINTS.SHARING.SHARE, {
        data: {
          documentId,
          targetUserId,
          teamId,
        },
      });
    } catch (err) {
      // ignore
    }

    // Clean up local shares if any
    try {
      const rawShares = localStorage.getItem('synkdocs_doc_shares') || '{}';
      const docShares = JSON.parse(rawShares);
      if (docShares[documentId]) {
        docShares[documentId] = docShares[documentId].filter(
          (c) => c.userId !== targetUserId && c.id !== targetUserId && c.teamId !== teamId
        );
        localStorage.setItem('synkdocs_doc_shares', JSON.stringify(docShares));
      }
    } catch (e) {}

    return { documentId, targetUserId };
  },
};
