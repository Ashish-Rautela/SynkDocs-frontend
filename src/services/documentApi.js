import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_API !== 'false';
const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let mockDb = [];

export const documentApi = {
  getDocuments: async () => {
    if (USE_MOCK) {
      await mockDelay();
      return mockDb;
    }
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS.BASE);
    return response.data;
  },

  getDocumentById: async (id) => {
    if (USE_MOCK) {
      await mockDelay(300);
      const doc = mockDb.find((d) => d.id === id);
      if (!doc) {
        return {
          id,
          title: 'Untitled Document',
          content: '<p></p>',
          owner: null,
          isStarred: false,
          isShared: false,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          collaborators: []
        };
      }
      return doc;
    }
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    return response.data;
  },

  createDocument: async (payload = {}) => {
    if (USE_MOCK) {
      await mockDelay(400);
      const newDoc = {
        id: `doc-${Date.now()}`,
        title: payload.title || 'Untitled Document',
        content: payload.content || '<p></p>',
        owner: null,
        isStarred: false,
        isShared: false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        collaborators: []
      };
      mockDb.unshift(newDoc);
      return newDoc;
    }
    const response = await apiClient.post(API_ENDPOINTS.DOCUMENTS.BASE, payload);
    return response.data;
  },

  saveDocument: async ({ id, title, content }) => {
    if (USE_MOCK) {
      await mockDelay(200);
      mockDb = mockDb.map((doc) =>
        doc.id === id
          ? { ...doc, title: title ?? doc.title, content: content ?? doc.content, updatedAt: new Date().toISOString() }
          : doc
      );
      return { id, title, content, updatedAt: new Date().toISOString() };
    }
    const response = await apiClient.put(API_ENDPOINTS.DOCUMENTS.BY_ID(id), { title, content });
    return response.data;
  },

  toggleStar: async (id) => {
    if (USE_MOCK) {
      await mockDelay(150);
      let updatedStatus = false;
      mockDb = mockDb.map((doc) => {
        if (doc.id === id) {
          updatedStatus = !doc.isStarred;
          return { ...doc, isStarred: updatedStatus };
        }
        return doc;
      });
      return { id, isStarred: updatedStatus };
    }
    const response = await apiClient.patch(API_ENDPOINTS.DOCUMENTS.STAR(id));
    return response.data;
  },

  deleteDocument: async (id) => {
    if (USE_MOCK) {
      await mockDelay(300);
      mockDb = mockDb.filter((doc) => doc.id !== id);
      return { id };
    }
    const response = await apiClient.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    return response.data;
  },

  getVersionHistory: async (id) => {
    if (USE_MOCK) {
      await mockDelay(300);
      return [];
    }
    const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS.VERSIONS(id));
    return response.data;
  }
};
