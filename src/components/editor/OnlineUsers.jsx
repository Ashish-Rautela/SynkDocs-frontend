import React from 'react';
import { useEditor } from '../../hooks/useEditor';
import { Avatar } from '../common/Avatar';

export const OnlineUsers = () => {
  const { activeUsers } = useEditor();

  return (
    <div className="flex items-center -space-x-2 overflow-hidden py-1">
      {activeUsers.map((user) => (
        <div key={user.id} className="relative group" title={user.name}>
          <Avatar
            src={user.avatarUrl || user.avatar}
            name={user.name}
            size="sm"
            status="online"
            className="ring-2 ring-white"
          />
          {/* Tooltip on hover */}
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg">
            {user.name}
          </div>
        </div>
      ))}
    </div>
  );
};
