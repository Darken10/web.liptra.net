import type { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

export default function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] p-6 flex items-start gap-4 hover:shadow-[var(--shadow-card)] transition-shadow duration-200',
        className,
      )}
    >
      {icon && (
        <div className="flex-shrink-0 p-3 rounded-xl bg-primary-50 text-primary-600">{icon}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-400 truncate">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p
            className={clsx(
              'text-xs font-medium mt-2',
              trend.value >= 0 ? 'text-success-600' : 'text-danger-600',
            )}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
