import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import { useRef, type InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export default function SearchInput({ value, onClear, className, ...props }: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className={clsx('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        ref={ref}
        type="text"
        value={value}
        className="w-full pl-10 pr-9 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-0 hover:border-gray-300 transition-colors"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={() => {
            onClear();
            ref.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
