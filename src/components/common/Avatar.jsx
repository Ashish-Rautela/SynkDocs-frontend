import React from 'react';
import { getInitials } from '../../utils/formatters';

export const Avatar = ({
  src,
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  status = null, // 'online' | 'offline' | null
  className = '',
}) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover border border-white/60 shadow-sm ${className}`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-docs-blue text-white font-medium flex items-center justify-center border border-white/60 shadow-sm ${className}`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-white ${
            status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};
