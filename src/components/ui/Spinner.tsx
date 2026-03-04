import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2 className={clsx('animate-spin text-primary-600', sizeMap[size], className)} />
  );
}

export function PageLoader({ message = 'Chargement...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
