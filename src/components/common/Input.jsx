import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-docs-subtext uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-docs-subtext pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-3.5 py-2.5 bg-white border border-docs-border rounded-lg text-sm text-docs-darkText placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-docs-blue focus:border-transparent transition-all',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-docs-subtext">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
