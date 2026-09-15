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
  UserPlus,
  Copy,
  Check,
  X,
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

  const [activeTab, setActiveTab] = useState('INDIVIDUAL');
  const [userInput, setUserInput] = useState('');
  const [roleInput, setRoleInput] = useState('EDITOR');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isShareModalOpen && docId) {
      dispatch(fetchCollaboratorsStart(docId));
      fetchTeams();
    }
  }, [isShareModalOpen, docId, dispatch]);

  const handleShareIndividual = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !docId) return;

    dispatch(
      shareDocumentStart({
        documentId: docId,
        targetUserId: userInput.trim(),
        role: roleInput,
      })
    );
    setUserInput('');
  };

  const handleShareWithTeam = (e) => {
    e.preventDefault();
    if (!selectedTeamId || !docId) return;

    dispatch(
      shareDocumentStart({
        documentId: docId,
        teamId: selectedTeamId,
        role: 'EDITOR',
      })
    );
    setSelectedTeamId('');
  };

  const handleRevoke = (target) => {
    const targetUserId = target.userId || target.id;
    const isTeam = target.targetType === 'TEAM' || target.teamId || (targetUserId && targetUserId.startsWith('TEAM#'));
    const teamId = target.teamId || (isTeam ? targetUserId.replace('TEAM#', '') : undefined);
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
    (c) =>
      c.role !== 'OWNER' &&
      c.userId !== currentDocument?.ownerId &&
      c.id !== currentDocument?.ownerId &&
      !(c.targetType === 'TEAM' || c.teamId || (c.userId && c.userId.startsWith('TEAM#')))
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
      title="Share Document"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('INDIVIDUAL')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'INDIVIDUAL'
                ? 'bg-white text-docs-darkText shadow-xs'
                : 'text-docs-subtext hover:text-docs-darkText'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Share with Individuals ({userCollaborators.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TEAM')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'TEAM'
                ? 'bg-white text-docs-darkText shadow-xs'
                : 'text-docs-subtext hover:text-docs-darkText'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Share with Teams ({teamCollaborators.length})</span>
          </button>
        </div>

        {/* INDIVIDUAL TAB */}
        {activeTab === 'INDIVIDUAL' && (
          <div className="space-y-5">
            <form onSubmit={handleShareIndividual} className="space-y-2">
              <label className="block text-xs font-semibold text-docs-subtext uppercase tracking-wider">
                Add People
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-docs-subtext" />
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter email address..."
                    required
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

                <Button
                  type="submit"
                  disabled={!userInput.trim()}
                  isLoading={loading}
                  variant="primary"
                  className="rounded-xl px-5 whitespace-nowrap"
                >
                  Share
                </Button>
              </div>
            </form>

            {/* People with access list */}
            <div>
              <h4 className="text-xs font-semibold text-docs-subtext uppercase tracking-wider mb-3">
                People with access ({userCollaborators.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {userCollaborators.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-docs-subtext">
                    No individual collaborators added yet.
                  </div>
                ) : (
                  userCollaborators.map((c) => (
                    <div
                      key={c.userId || c.id || c.email}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar src={c.avatarUrl} name={c.name || c.email || c.userId || 'User'} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-docs-darkText truncate">
                            {c.name || c.email || 'User'}
                          </p>
                          {c.email && c.name && (
                            <p className="text-xs text-docs-subtext truncate">{c.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.role?.startsWith('PENDING_') ? (
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
                                className="p-1.5 bg-docs-blue text-white rounded-lg hover:bg-docs-hoverBlue transition-all cursor-pointer"
                                title="Approve request"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevoke(c)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer"
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
                            <Badge variant={c.role === 'EDITOR' ? 'blue' : 'gray'}>{c.role}</Badge>
                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => handleRevoke(c)}
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
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'TEAM' && (
          <div className="space-y-5">
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

                  <Button
                    type="submit"
                    disabled={!selectedTeamId}
                    isLoading={loading}
                    variant="primary"
                    className="rounded-xl px-5 whitespace-nowrap"
                  >
                    Share with Team
                  </Button>
                </div>
                <p className="text-[11px] text-docs-subtext">
                  Member access permissions are automatically applied from each member&apos;s preset team role.
                </p>
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

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
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
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Team Access
                          </span>
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
          </div>
        )}

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
