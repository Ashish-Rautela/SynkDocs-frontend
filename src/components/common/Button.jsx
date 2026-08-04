import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-docs-blue/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-docs-blue text-white hover:bg-docs-hoverBlue shadow-sm hover:shadow',
    secondary: 'bg-[#e8f0fe] text-docs-blue hover:bg-[#d2e3fc]',
    outline: 'border border-docs-border text-docs-darkText hover:bg-gray-50',
    ghost: 'text-docs-subtext hover:bg-gray-100 hover:text-docs-darkText',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className={cn('w-4 h-4', size === 'lg' && 'w-5 h-5')} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
