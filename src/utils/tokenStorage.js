const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenStorage = {
  getAccessToken: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem('token') || localStorage.getItem('synkdocs_access_token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  },
  setAccessToken: (token) => {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('synkdocs_access_token', token);
    }
  },
  removeAccessToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('synkdocs_access_token');
  },

  getRefreshToken: () => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem('synkdocs_refresh_token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  },
  setRefreshToken: (token) => {
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem('refreshToken', token);
      localStorage.setItem('synkdocs_refresh_token', token);
    }
  },
  removeRefreshToken: () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('synkdocs_refresh_token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user') || localStorage.getItem('synkdocs_user');
    try {
      return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('synkdocs_user', JSON.stringify(user));
    }
  },
  removeUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('synkdocs_user');
  },

  clearAll: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('synkdocs_access_token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('synkdocs_refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('synkdocs_user');
  },
};


