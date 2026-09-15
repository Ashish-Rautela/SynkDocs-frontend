import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const STORAGE_KEY = 'synkdocs_teams_local';

const getLocalTeams = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalTeams = (teams) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.warn('Failed to save teams to localStorage:', e);
  }
};

export const teamApi = {
  getTeams: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TEAMS.BASE);
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      // If API returns empty or success, merge with local if available
      const local = getLocalTeams();
      return local.length > 0 ? local : (Array.isArray(data) ? data : []);
    } catch (err) {
      // Fallback to local storage
      const local = getLocalTeams();
      return local;
    }
  },

  getTeamById: async (teamId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TEAMS.BY_ID(teamId));
      return response.data?.data || response.data;
    } catch (err) {
      const local = getLocalTeams();
      const found = local.find((t) => t.id === teamId || t.teamId === teamId);
      if (found) return found;
      throw err;
    }
  },

  createTeam: async ({ name, description }) => {
    let created = null;
    try {
      const response = await apiClient.post(API_ENDPOINTS.TEAMS.BASE, { name, description });
      created = response.data?.data || response.data;
    } catch (err) {
      // Fallback create locally
      const id = 'team_' + Date.now();
      let currentUser = { email: 'user@example.com', name: 'User' };
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) currentUser = JSON.parse(rawUser);
      } catch (e) {}

      created = {
        id,
        teamId: id,
        name,
        description: description || '',
        ownerId: currentUser.userId || currentUser.id || 'me',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        membersCount: 1,
        userRole: 'OWNER',
        members: [
          {
            userId: currentUser.userId || currentUser.id || 'me',
            email: currentUser.email || 'you@example.com',
            name: currentUser.name || 'You',
            role: 'OWNER',
            joinedAt: new Date().toISOString(),
          },
        ],
      };
    }

    // Persist in local storage
    if (created) {
      const teams = getLocalTeams();
      const updated = [created, ...teams.filter((t) => (t.id || t.teamId) !== (created.id || created.teamId))];
      saveLocalTeams(updated);
    }

    return created;
  },

  addMember: async ({ teamId, email, role = 'MEMBER', permissions }) => {
    const defaultPerms = {
      canEdit: true,
      canShare: role === 'ADMIN',
      canInvite: role === 'ADMIN',
    };
    const resolvedPerms = permissions ? { ...defaultPerms, ...permissions } : defaultPerms;

    let member = null;
    try {
      const response = await apiClient.post(API_ENDPOINTS.TEAMS.MEMBERS(teamId), {
        email,
        role,
        permissions: resolvedPerms,
      });
      member = response.data?.data || response.data;
    } catch (err) {
      member = {
        userId: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        role,
        permissions: resolvedPerms,
        joinedAt: new Date().toISOString(),
      };
    }

    // Sync in local storage
    const teams = getLocalTeams();
    const updated = teams.map((t) => {
      if (t.id === teamId || t.teamId === teamId) {
        const members = t.members || [];
        const newMembers = [...members.filter((m) => m.email !== email), member];
        return {
          ...t,
          members: newMembers,
          membersCount: newMembers.length,
        };
      }
      return t;
    });
    saveLocalTeams(updated);

    return member;
  },

  updateMemberRole: async ({ teamId, memberId, role, permissions }) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.TEAMS.MEMBER_BY_ID(teamId, memberId), {
        role,
        permissions,
      });
      return response.data?.data || response.data;
    } catch (err) {
      const teams = getLocalTeams();
      const updated = teams.map((t) => {
        if (t.id === teamId || t.teamId === teamId) {
          const members = (t.members || []).map((m) => {
            if (m.userId === memberId || m.id === memberId) {
              return {
                ...m,
                role: role !== undefined ? role : m.role,
                permissions: permissions !== undefined ? { ...(m.permissions || {}), ...permissions } : m.permissions,
              };
            }
            return m;
          });
          return { ...t, members };
        }
        return t;
      });
      saveLocalTeams(updated);
      return { userId: memberId, role, permissions };
    }
  },

  removeMember: async ({ teamId, memberId }) => {
    try {
      await apiClient.delete(API_ENDPOINTS.TEAMS.MEMBER_BY_ID(teamId, memberId));
    } catch (err) {
      // local fallback
    }

    const teams = getLocalTeams();
    const updated = teams.map((t) => {
      if (t.id === teamId || t.teamId === teamId) {
        const members = (t.members || []).filter((m) => m.userId !== memberId && m.id !== memberId);
        return {
          ...t,
          members,
          membersCount: members.length,
        };
      }
      return t;
    });
    saveLocalTeams(updated);
    return { teamId, memberId };
  },

  deleteTeam: async (teamId) => {
    try {
      await apiClient.delete(API_ENDPOINTS.TEAMS.BY_ID(teamId));
    } catch (err) {
      // local fallback
    }

    const teams = getLocalTeams();
    const updated = teams.filter((t) => t.id !== teamId && t.teamId !== teamId);
    saveLocalTeams(updated);
    return { teamId };
  },
};
