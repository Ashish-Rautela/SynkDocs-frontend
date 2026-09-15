import React, { useState, useEffect } from 'react';
import { useTeam } from '../../hooks/useTeam';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { Dropdown } from '../../components/common/Dropdown';
import {
  Building2,
  Users,
  Plus,
  Shield,
  ShieldCheck,
  User,
  Trash2,
  MoreVertical,
  UserPlus,
  UserMinus,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TeamsPage = () => {
  const {
    teams,
    currentTeam,
    loading,
    currentUserId,
    fetchTeams,
    fetchTeamDetails,
    createTeam,
    addMember,
    updateMemberRole,
    removeMember,
    deleteTeam,
    clearTeam,
  } = useTeam();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('MEMBER');

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    createTeam({ name: teamName.trim(), description: teamDesc.trim() });
    setTeamName('');
    setTeamDesc('');
    setIsCreateModalOpen(false);
  };

  const handleOpenTeam = (team) => {
    setSelectedTeam(team);
    fetchTeamDetails(team.id || team.teamId);
  };

  const handleCloseTeamModal = () => {
    setSelectedTeam(null);
    clearTeam();
    setMemberEmail('');
    setMemberRole('MEMBER');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberEmail.trim() || !selectedTeam) return;
    addMember({
      teamId: selectedTeam.id || selectedTeam.teamId,
      email: memberEmail.trim(),
      role: memberRole,
    });
    setMemberEmail('');
  };

  const activeTeam = currentTeam || selectedTeam;
  const isOwner = activeTeam && (activeTeam.ownerId === currentUserId || activeTeam.userRole === 'OWNER');
  const callerRole = activeTeam?.userRole || (isOwner ? 'OWNER' : 'MEMBER');
  const canManageMembers = isOwner || callerRole === 'ADMIN';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-docs-border">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-docs-darkText">Teams & Workspaces</h1>
            <p className="text-xs text-docs-subtext mt-0.5">
              Organize members into teams and share documents directly with entire groups.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={Plus}
          className="rounded-xl shadow-sm"
        >
          Create Team
        </Button>
      </div>

      {/* Teams Grid */}
      {loading && teams.length === 0 ? (
        <Loader text="Loading your teams..." />
      ) : teams.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-docs-border shadow-sm space-y-4 max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-docs-darkText">No teams yet</h3>
            <p className="text-xs text-docs-subtext mt-1 max-w-xs mx-auto">
              Create a team to group your collaborators and share documents with everyone in one click.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
            className="rounded-xl"
          >
            Create Your First Team
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => {
            const teamId = team.id || team.teamId;
            const isTeamOwner = team.ownerId === currentUserId || team.userRole === 'OWNER';

            return (
              <div
                key={teamId}
                className="bg-white border border-docs-border rounded-2xl p-5 hover:shadow-docs-card transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-docs-darkText truncate">{team.name}</h3>
                      <span className="text-xs text-docs-subtext">
                        {team.membersCount || 1} {team.membersCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                        isTeamOwner
                          ? 'bg-blue-50 text-docs-blue border border-blue-200'
                          : team.userRole === 'ADMIN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {isTeamOwner ? 'Owner' : team.userRole || 'Member'}
                    </span>

                    {isTeamOwner && (
                      <Dropdown
                        align="right"
                        trigger={
                          <button className="p-1 text-docs-subtext hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          {
                            label: 'Delete Team',
                            icon: Trash2,
                            danger: true,
                            onClick: () => {
                              if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
                                deleteTeam(teamId);
                              }
                            },
                          },
                        ]}
                      />
                    )}
                  </div>
                </div>

                {team.description ? (
                  <p className="text-xs text-docs-subtext line-clamp-2">{team.description}</p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No description provided</p>
                )}

                <div className="pt-3 border-t border-docs-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-docs-subtext">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{team.membersCount || 1} Total</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenTeam(team)}
                    className="rounded-lg text-xs"
                  >
                    Manage Team
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Team"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-docs-darkText mb-1.5">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Core Engineering, Product Design"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-docs-darkText mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              placeholder="What does this team do?"
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="rounded-xl"
            >
              Create Team
            </Button>
          </div>
        </form>
      </Modal>

      {/* Team Detail / Member Management Modal */}
      {selectedTeam && (
        <Modal
          isOpen={Boolean(selectedTeam)}
          onClose={handleCloseTeamModal}
          title={`Manage Team: ${activeTeam?.name || selectedTeam.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Team Summary Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-docs-darkText">{activeTeam?.name}</h4>
                {activeTeam?.description && (
                  <p className="text-xs text-docs-subtext mt-1">{activeTeam.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-docs-subtext">
                  <span>Created {new Date(activeTeam?.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Your Role: <strong>{callerRole}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold shadow-xs">
                  {activeTeam?.members?.length || activeTeam?.membersCount || 1} Members
                </span>
              </div>
            </div>

            {/* Add Member Form (Admins & Owners only) */}
            {canManageMembers && (
              <form onSubmit={handleAddMember} className="space-y-2">
                <label className="block text-xs font-semibold text-docs-darkText uppercase tracking-wider">
                  Add Member to Team
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-docs-subtext" />
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Enter user email address..."
                      required
                      className="w-full pl-10 pr-4 py-2 bg-white border border-docs-border rounded-xl text-sm text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
                    />
                  </div>

                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="px-3 py-2 bg-white border border-docs-border rounded-xl text-sm font-medium text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue cursor-pointer"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <Button type="submit" variant="primary" size="sm" className="rounded-xl px-4">
                    Add
                  </Button>
                </div>
              </form>
            )}

            {/* Members List */}
            <div>
              <h4 className="text-xs font-semibold text-docs-subtext uppercase tracking-wider mb-3">
                Team Members ({activeTeam?.members?.length || 1})
              </h4>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(activeTeam?.members || [
                  {
                    userId: activeTeam?.ownerId,
                    name: 'Owner',
                    email: 'Team Owner',
                    role: 'OWNER',
                  },
                ]).map((member) => {
                  const mId = member.userId || member.id;
                  const isMemberOwner = member.role === 'OWNER' || mId === activeTeam?.ownerId;
                  const isSelf = mId === currentUserId;

                  return (
                    <div
                      key={mId || member.email}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={member.name || member.email} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-docs-darkText truncate">
                            {member.name || member.email?.split('@')[0]}
                            {isSelf && <span className="ml-1.5 text-xs text-docs-blue font-normal">(You)</span>}
                          </p>
                          <p className="text-xs text-docs-subtext truncate">{member.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isMemberOwner
                              ? 'bg-blue-50 text-docs-blue border-blue-200'
                              : member.role === 'ADMIN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {isMemberOwner ? 'OWNER' : member.role || 'MEMBER'}
                        </span>

                        {/* Action buttons */}
                        {canManageMembers && !isMemberOwner && !isSelf && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateMemberRole({
                                  teamId: selectedTeam.id || selectedTeam.teamId,
                                  memberId: mId,
                                  role: member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
                                })
                              }
                              className="p-1.5 text-docs-subtext hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium"
                              title={member.role === 'ADMIN' ? 'Demote to Member' : 'Promote to Admin'}
                            >
                              {member.role === 'ADMIN' ? (
                                <Shield className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <ShieldCheck className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove ${member.email} from the team?`)) {
                                  removeMember({
                                    teamId: selectedTeam.id || selectedTeam.teamId,
                                    memberId: mId,
                                  });
                                }
                              }}
                              className="p-1.5 text-docs-subtext hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from team"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Member self leave */}
                        {isSelf && !isMemberOwner && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Are you sure you want to leave this team?')) {
                                removeMember({
                                  teamId: selectedTeam.id || selectedTeam.teamId,
                                  memberId: mId,
                                });
                                handleCloseTeamModal();
                              }
                            }}
                            className="text-xs text-red-600 hover:underline px-2 py-1"
                          >
                            Leave Team
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-docs-border flex justify-end">
              <Button variant="primary" onClick={handleCloseTeamModal} className="rounded-xl">
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TeamsPage;
