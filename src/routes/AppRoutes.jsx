import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/navigation/ProtectedRoute';
import { PublicRoute } from '../components/navigation/PublicRoute';
import { Loader } from '../components/common/Loader';

// Lazy-loaded page components for code-splitting and performance
const LoginPage = lazy(() => import('../pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const EditorPage = lazy(() => import('../pages/Editor/EditorPage').then((m) => ({ default: m.EditorPage })));
const SharedDocumentsPage = lazy(() => import('../pages/Shared/SharedDocumentsPage').then((m) => ({ default: m.SharedDocumentsPage })));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullPage text="Loading workspace..." />}>
      <Routes>
        {/* Public Unauthenticated Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Google Docs Editor (Standalone View without Sidebar) */}
          <Route path={ROUTES.EDITOR} element={<EditorPage />} />

          {/* Dashboard & Workspace Standard Layout */}
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.SHARED} element={<SharedDocumentsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback & Redirects */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
