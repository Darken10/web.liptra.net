import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import clsx from 'clsx';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-5">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
