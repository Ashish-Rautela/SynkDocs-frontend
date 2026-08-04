import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  preferences: {
    theme: 'light',
    autoSaveFrequency: 3000,
    emailNotifications: true,
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      if (action.payload.preferences) {
        state.preferences = { ...state.preferences, ...action.payload.preferences };
      }
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updatePreferences,
} = profileSlice.actions;

export default profileSlice.reducer;
