import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  currentDocument: null,
  starredDocuments: [],
  recentDocuments: [],
  sharedDocuments: [],
  versionHistory: [],
  searchQuery: '',
  filterCategory: 'all', // 'all' | 'recent' | 'starred' | 'shared'
  loading: false,
  saving: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // Sagas Trigger Actions
    fetchDocumentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess: (state, action) => {
      state.loading = false;
      state.documents = action.payload;
      state.recentDocuments = [...action.payload].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      state.starredDocuments = action.payload.filter((doc) => doc.isStarred);
      state.sharedDocuments = action.payload.filter((doc) => doc.isShared);
    },
    fetchDocumentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchDocumentByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentDocument = action.payload;
    },
    fetchDocumentByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createDocumentStart: (state) => {
      state.loading = true;
    },
    createDocumentSuccess: (state, action) => {
      state.loading = false;
      state.documents.unshift(action.payload);
      state.recentDocuments.unshift(action.payload);
      state.currentDocument = action.payload;
    },
    createDocumentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    saveDocumentStart: (state) => {
      state.saving = true;
    },
    saveDocumentSuccess: (state, action) => {
      state.saving = false;
      if (state.currentDocument && state.currentDocument.id === action.payload.id) {
        state.currentDocument.title = action.payload.title;
        state.currentDocument.content = action.payload.content;
        state.currentDocument.updatedAt = action.payload.updatedAt;
      }
      state.documents = state.documents.map((doc) =>
        doc.id === action.payload.id ? { ...doc, ...action.payload } : doc
      );
    },
    saveDocumentFailure: (state, action) => {
      state.saving = false;
      state.error = action.payload;
    },
    toggleStarStart: (state) => {},
    toggleStarSuccess: (state, action) => {
      const { id, isStarred } = action.payload;
      state.documents = state.documents.map((doc) =>
        doc.id === id ? { ...doc, isStarred } : doc
      );
      if (state.currentDocument && state.currentDocument.id === id) {
        state.currentDocument.isStarred = isStarred;
      }
      state.starredDocuments = state.documents.filter((doc) => doc.isStarred);
    },
    deleteDocumentStart: (state) => {
      state.loading = true;
    },
    deleteDocumentSuccess: (state, action) => {
      state.loading = false;
      state.documents = state.documents.filter((doc) => doc.id !== action.payload.id);
      state.recentDocuments = state.recentDocuments.filter((doc) => doc.id !== action.payload.id);
      state.starredDocuments = state.starredDocuments.filter((doc) => doc.id !== action.payload.id);
      state.sharedDocuments = state.sharedDocuments.filter((doc) => doc.id !== action.payload.id);
    },
    fetchVersionHistoryStart: (state) => {
      state.loading = true;
    },
    fetchVersionHistorySuccess: (state, action) => {
      state.loading = false;
      state.versionHistory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
  },
});

export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  fetchDocumentByIdStart,
  fetchDocumentByIdSuccess,
  fetchDocumentByIdFailure,
  createDocumentStart,
  createDocumentSuccess,
  createDocumentFailure,
  saveDocumentStart,
  saveDocumentSuccess,
  saveDocumentFailure,
  toggleStarStart,
  toggleStarSuccess,
  deleteDocumentStart,
  deleteDocumentSuccess,
  fetchVersionHistoryStart,
  fetchVersionHistorySuccess,
  setSearchQuery,
  setFilterCategory,
} = documentSlice.actions;

export default documentSlice.reducer;
