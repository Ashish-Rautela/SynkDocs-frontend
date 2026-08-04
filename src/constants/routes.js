export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EDITOR: '/document/:id',
  EDITOR_BUILDER: (id) => `/document/${id}`,
  SHARED: '/shared-documents',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
};
