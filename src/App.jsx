import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { logoutSuccess } from './redux/slices/authSlice';

// Inner component that can use Redux hooks
const AppInner = () => {
  const dispatch = useDispatch();

  // Listen for force-logout events from the axios interceptor (api.js)
  // When the refresh token fails, the interceptor clears localStorage and fires this event.
  // Without this listener, Redux auth state stays stale (isAuthenticated: true) while
  // all API calls fail, causing blank pages.
  useEffect(() => {
    const handleForceLogout = () => {
      dispatch(logoutSuccess());
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
