import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import documentReducer from './slices/documentSlice';
import editorReducer from './slices/editorSlice';
import notificationReducer from './slices/notificationSlice';
import sharingReducer from './slices/sharingSlice';
import profileReducer from './slices/profileSlice';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    document: documentReducer,
    editor: editorReducer,
    notification: notificationReducer,
    sharing: sharingReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);
