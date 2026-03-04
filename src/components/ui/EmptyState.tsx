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
      <div className="text-gray-300 mb-4">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
