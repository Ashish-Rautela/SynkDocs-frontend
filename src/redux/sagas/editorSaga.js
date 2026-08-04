import { takeLatest, delay, put, select } from 'redux-saga/effects';
import { setEditorContent, setSaveStatus, setDocumentTitle } from '../slices/editorSlice';
import { saveDocumentStart } from '../slices/documentSlice';
import { SAVE_STATUS } from '../../constants/editorConstants';

function* handleAutoSave() {
  yield put(setSaveStatus(SAVE_STATUS.SAVING));
  yield delay(1500); // 1.5s debounce delay

  const state = yield select();
  const currentDoc = state.document.currentDocument;
  const content = state.editor.content;
  const title = state.editor.title;

  if (currentDoc && currentDoc.id) {
    yield put(saveDocumentStart({ id: currentDoc.id, title, content }));
    yield put(setSaveStatus(SAVE_STATUS.SAVED));
  } else {
    yield put(setSaveStatus(SAVE_STATUS.SAVED));
  }
}

export function* editorSaga() {
  yield takeLatest([setEditorContent.type, setDocumentTitle.type], handleAutoSave);
}
