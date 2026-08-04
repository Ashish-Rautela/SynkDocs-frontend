import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LayoutDashboard, Users, Star, User, Settings, FileText } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'All Documents', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Shared with me', path: ROUTES.SHARED, icon: Users },
    { label: 'Profile', path: ROUTES.PROFILE, icon: User },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-docs-border bg-docs-sidebarBg p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="flex flex-col gap-6">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e8f0fe] text-docs-blue'
                      : 'text-docs-darkText hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-docs-border shadow-sm">
        <div className="flex items-center gap-2 text-docs-blue font-semibold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>SynkDocs Engine</span>
        </div>
        <p className="text-xs text-docs-subtext leading-relaxed">
          Production-grade document architecture with Redux Saga & Socket.io sync.
        </p>
      </div>
    </aside>
  );
};
