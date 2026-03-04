import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  danger: 'bg-danger-100 text-danger-700',
  warning: 'bg-accent-100 text-accent-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', {
            'bg-gray-500': variant === 'default',
            'bg-primary-500': variant === 'primary',
            'bg-success-500': variant === 'success',
            'bg-danger-500': variant === 'danger',
            'bg-accent-500': variant === 'warning',
            'bg-blue-500': variant === 'info',
          })}
        />
      )}
      {children}
    </span>
  );
}
