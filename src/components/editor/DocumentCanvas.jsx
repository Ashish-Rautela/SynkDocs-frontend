import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
import { documentApi } from '../../services/documentApi';
import { setActiveUsers } from '../../redux/slices/editorSlice';
import { SAVE_STATUS } from '../../constants/editorConstants';
import { computeTextDiff, applyOperation, adjustCaretOffset } from '../../utils/textSyncEngine';
import { getCaretCharacterOffsetWithin, setCaretCharacterOffsetWithin } from '../../utils/caretUtils';

export const DocumentCanvas = ({ documentId }) => {
  const dispatch = useDispatch();
  const { content, updateContent, receiveRemoteContent, triggerManualSave } = useEditor();
  const saveStatus = useSelector((state) => state.editor.saveStatus);
  const { user } = useAuth();
  const editorRef = useRef(null);
  const lastLocalEditTimestamp = useRef(0);
  const lastPolledContent = useRef('');
  const lastKnownHtmlRef = useRef('');

  // Sync content with ref on initial load or local state change
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
      lastKnownHtmlRef.current = content || '';
    }
  }, [content]);

  // Real-time socket listeners for incoming remote edits & presence updates
  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (data && typeof data.content === 'string') {
        if (editorRef.current && editorRef.current.innerHTML !== data.content) {
          editorRef.current.innerHTML = data.content;
          lastKnownHtmlRef.current = data.content;
        }
        receiveRemoteContent(data.content);
        lastPolledContent.current = data.content;
      }
    };

    // Instant character-by-character operation listener
    const handleRemoteOperation = (data) => {
      const { operation, senderId } = data || {};
      if (!operation || senderId === socketService.currentUser?.id) return;

      if (operation.type === 'DOC_TEXT_DELTA' && operation.diff && editorRef.current) {
        const isFocused = document.activeElement === editorRef.current;
        const currentCaret = isFocused ? getCaretCharacterOffsetWithin(editorRef.current) : null;

        const currentText = lastKnownHtmlRef.current || editorRef.current.innerHTML;
        const updated = applyOperation(currentText, operation.diff);
        lastKnownHtmlRef.current = updated;
        lastPolledContent.current = updated;

        editorRef.current.innerHTML = updated;
        receiveRemoteContent(updated);

        // Preserve local caret offset so typing is never interrupted
        if (isFocused && currentCaret !== null) {
          const adjustedCaret = adjustCaretOffset(currentCaret, operation.diff);
          setCaretCharacterOffsetWithin(editorRef.current, adjustedCaret);
        }
      }
    };

    const handlePresenceUpdate = (activeUsers) => {
      if (Array.isArray(activeUsers)) {
        dispatch(setActiveUsers(activeUsers));
      }
    };

    socketService.on('document-change', handleRemoteChange);
    socketService.on('document-op', handleRemoteOperation);
    socketService.on('presence-update', handlePresenceUpdate);

    return () => {
      socketService.off('document-change', handleRemoteChange);
      socketService.off('document-op', handleRemoteOperation);
      socketService.off('presence-update', handlePresenceUpdate);
    };
  }, [dispatch, receiveRemoteContent]);

  // Cross-device background sync: poll the server every 2s.
  // This is the ONLY mechanism that works across different devices/browsers.
  // We ALWAYS poll, but only apply remote changes if the user hasn't typed locally
  // in the last 3 seconds (to avoid overwriting mid-typing).
  useEffect(() => {
    if (!documentId) return;

    const pollForRemoteChanges = async () => {
      const timeSinceLastEdit = Date.now() - lastLocalEditTimestamp.current;

      // If the user typed locally less than 3s ago, skip this poll cycle
      // so we don't overwrite their in-progress edits
      if (timeSinceLastEdit < 3000) {
        return;
      }

      try {
        const latestDoc = await documentApi.getDocumentById(documentId);
        const remoteContent = latestDoc?.content;

        if (typeof remoteContent !== 'string') return;

        // Only update if the remote content is actually different from what we last polled
        // AND different from current editor content
        if (
          remoteContent !== lastPolledContent.current &&
          editorRef.current &&
          editorRef.current.innerHTML !== remoteContent
        ) {
          lastPolledContent.current = remoteContent;
          editorRef.current.innerHTML = remoteContent;
          receiveRemoteContent(remoteContent);
        }
      } catch (e) {
        // Silently skip background polling errors
      }
    };

    // Poll every 2 seconds — guarantees < 5s update time on the receiving device
    const syncInterval = setInterval(pollForRemoteChanges, 2000);

    // Also poll immediately on mount to get latest content
    pollForRemoteChanges();

    return () => clearInterval(syncInterval);
  }, [documentId, receiveRemoteContent]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const diff = computeTextDiff(lastKnownHtmlRef.current, html, socketService.currentUser?.id);

      lastKnownHtmlRef.current = html;
      lastLocalEditTimestamp.current = Date.now();
      lastPolledContent.current = html; // Mark current content as "known" so polling doesn't revert it
      updateContent(html);

      if (documentId && diff) {
        // Emit character delta immediately with 0ms delay to remote collaborators
        socketService.emitOperation(documentId, {
          type: 'DOC_TEXT_DELTA',
          diff,
        });
      }
    }
  }, [documentId, updateContent]);

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
