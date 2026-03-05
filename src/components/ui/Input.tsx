import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          'w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-0',
          error
            ? 'border-danger-300 focus:border-danger-500 bg-danger-50/50'
            : 'border-gray-200 focus:border-primary-500 hover:border-gray-300 bg-white',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger-600 font-medium">{error}</p>}
    </div>
  );
}
