import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDocument } from '../../hooks/useDocument';
import { Avatar } from '../common/Avatar';
import { Dropdown } from '../common/Dropdown';
import { ROUTES } from '../../constants/routes';
import { Search, FileText, User, Settings, LogOut, Plus } from 'lucide-react';

export const Header = ({ showSearch = true }) => {
  const { user, logout } = useAuth();
  const { searchQuery, updateSearchQuery, createDocument } = useDocument();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    createDocument({ title: 'Untitled Document' });
    navigate(ROUTES.EDITOR_BUILDER('new-' + Date.now()));
  };

  const userMenuItems = [
    { label: 'Profile Settings', icon: User, onClick: () => navigate(ROUTES.PROFILE) },
    { label: 'Preferences', icon: Settings, onClick: () => navigate(ROUTES.SETTINGS) },
    { divider: true },
    { label: 'Sign Out', icon: LogOut, danger: true, onClick: logout },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-2.5 bg-white border-b border-docs-border shadow-sm">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-docs-blue flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-docs-darkText tracking-tight">
            Synk<span className="text-docs-blue">Docs</span>
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      {showSearch && (
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-docs-subtext" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              placeholder="Search documents by title..."
              className="w-full pl-10 pr-4 py-2 bg-docs-bg border border-transparent rounded-xl text-sm text-docs-darkText focus:outline-none focus:bg-white focus:border-docs-blue focus:shadow-sm transition-all"
            />
          </div>
        </div>
      )}

      {/* Right: Quick Actions & User Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-docs-blue text-white rounded-full text-sm font-medium hover:bg-docs-hoverBlue shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Document</span>
        </button>

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar src={user?.avatarUrl} name={user?.name || 'User'} size="md" />
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};
