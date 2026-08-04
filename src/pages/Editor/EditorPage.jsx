import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useEditor } from '../../hooks/useEditor';
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
  const { updateTitle, updateContent } = useEditor();

  useEffect(() => {
    if (id) {
      fetchDocumentById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentDocument) {
      updateTitle(currentDocument.title);
      updateContent(currentDocument.content);
    }
  }, [currentDocument]);

  if (loading && !currentDocument) {
    return <Loader fullPage text="Loading Google Docs Editor state engine..." />;
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
