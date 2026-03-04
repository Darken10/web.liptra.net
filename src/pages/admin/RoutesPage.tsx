import { adminApi } from '@/lib/api';
import type { AdminRoute } from '@/types';
import type { Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import CrudPage from './CrudPage';
import { MapPin } from 'lucide-react';

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}` : `${m}min`;
};

const columns: Column<AdminRoute>[] = [
  {
    key: 'route',
    header: 'Itinéraire',
    render: (row) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
        <span className="font-medium text-gray-900">
          {row.departure_city?.name} → {row.arrival_city?.name}
        </span>
      </div>
    ),
  },
  {
    key: 'company',
    header: 'Compagnie',
    render: (row) => <span className="text-gray-600">{row.company?.name ?? '—'}</span>,
  },
  {
    key: 'distance',
    header: 'Distance',
    render: (row) => (
      <span className="text-gray-600">{row.distance_km ? `${row.distance_km} km` : '—'}</span>
    ),
  },
  {
    key: 'duration',
    header: 'Durée estimée',
    render: (row) => (
      <span className="text-gray-600">{formatDuration(row.estimated_duration_minutes)}</span>
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
];

export default function RoutesPage() {
  return (
    <CrudPage<AdminRoute>
      title="Itinéraires"
      description="Gérer les itinéraires et trajets"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Itinéraires' }]}
      queryKey={['admin', 'routes']}
      columns={columns}
      fetchFn={(params) => adminApi.routes.list(params)}
      deleteFn={(id) => adminApi.routes.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/routes/create"
      editPath={(row) => `/admin/routes/${row.id}/edit`}
      emptyTitle="Aucun itinéraire"
      emptyDescription="Aucun itinéraire enregistré"
    />
  );
}
