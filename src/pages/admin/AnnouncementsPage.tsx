import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MoreVertical, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Announcement } from '@/types';
import type { Column } from '@/components/ui';
import { Avatar, Badge, Button, SearchInput, ConfirmDialog, Dropdown, Alert, DataTable } from '@/components/ui';
import PageHeader from '@/components/layout/PageHeader';

const columns: Column<Announcement>[] = [
  {
    key: 'announcement',
    header: 'Annonce',
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.image ? (
          <img src={row.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">
            IMG
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate max-w-[250px]">{row.title}</p>
          <p className="text-xs text-gray-500 truncate max-w-[250px]">
            {row.content?.replace(/<[^>]+>/g, '').slice(0, 60)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'author',
    header: 'Auteur',
    render: (row) =>
      row.author ? (
        <div className="flex items-center gap-2">
          <Avatar name={row.author.name} size="sm" />
          <span className="text-sm text-gray-600">{row.author.name}</span>
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => <span className="text-gray-600">{row.company?.name ?? 'Globale'}</span>,
  },
  {
    key: 'stats',
    header: 'Engagement',
    render: (row) => (
      <div className="flex gap-2">
        <Badge variant="info" size="sm">{row.comments_count ?? 0} com.</Badge>
        <Badge variant="primary" size="sm">{row.reactions_count ?? 0} réac.</Badge>
      </div>
    ),
  },
  {
    key: 'published',
    header: 'Statut',
    render: (row) => (
      <Badge variant={row.is_published ? 'success' : 'warning'} dot>
        {row.is_published ? 'Publié' : 'Brouillon'}
      </Badge>
    ),
  },
  {
    key: 'published_at',
    header: 'Date publication',
    render: (row) =>
      row.published_at
        ? new Date(row.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—',
  },
];

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'publish' | 'unpublish' | 'delete';
    announcement: Announcement;
  } | null>(null);

  const params = new URLSearchParams();
  params.set('page', String(page));
  if (search) params.set('search', search);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'announcements', { page, search }],
    queryFn: async () => {
      const res = await adminApi.announcements.list(Object.fromEntries(params));
      return res.data.data;
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (announcement: Announcement) => {
      const formData = new FormData();
      formData.append('is_published', '1');
      formData.append('_method', 'PUT');
      await adminApi.announcements.update(announcement.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setError(null);
    },
    onError: () => setError('Erreur lors de la publication'),
  });

  const unpublishMutation = useMutation({
    mutationFn: async (announcement: Announcement) => {
      const formData = new FormData();
      formData.append('is_published', '0');
      formData.append('_method', 'PUT');
      await adminApi.announcements.update(announcement.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setError(null);
    },
    onError: () => setError('Erreur lors du retrait de publication'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.announcements.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] });
      setError(null);
    },
    onError: () => setError('Erreur lors de la suppression'),
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'publish') {
        await publishMutation.mutateAsync(confirmAction.announcement);
      } else if (confirmAction.type === 'unpublish') {
        await unpublishMutation.mutateAsync(confirmAction.announcement);
      } else if (confirmAction.type === 'delete') {
        await deleteMutation.mutateAsync(confirmAction.announcement.id);
      }
      setConfirmAction(null);
    } catch {
      // Error already handled by mutation
    }
  };

  const getActionItems = (row: Announcement) => [
    {
      key: 'publish',
      label: row.is_published ? 'Retirer de publication' : 'Publier',
      icon: row.is_published ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />,
      onClick: () => setConfirmAction({
        type: row.is_published ? 'unpublish' : 'publish',
        announcement: row,
      }),
    },
    {
      key: 'edit',
      label: 'Modifier',
      icon: <Edit2 className="h-4 w-4" />,
      onClick: () => navigate(`/admin/announcements/${row.id}/edit`),
    },
    {
      key: 'delete',
      label: 'Supprimer',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: () => setConfirmAction({ type: 'delete', announcement: row }),
    },
  ];

  const actionsColumn: Column<Announcement> = {
    key: '_actions',
    header: '',
    className: 'w-12',
    render: (row) => (
      <Dropdown
        trigger={
          <button className="p-1 rounded hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        }
        items={getActionItems(row)}
      />
    ),
  };

  const allColumns = [...columns, actionsColumn];

  const getConfirmMessage = () => {
    if (!confirmAction) return '';
    switch (confirmAction.type) {
      case 'publish':
        return `Êtes-vous sûr de vouloir publier "${confirmAction.announcement.title}" ?`;
      case 'unpublish':
        return `Êtes-vous sûr de vouloir retirer "${confirmAction.announcement.title}" de la publication ? Elle ne sera plus visible aux utilisateurs.`;
      case 'delete':
        return `Êtes-vous sûr de vouloir supprimer "${confirmAction.announcement.title}" ? Cette action est irréversible.`;
    }
  };

  const getConfirmTitle = () => {
    if (!confirmAction) return '';
    switch (confirmAction.type) {
      case 'publish':
        return 'Publier annonce';
      case 'unpublish':
        return 'Retirer de publication';
      case 'delete':
        return 'Supprimer annonce';
    }
  };

  const getConfirmLabel = () => {
    if (!confirmAction) return 'Confirmer';
    switch (confirmAction.type) {
      case 'delete':
        return 'Supprimer';
      default:
        return 'Confirmer';
    }
  };

  const getConfirmVariant = () => {
    return confirmAction?.type === 'delete' ? 'danger' : 'primary';
  };

  return (
    <div>
      <PageHeader
        title="Annonces"
        description="Gérer les annonces de la plateforme"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Annonces' }]}
        action={
          <Button onClick={() => navigate('/admin/announcements/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
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
        </div>

        <DataTable
          columns={allColumns}
          data={data?.data ?? []}
          loading={isLoading}
          rowKey={(row) => row.id}
          emptyTitle="Aucune annonce"
          emptyDescription="Créez votre première annonce"
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

      <ConfirmDialog
        title={getConfirmTitle()}
        message={getConfirmMessage()}
        confirmLabel={getConfirmLabel()}
        variant={getConfirmVariant()}
        isOpen={!!confirmAction}
        loading={publishMutation.isPending || unpublishMutation.isPending || deleteMutation.isPending}
        onConfirm={handleConfirm}
        onClose={() => setConfirmAction(null)}
      />
    </div>
  );
}
