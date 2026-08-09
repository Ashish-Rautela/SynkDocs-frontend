import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import {
  shareDocumentStart,
  fetchCollaboratorsStart,
  denyRequestStart,
} from '../../redux/slices/sharingSlice';
import { addToast } from '../../redux/slices/notificationSlice';
import { useEditor } from '../../hooks/useEditor';
import { useDocument } from '../../hooks/useDocument';
import { useAuth } from '../../hooks/useAuth';
import { Link2, Copy, Check, Lock, Globe, UserPlus, X, Trash2 } from 'lucide-react';

export const ShareModal = () => {
  const dispatch = useDispatch();
  const { id: paramDocId } = useParams();
  const { currentDocument } = useDocument();
  const { isShareModalOpen, openShareModal } = useEditor();
  const { user: currentUser } = useAuth();
  const { collaborators, generalAccess, loading } = useSelector((state) => state.sharing);

  const docId = currentDocument?.id || currentDocument?.documentId || paramDocId;

  const isOwner = currentDocument?.ownerId === currentUser?.userId ||
                  collaborators.some(
                    (c) => c.role === 'OWNER' && (c.userId === currentUser?.userId || c.id === currentUser?.userId)
                  );

  const [userInput, setUserInput] = useState('');
  const [roleInput, setRoleInput] = useState('EDITOR');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isShareModalOpen && docId) {
      dispatch(fetchCollaboratorsStart(docId));
    }
  }, [isShareModalOpen, docId, dispatch]);

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!userInput || !docId) return;
    dispatch(
      shareDocumentStart({
        documentId: docId,
        targetUserId: userInput,
        role: roleInput,
      })
    );
    setUserInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    dispatch(addToast({ type: 'success', message: 'Share link copied to clipboard!' }));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isShareModalOpen}
      onClose={() => openShareModal(false)}
      title="Share document with collaborators"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Invitation Form */}
        <form onSubmit={handleSendInvite} className="flex gap-2">
          <div className="relative flex-1">
            <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-docs-subtext" />
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter email address..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
            />
          </div>
          <select
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            className="px-3 py-2.5 bg-white border border-docs-border rounded-xl text-sm font-medium text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue cursor-pointer"
          >
            <option value="VIEWER">Viewer</option>
            <option value="COMMENTER">Commenter</option>
            <option value="EDITOR">Editor</option>
          </select>
          <Button type="submit" isLoading={loading} variant="primary">
            Share
          </Button>
        </form>

        {/* Collaborators List */}
        <div>
          <h4 className="text-xs font-semibold text-docs-subtext uppercase tracking-wider mb-3">
            People with access ({collaborators.length})
          </h4>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {collaborators.length === 0 ? (
              <p className="text-xs text-docs-subtext py-2">No collaborators added yet.</p>
            ) : (
              collaborators.map((c) => (
                <div key={c.userId || c.id || c.email} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar src={c.avatarUrl} name={c.name || c.email || c.userId || 'User'} size="md" />
                    <div>
                      <p className="text-sm font-medium text-docs-darkText">{c.name || c.email || 'User'}</p>
                      {c.email && c.name && <p className="text-xs text-docs-subtext">{c.email}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {c.role.startsWith('PENDING_') ? (
                      isOwner ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                shareDocumentStart({
                                  documentId: docId,
                                  targetUserId: c.userId || c.id,
                                  role: c.role.replace('PENDING_', ''),
                                })
                              )
                            }
                            className="p-1 bg-docs-blue text-white rounded-lg hover:bg-docs-hoverBlue transition-all cursor-pointer"
                            title="Approve request"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                denyRequestStart({
                                  documentId: docId,
                                  userId: c.userId || c.id,
                                })
                              )
                            }
                            className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
                            title="Deny request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Badge variant="amber">{c.role}</Badge>
                      )
                    ) : (
                      <>
                        <Badge variant={c.role === 'OWNER' ? 'blue' : 'gray'}>{c.role}</Badge>
                        {isOwner && c.role !== 'OWNER' && (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                denyRequestStart({
                                  documentId: docId,
                                  userId: c.userId || c.id,
                                })
                              )
                            }
                            className="p-1.5 text-docs-subtext hover:text-red-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                            title="Revoke access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* General Access Options */}
        <div className="pt-4 border-t border-docs-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-docs-blue">
              {generalAccess === 'RESTRICTED' ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-docs-darkText">General access</p>
              <p className="text-xs text-docs-subtext">
                {generalAccess === 'RESTRICTED' ? 'Only added people can open with link' : 'Anyone on the internet with link can view'}
              </p>
            </div>
          </div>
        </div>

        {/* Copy Link Footer */}
        <div className="pt-4 border-t border-docs-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            icon={copied ? Check : Copy}
            className="rounded-full"
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </Button>

          <Button variant="primary" onClick={() => openShareModal(false)}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

