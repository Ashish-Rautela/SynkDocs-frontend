import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { shareDocumentStart, fetchCollaboratorsStart } from '../../redux/slices/sharingSlice';
import { addToast } from '../../redux/slices/notificationSlice';
import { useEditor } from '../../hooks/useEditor';
import { useDocument } from '../../hooks/useDocument';
import { Link2, Copy, Check, Lock, Globe, UserPlus } from 'lucide-react';

export const ShareModal = () => {
  const dispatch = useDispatch();
  const { id: paramDocId } = useParams();
  const { currentDocument } = useDocument();
  const { isShareModalOpen, openShareModal } = useEditor();
  const { collaborators, generalAccess, loading } = useSelector((state) => state.sharing);

  const docId = currentDocument?.id || currentDocument?.documentId || paramDocId;

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
              placeholder="Enter User ID (e.g. usr_123) or Email..."
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
                      <p className="text-sm font-medium text-docs-darkText">{c.name || c.userId || c.email}</p>
                      <p className="text-xs text-docs-subtext">ID: {c.userId || c.id}</p>
                    </div>
                  </div>
                  <Badge variant={c.role === 'OWNER' ? 'blue' : 'gray'}>{c.role}</Badge>
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

