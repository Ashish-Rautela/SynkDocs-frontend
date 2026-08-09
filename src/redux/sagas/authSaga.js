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

const extractErrorMessage = (error, defaultMsg) => {
  const resData = error.response?.data;
  if (resData) {
    const details = resData.data || resData.details;
    if (Array.isArray(details) && details.length > 0) {
      const msgs = details.map((d) => d.message || d.msg).filter(Boolean);
      if (msgs.length > 0) {
        return msgs.join('. ').replace(/"/g, '');
      }
    }
    if (resData.message && resData.message !== 'Validation failed for request data') {
      return resData.message;
    }
    if (resData.message) {
      return resData.message;
    }
  }
  return error.message || defaultMsg;
};

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
    const message = extractErrorMessage(error, 'Login failed. Please check credentials.');
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
    const message = extractErrorMessage(error, 'Registration failed.');
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
