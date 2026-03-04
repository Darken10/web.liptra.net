import { adminApi } from '@/lib/api';
import type { Trip } from '@/types';
import type { Column } from '@/components/ui';
import { Badge, StatusBadge } from '@/components/ui';
import CrudPage from './CrudPage';
import { Calendar } from 'lucide-react';

const columns: Column<Trip>[] = [
  {
    key: 'trip',
    header: 'Voyage',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">
          {row.route?.departure_city?.name} → {row.route?.arrival_city?.name}
        </p>
        <p className="text-xs text-gray-500">{row.company?.name}</p>
      </div>
    ),
  },
  {
    key: 'departure',
    header: 'Départ',
    render: (row) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm text-gray-900">
            {new Date(row.departure_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(row.departure_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'bus',
    header: 'Bus',
    render: (row) => (
      <span className="text-gray-600">{row.bus?.registration_number ?? '—'}</span>
    ),
  },
  {
    key: 'driver',
    header: 'Chauffeur',
    render: (row) => (
      <span className="text-gray-600">{row.driver?.full_name ?? '—'}</span>
    ),
  },
  {
    key: 'seats',
    header: 'Places',
    render: (row) => (
      <Badge variant={row.available_seats > 0 ? 'success' : 'danger'}>
        {row.available_seats} dispo.
      </Badge>
    ),
  },
  {
    key: 'price',
    header: 'Prix',
    render: (row) => (
      <span className="font-medium text-gray-900">{row.price_formatted}</span>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => <StatusBadge type="trip" value={row.status ?? 'scheduled'} />,
  },
];

export default function TripsPage() {
  return (
    <CrudPage<Trip>
      title="Voyages"
      description="Gérer les voyages planifiés"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Voyages' }]}
      queryKey={['admin', 'trips']}
      columns={columns}
      fetchFn={(params) => adminApi.trips.list(params)}
      rowKey={(row) => row.id}
      createPath="/admin/trips/create"
      editPath={(row) => `/admin/trips/${row.id}/edit`}
      canDelete={false}
      emptyTitle="Aucun voyage"
      emptyDescription="Aucun voyage planifié"
    />
  );
}
