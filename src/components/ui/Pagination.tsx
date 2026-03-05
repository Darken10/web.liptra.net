import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const pages = getPageNumbers(currentPage, lastPage);

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <p className="text-sm text-gray-500">
        {from}-{to} sur {total} résultats
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`e-${i}`} className="px-2 text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer',
                currentPage === page
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              {page}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getPageNumbers(current: number, last: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
}
