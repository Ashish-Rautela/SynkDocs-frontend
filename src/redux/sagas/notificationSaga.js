import { takeEvery, delay, put } from 'redux-saga/effects';
import { addToast, removeToast } from '../slices/notificationSlice';

function* handleAutoDismissToast(action) {
  const { id, duration } = action.payload;
  if (duration && duration > 0) {
    yield delay(duration);
    yield put(removeToast(id));
  }
}

export function* notificationSaga() {
  yield takeEvery(addToast.type, handleAutoDismissToast);
}
