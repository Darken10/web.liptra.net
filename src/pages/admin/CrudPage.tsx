import { useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import type { PaginatedResponse, ApiResponse } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import type { Crumb } from '@/components/layout/Breadcrumb';
import {
  DataTable,
  type Column,
  Button,
  SearchInput,
  ConfirmDialog,
  Dropdown,
  Alert,
} from '@/components/ui';

interface CrudPageProps<T> {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  queryKey: string[];
  columns: Column<T>[];
  fetchFn: (params: Record<string, string>) => Promise<{ data: ApiResponse<PaginatedResponse<T>> }>;
  deleteFn?: (id: string) => Promise<unknown>;
  rowKey: (row: T) => string;
  createPath?: string;
  editPath?: (row: T) => string;
  viewPath?: (row: T) => string;
  onRowClick?: (row: T) => void;
  filters?: ReactNode;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function CrudPage<T>({
  title,
  description,
  breadcrumbs,
  queryKey,
  columns,
  fetchFn,
  deleteFn,
  rowKey,
  createPath,
  editPath,
  viewPath,
  onRowClick,
  filters,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  emptyTitle = 'Aucune donnée',
  emptyDescription,
}: CrudPageProps<T>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params: Record<string, string> = { page: String(page) };
  if (search) params.search = search;

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const res = await fetchFn(params);
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (deleteFn) await deleteFn(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDeleteTarget(null);
      setError(null);
    },
    onError: () => {
      setError('Erreur lors de la suppression');
    },
  });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    [],
  );

  const actionsColumn: Column<T> = {
    key: '_actions',
    header: '',
    className: 'w-12',
    render: (row: T) => {
      const items = [];
      if (viewPath) {
        items.push({
          key: 'view',
          label: 'Voir',
          icon: <Eye className="h-4 w-4" />,
          onClick: () => navigate(viewPath(row)),
        });
      }
      if (canEdit && editPath) {
        items.push({
          key: 'edit',
          label: 'Modifier',
          icon: <Edit2 className="h-4 w-4" />,
          onClick: () => navigate(editPath(row)),
        });
      }
      if (canDelete && deleteFn) {
        items.push({
          key: 'delete',
          label: 'Supprimer',
          icon: <Trash2 className="h-4 w-4" />,
          danger: true,
          onClick: () => setDeleteTarget(row),
        });
      }
      if (!items.length) return null;

      return (
        <Dropdown
          trigger={
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          }
          items={items}
        />
      );
    },
  };

  const allColumns = [...columns, ...(canEdit || canDelete || viewPath ? [actionsColumn] : [])];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        action={
          canCreate && createPath ? (
            <Button onClick={() => navigate(createPath)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          ) : undefined
        }
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch('')}
            placeholder="Rechercher..."
            className="w-full sm:w-72"
          />
          {filters}
        </div>

        <DataTable
          columns={allColumns}
          data={data?.data ?? []}
          loading={isLoading}
          rowKey={rowKey}
          onRowClick={onRowClick}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          pagination={
            data
              ? {
                  currentPage: data.current_page,
                  lastPage: data.last_page,
                  total: data.total,
                  perPage: data.per_page,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(rowKey(deleteTarget))}
          title="Confirmer la suppression"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
