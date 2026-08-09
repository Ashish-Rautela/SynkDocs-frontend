import { takeLatest, call, put } from 'redux-saga/effects';
import { documentApi } from '../../services/documentApi';
import { searchApi } from '../../services/searchApi';
import {
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
  setSearchResults,
} from '../slices/documentSlice';
import { addToast } from '../slices/notificationSlice';

function* handleFetchDocuments() {
  try {
    const data = yield call(documentApi.getDocuments);
    yield put(fetchDocumentsSuccess(data));
  } catch (error) {
    const msg = error.message || 'Failed to fetch documents';
    yield put(fetchDocumentsFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleFetchDocumentById(action) {
  try {
    const data = yield call(documentApi.getDocumentById, action.payload);
    yield put(fetchDocumentByIdSuccess(data));
  } catch (error) {
    const msg = error.message || 'Failed to load document';
    yield put(fetchDocumentByIdFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleCreateDocument(action) {
  try {
    const data = yield call(documentApi.createDocument, action.payload);
    yield put(createDocumentSuccess(data));
    yield put(addToast({ type: 'success', message: 'New document created!' }));
    if (action.payload?.onSuccess) {
      action.payload.onSuccess(data);
    }
  } catch (error) {
    const msg = error.message || 'Failed to create document';
    yield put(createDocumentFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}


import { markSaved, setSaveStatus } from '../slices/editorSlice';
import { SAVE_STATUS } from '../../constants/editorConstants';

function* handleSaveDocument(action) {
  try {
    const data = yield call(documentApi.saveDocument, action.payload);
    yield put(saveDocumentSuccess(data));
    yield put(markSaved({ title: data.title || action.payload.title, content: data.content || action.payload.content }));
  } catch (error) {
    const msg = error.message || 'Failed to save document';
    yield put(saveDocumentFailure(msg));
    yield put(setSaveStatus(SAVE_STATUS.UNSAVED_CHANGES));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleToggleStar(action) {
  try {
    const data = yield call(documentApi.toggleStar, action.payload);
    yield put(toggleStarSuccess(data));
  } catch (error) {
    yield put(addToast({ type: 'error', message: 'Could not update star status' }));
  }
}

function* handleDeleteDocument(action) {
  try {
    const data = yield call(documentApi.deleteDocument, action.payload);
    yield put(deleteDocumentSuccess(data));
    yield put(addToast({ type: 'info', message: 'Document deleted successfully' }));
  } catch (error) {
    yield put(addToast({ type: 'error', message: 'Failed to delete document' }));
  }
}

function* handleFetchVersionHistory(action) {
  try {
    const versions = yield call(documentApi.getVersionHistory, action.payload);
    yield put(fetchVersionHistorySuccess(versions));
  } catch (error) {
    yield put(addToast({ type: 'error', message: 'Could not fetch version history' }));
  }
}

function* handleSearchDocuments(action) {
  try {
    const query = action.payload;
    if (!query) {
      yield put(setSearchResults(null));
      return;
    }
    const results = yield call(searchApi.searchDocuments, query);
    yield put(setSearchResults(results));
  } catch (error) {
    console.warn('Search API error:', error);
  }
}

export function* documentSaga() {
  yield takeLatest(fetchDocumentsStart.type, handleFetchDocuments);
  yield takeLatest(fetchDocumentByIdStart.type, handleFetchDocumentById);
  yield takeLatest(createDocumentStart.type, handleCreateDocument);
  yield takeLatest(saveDocumentStart.type, handleSaveDocument);
  yield takeLatest(toggleStarStart.type, handleToggleStar);
  yield takeLatest(deleteDocumentStart.type, handleDeleteDocument);
  yield takeLatest(fetchVersionHistoryStart.type, handleFetchVersionHistory);
  yield takeLatest(setSearchQuery.type, handleSearchDocuments);
}

