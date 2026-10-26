export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EDITOR: '/document/:id',
  EDITOR_BUILDER: (id) => `/document/${id}`,
  SHARED: '/shared-documents',
  TEAMS: '/teams',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
};
