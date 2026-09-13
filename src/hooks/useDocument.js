import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDocumentsStart,
  fetchDocumentByIdStart,
  createDocumentStart,
  saveDocumentStart,
  toggleStarStart,
  deleteDocumentStart,
  fetchVersionHistoryStart,
  setSearchQuery,
  setFilterCategory,
} from '../redux/slices/documentSlice';
import { addToast } from '../redux/slices/notificationSlice';

export const useDocument = () => {
  const dispatch = useDispatch();
  const documentState = useSelector((state) => state.document);
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userId || authUser?.id;

  const fetchDocuments = () => dispatch(fetchDocumentsStart());
  const fetchDocumentById = (id) => dispatch(fetchDocumentByIdStart(id));
  const createDocument = (payload) => dispatch(createDocumentStart(payload));
  const saveDocument = (payload) => dispatch(saveDocumentStart(payload));
  const toggleStar = (id) => dispatch(toggleStarStart(id));
  const deleteDocument = (docOrId) => {
    const id = typeof docOrId === 'object' ? (docOrId?.id || docOrId?.documentId) : docOrId;
    const doc = typeof docOrId === 'object' ? docOrId : (documentState.documents || []).find((d) => d.id === id || d.documentId === id);
    if (doc && isSharedWithUser(doc)) {
      dispatch(addToast({ type: 'error', message: "Cannot delete document: you don't own this document" }));
      return;
    }
    dispatch(deleteDocumentStart(id));
  };
  const fetchVersionHistory = (id) => dispatch(fetchVersionHistoryStart(id));
  const updateSearchQuery = (query) => dispatch(setSearchQuery(query));
  const updateFilterCategory = (category) => dispatch(setFilterCategory(category));

  // Helper to determine if a document was shared to this user
  const isSharedWithUser = (doc) => {
    if (!doc) return false;
    if (doc.isShared === true) return true;
    if (doc.isShared === false) return false;
    if (doc.role && doc.role !== 'OWNER') return true;
    if (doc.role === 'OWNER') return false;
    if (doc.ownerId && currentUserId) {
      return doc.ownerId !== currentUserId;
    }
    return false;
  };

  // Filtered documents based on search query and category tab
  const getFilteredDocuments = () => {
    let list = Array.isArray(documentState.documents) ? documentState.documents : [];

    if (documentState.filterCategory === 'starred') {
      list = list.filter((doc) => doc.isStarred);
    } else if (documentState.filterCategory === 'shared') {
      list = list.filter((doc) => isSharedWithUser(doc));
    }

    if (documentState.searchQuery && documentState.searchQuery.trim() !== '') {
      const q = documentState.searchQuery.toLowerCase().trim();
      return list.filter((doc) => doc?.title?.toLowerCase().includes(q));
    }

    return list;
  };

  return {
    ...documentState,
    filteredDocuments: getFilteredDocuments(),
    fetchDocuments,
    fetchDocumentById,
    createDocument,
    saveDocument,
    toggleStar,
    deleteDocument,
    fetchVersionHistory,
    updateSearchQuery,
    updateFilterCategory,
    isSharedWithUser,
  };
};
