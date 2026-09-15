import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from '../common/ToastContainer';
import loginBg from '../../assets/login-bg.jpg';

export const AuthLayout = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Ambient background contrast layer */}
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />

      {/* Floating glass card container */}
      <div className="relative z-10 w-full max-w-[430px] my-auto">
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};
