import { takeLatest, call, put } from 'redux-saga/effects';
import { sharingApi } from '../../services/sharingApi';
import {
  fetchCollaboratorsStart,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
  shareDocumentStart,
  shareDocumentSuccess,
  shareDocumentFailure,
  updatePermissionStart,
  updatePermissionSuccess,
} from '../slices/sharingSlice';
import { addToast } from '../slices/notificationSlice';

function* handleFetchCollaborators(action) {
  try {
    const collaborators = yield call(sharingApi.getCollaborators, action.payload);
    yield put(fetchCollaboratorsSuccess(collaborators));
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to fetch collaborators';
    yield put(fetchCollaboratorsFailure(msg));
  }
}

function* handleShareDocument(action) {
  try {
    const collaborator = yield call(sharingApi.shareDocument, action.payload);
    yield put(shareDocumentSuccess(collaborator));
    yield put(addToast({ type: 'success', message: 'Document shared successfully' }));
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to share document';
    yield put(shareDocumentFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleUpdatePermission(action) {
  try {
    yield call(sharingApi.shareDocument, action.payload);
    yield put(updatePermissionSuccess(action.payload));
    yield put(addToast({ type: 'info', message: 'Permissions updated successfully' }));
  } catch (error) {
    yield put(addToast({ type: 'error', message: 'Failed to update access permissions' }));
  }
}

export function* sharingSaga() {
  yield takeLatest(fetchCollaboratorsStart.type, handleFetchCollaborators);
  yield takeLatest(shareDocumentStart.type, handleShareDocument);
  yield takeLatest(updatePermissionStart.type, handleUpdatePermission);
}

