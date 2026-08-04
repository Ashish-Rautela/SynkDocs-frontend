import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-docs-bg p-6">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-docs-border shadow-docs-card space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-docs-blue flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-docs-darkText">404</h1>
          <h2 className="text-lg font-bold text-docs-darkText">Document Not Found</h2>
          <p className="text-xs text-docs-subtext leading-relaxed">
            The document or page you are attempting to access does not exist or has been moved.
          </p>
        </div>

        <Button
          variant="primary"
          icon={ArrowLeft}
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="w-full"
        >
          Return to Workspace Dashboard
        </Button>
      </div>
    </div>
  );
};
