import { adminApi } from '@/lib/api';
import type { AdminBus } from '@/types';
import type { Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<AdminBus>[] = [
  {
    key: 'bus',
    header: 'Bus',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.registration_number}</p>
        <p className="text-xs text-gray-500">
          {[row.brand, row.model].filter(Boolean).join(' ') || '—'}
        </p>
      </div>
    ),
  },
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => <span className="text-gray-600">{row.company?.name ?? '—'}</span>,
  },
  {
    key: 'seats',
    header: 'Places',
    render: (row) => <Badge variant="primary">{row.total_seats}</Badge>,
  },
  {
    key: 'comfort',
    header: 'Confort',
    render: (row) => (
      <span className="text-gray-600">{row.comfort_type_label ?? row.comfort_type ?? '—'}</span>
    ),
  },
  {
    key: 'features',
    header: 'Équipements',
    render: (row) => {
      const features = [];
      if (row.has_air_conditioning) features.push('AC');
      if (row.has_wifi) features.push('WiFi');
      if (row.has_usb_charging) features.push('USB');
      if (row.has_toilet) features.push('WC');
      return features.length ? (
        <div className="flex gap-1 flex-wrap">
          {features.map((f) => (
            <Badge key={f} variant="info" size="sm">{f}</Badge>
          ))}
        </div>
      ) : (
        <span className="text-gray-400">—</span>
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

export default function BusesPage() {
  return (
    <CrudPage<AdminBus>
      title="Bus"
      description="Gérer la flotte de véhicules"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bus' }]}
      queryKey={['admin', 'buses']}
      columns={columns}
      fetchFn={(params) => adminApi.buses.list(params)}
      deleteFn={(id) => adminApi.buses.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/buses/create"
      editPath={(row) => `/admin/buses/${row.id}/edit`}
      emptyTitle="Aucun bus"
      emptyDescription="Aucun véhicule enregistré"
    />
  );
}
