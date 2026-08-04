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
      const { email, role } = action.payload;
      state.collaborators = state.collaborators.map((c) =>
        c.email === email ? { ...c, role } : c
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
  shareDocumentStart,
  shareDocumentSuccess,
  shareDocumentFailure,
  updatePermissionStart,
  updatePermissionSuccess,
  setGeneralAccess,
  setCollaborators,
} = sharingSlice.actions;

export default sharingSlice.reducer;
