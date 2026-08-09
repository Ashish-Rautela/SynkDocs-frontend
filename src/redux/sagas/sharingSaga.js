import { takeLatest, call, put } from 'redux-saga/effects';
import { sharingApi } from '../../services/sharingApi';
import {
  fetchCollaboratorsStart,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
  requestAccessStart,
  requestAccessSuccess,
  requestAccessFailure,
  fetchPendingRequestsStart,
  fetchPendingRequestsSuccess,
  fetchPendingRequestsFailure,
  removePendingRequest,
  denyRequestStart,
  denyRequestSuccess,
  denyRequestFailure,
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
    yield put(
      removePendingRequest({
        documentId: action.payload.documentId,
        userId: action.payload.targetUserId || collaborator.userId || collaborator.id,
      })
    );
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

function* handleRequestAccess(action) {
  try {
    const request = yield call(sharingApi.requestAccess, action.payload);
    yield put(requestAccessSuccess(request));
    yield put(addToast({ type: 'success', message: 'Access request notification sent to document owner!' }));
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to send access request';
    yield put(requestAccessFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleFetchPendingRequests() {
  try {
    const requests = yield call(sharingApi.getPendingRequests);
    yield put(fetchPendingRequestsSuccess(requests));
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to fetch pending requests';
    yield put(fetchPendingRequestsFailure(msg));
  }
}

function* handleDenyRequest(action) {
  try {
    yield call(sharingApi.revokeAccess, action.payload);
    yield put(denyRequestSuccess());
    yield put(removePendingRequest(action.payload));
    yield put(addToast({ type: 'info', message: 'Access request denied' }));
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to deny request';
    yield put(denyRequestFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

export function* sharingSaga() {
  yield takeLatest(fetchCollaboratorsStart.type, handleFetchCollaborators);
  yield takeLatest(shareDocumentStart.type, handleShareDocument);
  yield takeLatest(updatePermissionStart.type, handleUpdatePermission);
  yield takeLatest(requestAccessStart.type, handleRequestAccess);
  yield takeLatest(fetchPendingRequestsStart.type, handleFetchPendingRequests);
  yield takeLatest(denyRequestStart.type, handleDenyRequest);
}
