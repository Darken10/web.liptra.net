import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer',
        {
          'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 focus-visible:ring-primary-500':
            variant === 'primary',
          'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-400':
            variant === 'secondary',
          'border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500':
            variant === 'outline',
          'bg-danger-500 text-white hover:bg-danger-600 hover:shadow-lg hover:shadow-danger-500/25 focus-visible:ring-danger-500':
            variant === 'danger',
          'text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500':
            variant === 'ghost',
          'gradient-accent text-white hover:shadow-lg hover:shadow-accent-500/25 focus-visible:ring-accent-500':
            variant === 'accent',
          'px-3.5 py-2 text-sm gap-1.5': size === 'sm',
          'px-5 py-2.5 text-sm gap-2': size === 'md',
          'px-7 py-3.5 text-base gap-2': size === 'lg',
        },
        className,
      )}
    >
      {loading && <Loader2 className="animate-spin h-4 w-4" />}
      {children}
    </button>
  );
}
