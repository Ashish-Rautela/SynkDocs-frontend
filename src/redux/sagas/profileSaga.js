import { takeLatest, call, put } from 'redux-saga/effects';
import { profileApi } from '../../services/profileApi';
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from '../slices/profileSlice';
import { addToast } from '../slices/notificationSlice';

function* handleFetchProfile() {
  try {
    const data = yield call(profileApi.getProfile);
    yield put(fetchProfileSuccess(data));
  } catch (error) {
    const msg = error.message || 'Failed to fetch user profile';
    yield put(fetchProfileFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

function* handleUpdateProfile(action) {
  try {
    const updated = yield call(profileApi.updateProfile, action.payload);
    yield put(updateProfileSuccess(updated));
    yield put(addToast({ type: 'success', message: 'Profile updated successfully' }));
  } catch (error) {
    const msg = error.message || 'Failed to update profile';
    yield put(updateProfileFailure(msg));
    yield put(addToast({ type: 'error', message: msg }));
  }
}

export function* profileSaga() {
  yield takeLatest(fetchProfileStart.type, handleFetchProfile);
  yield takeLatest(updateProfileStart.type, handleUpdateProfile);
}
