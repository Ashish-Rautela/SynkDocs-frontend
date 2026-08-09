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

export const useDocument = () => {
  const dispatch = useDispatch();
  const documentState = useSelector((state) => state.document);

  const fetchDocuments = () => dispatch(fetchDocumentsStart());
  const fetchDocumentById = (id) => dispatch(fetchDocumentByIdStart(id));
  const createDocument = (payload) => dispatch(createDocumentStart(payload));
  const saveDocument = (payload) => dispatch(saveDocumentStart(payload));
  const toggleStar = (id) => dispatch(toggleStarStart(id));
  const deleteDocument = (id) => dispatch(deleteDocumentStart(id));
  const fetchVersionHistory = (id) => dispatch(fetchVersionHistoryStart(id));
  const updateSearchQuery = (query) => dispatch(setSearchQuery(query));
  const updateFilterCategory = (category) => dispatch(setFilterCategory(category));

  // Filtered documents based on search query and category tab
  const getFilteredDocuments = () => {
    let list = Array.isArray(documentState.documents) ? documentState.documents : [];

    if (documentState.filterCategory === 'starred') {
      list = list.filter((doc) => doc.isStarred);
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
  };
};
