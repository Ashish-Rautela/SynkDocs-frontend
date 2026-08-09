import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { socketService } from '../../socket/socket';
import { documentApi } from '../../services/documentApi';
import {
  PenTool,
  Eraser,
  Type,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  FilePlus,
} from 'lucide-react';

const COLORS = [
  { name: 'Dark Ink', value: '#1e293b' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Amber', value: '#d97706' },
];

export const NotesCanvas = ({ documentId }) => {
  const { content, updateContent } = useEditor();
  const canvasRef = useRef(null);
  const textEditorRef = useRef(null);

  const [mode, setMode] = useState('brush'); // 'brush' | 'eraser' | 'type'
  const [selectedColor, setSelectedColor] = useState('#1e293b');
  const [thickness, setThickness] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  // Multi-page state
  const [pages, setPages] = useState([{ id: 1, textContent: '', drawingData: '' }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const lastLocalEditTimestamp = useRef(0);
  const lastPolledContent = useRef('');

  // Setup canvas size & scale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Load active page onto canvas and text layer
  const loadPageToCanvas = (pageObj) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (textEditorRef.current) {
      textEditorRef.current.innerHTML = pageObj?.textContent || '';
    }

    if (pageObj?.drawingData && typeof pageObj.drawingData === 'string' && pageObj.drawingData.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          context.drawImage(img, 0, 0);
        }
      };
      img.onerror = (err) => {
        console.warn('Canvas image load warning:', err);
      };
      img.src = pageObj.drawingData;
    }
  };

  // Parse initial content JSON
  useEffect(() => {
    if (
      content &&
      typeof content === 'string' &&
      content.includes('<!-- TYPE:NOTES -->') &&
      content !== lastPolledContent.current
    ) {
      lastPolledContent.current = content;
      try {
        const jsonStr = content.replace('<!-- TYPE:NOTES -->', '').trim();
        const parsed = JSON.parse(jsonStr);

        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          setPages(parsed.pages);
          const pageIdx =
            parsed.currentPageIndex !== undefined && parsed.currentPageIndex < parsed.pages.length
              ? parsed.currentPageIndex
              : 0;
          setCurrentPageIndex(pageIdx);
          loadPageToCanvas(parsed.pages[pageIdx]);
        } else if (parsed.drawingData || parsed.textContent) {
          const singlePage = [
            { id: 1, textContent: parsed.textContent || '', drawingData: parsed.drawingData || '' },
          ];
          setPages(singlePage);
          setCurrentPageIndex(0);
          loadPageToCanvas(singlePage[0]);
        }
      } catch (e) {
        console.warn('Notes Canvas parse error:', e);
      }
    }
  }, [content]);

  // Real-time socket listener for remote drawing & page changes
  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (data && typeof data.content === 'string' && data.content.includes('<!-- TYPE:NOTES -->')) {
        try {
          const jsonStr = data.content.replace('<!-- TYPE:NOTES -->', '').trim();
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
            setPages(parsed.pages);
            const activePage = parsed.pages[currentPageIndex] || parsed.pages[0];
            loadPageToCanvas(activePage);
            lastPolledContent.current = data.content;
          }
        } catch (e) {
          console.warn('Remote Notes Canvas parse error:', e);
        }
      }
    };

    socketService.on('document-change', handleRemoteChange);
    return () => socketService.off('document-change', handleRemoteChange);
  }, [currentPageIndex]);

  // Cross-device background polling sync (every 2s) so edits on other devices display without refresh
  useEffect(() => {
    if (!documentId) return;

    const pollForRemoteChanges = async () => {
      const timeSinceLastEdit = Date.now() - lastLocalEditTimestamp.current;
      if (timeSinceLastEdit < 3000) return;

      try {
        const latestDoc = await documentApi.getDocumentById(documentId);
        const remoteContent = latestDoc?.content;

        if (
          remoteContent &&
          typeof remoteContent === 'string' &&
          remoteContent.includes('<!-- TYPE:NOTES -->') &&
          remoteContent !== lastPolledContent.current
        ) {
          lastPolledContent.current = remoteContent;
          const jsonStr = remoteContent.replace('<!-- TYPE:NOTES -->', '').trim();
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
            setPages(parsed.pages);
            const activePage = parsed.pages[currentPageIndex] || parsed.pages[0];
            loadPageToCanvas(activePage);
          }
        }
      } catch (e) {}
    };

    const syncInterval = setInterval(pollForRemoteChanges, 2000);
    pollForRemoteChanges();
    return () => clearInterval(syncInterval);
  }, [documentId, currentPageIndex]);

  // Save current pages state to document & cloud
  const saveNotesData = (updatedPages = pages, idx = currentPageIndex) => {
    lastLocalEditTimestamp.current = Date.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const currentDrawingData = canvas.toDataURL();
    const currentText = textEditorRef.current ? textEditorRef.current.innerHTML : '';

    const newPages = updatedPages.map((pg, i) => {
      if (i === idx) {
        return {
          ...pg,
          textContent: currentText,
          drawingData: currentDrawingData,
        };
      }
      return pg;
    });

    setPages(newPages);

    const payloadObj = {
      pages: newPages,
      currentPageIndex: idx,
    };
    const serialized = `<!-- TYPE:NOTES -->${JSON.stringify(payloadObj)}`;
    lastPolledContent.current = serialized;
    updateContent(serialized);
    if (documentId) {
      socketService.emitDocumentChange(documentId, serialized);
    }
  };

  // Multi-page navigation & management
  const handleAddPage = () => {
    const canvas = canvasRef.current;
    const currentDrawingData = canvas ? canvas.toDataURL() : '';
    const currentText = textEditorRef.current ? textEditorRef.current.innerHTML : '';

    const updatedPages = pages.map((pg, i) => {
      if (i === currentPageIndex) {
        return { ...pg, textContent: currentText, drawingData: currentDrawingData };
      }
      return pg;
    });

    const newPageObj = { id: Date.now(), textContent: '', drawingData: '' };
    const nextPages = [...updatedPages, newPageObj];
    const newIdx = nextPages.length - 1;

    setPages(nextPages);
    setCurrentPageIndex(newIdx);
    loadPageToCanvas(newPageObj);

    saveNotesData(nextPages, newIdx);
  };

  const handleSwitchPage = (targetIdx) => {
    if (targetIdx < 0 || targetIdx >= pages.length || targetIdx === currentPageIndex) return;

    const canvas = canvasRef.current;
    const currentDrawingData = canvas ? canvas.toDataURL() : '';
    const currentText = textEditorRef.current ? textEditorRef.current.innerHTML : '';

    const updatedPages = pages.map((pg, i) => {
      if (i === currentPageIndex) {
        return { ...pg, textContent: currentText, drawingData: currentDrawingData };
      }
      return pg;
    });

    setPages(updatedPages);
    setCurrentPageIndex(targetIdx);
    loadPageToCanvas(updatedPages[targetIdx]);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      handleClearCanvas();
      return;
    }

    const nextPages = pages.filter((_, i) => i !== currentPageIndex);
    const newIdx = Math.max(0, currentPageIndex - 1);

    setPages(nextPages);
    setCurrentPageIndex(newIdx);
    loadPageToCanvas(nextPages[newIdx]);

    saveNotesData(nextPages, newIdx);
  };

  // Drawing Handlers
  const startDrawing = (e) => {
    if (mode === 'type') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || mode === 'type') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = thickness * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = thickness;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveNotesData();
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (textEditorRef.current) textEditorRef.current.innerHTML = '';
      saveNotesData();
    }
  };

  const handleTextInput = () => {
    saveNotesData();
  };

  return (
    <div className="flex-1 flex flex-col bg-amber-50/30 overflow-hidden select-none">
      {/* 1. Paint & Multi-Page Notes Toolbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-docs-border gap-3 flex-wrap shadow-sm">
        {/* Tool Modes */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('brush')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'brush'
                ? 'bg-docs-blue text-white shadow-sm'
                : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Brush Pen</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('eraser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'eraser'
                ? 'bg-docs-blue text-white shadow-sm'
                : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'type'
                ? 'bg-docs-blue text-white shadow-sm'
                : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Type Directly</span>
          </button>
        </div>

        {/* Colors Palette */}
        {mode === 'brush' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider hidden sm:inline mr-1">
              Color:
            </span>
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                  selectedColor === c.value
                    ? 'scale-110 ring-2 ring-docs-blue ring-offset-1'
                    : 'hover:scale-105'
                }`}
                title={c.name}
              >
                {selectedColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        )}

        {/* Brush Thickness Slider */}
        {mode !== 'type' && (
          <div className="flex items-center gap-2 bg-gray-50 border border-docs-border px-3 py-1 rounded-xl">
            <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider hidden sm:inline">
              Size:
            </span>
            <input
              type="range"
              min="1"
              max="35"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-20 sm:w-28 accent-docs-blue cursor-pointer"
            />
            <span className="text-xs font-bold text-docs-darkText min-w-[28px]">
              {thickness}px
            </span>
          </div>
        )}

        {/* Multi-Page Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleSwitchPage(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="p-1 rounded-lg text-amber-900 disabled:opacity-30 hover:bg-amber-100 transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-amber-900 px-1">
            Page {currentPageIndex + 1} of {pages.length}
          </span>

          <button
            type="button"
            onClick={() => handleSwitchPage(currentPageIndex + 1)}
            disabled={currentPageIndex === pages.length - 1}
            className="p-1 rounded-lg text-amber-900 disabled:opacity-30 hover:bg-amber-100 transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleAddPage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all ml-1"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Page</span>
          </button>
        </div>

        {/* Actions: Delete/Clear Page */}
        <button
          type="button"
          onClick={handleDeletePage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{pages.length > 1 ? 'Delete Page' : 'Clear Notes'}</span>
        </button>
      </div>

      {/* 2. Note Paper Pad Workspace Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-10 flex justify-center">
        <div className="w-full max-w-[800px] min-h-[1000px] bg-amber-50/70 border border-amber-200/80 rounded-xl shadow-docs-canvas relative overflow-hidden flex flex-col note-paper-pad">
          {/* Page indicator watermark tag */}
          <div className="absolute top-3 right-4 text-[11px] font-bold text-amber-700/60 bg-amber-100/60 px-2 py-0.5 rounded-md select-none pointer-events-none z-30">
            Page {currentPageIndex + 1} of {pages.length}
          </div>

          {/* Lined Note Paper Lines Background Effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '100% 28px',
              marginTop: '40px',
            }}
          />
          {/* Left Red Margin Line */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-0.5 bg-red-300/60 pointer-events-none" />

          {/* Direct Text Editor Layer */}
          <div
            ref={textEditorRef}
            contentEditable={mode === 'type'}
            suppressContentEditableWarning
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
            onInput={handleTextInput}
            placeholder={mode === 'type' ? 'Click anywhere on notes paper to type directly...' : ''}
            className={`w-full h-full p-8 sm:p-16 pl-12 sm:pl-20 outline-none font-sans text-base leading-[28px] text-docs-darkText relative min-h-[950px] ${
              mode === 'type' ? 'cursor-text z-30' : 'pointer-events-none z-10'
            }`}
          />

          {/* HTML5 Paint Drawing Canvas Layer */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => {
              if (e.touches[0]) startDrawing(e.touches[0]);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) draw(e.touches[0]);
            }}
            onTouchEnd={stopDrawing}
            className={`absolute inset-0 z-20 ${
              mode === 'type' ? 'pointer-events-none' : 'cursor-crosshair'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
