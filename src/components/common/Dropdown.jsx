import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'left', // 'left' | 'right'
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 mt-1 min-w-[180px] bg-white rounded-xl shadow-docs-card border border-docs-border py-1 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-1 border-t border-docs-border" />;
            }
            const Icon = item.icon;
            return (
              <button
                key={item.label || index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-docs-darkText hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-docs-subtext shrink-0" />}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
