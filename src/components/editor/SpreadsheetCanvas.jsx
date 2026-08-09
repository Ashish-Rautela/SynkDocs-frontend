import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { socketService } from '../../socket/socket';
import { Plus, Download, Bold, AlignLeft, AlignCenter, AlignRight, Table } from 'lucide-react';

const DEFAULT_COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const INITIAL_ROWS_COUNT = 15;

export const SpreadsheetCanvas = ({ documentId }) => {
  const { content, updateContent } = useEditor();
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rowCount, setRowCount] = useState(INITIAL_ROWS_COUNT);
  const [gridData, setGridData] = useState({});
  const [activeCell, setActiveCell] = useState('A1');
  const [formulaValue, setFormulaValue] = useState('');
  const [cellStyles, setCellStyles] = useState({});

  // Parse initial content or JSON
  useEffect(() => {
    if (content && content.includes('<!-- TYPE:DATASHEET -->')) {
      try {
        const jsonStr = content.replace('<!-- TYPE:DATASHEET -->', '').trim();
        const parsed = JSON.parse(jsonStr);
        if (parsed.gridData) setGridData(parsed.gridData);
        if (parsed.cols) setCols(parsed.cols);
        if (parsed.rowCount) setRowCount(parsed.rowCount);
        if (parsed.cellStyles) setCellStyles(parsed.cellStyles);
      } catch (e) {
        console.warn('Failed to parse Data Sheet JSON:', e);
      }
    }
  }, [content]);

  // Real-time socket listener for remote spreadsheet edits
  useEffect(() => {
    const handleRemoteChange = (data) => {
      if (data && typeof data.content === 'string' && data.content.includes('<!-- TYPE:DATASHEET -->')) {
        try {
          const jsonStr = data.content.replace('<!-- TYPE:DATASHEET -->', '').trim();
          const parsed = JSON.parse(jsonStr);
          if (parsed.gridData) setGridData(parsed.gridData);
          if (parsed.cols) setCols(parsed.cols);
          if (parsed.rowCount) setRowCount(parsed.rowCount);
          if (parsed.cellStyles) setCellStyles(parsed.cellStyles);
        } catch (e) {
          console.warn('Remote Data Sheet parse error:', e);
        }
      }
    };

    socketService.on('document-change', handleRemoteChange);
    return () => socketService.off('document-change', handleRemoteChange);
  }, []);

  // Save grid data to document state
  const saveSheetData = (newGridData, newCols = cols, newRows = rowCount, newStyles = cellStyles) => {
    const payloadObj = {
      gridData: newGridData,
      cols: newCols,
      rowCount: newRows,
      cellStyles: newStyles,
    };
    const serialized = `<!-- TYPE:DATASHEET -->${JSON.stringify(payloadObj)}`;
    updateContent(serialized);
    if (documentId) {
      socketService.emitDocumentChange(documentId, serialized);
    }
  };

  // Evaluate cell formula (e.g. =SUM(A1:A5), =A1+B1)
  const evaluateCellValue = (rawVal) => {
    if (!rawVal || typeof rawVal !== 'string' || !rawVal.startsWith('=')) {
      return rawVal || '';
    }

    const expr = rawVal.substring(1).toUpperCase().trim();
    try {
      if (expr.startsWith('SUM(') && expr.endsWith(')')) {
        const rangeStr = expr.substring(4, expr.length - 1);
        const [startCell, endCell] = rangeStr.split(':');
        if (startCell && endCell) {
          const colLetter = startCell.charAt(0);
          const startRow = parseInt(startCell.substring(1), 10);
          const endRow = parseInt(endCell.substring(1), 10);
          let sum = 0;
          for (let r = startRow; r <= endRow; r++) {
            const val = parseFloat(gridData[`${colLetter}${r}`]) || 0;
            sum += val;
          }
          return sum.toString();
        }
      }
      return rawVal;
    } catch {
      return '#ERROR!';
    }
  };

  const handleCellChange = (cellId, value) => {
    const updatedGrid = { ...gridData, [cellId]: value };
    setGridData(updatedGrid);
    setFormulaValue(value);
    saveSheetData(updatedGrid);
  };

  const handleFormulaSubmit = (e) => {
    e.preventDefault();
    if (activeCell) {
      handleCellChange(activeCell, formulaValue);
    }
  };

  const handleAddColumn = () => {
    const lastCol = cols[cols.length - 1];
    const nextColChar = String.fromCharCode(lastCol.charCodeAt(0) + 1);
    const newCols = [...cols, nextColChar];
    setCols(newCols);
    saveSheetData(gridData, newCols);
  };

  const handleAddRow = () => {
    const newCount = rowCount + 5;
    setRowCount(newCount);
    saveSheetData(gridData, cols, newCount);
  };

  const toggleBoldCell = () => {
    if (!activeCell) return;
    const isBold = cellStyles[activeCell]?.bold;
    const updatedStyles = {
      ...cellStyles,
      [activeCell]: { ...cellStyles[activeCell], bold: !isBold },
    };
    setCellStyles(updatedStyles);
    saveSheetData(gridData, cols, rowCount, updatedStyles);
  };

  const exportToCSV = () => {
    let csv = cols.join(',') + '\n';
    for (let r = 1; r <= rowCount; r++) {
      const rowVals = cols.map((col) => {
        const raw = gridData[`${col}${r}`] || '';
        return `"${raw.replace(/"/g, '""')}"`;
      });
      csv += rowVals.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DataSheet_${documentId || 'export'}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* 1. Formula & Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-docs-border gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <span className="text-xs font-bold text-docs-blue bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            {activeCell}
          </span>
          <form onSubmit={handleFormulaSubmit} className="flex-1 flex items-center">
            <span className="text-xs font-serif font-bold text-gray-400 mr-2">fx</span>
            <input
              type="text"
              value={formulaValue}
              onChange={(e) => setFormulaValue(e.target.value)}
              onBlur={handleFormulaSubmit}
              placeholder="Enter text, number or formula (e.g. =SUM(A1:A5))"
              className="w-full px-3 py-1 bg-white border border-docs-border rounded-lg text-xs font-mono text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBoldCell}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
              cellStyles[activeCell]?.bold
                ? 'bg-blue-50 border-docs-blue text-docs-blue'
                : 'border-docs-border bg-white text-docs-darkText hover:bg-gray-100'
            }`}
            title="Bold cell"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-docs-border bg-white hover:bg-gray-100 text-xs font-semibold text-docs-darkText transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Row</span>
          </button>

          <button
            type="button"
            onClick={handleAddColumn}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-docs-border bg-white hover:bg-gray-100 text-xs font-semibold text-docs-darkText transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Col</span>
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Excel Grid Container */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
        <div className="bg-white border border-docs-border rounded-lg shadow-docs-canvas overflow-hidden min-w-[700px]">
          <table className="w-full border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b border-docs-border">
                <th className="w-12 py-2 border-r border-docs-border font-semibold text-center select-none bg-gray-200/60">
                  #
                </th>
                {cols.map((col) => (
                  <th
                    key={col}
                    className="min-w-[110px] px-3 py-2 border-r border-docs-border font-bold text-center select-none"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, rIdx) => {
                const rowNum = rIdx + 1;
                return (
                  <tr key={rowNum} className="border-b border-docs-border hover:bg-blue-50/20">
                    <td className="w-12 py-2 border-r border-docs-border font-medium text-center text-gray-400 bg-gray-50 select-none">
                      {rowNum}
                    </td>
                    {cols.map((col) => {
                      const cellId = `${col}${rowNum}`;
                      const rawVal = gridData[cellId] || '';
                      const displayVal = evaluateCellValue(rawVal);
                      const isSelected = activeCell === cellId;
                      const isBold = cellStyles[cellId]?.bold;

                      return (
                        <td
                          key={cellId}
                          onClick={() => {
                            setActiveCell(cellId);
                            setFormulaValue(rawVal);
                          }}
                          className={`border-r border-docs-border p-0 relative transition-all ${
                            isSelected ? 'ring-2 ring-docs-blue ring-inset bg-blue-50/40' : ''
                          }`}
                        >
                          <input
                            type="text"
                            value={isSelected ? formulaValue : displayVal}
                            onChange={(e) => {
                              setFormulaValue(e.target.value);
                              handleCellChange(cellId, e.target.value);
                            }}
                            onFocus={() => {
                              setActiveCell(cellId);
                              setFormulaValue(rawVal);
                            }}
                            className={`w-full h-full px-2 py-1.5 bg-transparent border-none outline-none font-sans text-xs text-docs-darkText ${
                              isBold ? 'font-bold' : 'font-normal'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
