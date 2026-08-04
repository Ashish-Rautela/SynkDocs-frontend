import React from 'react';
import { useEditor } from '../../hooks/useEditor';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, HEADING_OPTIONS } from '../../constants/editorConstants';
import {
  Undo2,
  Redo2,
  Printer,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Highlighter,
  ChevronDown,
  Outdent,
  Indent,
} from 'lucide-react';

export const EditorToolbar = () => {
  const {
    formatState,
    applyFormat,
    triggerUndo,
    triggerRedo,
    undoStack,
    redoStack,
  } = useEditor();

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (command === 'bold') applyFormat('bold');
    if (command === 'italic') applyFormat('italic');
    if (command === 'underline') applyFormat('underline');
    if (command === 'justifyLeft') applyFormat('alignment', 'left');
    if (command === 'justifyCenter') applyFormat('alignment', 'center');
    if (command === 'justifyRight') applyFormat('alignment', 'right');
    if (command === 'justifyFull') applyFormat('alignment', 'justify');
    if (command === 'insertUnorderedList') applyFormat('listStyle', 'bullet');
    if (command === 'insertOrderedList') applyFormat('listStyle', 'number');
  };

  const handleHeadingChange = (e) => {
    const val = e.target.value;
    applyFormat('heading', val);
    document.execCommand('formatBlock', false, val === 'p' ? '<p>' : `<${val}>`);
  };

  const handleFontFamilyChange = (e) => {
    const val = e.target.value;
    applyFormat('fontFamily', val);
    document.execCommand('fontName', false, val);
  };

  const handleFontSizeChange = (e) => {
    const val = e.target.value;
    applyFormat('fontSize', val);
    document.execCommand('fontSize', false, Math.min(7, Math.max(1, Math.floor(parseInt(val) / 6))));
  };

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 bg-docs-toolbar border-b border-docs-border overflow-x-auto select-none no-scrollbar">
      {/* Undo & Redo */}
      <button
        onClick={() => {
          document.execCommand('undo');
          triggerUndo();
        }}
        disabled={undoStack.length === 0}
        className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          document.execCommand('redo');
          triggerRedo();
        }}
        disabled={redoStack.length === 0}
        className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => window.print()}
        className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText transition-colors"
        title="Print (Ctrl+P)"
      >
        <Printer className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Heading Selector */}
      <select
        value={formatState.heading}
        onChange={handleHeadingChange}
        className="px-2 py-1 bg-transparent hover:bg-gray-200/70 border border-transparent rounded text-xs font-medium text-docs-darkText focus:outline-none focus:bg-white focus:border-docs-border cursor-pointer transition-colors"
      >
        {HEADING_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Font Family Selector */}
      <select
        value={formatState.fontFamily}
        onChange={handleFontFamilyChange}
        className="px-2 py-1 bg-transparent hover:bg-gray-200/70 border border-transparent rounded text-xs font-medium text-docs-darkText focus:outline-none focus:bg-white focus:border-docs-border cursor-pointer transition-colors max-w-[110px] truncate"
      >
        {FONT_FAMILY_OPTIONS.map((font) => (
          <option key={font.label} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Font Size Selector */}
      <select
        value={formatState.fontSize}
        onChange={handleFontSizeChange}
        className="px-2 py-1 bg-transparent hover:bg-gray-200/70 border border-transparent rounded text-xs font-medium text-docs-darkText focus:outline-none focus:bg-white focus:border-docs-border cursor-pointer transition-colors"
      >
        {FONT_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Bold, Italic, Underline */}
      <button
        onClick={() => handleCommand('bold')}
        className={`p-1.5 rounded transition-colors ${
          formatState.bold ? 'bg-blue-100 text-docs-blue font-bold' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('italic')}
        className={`p-1.5 rounded transition-colors ${
          formatState.italic ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('underline')}
        className={`p-1.5 rounded transition-colors ${
          formatState.underline ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* Text Color */}
      <label className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText cursor-pointer transition-colors relative" title="Text Color">
        <Type className="w-4 h-4" />
        <input
          type="color"
          onChange={(e) => {
            document.execCommand('foreColor', false, e.target.value);
            applyFormat('textColor', e.target.value);
          }}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
      </label>

      {/* Highlight Color */}
      <label className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText cursor-pointer transition-colors relative" title="Highlight Color">
        <Highlighter className="w-4 h-4" />
        <input
          type="color"
          onChange={(e) => {
            document.execCommand('hiliteColor', false, e.target.value);
            applyFormat('highlightColor', e.target.value);
          }}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
      </label>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Alignments */}
      <button
        onClick={() => handleCommand('justifyLeft')}
        className={`p-1.5 rounded transition-colors ${
          formatState.alignment === 'left' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Align left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('justifyCenter')}
        className={`p-1.5 rounded transition-colors ${
          formatState.alignment === 'center' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Align center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('justifyRight')}
        className={`p-1.5 rounded transition-colors ${
          formatState.alignment === 'right' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Align right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('justifyFull')}
        className={`p-1.5 rounded transition-colors ${
          formatState.alignment === 'justify' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-docs-border mx-1" />

      {/* Lists */}
      <button
        onClick={() => handleCommand('insertUnorderedList')}
        className={`p-1.5 rounded transition-colors ${
          formatState.listStyle === 'bullet' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Bulleted list"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleCommand('insertOrderedList')}
        className={`p-1.5 rounded transition-colors ${
          formatState.listStyle === 'number' ? 'bg-blue-100 text-docs-blue' : 'hover:bg-gray-200/70 text-docs-darkText'
        }`}
        title="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      {/* Indents */}
      <button
        onClick={() => document.execCommand('outdent')}
        className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText transition-colors"
        title="Decrease indent"
      >
        <Outdent className="w-4 h-4" />
      </button>

      <button
        onClick={() => document.execCommand('indent')}
        className="p-1.5 rounded hover:bg-gray-200/70 text-docs-darkText transition-colors"
        title="Increase indent"
      >
        <Indent className="w-4 h-4" />
      </button>
    </div>
  );
};
