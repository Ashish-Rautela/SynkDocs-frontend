import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../redux/slices/notificationSlice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.notification.toasts);

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-docs-blue shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-4 bg-white border border-docs-border rounded-xl shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center gap-3">
            {icons[toast.type] || icons.info}
            <p className="text-sm font-medium text-docs-darkText">{toast.message}</p>
          </div>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="p-1 text-docs-subtext hover:bg-gray-100 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
