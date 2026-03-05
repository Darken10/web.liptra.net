import type { ReactNode } from 'react';
import Breadcrumb, { type Crumb } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  action?: ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
