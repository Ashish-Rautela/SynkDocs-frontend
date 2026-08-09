import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPendingRequestsStart,
  shareDocumentStart,
  denyRequestStart,
} from '../../redux/slices/sharingSlice';
import { formatRelativeTime } from '../../utils/formatters';
import { Check, X, Bell } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const PendingRequestsList = () => {
  const dispatch = useDispatch();
  const { pendingRequests, requestsLoading, loading } = useSelector((state) => state.sharing);

  useEffect(() => {
    dispatch(fetchPendingRequestsStart());
  }, [dispatch]);

  if (requestsLoading || !pendingRequests || pendingRequests.length === 0) {
    return null;
  }

  const handleApprove = (req) => {
    dispatch(
      shareDocumentStart({
        documentId: req.documentId,
        targetUserId: req.userId,
        role: req.requestedRole || 'EDITOR',
      })
    );
  };

  const handleDeny = (req) => {
    dispatch(
      denyRequestStart({
        documentId: req.documentId,
        userId: req.userId,
      })
    );
  };

  return (
    <section className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-amber-900">Access Requests</h2>
          <p className="text-[11px] text-amber-700">Other collaborators have requested permission to view or edit your documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingRequests.map((req) => (
          <div
            key={`${req.documentId}-${req.userId}`}
            className="flex items-center justify-between p-3.5 bg-white border border-amber-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar src={req.avatarUrl} name={req.name || req.email} size="md" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-docs-darkText truncate">
                  {req.name || req.email}
                </p>
                <p className="text-[10px] text-docs-subtext truncate">
                  Wants to {req.requestedRole === 'EDITOR' ? 'edit' : 'view'} <span className="font-semibold text-docs-darkText">"{req.documentTitle}"</span>
                </p>
                <p className="text-[9px] text-amber-600 font-medium mt-0.5">
                  Requested {formatRelativeTime(req.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleApprove(req)}
                disabled={loading}
                className="w-8 h-8 rounded-xl bg-docs-blue text-white flex items-center justify-center hover:bg-docs-hoverBlue shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                title="Approve & Share"
              >
                <Check className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDeny(req)}
                disabled={loading}
                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
                title="Deny Request"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
