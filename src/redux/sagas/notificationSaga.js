import { takeEvery, delay, put } from 'redux-saga/effects';
import { addToast, removeToast } from '../slices/notificationSlice';

function* handleAutoDismissToast(action) {
  const { id, duration = 4000 } = action.payload || {};
  if (id && duration > 0) {
    yield delay(duration);
    yield put(removeToast(id));
  }
}

export function* notificationSaga() {
  yield takeEvery(addToast.type, handleAutoDismissToast);
}
