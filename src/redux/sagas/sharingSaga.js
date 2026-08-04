import { takeLatest, call, put } from 'redux-saga/effects';
import { sharingApi } from '../../services/sharingApi';
import {
  shareDocumentStart,
  shareDocumentSuccess,
  shareDocumentFailure,
  updatePermissionStart,
  updatePermissionSuccess,
} from '../slices/sharingSlice';
import { addToast } from '../slices/notificationSlice';

function* handleShareDocument(action) {
  try {
    const collaborator = yield call(sharingApi.shareDocument, action.payload);
    yield put(shareDocumentSuccess(collaborator));
    yield put(addToast({ type: 'success', message: `Invite sent to ${collaborator.email}` }));
  } catch (error) {
    const msg = error.message || 'Failed to share document';
    yield put(shareDocumentFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleUpdatePermission(action) {
  try {
    yield call(sharingApi.updatePermission, action.payload);
    yield put(updatePermissionSuccess(action.payload));
    yield put(addToast({ type: 'info', message: 'Permissions updated successfully' }));
  } catch (error) {
    yield put(addToast({ type: 'error', message: 'Failed to update access permissions' }));
  }
}

export function* sharingSaga() {
  yield takeLatest(shareDocumentStart.type, handleShareDocument);
  yield takeLatest(updatePermissionStart.type, handleUpdatePermission);
}
