import React from 'react';

export const Badge = ({
  children,
  variant = 'blue', // 'blue' | 'gray' | 'green' | 'amber'
  size = 'md', // 'sm' | 'md'
}) => {
  const variants = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
