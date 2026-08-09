import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const ensureArray = (resData) => {
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.documents)) return resData.documents;
    if (Array.isArray(resData.items)) return resData.items;
    if (Array.isArray(resData.results)) return resData.results;
    if (resData.data && typeof resData.data === 'object') {
      if (Array.isArray(resData.data.documents)) return resData.data.documents;
      if (Array.isArray(resData.data.items)) return resData.data.items;
      if (Array.isArray(resData.data.data)) return resData.data.data;
    }
  }
  return [];
};

export const documentApi = {
  getDocuments: async () => {
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS.BASE);
    const list = ensureArray(response.data);
    return list.map((doc) => ({
      ...doc,
      id: doc.documentId || doc.id,
      documentId: doc.documentId || doc.id,
      content: doc.content || '',
      updatedAt: doc.updatedAt || doc.createdAt || new Date().toISOString(),
    }));
  },

  getDocumentById: async (documentId) => {
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS.BY_ID(documentId));
    // Response (200 OK):
    // { success: true, data: { documentId: "...", title: "...", content: "...", ownerId: "..." } }
    const data = response.data?.data || response.data || {};
    return {
      ...data,
      id: data.documentId || data.id || documentId,
      documentId: data.documentId || data.id || documentId,
      content: data.content || '',
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
    };
  },

  createDocument: async (payload = {}) => {
    const response = await apiClient.post(API_ENDPOINTS.DOCUMENTS.BASE, {
      title: payload.title || 'System Architecture Specs',
      content: payload.content || '',
    });
    // Response (201 Created):
    // { success: true, message: "Document created successfully", data: { documentId: "...", title: "...", ownerId: "...", createdAt: "..." } }
    const data = response.data?.data || response.data || {};
    return {
      ...data,
      id: data.documentId || data.id,
      documentId: data.documentId || data.id,
      title: data.title || payload.title || 'Untitled Document',
      content: payload.content || '',
      updatedAt: data.createdAt || new Date().toISOString(),
    };
  },

  saveDocument: async ({ id, documentId, title, content }) => {
    const docId = documentId || id;
    let response;
    try {
      response = await apiClient.put(API_ENDPOINTS.DOCUMENTS.BY_ID(docId), { title, content });
    } catch {
      response = await apiClient.post(API_ENDPOINTS.DOCUMENTS.BASE, { title, content });
    }
    const data = response.data?.data || response.data || {};
    return {
      ...data,
      id: data?.documentId || data?.id || docId,
      documentId: data?.documentId || data?.id || docId,
      title: title || data?.title,
      content: content || data?.content,
      updatedAt: new Date().toISOString(),
    };
  },

  toggleStar: async (id) => {
    return { id, isStarred: true };
  },

  deleteDocument: async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    } catch (e) {
      console.warn('Delete endpoint warning:', e);
    }
    return { id };
  },

  getVersionHistory: async (id) => {
    return [];
  },
};


