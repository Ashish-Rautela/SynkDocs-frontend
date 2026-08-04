import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout = ({ showSearch = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-docs-bg text-docs-darkText">
      <Header showSearch={showSearch} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
