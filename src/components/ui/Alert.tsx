import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; text: string; icon: typeof Info }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info },
  success: { bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-800', icon: CheckCircle2 },
  warning: { bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-800', icon: AlertTriangle },
  danger: { bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-800', icon: AlertCircle },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 flex gap-3',
        config.bg,
        config.border,
        className,
      )}
      role="alert"
    >
      <Icon className={clsx('h-5 w-5 flex-shrink-0 mt-0.5', config.text)} />
      <div className="flex-1 min-w-0">
        {title && <p className={clsx('text-sm font-semibold', config.text)}>{title}</p>}
        <div className={clsx('text-sm', config.text, title && 'mt-1')}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className={clsx('flex-shrink-0 p-1 rounded hover:bg-black/5', config.text)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
