import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [], // { id, message, type: 'info'|'success'|'warning'|'error', duration }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: (toast) => {
        const payload = typeof toast === 'string' ? { message: toast } : (toast || {});
        return {
          payload: {
            id: payload.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: payload.type || 'info',
            message: payload.message,
            duration: payload.duration !== undefined ? payload.duration : 4000,
          },
        };
      },
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = notificationSlice.actions;
export default notificationSlice.reducer;
