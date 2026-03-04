import { adminApi } from '@/lib/api';
import type { AdminDriver } from '@/types';
import type { Column } from '@/components/ui';
import { Avatar, Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<AdminDriver>[] = [
  {
    key: 'driver',
    header: 'Chauffeur',
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.full_name} size="sm" src={row.photo ?? undefined} />
        <div>
          <p className="font-medium text-gray-900">{row.full_name}</p>
          <p className="text-xs text-gray-500">{row.phone}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => <span className="text-gray-600">{row.company?.name ?? '—'}</span>,
  },
  {
    key: 'license',
    header: 'Permis',
    render: (row) => (
      <div>
        <p className="text-gray-900 text-sm">{row.license_number}</p>
        {row.license_type && <p className="text-xs text-gray-500">Type: {row.license_type}</p>}
      </div>
    ),
  },
  {
    key: 'license_expiry',
    header: 'Expiration Permis',
    render: (row) => {
      if (!row.license_expiry) return <span className="text-gray-400">—</span>;
      const isExpired = new Date(row.license_expiry) < new Date();
      return (
        <Badge variant={isExpired ? 'danger' : 'success'} dot>
          {new Date(row.license_expiry).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Badge>
      );
    },
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => (
      <Badge variant={row.is_active ? 'success' : 'default'} dot>
        {row.is_active ? 'Actif' : 'Inactif'}
      </Badge>
    ),
  },
];

export default function DriversPage() {
  return (
    <CrudPage<AdminDriver>
      title="Chauffeurs"
      description="Gérer les chauffeurs et leurs permis"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Chauffeurs' }]}
      queryKey={['admin', 'drivers']}
      columns={columns}
      fetchFn={(params) => adminApi.drivers.list(params)}
      deleteFn={(id) => adminApi.drivers.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/drivers/create"
      editPath={(row) => `/admin/drivers/${row.id}/edit`}
      emptyTitle="Aucun chauffeur"
      emptyDescription="Aucun chauffeur enregistré"
    />
  );
}
