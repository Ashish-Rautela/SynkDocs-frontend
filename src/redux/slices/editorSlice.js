import { createSlice } from '@reduxjs/toolkit';
import { SAVE_STATUS } from '../../constants/editorConstants';

const initialState = {
  content: '',
  title: 'Untitled Document',
  formatState: {
    bold: false,
    italic: false,
    underline: false,
    fontFamily: 'Inter',
    fontSize: '11',
    heading: 'p',
    alignment: 'left',
    listStyle: 'none', // 'none' | 'bullet' | 'number'
    textColor: '#202124',
    highlightColor: 'transparent',
  },
  saveStatus: SAVE_STATUS.SAVED,
  activeUsers: [],
  undoStack: [],
  redoStack: [],
  comments: [],
  isCommentsSidebarOpen: false,
  isShareModalOpen: false,
  isVersionHistoryOpen: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorContent: (state, action) => {
      if (state.content !== action.payload) {
        state.undoStack.push(state.content);
        state.content = action.payload;
        state.redoStack = [];
        state.saveStatus = SAVE_STATUS.UNSAVED_CHANGES;
      }
    },
    setDocumentTitle: (state, action) => {
      state.title = action.payload;
      state.saveStatus = SAVE_STATUS.UNSAVED_CHANGES;
    },
    toggleFormat: (state, action) => {
      const { formatKey, value } = action.payload;
      if (typeof value !== 'undefined') {
        state.formatState[formatKey] = value;
      } else {
        state.formatState[formatKey] = !state.formatState[formatKey];
      }
    },
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    addActiveUser: (state, action) => {
      if (!state.activeUsers.find((u) => u.id === action.payload.id)) {
        state.activeUsers.push(action.payload);
      }
    },
    removeActiveUser: (state, action) => {
      state.activeUsers = state.activeUsers.filter((u) => u.id !== action.payload);
    },
    undo: (state) => {
      if (state.undoStack.length > 0) {
        const previousContent = state.undoStack.pop();
        state.redoStack.push(state.content);
        state.content = previousContent;
        state.saveStatus = SAVE_STATUS.UNSAVED_CHANGES;
      }
    },
    redo: (state) => {
      if (state.redoStack.length > 0) {
        const nextContent = state.redoStack.pop();
        state.undoStack.push(state.content);
        state.content = nextContent;
        state.saveStatus = SAVE_STATUS.UNSAVED_CHANGES;
      }
    },
    addComment: (state, action) => {
      state.comments.push({
        id: `cmt-${Date.now()}`,
        author: action.payload.author || 'User',
        avatar: action.payload.avatar || '',
        text: action.payload.text,
        timestamp: 'Just now',
        resolved: false,
      });
    },
    toggleResolveComment: (state, action) => {
      state.comments = state.comments.map((cmt) =>
        cmt.id === action.payload ? { ...cmt, resolved: !cmt.resolved } : cmt
      );
    },
    toggleCommentsSidebar: (state) => {
      state.isCommentsSidebarOpen = !state.isCommentsSidebarOpen;
    },
    setShareModalOpen: (state, action) => {
      state.isShareModalOpen = action.payload;
    },
    setVersionHistoryOpen: (state, action) => {
      state.isVersionHistoryOpen = action.payload;
    },
    resetEditorState: () => initialState,
  },
});

export const {
  setEditorContent,
  setDocumentTitle,
  toggleFormat,
  setSaveStatus,
  setActiveUsers,
  addActiveUser,
  removeActiveUser,
  undo,
  redo,
  addComment,
  toggleResolveComment,
  toggleCommentsSidebar,
  setShareModalOpen,
  setVersionHistoryOpen,
  resetEditorState,
} = editorSlice.actions;

export default editorSlice.reducer;
