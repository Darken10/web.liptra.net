import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={clsx(
          'w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:border-primary-500 focus:ring-0 resize-y min-h-[80px] hover:border-gray-300',
          error ? 'border-danger-300 focus:border-danger-500' : 'border-gray-200',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger-600 font-medium">{error}</p>}
    </div>
  );
}
