import { useSelector, useDispatch } from 'react-redux';
import {
  loadDocumentState,
  setEditorContent,
  setDocumentTitle,
  remoteContentReceived,
  manualSaveDocument,
  toggleFormat,
  undo,
  redo,
  addComment,
  toggleResolveComment,
  toggleCommentsSidebar,
  setShareModalOpen,
  setVersionHistoryOpen,
  resetEditorState,
} from '../redux/slices/editorSlice';

export const useEditor = () => {
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor);

  return {
    ...editorState,
    loadDocument: (payload) => dispatch(loadDocumentState(payload)),
    updateContent: (content) => dispatch(setEditorContent(content)),
    updateTitle: (title) => dispatch(setDocumentTitle(title)),
    receiveRemoteContent: (content) => dispatch(remoteContentReceived(content)),
    triggerManualSave: () => dispatch(manualSaveDocument()),
    applyFormat: (formatKey, value) => dispatch(toggleFormat({ formatKey, value })),
    triggerUndo: () => dispatch(undo()),
    triggerRedo: () => dispatch(redo()),
    postComment: (comment) => dispatch(addComment(comment)),
    resolveComment: (id) => dispatch(toggleResolveComment(id)),
    toggleCommentsPanel: () => dispatch(toggleCommentsSidebar()),
    openShareModal: (open = true) => dispatch(setShareModalOpen(open)),
    openVersionHistory: (open = true) => dispatch(setVersionHistoryOpen(open)),
    resetEditor: () => dispatch(resetEditorState()),
  };
};
