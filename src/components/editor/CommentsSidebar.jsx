import React, { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { Avatar } from '../common/Avatar';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const CommentsSidebar = () => {
  const {
    isCommentsSidebarOpen,
    toggleCommentsPanel,
    comments,
    postComment,
    resolveComment,
  } = useEditor();
  const [commentInput, setCommentInput] = useState('');

  if (!isCommentsSidebarOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    postComment({ text: commentInput });
    setCommentInput('');
  };

  return (
    <aside className="w-80 border-l border-docs-border bg-white p-4 flex flex-col justify-between shrink-0 shadow-lg animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-docs-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-docs-blue" />
          <h3 className="text-sm font-bold text-docs-darkText">Comments ({comments.length})</h3>
        </div>
        <button
          onClick={toggleCommentsPanel}
          className="p-1 rounded-full text-docs-subtext hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {comments.map((cmt) => (
          <div
            key={cmt.id}
            className={`p-3.5 rounded-xl border transition-all ${
              cmt.resolved
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : 'bg-blue-50/30 border-blue-100 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar src={cmt.avatar} name={cmt.author} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-docs-darkText">{cmt.author}</h4>
                  <span className="text-[10px] text-docs-subtext">{cmt.timestamp}</span>
                </div>
              </div>
              <button
                onClick={() => resolveComment(cmt.id)}
                className={`p-1 rounded-full text-docs-subtext hover:text-emerald-600 transition-colors ${
                  cmt.resolved ? 'text-emerald-600' : ''
                }`}
                title={cmt.resolved ? 'Mark as unresolved' : 'Resolve thread'}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-docs-darkText leading-relaxed pl-8">{cmt.text}</p>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-docs-border flex gap-2">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 bg-docs-bg border border-docs-border rounded-xl text-xs text-docs-darkText focus:outline-none focus:ring-2 focus:ring-docs-blue"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="p-2 rounded-xl bg-docs-blue text-white disabled:opacity-40 hover:bg-docs-hoverBlue transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
