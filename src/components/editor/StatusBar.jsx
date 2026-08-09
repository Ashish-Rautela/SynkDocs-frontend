import React, { useState, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { countWordsAndChars } from '../../utils/formatters';
import { Wifi, WifiOff, FileText } from 'lucide-react';
import { socketService } from '../../socket/socket';

export const StatusBar = () => {
  const { content } = useEditor();
  const { words, characters } = countWordsAndChars(content);
  const [isConnected, setIsConnected] = useState(socketService.isConnected);

  useEffect(() => {
    const unsubscribe = socketService.onStatusChange((status) => {
      setIsConnected(status);
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="flex items-center justify-between px-6 py-1.5 bg-white border-t border-docs-border text-xs text-docs-subtext select-none">
      {/* Left: Word & Character metrics */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-medium">
          <FileText className="w-3.5 h-3.5 text-docs-blue" />
          <span>Page 1 of 1</span>
        </span>
        <span className="h-3 w-px bg-docs-border" />
        <span>
          <strong className="text-docs-darkText">{words}</strong> words
        </span>
        <span>
          <strong className="text-docs-darkText">{characters}</strong> characters
        </span>
      </div>

      {/* Right: Socket connectivity status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Multiplayer Active (Connected)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400 font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode</span>
          </span>
        )}
      </div>
    </footer>
  );
};
