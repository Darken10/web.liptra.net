import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padding = true, hover = false, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] transition-all duration-300',
        padding && 'p-6',
        hover && 'hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between mb-5', className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={clsx('text-lg font-bold text-gray-900', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('text-sm text-gray-500 mt-1', className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-5', className)}>
      {children}
    </div>
  );
}
