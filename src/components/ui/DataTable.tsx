import { type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';
import Pagination from './Pagination';
import { PageLoader } from './Spinner';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  pagination?: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyTitle = 'Aucune donnée',
  emptyDescription,
  emptyAction,
  sortKey,
  sortDir,
  onSort,
  pagination,
  onRowClick,
  rowKey,
  className,
}: DataTableProps<T>) {
  if (loading) return <PageLoader />;

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-700',
                    col.className,
                  )}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={clsx(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-4 py-3 text-sm text-gray-700', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.lastPage > 1 && <Pagination {...pagination} />}
    </div>
  );
}
