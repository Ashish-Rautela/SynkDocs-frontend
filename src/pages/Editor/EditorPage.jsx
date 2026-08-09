import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
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
  const { fetchDocumentById, currentDocument, loading, error } = useDocument();
  const { loadDocument, content } = useEditor();
  const { user, token } = useAuth();

  useEffect(() => {
    if (id) {
      fetchDocumentById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentDocument) {
      loadDocument({
        title: currentDocument.title,
        content: currentDocument.content,
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
  }, [id, user]);

  const isAccessDenied = !!error && !currentDocument;

  const isDataSheet = (content && content.includes('<!-- TYPE:DATASHEET -->')) || (currentDocument?.content && currentDocument.content.includes('<!-- TYPE:DATASHEET -->'));
  const isNotesCanvas = (content && content.includes('<!-- TYPE:NOTES -->')) || (currentDocument?.content && currentDocument.content.includes('<!-- TYPE:NOTES -->'));

  if (loading && !currentDocument && !error) {
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
