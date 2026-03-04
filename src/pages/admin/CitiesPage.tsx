import { adminApi } from '@/lib/api';
import type { AdminCity } from '@/types';
import type { Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<AdminCity>[] = [
  {
    key: 'name',
    header: 'Ville',
    render: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
  },
  {
    key: 'region',
    header: 'Région',
    render: (row) => <span className="text-gray-600">{row.region || '—'}</span>,
  },
  {
    key: 'stations_count',
    header: 'Gares',
    render: (row) => (
      <Badge variant={row.stations_count > 0 ? 'primary' : 'default'}>
        {row.stations_count}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => (
      <Badge variant={row.is_active ? 'success' : 'default'} dot>
        {row.is_active ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    key: 'created_at',
    header: 'Créée le',
    render: (row) =>
      row.created_at
        ? new Date(row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—',
  },
];

export default function CitiesPage() {
  return (
    <CrudPage<AdminCity>
      title="Villes"
      description="Gérer les villes desservies par la plateforme"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Villes' }]}
      queryKey={['admin', 'cities']}
      columns={columns}
      fetchFn={(params) => adminApi.cities.list(params)}
      deleteFn={(id) => adminApi.cities.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/cities/create"
      editPath={(row) => `/admin/cities/${row.id}/edit`}
      emptyTitle="Aucune ville"
      emptyDescription="Aucune ville enregistrée"
    />
  );
}
