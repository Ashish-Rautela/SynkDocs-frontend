import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collaborators: [],
  generalAccess: 'RESTRICTED', // 'RESTRICTED' | 'ANYONE_WITH_LINK'
  linkPermission: 'VIEWER',
  loading: false,
  error: null,
};

const sharingSlice = createSlice({
  name: 'sharing',
  initialState,
  reducers: {
    fetchCollaboratorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCollaboratorsSuccess: (state, action) => {
      state.loading = false;
      state.collaborators = action.payload;
    },
    fetchCollaboratorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    shareDocumentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    shareDocumentSuccess: (state, action) => {
      state.loading = false;
      state.collaborators.push(action.payload);
    },
    shareDocumentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePermissionStart: (state) => {
      state.loading = true;
    },
    updatePermissionSuccess: (state, action) => {
      state.loading = false;
      const { targetUserId, userId, role } = action.payload;
      const target = targetUserId || userId;
      state.collaborators = state.collaborators.map((c) =>
        (c.userId === target || c.id === target) ? { ...c, role } : c
      );
    },
    setGeneralAccess: (state, action) => {
      state.generalAccess = action.payload.access;
      state.linkPermission = action.payload.permission || state.linkPermission;
    },
    setCollaborators: (state, action) => {
      state.collaborators = action.payload;
    },
  },
});

export const {
  fetchCollaboratorsStart,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
  shareDocumentStart,
  shareDocumentSuccess,
  shareDocumentFailure,
  updatePermissionStart,
  updatePermissionSuccess,
  setGeneralAccess,
  setCollaborators,
} = sharingSlice.actions;

export default sharingSlice.reducer;

