import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { socketService } from '../../socket/socket';
import { PenTool, Eraser, Type, Trash2, Sliders, Palette, Check } from 'lucide-react';

const COLORS = [
  { name: 'Dark Ink', value: '#1e293b' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Amber', value: '#d97706' },
];

const THICKNESSES = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 },
  { label: 'Marker', value: 14 },
];

export const NotesCanvas = ({ documentId }) => {
  const { content, updateContent } = useEditor();
  const canvasRef = useRef(null);
  const textEditorRef = useRef(null);

  const [mode, setMode] = useState('brush'); // 'brush' | 'eraser' | 'type'
  const [selectedColor, setSelectedColor] = useState('#1e293b');
  const [thickness, setThickness] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textContent, setTextContent] = useState('');

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

  // Parse initial content
  useEffect(() => {
    if (content && content.includes('<!-- TYPE:NOTES -->')) {
      try {
        const jsonStr = content.replace('<!-- TYPE:NOTES -->', '').trim();
        const parsed = JSON.parse(jsonStr);
        if (parsed.textContent) {
          setTextContent(parsed.textContent);
          if (textEditorRef.current) textEditorRef.current.innerHTML = parsed.textContent;
        }
        if (parsed.drawingData) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
            };
            img.src = parsed.drawingData;
          }
        }
      } catch (e) {
        console.warn('Notes Canvas parse error:', e);
      }
    }
  }, [content]);

  // Real-time socket listener for remote drawing & text changes
  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (data && typeof data.content === 'string' && data.content.includes('<!-- TYPE:NOTES -->')) {
        try {
          const jsonStr = data.content.replace('<!-- TYPE:NOTES -->', '').trim();
          const parsed = JSON.parse(jsonStr);
          if (parsed.textContent !== undefined) {
            setTextContent(parsed.textContent);
            if (textEditorRef.current && textEditorRef.current.innerHTML !== parsed.textContent) {
              textEditorRef.current.innerHTML = parsed.textContent;
            }
          }
          if (parsed.drawingData) {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              };
              img.src = parsed.drawingData;
            }
          }
        } catch (e) {
          console.warn('Remote Notes Canvas parse error:', e);
        }
      }
    };

    socketService.on('document-change', handleRemoteChange);
    return () => socketService.off('document-change', handleRemoteChange);
  }, []);

  const saveNotesData = (newText = textContent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawingData = canvas.toDataURL();
    const payloadObj = {
      textContent: newText,
      drawingData,
    };
    const serialized = `<!-- TYPE:NOTES -->${JSON.stringify(payloadObj)}`;
    updateContent(serialized);
    if (documentId) {
      socketService.emitDocumentChange(documentId, serialized);
    }
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
      saveNotesData();
    }
  };

  const handleTextInput = () => {
    if (textEditorRef.current) {
      const html = textEditorRef.current.innerHTML;
      setTextContent(html);
      saveNotesData(html);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-amber-50/30 overflow-hidden select-none">
      {/* 1. Paint Notes Toolbar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-docs-border gap-4 flex-wrap shadow-sm">
        {/* Tool Modes */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
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
            <span>Brush Pen</span>
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
            <span>Eraser</span>
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
            <span>Type Directly</span>
          </button>
        </div>

        {/* Colors Palette */}
        {mode === 'brush' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider mr-1">
              Color:
            </span>
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                  selectedColor === c.value ? 'scale-110 ring-2 ring-docs-blue ring-offset-1' : 'hover:scale-105'
                }`}
                title={c.name}
              >
                {selectedColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            ))}
          </div>
        )}

        {/* Thickness Adjuster */}
        {mode !== 'type' && (
          <div className="flex items-center gap-1 bg-gray-50 border border-docs-border p-1 rounded-xl">
            <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider px-2">
              Size:
            </span>
            {THICKNESSES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setThickness(t.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  thickness === t.value
                    ? 'bg-white text-docs-blue shadow-sm font-bold border border-docs-border'
                    : 'text-docs-subtext hover:bg-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Action: Clear */}
        <button
          type="button"
          onClick={handleClearCanvas}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Notes</span>
        </button>
      </div>

      {/* 2. Note Paper Pad Workspace Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center">
        <div className="w-[800px] min-h-[1000px] bg-amber-50/70 border border-amber-200/80 rounded-xl shadow-docs-canvas relative overflow-hidden flex flex-col note-paper-pad">
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
          <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-red-300/60 pointer-events-none" />

          {/* Direct Text Editor Layer */}
          <div
            ref={textEditorRef}
            contentEditable={mode === 'type'}
            suppressContentEditableWarning
            onInput={handleTextInput}
            placeholder={mode === 'type' ? 'Click anywhere on notes paper to type directly...' : ''}
            className={`w-full h-full p-16 pl-20 outline-none font-sans text-base leading-[28px] text-docs-darkText relative z-10 min-h-[950px] ${
              mode === 'type' ? 'cursor-text' : 'pointer-events-none'
            }`}
          />

          {/* HTML5 Paint Drawing Canvas Layer */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`absolute inset-0 z-20 ${
              mode === 'type' ? 'pointer-events-none' : 'cursor-crosshair'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
