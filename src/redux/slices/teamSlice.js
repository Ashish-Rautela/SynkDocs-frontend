import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    fetchTeamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamsSuccess: (state, action) => {
      state.loading = false;
      state.teams = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchTeamsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchTeamDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeamDetailsSuccess: (state, action) => {
      state.loading = false;
      state.currentTeam = action.payload;
    },
    fetchTeamDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTeamSuccess: (state, action) => {
      state.loading = false;
      state.teams = [action.payload, ...state.teams];
    },
    createTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addMemberStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addMemberSuccess: (state, action) => {
      state.loading = false;
      const member = action.payload;
      if (state.currentTeam) {
        const members = state.currentTeam.members || [];
        state.currentTeam.members = [...members.filter((m) => m.email !== member.email), member];
        state.currentTeam.membersCount = state.currentTeam.members.length;
      }
      // Update member count in teams list
      state.teams = state.teams.map((t) => {
        if ((t.id || t.teamId) === (state.currentTeam?.id || state.currentTeam?.teamId)) {
          return { ...t, membersCount: (t.membersCount || 1) + 1 };
        }
        return t;
      });
    },
    addMemberFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateMemberRoleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateMemberRoleSuccess: (state, action) => {
      state.loading = false;
      const { memberId, role } = action.payload;
      if (state.currentTeam) {
        state.currentTeam.members = (state.currentTeam.members || []).map((m) =>
          m.userId === memberId || m.id === memberId ? { ...m, role } : m
        );
      }
    },
    updateMemberRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeMemberStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeMemberSuccess: (state, action) => {
      state.loading = false;
      const { memberId } = action.payload;
      if (state.currentTeam) {
        state.currentTeam.members = (state.currentTeam.members || []).filter(
          (m) => m.userId !== memberId && m.id !== memberId
        );
        state.currentTeam.membersCount = state.currentTeam.members.length;
      }
      state.teams = state.teams.map((t) => {
        if ((t.id || t.teamId) === (state.currentTeam?.id || state.currentTeam?.teamId)) {
          return { ...t, membersCount: Math.max(1, (t.membersCount || 1) - 1) };
        }
        return t;
      });
    },
    removeMemberFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteTeamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTeamSuccess: (state, action) => {
      state.loading = false;
      const teamId = action.payload;
      state.teams = state.teams.filter((t) => t.id !== teamId && t.teamId !== teamId);
      if (state.currentTeam?.id === teamId || state.currentTeam?.teamId === teamId) {
        state.currentTeam = null;
      }
    },
    deleteTeamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearCurrentTeam: (state) => {
      state.currentTeam = null;
    },
  },
});

export const {
  fetchTeamsStart,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamDetailsStart,
  fetchTeamDetailsSuccess,
  fetchTeamDetailsFailure,
  createTeamStart,
  createTeamSuccess,
  createTeamFailure,
  addMemberStart,
  addMemberSuccess,
  addMemberFailure,
  updateMemberRoleStart,
  updateMemberRoleSuccess,
  updateMemberRoleFailure,
  removeMemberStart,
  removeMemberSuccess,
  removeMemberFailure,
  deleteTeamStart,
  deleteTeamSuccess,
  deleteTeamFailure,
  clearCurrentTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
