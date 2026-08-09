import { takeLatest, delay, put, select } from 'redux-saga/effects';
import {
  setEditorContent,
  setDocumentTitle,
  setSaveStatus,
  manualSaveDocument,
} from '../slices/editorSlice';
import { saveDocumentStart } from '../slices/documentSlice';
import { addToast } from '../slices/notificationSlice';
import { SAVE_STATUS } from '../../constants/editorConstants';

function* handleAutoSave() {
  const initialState = yield select();
  if (initialState.editor.saveStatus !== SAVE_STATUS.UNSAVED_CHANGES) {
    return;
  }

  yield delay(800); // Fast 800ms debounce delay after user stops typing

  const state = yield select();
  if (state.editor.saveStatus !== SAVE_STATUS.UNSAVED_CHANGES) {
    return;
  }

  const currentDoc = state.document.currentDocument;
  const content = state.editor.content;
  const title = state.editor.title;

  if (currentDoc && (currentDoc.id || currentDoc.documentId)) {
    const docId = currentDoc.id || currentDoc.documentId;
    yield put(setSaveStatus(SAVE_STATUS.SAVING));
    yield put(saveDocumentStart({ id: docId, documentId: docId, title, content }));
  }
}

function* handleManualSave() {
  const state = yield select();
  const currentDoc = state.document.currentDocument;
  const content = state.editor.content;
  const title = state.editor.title;

  if (currentDoc && (currentDoc.id || currentDoc.documentId)) {
    const docId = currentDoc.id || currentDoc.documentId;
    yield put(setSaveStatus(SAVE_STATUS.SAVING));
    yield put(saveDocumentStart({ id: docId, documentId: docId, title, content }));
    yield put(addToast({ type: 'success', message: 'Document saved to cloud!' }));
  }
}

export function* editorSaga() {
  yield takeLatest([setEditorContent.type, setDocumentTitle.type], handleAutoSave);
  yield takeLatest(manualSaveDocument.type, handleManualSave);
}
