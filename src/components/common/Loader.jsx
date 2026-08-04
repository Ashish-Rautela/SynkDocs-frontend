import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ fullPage = false, text = 'Loading SynkDocs...' }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-docs-bg/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-docs-card border border-docs-border">
          <Loader2 className="w-8 h-8 text-docs-blue animate-spin" />
          <p className="text-sm font-medium text-docs-subtext animate-pulse">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 text-docs-blue animate-spin" />
    </div>
  );
};
