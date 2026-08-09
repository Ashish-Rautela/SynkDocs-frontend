import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEditor } from '../../hooks/useEditor';
import { useDocument } from '../../hooks/useDocument';
import { useAuth } from '../../hooks/useAuth';
import { OnlineUsers } from './OnlineUsers';
import { Avatar } from '../common/Avatar';
import { Dropdown } from '../common/Dropdown';
import { ROUTES } from '../../constants/routes';
import { SAVE_STATUS } from '../../constants/editorConstants';
import {
  FileText,
  Star,
  Share2,
  History,
  MessageSquare,
  Cloud,
  CloudOff,
  Loader2,
  Check,
  User,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

export const EditorNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentDocument, toggleStar } = useDocument();
  const {
    title,
    updateTitle,
    saveStatus,
    openShareModal,
    openVersionHistory,
    toggleCommentsPanel,
    isCommentsSidebarOpen,
  } = useEditor();

  const handleStarToggle = () => {
    if (currentDocument?.id) {
      toggleStar(currentDocument.id);
    }
  };

  const userMenuItems = [
    { label: 'Profile Settings', icon: User, onClick: () => navigate(ROUTES.PROFILE) },
    { divider: true },
    { label: 'Sign Out', icon: LogOut, danger: true, onClick: logout },
  ];

  return (
    <header className="flex flex-col bg-white border-b border-docs-border select-none">
      {/* Top Main Row */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Back button, Logo, Title, Menus */}
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="p-2 rounded-full hover:bg-gray-100 text-docs-subtext transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-8 h-8 rounded-lg bg-docs-blue flex items-center justify-center text-white shrink-0 shadow-sm">
            <FileText className="w-4 h-4" />
          </div>

          <div className="flex flex-col">
            {/* Title & Star & Auto Save */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => updateTitle(e.target.value)}
                className="font-medium text-base text-docs-darkText bg-transparent border border-transparent hover:border-docs-border focus:border-docs-blue rounded px-1.5 py-0.5 outline-none transition-all max-w-[280px] sm:max-w-xs md:max-w-md truncate"
                placeholder="Untitled Document"
              />

              <button
                onClick={handleStarToggle}
                className="p-1 text-docs-subtext hover:text-amber-500 rounded transition-colors"
                title={currentDocument?.isStarred ? 'Unstar document' : 'Star document'}
              >
                <Star
                  className={`w-4 h-4 ${
                    currentDocument?.isStarred ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>

              {/* Auto Save Status Indicator */}
              <div className="flex items-center gap-1 px-2 py-0.5 text-xs text-docs-subtext rounded-md bg-gray-50 border border-gray-100">
                {saveStatus === SAVE_STATUS.SAVING ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-docs-blue animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : saveStatus === SAVE_STATUS.SAVED ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Saved to Cloud</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Unsaved changes</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comments, Version History, Live Users, Share, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Comments Button */}
          <button
            onClick={toggleCommentsPanel}
            className={`p-2 rounded-full text-docs-subtext hover:bg-gray-100 transition-colors relative ${
              isCommentsSidebarOpen ? 'bg-blue-50 text-docs-blue' : ''
            }`}
            title="Comments thread"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Active Online Collaborators Indicator */}
          <div className="hidden md:flex items-center">
            <OnlineUsers />
          </div>

          {/* Share Button */}
          <button
            onClick={() => openShareModal(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-docs-blue text-white rounded-full text-sm font-semibold hover:bg-docs-hoverBlue shadow-sm hover:shadow transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* User Profile */}
          <Dropdown
            align="right"
            trigger={
              <button className="focus:outline-none">
                <Avatar src={user?.avatarUrl} name={user?.name || 'User'} size="md" />
              </button>
            }
            items={userMenuItems}
          />
        </div>
      </div>
    </header>
  );
};
