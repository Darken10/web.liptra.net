import { adminApi } from '@/lib/api';
import type { Company } from '@/types';
import type { Column } from '@/components/ui';
import { Avatar, Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<Company>[] = [
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.logo ? (
          <img src={row.logo} alt={row.name} className="h-8 w-8 rounded-lg object-cover" />
        ) : (
          <Avatar name={row.name} size="sm" />
        )}
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) => <span className="text-gray-600">{row.email || '—'}</span>,
  },
  {
    key: 'phone',
    header: 'Téléphone',
    render: (row) => <span className="text-gray-600">{row.phone || '—'}</span>,
  },
  {
    key: 'address',
    header: 'Adresse',
    render: (row) => (
      <span className="text-gray-600 truncate max-w-[200px] block">{row.address || '—'}</span>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    render: () => <Badge variant="success" dot>Active</Badge>,
  },
];

export default function CompaniesPage() {
  return (
    <CrudPage<Company>
      title="Compagnies"
      description="Gérer les compagnies de transport"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Compagnies' }]}
      queryKey={['admin', 'companies']}
      columns={columns}
      fetchFn={(params) => adminApi.companies.list(params)}
      deleteFn={(id) => adminApi.companies.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/companies/create"
      editPath={(row) => `/admin/companies/${row.id}/edit`}
      emptyTitle="Aucune compagnie"
      emptyDescription="Aucune compagnie enregistrée"
    />
  );
}
