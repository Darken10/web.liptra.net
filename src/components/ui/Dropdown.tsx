import { useState, useRef, useEffect, type ReactNode } from 'react';
import clsx from 'clsx';

interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={clsx('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={clsx(
            'absolute z-30 mt-2 min-w-[180px] bg-white rounded-xl shadow-[var(--shadow-elevated)] border border-gray-100 py-1.5 animate-slide-down',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <button
              key={item.key}
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={clsx(
                'flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors text-left',
                item.danger
                  ? 'text-danger-600 hover:bg-danger-50'
                  : 'text-gray-700 hover:bg-gray-50',
                item.disabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
