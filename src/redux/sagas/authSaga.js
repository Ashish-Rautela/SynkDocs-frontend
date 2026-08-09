import { takeLatest, call, put } from 'redux-saga/effects';
import { authApi } from '../../services/authApi';
import { tokenStorage } from '../../utils/tokenStorage';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutStart,
  logoutSuccess,
} from '../slices/authSlice';
import { addToast } from '../slices/notificationSlice';

function* handleLogin(action) {
  try {
    const data = yield call(authApi.login, action.payload);
    const token = data.accessToken || data.token;
    if (token) {
      tokenStorage.setAccessToken(token);
    }
    if (data.refreshToken) {
      tokenStorage.setRefreshToken(data.refreshToken);
    }
    if (data.user) {
      tokenStorage.setUser(data.user);
    }

    yield put(loginSuccess(data));
    yield put(addToast({ type: 'success', message: `Welcome back, ${data.user?.name || 'User'}!` }));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
    yield put(loginFailure(message));
    yield put(addToast({ type: 'error', message }));
  }
}

function* handleRegister(action) {
  try {
    const data = yield call(authApi.register, action.payload);
    const token = data.accessToken || data.token;
    if (token) {
      tokenStorage.setAccessToken(token);
    }
    if (data.refreshToken) {
      tokenStorage.setRefreshToken(data.refreshToken);
    }
    if (data.user) {
      tokenStorage.setUser(data.user);
    }

    yield put(registerSuccess(data));
    yield put(addToast({ type: 'success', message: 'Account created successfully!' }));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed.';
    yield put(registerFailure(message));
    yield put(addToast({ type: 'error', message }));
  }
}


function* handleLogout() {
  try {
    yield call(authApi.logout);
  } catch (e) {
    console.warn('Logout API warning:', e);
  } finally {
    tokenStorage.clearAll();
    yield put(logoutSuccess());
    yield put(addToast({ type: 'info', message: 'You have been logged out.' }));
  }
}

export function* authSaga() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(registerStart.type, handleRegister);
  yield takeLatest(logoutStart.type, handleLogout);
}
