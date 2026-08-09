import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const ensureArray = (resData) => {
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.results)) return resData.results;
    if (Array.isArray(resData.documents)) return resData.documents;
    if (resData.data && typeof resData.data === 'object') {
      if (Array.isArray(resData.data.results)) return resData.data.results;
      if (Array.isArray(resData.data.documents)) return resData.data.documents;
    }
  }
  return [];
};

export const searchApi = {
  searchDocuments: async (query) => {
    const response = await apiClient.get(API_ENDPOINTS.SEARCH.DOCUMENTS(query));
    const list = ensureArray(response.data);
    return list.map((doc) => ({
      ...doc,
      id: doc.documentId || doc.id,
      documentId: doc.documentId || doc.id,
    }));
  },
};

