import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { addToast } from '../../redux/slices/notificationSlice';
import { ROUTES } from '../../constants/routes';
import { Lock, ArrowLeft, Send, Check } from 'lucide-react';

export const AccessDeniedModal = ({ isOpen, onClose, errorMessage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [requested, setRequested] = useState(false);

  const handleRequestAccess = () => {
    setRequested(true);
    dispatch(
      addToast({
        type: 'success',
        message: 'Access request notification sent to document owner!',
      })
    );
  };

  const handleGoBack = () => {
    if (onClose) onClose();
    navigate(ROUTES.DASHBOARD);
  };

  const displayMessage =
    !errorMessage ||
    errorMessage.includes('status code') ||
    errorMessage.includes('403') ||
    errorMessage.includes('404')
      ? 'You currently do not have permission to view or edit this file.'
      : errorMessage;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleGoBack}
      title="Access Restricted"
      maxWidth="max-w-md"
      showCloseButton={false}
    >
      <div className="space-y-5 text-center sm:text-left select-none">
        {/* Header Icon & Alert Badge */}
        <div className="flex items-center gap-3.5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">You need permission to access this document</h4>
            <p className="text-xs text-amber-700 mt-0.5">{displayMessage}</p>
          </div>
        </div>

        {/* User context box */}
        <div className="p-3.5 bg-gray-50 border border-docs-border rounded-xl space-y-1">
          <p className="text-[11px] font-semibold text-docs-subtext uppercase tracking-wider">
            Signed in as
          </p>
          <p className="text-sm font-bold text-docs-darkText truncate">
            {user?.email || user?.name || 'Current User'}
          </p>
        </div>

        <p className="text-xs text-docs-subtext leading-relaxed">
          Ask the document owner for edit or view access. Once permission is granted, refresh this page to start collaborating.
        </p>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-docs-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleGoBack}
            icon={ArrowLeft}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>

          <Button
            variant="primary"
            onClick={handleRequestAccess}
            disabled={requested}
            icon={requested ? Check : Send}
            className="w-full sm:w-auto"
          >
            {requested ? 'Request Sent' : 'Request Access'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
