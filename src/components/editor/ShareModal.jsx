import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useTeam } from '../../hooks/useTeam';
import { ROUTES } from '../../constants/routes';
import {
  Building2,
  Users,
  Copy,
  Check,
  Lock,
  Globe,
  Trash2,
  Plus,
  ExternalLink,
} from 'lucide-react';

export const ShareModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: paramDocId } = useParams();
  const { currentDocument } = useDocument();
  const { isShareModalOpen, openShareModal } = useEditor();
  const { user: currentUser } = useAuth();
  const { teams, fetchTeams } = useTeam();
  const { collaborators, generalAccess, loading } = useSelector((state) => state.sharing);

  const docId = currentDocument?.id || currentDocument?.documentId || paramDocId;

  const isOwner =
    currentDocument?.ownerId === currentUser?.userId ||
    collaborators.some(
      (c) => c.role === 'OWNER' && (c.userId === currentUser?.userId || c.id === currentUser?.userId)
    );

  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [roleInput, setRoleInput] = useState('EDITOR');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isShareModalOpen && docId) {
      dispatch(fetchCollaboratorsStart(docId));
      fetchTeams();
    }
  }, [isShareModalOpen, docId, dispatch]);

  const handleShareWithTeam = (e) => {
    e.preventDefault();
    if (!selectedTeamId || !docId) return;

    dispatch(
      shareDocumentStart({
        documentId: docId,
        teamId: selectedTeamId,
        role: roleInput,
      })
    );
    setSelectedTeamId('');
  };

  const handleRevoke = (target) => {
    const targetUserId = target.userId || target.id;
    const teamId = target.teamId || (target.targetType === 'TEAM' ? targetUserId.replace('TEAM#', '') : undefined);
    dispatch(
      denyRequestStart({
        documentId: docId,
        userId: targetUserId,
        teamId,
      })
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    dispatch(addToast({ type: 'success', message: 'Share link copied to clipboard!' }));
    setTimeout(() => setCopied(false), 2000);
  };

  const teamCollaborators = collaborators.filter(
    (c) => c.targetType === 'TEAM' || c.teamId || (c.userId && c.userId.startsWith('TEAM#'))
  );

  const userCollaborators = collaborators.filter(
    (c) => !(c.targetType === 'TEAM' || c.teamId || (c.userId && c.userId.startsWith('TEAM#')))
  );

  // Teams that are not already given access to this document
  const availableTeams = teams.filter((t) => {
    const tId = t.id || t.teamId;
    return !teamCollaborators.some(
      (tc) => tc.teamId === tId || tc.userId === `TEAM#${tId}` || tc.id === `TEAM#${tId}`
    );
  });

  return (
    <Modal
      isOpen={isShareModalOpen}
      onClose={() => openShareModal(false)}
      title="Share Document with Team"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Team Sharing Form */}
        {teams.length === 0 ? (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-docs-darkText">No teams available</h4>
                <p className="text-xs text-docs-subtext mt-0.5">
                  Create a team to easily share documents with multiple collaborators at once.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                openShareModal(false);
                navigate(ROUTES.TEAMS);
              }}
              className="rounded-xl shrink-0"
            >
              Create Team
            </Button>
          </div>
        ) : (
          <form onSubmit={handleShareWithTeam} className="space-y-2">
            <label className="block text-xs font-semibold text-docs-subtext uppercase tracking-wider">
              Add Team Access
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-docs-subtext" />
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue cursor-pointer"
                >
                  <option value="">Select a team...</option>
                  {availableTeams.map((team) => (
                    <option key={team.id || team.teamId} value={team.id || team.teamId}>
                      {team.name} ({team.membersCount || 1} {team.membersCount === 1 ? 'member' : 'members'})
                    </option>
                  ))}
                  {availableTeams.length === 0 && (
                    <option disabled value="">All your teams already have access</option>
                  )}
                </select>
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

              <Button
                type="submit"
                disabled={!selectedTeamId}
                isLoading={loading}
                variant="primary"
                className="rounded-xl px-4"
              >
                Share with Team
              </Button>
            </div>
          </form>
        )}

        {/* Teams with Access List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-docs-subtext uppercase tracking-wider">
              Teams with access ({teamCollaborators.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                openShareModal(false);
                navigate(ROUTES.TEAMS);
              }}
              className="text-xs text-docs-blue hover:underline flex items-center gap-1 font-medium"
            >
              <span>Manage teams</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {teamCollaborators.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-docs-subtext">
                No teams have been granted access to this document yet.
              </div>
            ) : (
              teamCollaborators.map((c) => {
                const teamName = c.teamName || c.name || 'Team';
                const memberCount = c.membersCount;

                return (
                  <div
                    key={c.userId || c.id || c.teamId}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-docs-darkText truncate">{teamName}</p>
                        <p className="text-xs text-docs-subtext">
                          Team • {memberCount ? `${memberCount} members` : 'All team members have access'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={c.role === 'EDITOR' ? 'blue' : 'gray'}>{c.role}</Badge>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(c)}
                          className="p-1.5 text-docs-subtext hover:text-red-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                          title="Revoke team access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Document Owner */}
        <div>
          <h4 className="text-xs font-semibold text-docs-subtext uppercase tracking-wider mb-2">
            Document Owner
          </h4>
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 border border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={currentDocument?.owner?.avatarUrl || currentUser?.avatarUrl}
                name={currentDocument?.owner?.name || currentUser?.name || 'Owner'}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-docs-darkText">
                  {currentDocument?.owner?.name || currentUser?.name || 'You (Owner)'}
                </p>
                <p className="text-xs text-docs-subtext">
                  {currentDocument?.owner?.email || currentUser?.email}
                </p>
              </div>
            </div>
            <Badge variant="blue">OWNER</Badge>
          </div>
        </div>

        {/* Copy Link Footer */}
        <div className="pt-4 border-t border-docs-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            icon={copied ? Check : Copy}
            className="rounded-xl"
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </Button>

          <Button variant="primary" onClick={() => openShareModal(false)} className="rounded-xl">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
