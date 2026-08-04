const ACCESS_TOKEN_KEY = 'synkdocs_access_token';
const REFRESH_TOKEN_KEY = 'synkdocs_refresh_token';
const USER_KEY = 'synkdocs_user';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  clearAll: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
