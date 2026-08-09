import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
import { EditorNavbar } from '../../components/editor/EditorNavbar';
import { EditorToolbar } from '../../components/editor/EditorToolbar';
import { DocumentCanvas } from '../../components/editor/DocumentCanvas';
import { StatusBar } from '../../components/editor/StatusBar';
import { CommentsSidebar } from '../../components/editor/CommentsSidebar';
import { ShareModal } from '../../components/editor/ShareModal';
import { VersionHistoryModal } from '../../components/editor/VersionHistoryModal';
import { Loader } from '../../components/common/Loader';
import { ToastContainer } from '../../components/common/ToastContainer';

export const EditorPage = () => {
  const { id } = useParams();
  const { fetchDocumentById, currentDocument, loading } = useDocument();
  const { loadDocument } = useEditor();
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

  if (loading && !currentDocument) {
    return <Loader fullPage text="Loading document workspace..." />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-docs-bg">
      {/* 1. Top Navbar */}
      <EditorNavbar />

      {/* 2. Formatting Toolbar */}
      <EditorToolbar />

      {/* 3. Main Workspace Area (Canvas & Right Sidebar Placeholder) */}
      <div className="flex-1 flex overflow-hidden relative">
        <DocumentCanvas documentId={id} />
        <CommentsSidebar />
      </div>

      {/* 4. Bottom Status Bar */}
      <StatusBar />

      {/* Modals & Toast Containers */}
      <ShareModal />
      <VersionHistoryModal />
      <ToastContainer />
    </div>
  );
};
