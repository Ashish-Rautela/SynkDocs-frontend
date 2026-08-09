import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from '../common/ToastContainer';
import { FileText, ShieldCheck, Zap, Users } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-docs-bg">
      {/* Left side banner */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-docs-blue to-docs-hoverBlue text-white p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link to={ROUTES.LOGIN} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SynkDocs</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Create, Share, and Collaborate in Real Time
          </h1>
          <p className="text-blue-100 text-base leading-relaxed">
            SynkDocs brings your team together with lightning-fast document editing, seamless sharing, and secure access control.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-sm font-medium">Real-time collaborative editing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-sm font-medium">Secure and reliable access</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Users className="w-5 h-5 text-blue-200" />
              </div>
              <span className="text-sm font-medium">Easy document sharing and permissions</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200">
          © {new Date().getFullYear()} SynkDocs Inc. All rights reserved.
        </div>
      </div>

      {/* Right side authentication form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
