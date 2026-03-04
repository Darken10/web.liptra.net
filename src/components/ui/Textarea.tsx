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
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[80px]',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
