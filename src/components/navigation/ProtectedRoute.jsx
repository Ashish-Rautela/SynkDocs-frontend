import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Loader } from '../common/Loader';
import { tokenStorage } from '../../utils/tokenStorage';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // On mount, give a brief moment for Redux to rehydrate from localStorage.
  // This prevents the flash-redirect to /login on hard refresh when the token
  // exists in localStorage but Redux hasn't initialized yet.
  useEffect(() => {
    // Check if there's a token in localStorage even if Redux says not authenticated yet
    const token = tokenStorage.getAccessToken();
    if (token || isAuthenticated) {
      setIsChecking(false);
    } else {
      // Small delay to let Redux store initialize from localStorage
      const timer = setTimeout(() => setIsChecking(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // While checking auth state, show a brief loader instead of blank screen or flash redirect
  if (isChecking || loading) {
    return <Loader fullPage text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
