import { adminApi } from '@/lib/api';
import type { AdminStation } from '@/types';
import type { Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<AdminStation>[] = [
  {
    key: 'name',
    header: 'Gare',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-500">{row.address || '—'}</p>
      </div>
    ),
  },
  {
    key: 'city',
    header: 'Ville',
    render: (row) => <span className="text-gray-600">{row.city?.name ?? '—'}</span>,
  },
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => <span className="text-gray-600">{row.company?.name ?? '—'}</span>,
  },
  {
    key: 'phone',
    header: 'Téléphone',
    render: (row) => <span className="text-gray-600">{row.phone || '—'}</span>,
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
];

export default function StationsPage() {
  return (
    <CrudPage<AdminStation>
      title="Gares"
      description="Gérer les gares routières"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gares' }]}
      queryKey={['admin', 'stations']}
      columns={columns}
      fetchFn={(params) => adminApi.stations.list(params)}
      deleteFn={(id) => adminApi.stations.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/stations/create"
      editPath={(row) => `/admin/stations/${row.id}/edit`}
      emptyTitle="Aucune gare"
      emptyDescription="Aucune gare enregistrée"
    />
  );
}
