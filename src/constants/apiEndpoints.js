export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    HEALTH: '/auth/health',
  },
  USER: {
    PROFILE: '/users/profile',
  },
  DOCUMENTS: {
    BASE: '/documents/documents',
    BY_ID: (documentId) => `/documents/documents/${documentId}`,
  },
  SHARING: {
    SHARE: '/sharing/documents/share',
    COLLABORATORS: (documentId) => `/sharing/documents/${documentId}/collaborators`,
  },
  SEARCH: {
    DOCUMENTS: (query) => `/search/documents/search?q=${encodeURIComponent(query)}`,
  },
};

