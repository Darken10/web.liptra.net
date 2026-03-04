import { adminApi } from '@/lib/api';
import type { Announcement } from '@/types';
import type { Column } from '@/components/ui';
import { Avatar, Badge } from '@/components/ui';
import CrudPage from './CrudPage';

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
    header: 'Publié',
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
  return (
    <CrudPage<Announcement>
      title="Annonces"
      description="Gérer les annonces de la plateforme"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Annonces' }]}
      queryKey={['admin', 'announcements']}
      columns={columns}
      fetchFn={(params) => adminApi.announcements.list(params)}
      deleteFn={(id) => adminApi.announcements.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/announcements/create"
      editPath={(row) => `/admin/announcements/${row.id}/edit`}
      emptyTitle="Aucune annonce"
      emptyDescription="Aucune annonce publiée"
    />
  );
}
