import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
import { documentApi } from '../../services/documentApi';
import { setActiveUsers } from '../../redux/slices/editorSlice';

export const DocumentCanvas = ({ documentId }) => {
  const dispatch = useDispatch();
  const { content, updateContent, receiveRemoteContent, triggerManualSave } = useEditor();
  const { user } = useAuth();
  const editorRef = useRef(null);

  // Sync content with ref on initial load or local state change
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  // Real-time socket listeners for incoming remote edits & presence updates
  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (data && typeof data.content === 'string') {
        if (editorRef.current && editorRef.current.innerHTML !== data.content) {
          editorRef.current.innerHTML = data.content;
        }
        receiveRemoteContent(data.content);
      }
    };

    const handlePresenceUpdate = (activeUsers) => {
      if (Array.isArray(activeUsers)) {
        dispatch(setActiveUsers(activeUsers));
      }
    };

    socketService.on('document-change', handleRemoteChange);
    socketService.on('presence-update', handlePresenceUpdate);

    return () => {
      socketService.off('document-change', handleRemoteChange);
      socketService.off('presence-update', handlePresenceUpdate);
    };
  }, [dispatch, receiveRemoteContent]);

  // Real-time cross-device background sync (every 3.5s) so edits on other devices appear without page refresh
  useEffect(() => {
    if (!documentId) return;

    const syncInterval = setInterval(async () => {
      // Don't overwrite if local user is actively focused and typing in the editor
      if (typeof document !== 'undefined' && document.hasFocus && document.hasFocus() && editorRef.current === document.activeElement) {
        return;
      }

      try {
        const latestDoc = await documentApi.getDocumentById(documentId);
        if (latestDoc && typeof latestDoc.content === 'string') {
          if (editorRef.current && editorRef.current.innerHTML !== latestDoc.content) {
            editorRef.current.innerHTML = latestDoc.content;
            receiveRemoteContent(latestDoc.content);
          }
        }
      } catch (e) {
        // Silently skip background polling errors
      }
    }, 3500);

    return () => clearInterval(syncInterval);
  }, [documentId, receiveRemoteContent]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      updateContent(html);
      if (documentId) {
        socketService.emitDocumentChange(documentId, html);
      }
    }
  };

  // Keyboard shortcut listener for Ctrl+S / Cmd+S manual save to cloud
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerManualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerManualSave]);

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
