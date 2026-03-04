import { useState, type ReactNode } from 'react';
import clsx from 'clsx';

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (key: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.key ?? '');
  const active = activeTab ?? internalActive;

  const handleClick = (key: string) => {
    setInternalActive(key);
    onChange(key);
  };

  return (
    <div
      className={clsx(
        'flex gap-1',
        variant === 'underline' && 'border-b border-gray-200',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleClick(tab.key)}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
            variant === 'underline' && [
              '-mb-px border-b-2',
              active === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ],
            variant === 'pills' && [
              'rounded-lg',
              active === tab.key
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ],
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={clsx(
                'ml-1 rounded-full px-2 py-0.5 text-xs font-medium',
                active === tab.key
                  ? 'bg-primary-200 text-primary-700'
                  : 'bg-gray-100 text-gray-500',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
