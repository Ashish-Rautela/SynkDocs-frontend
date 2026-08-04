export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id) => `/documents/${id}`,
    STAR: (id) => `/documents/${id}/star`,
    SHARE: (id) => `/documents/${id}/share`,
    VERSIONS: (id) => `/documents/${id}/versions`,
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
};
