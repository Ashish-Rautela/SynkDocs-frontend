import { all, fork } from 'redux-saga/effects';
import { authSaga } from './sagas/authSaga';
import { documentSaga } from './sagas/documentSaga';
import { editorSaga } from './sagas/editorSaga';
import { notificationSaga } from './sagas/notificationSaga';
import { sharingSaga } from './sagas/sharingSaga';
import { profileSaga } from './sagas/profileSaga';
import { teamSaga } from './sagas/teamSaga';

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(documentSaga),
    fork(editorSaga),
    fork(notificationSaga),
    fork(sharingSaga),
    fork(profileSaga),
    fork(teamSaga),
  ]);
}
