import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { useAuth } from '../../hooks/useAuth';
import { socketService } from '../../socket/socket';
import { Avatar } from '../common/Avatar';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addComment, toggleResolveComment } from '../../redux/slices/editorSlice';

export const CommentsSidebar = () => {
  const { id: documentId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    isCommentsSidebarOpen,
    toggleCommentsPanel,
    comments,
    postComment,
    resolveComment,
  } = useEditor();
  const [commentInput, setCommentInput] = useState('');

  // Live WebSocket & room sync for incoming remote comments
  useEffect(() => {
    const handleRemoteAdd = (cmt) => {
      if (cmt && cmt.text) {
        dispatch(addComment(cmt));
      }
    };
    const handleRemoteResolve = (cmtId) => {
      if (cmtId) {
        dispatch(toggleResolveComment(cmtId));
      }
    };

    socketService.on('comment-added', handleRemoteAdd);
    socketService.on('comment-resolved', handleRemoteResolve);

    return () => {
      socketService.off('comment-added', handleRemoteAdd);
      socketService.off('comment-resolved', handleRemoteResolve);
    };
  }, [dispatch]);

  if (!isCommentsSidebarOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: `cmt-${Date.now()}`,
      text: commentInput.trim(),
      author: user?.name || user?.email || 'Collaborator',
      avatar: user?.avatarUrl || '',
      timestamp: 'Just now',
      resolved: false,
    };

    postComment(newComment);
    if (documentId) {
      socketService.emitCommentAdded(documentId, newComment);
    }
    setCommentInput('');
  };

  const handleToggleResolve = (cmtId) => {
    resolveComment(cmtId);
    if (documentId) {
      socketService.emitCommentResolved(documentId, cmtId);
    }
  };

  return (
    <aside className="w-full sm:w-80 border-l border-docs-border bg-white p-4 flex flex-col justify-between shrink-0 shadow-lg animate-in slide-in-from-right duration-200 z-40">
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
        {comments.length === 0 ? (
          <div className="text-center py-10 text-docs-subtext space-y-2 select-none">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
            <p className="text-xs font-medium">No comments yet</p>
            <p className="text-[11px] text-gray-400">Start the conversation by adding a comment below.</p>
          </div>
        ) : (
          comments.map((cmt) => (
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
                  onClick={() => handleToggleResolve(cmt.id)}
                  className={`p-1 rounded-full transition-colors ${
                    cmt.resolved
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-docs-subtext hover:text-emerald-600 hover:bg-gray-100'
                  }`}
                  title={cmt.resolved ? 'Mark thread as active' : 'Resolve thread'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-docs-darkText leading-relaxed pl-8">{cmt.text}</p>
            </div>
          ))
        )}
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
