import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'w-full rounded-xl border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:border-primary-500 focus:ring-0 bg-white hover:border-gray-300 cursor-pointer',
          error ? 'border-danger-300 focus:border-danger-500' : 'border-gray-200',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-danger-600 font-medium">{error}</p>}
    </div>
  );
}
