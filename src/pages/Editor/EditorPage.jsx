import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useDocument } from '../../hooks/useDocument';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
import { resetEditorState } from '../../redux/slices/editorSlice';
import { EditorNavbar } from '../../components/editor/EditorNavbar';
import { EditorToolbar } from '../../components/editor/EditorToolbar';
import { DocumentCanvas } from '../../components/editor/DocumentCanvas';
import { SpreadsheetCanvas } from '../../components/editor/SpreadsheetCanvas';
import { NotesCanvas } from '../../components/editor/NotesCanvas';
import { StatusBar } from '../../components/editor/StatusBar';
import { CommentsSidebar } from '../../components/editor/CommentsSidebar';
import { ShareModal } from '../../components/editor/ShareModal';
import { AccessDeniedModal } from '../../components/editor/AccessDeniedModal';
import { Loader } from '../../components/common/Loader';
import { ToastContainer } from '../../components/common/ToastContainer';

export const EditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchDocumentById, currentDocument, loading, error } = useDocument();
  const { loadDocument, content } = useEditor();
  const { user, token } = useAuth();
  const loadTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    hasLoadedRef.current = false;

    if (id) {
      fetchDocumentById(id);
    }

    // Safety timeout: if after 15 seconds we still have no document and no error,
    // something went wrong silently. Set a fallback so user isn't stuck on loader forever.
    loadTimeoutRef.current = setTimeout(() => {
      if (!hasLoadedRef.current) {
        console.warn('[EditorPage] Load timeout — navigating to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }, 15000);

    return () => {
      dispatch(resetEditorState());
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [id, dispatch]);

  // Track when document has loaded successfully
  useEffect(() => {
    if (currentDocument || error) {
      hasLoadedRef.current = true;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }
  }, [currentDocument, error]);

  useEffect(() => {
    if (currentDocument) {
      loadDocument({
        title: currentDocument.title || 'Untitled Document',
        content: currentDocument.content || '',
      });
    }
  }, [currentDocument?.id || currentDocument?.documentId]);

  useEffect(() => {
    if (id && user) {
      const activeUser = {
        id: user.userId || user.id || 'usr-anon',
        name: user.name || user.email || 'Collaborator',
        avatarUrl: user.avatarUrl || '',
      };
      socketService.connect(token, activeUser);
      socketService.joinDocument(id, activeUser);
    }

    return () => {
      if (id) {
        socketService.leaveDocument(id);
      }
    };
  }, [id, user, token]);

  const isAccessDenied = !!error && !currentDocument;

  const strContent = typeof content === 'string' ? content : '';
  const strDocContent = typeof currentDocument?.content === 'string' ? currentDocument.content : '';

  const isDataSheet = strContent.includes('<!-- TYPE:DATASHEET -->') || strDocContent.includes('<!-- TYPE:DATASHEET -->');
  const isNotesCanvas = strContent.includes('<!-- TYPE:NOTES -->') || strDocContent.includes('<!-- TYPE:NOTES -->');

  // Show loader while loading, but NOT if we have an error (to show AccessDeniedModal)
  if (loading && !error) {
    return <Loader fullPage text="Loading document workspace..." />;
  }

  // If neither loading nor document loaded and no error yet, show loader briefly
  // (this covers the brief gap between mount and saga dispatch)
  if (!currentDocument && !error && !loading) {
    return <Loader fullPage text="Loading document workspace..." />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-docs-bg relative">
      {/* 1. Top Navbar */}
      <EditorNavbar />

      {/* 2. Formatting Toolbar (only for standard rich text documents) */}
      {!isDataSheet && !isNotesCanvas && <EditorToolbar />}

      {/* 3. Main Workspace Area (Document Canvas / Data Sheet / Notes Canvas) */}
      <div className="flex-1 flex overflow-hidden relative">
        {isDataSheet ? (
          <SpreadsheetCanvas documentId={id} />
        ) : isNotesCanvas ? (
          <NotesCanvas documentId={id} />
        ) : (
          <DocumentCanvas documentId={id} />
        )}
        <CommentsSidebar />
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar />

      {/* Access Denied Modal Pop-up */}
      <AccessDeniedModal
        isOpen={isAccessDenied}
        errorMessage={error}
      />

      {/* Modals & Toast Containers */}
      <ShareModal />
      <ToastContainer />
    </div>
  );
};
