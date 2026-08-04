import React, { useRef, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { socketService } from '../../socket/socket';

export const DocumentCanvas = ({ documentId }) => {
  const { content, updateContent } = useEditor();
  const editorRef = useRef(null);

  // Sync content with ref on initial load or remote change
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  // Join document socket channel
  useEffect(() => {
    if (documentId) {
      socketService.joinDocument(documentId, { id: 'usr-101', name: 'Sarah Jenkins' });
    }
    return () => {
      if (documentId) {
        socketService.leaveDocument(documentId);
      }
    };
  }, [documentId]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      updateContent(html);
      socketService.emitDocumentChange(documentId, html);
    }
  };

  // Keyboard shortcut listener for Ctrl+S / Cmd+S manual save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-docs-canvasBg p-6 sm:p-12 flex justify-center doc-canvas-editor">
      {/* Paper Sheet container resembling Google Docs A4 sheet */}
      <div className="w-full max-w-[816px] min-h-[1056px] bg-white rounded-sm shadow-docs-canvas border border-gray-200/80 p-12 sm:p-16 relative print-page flex flex-col">
        {/* Top margin indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 select-none no-print">
          — 1 inch margin —
        </div>

        {/* Contenteditable Rich Engine Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="flex-1 outline-none text-docs-darkText font-sans text-base leading-relaxed space-y-4 min-h-[900px]"
          style={{ wordBreak: 'break-word' }}
        />
      </div>
    </div>
  );
};
