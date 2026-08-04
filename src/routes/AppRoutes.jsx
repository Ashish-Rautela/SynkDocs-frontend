import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/navigation/ProtectedRoute';
import { PublicRoute } from '../components/navigation/PublicRoute';

import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { EditorPage } from '../pages/Editor/EditorPage';
import { SharedDocumentsPage } from '../pages/Shared/SharedDocumentsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

export const AppRoutes = () => {
  return (
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
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback & Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
