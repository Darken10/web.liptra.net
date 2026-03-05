import { adminApi } from '@/lib/api';
import type { TripSchedule } from '@/types';
import type { Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import CrudPage from './CrudPage';
import { Calendar, Clock, Repeat } from 'lucide-react';

const DAY_LABELS: Record<number, string> = {
  1: 'Lun',
  2: 'Mar',
  3: 'Mer',
  4: 'Jeu',
  5: 'Ven',
  6: 'Sam',
  7: 'Dim',
};

const TYPE_LABELS: Record<string, { label: string; variant: 'primary' | 'info' | 'warning' }> = {
  one_time: { label: 'Unique', variant: 'warning' },
  daily: { label: 'Quotidien', variant: 'primary' },
  weekly: { label: 'Hebdomadaire', variant: 'info' },
};

const columns: Column<TripSchedule>[] = [
  {
    key: 'route',
    header: 'Trajet',
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
    key: 'schedule_type',
    header: 'Type',
    render: (row) => {
      const info = TYPE_LABELS[row.schedule_type] ?? { label: row.schedule_type, variant: 'primary' as const };
      return (
        <div className="flex items-center gap-1.5">
          <Repeat className="h-3.5 w-3.5 text-gray-400" />
          <Badge variant={info.variant} size="sm">{info.label}</Badge>
        </div>
      );
    },
  },
  {
    key: 'times',
    header: 'Horaires',
    render: (row) => (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        {row.departure_times.map((t) => (
          <span key={t} className="text-sm bg-gray-100 rounded px-1.5 py-0.5 font-mono">{t}</span>
        ))}
      </div>
    ),
  },
  {
    key: 'days',
    header: 'Jours',
    render: (row) => {
      if (row.schedule_type === 'daily') {
        return <span className="text-sm text-gray-600">Tous les jours</span>;
      }
      if (row.schedule_type === 'one_time' && row.one_time_departure_at) {
        return (
          <span className="text-sm text-gray-600">
            {new Date(row.one_time_departure_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        );
      }
      if (row.days_of_week) {
        return (
          <div className="flex gap-1 flex-wrap">
            {row.days_of_week.map((d) => (
              <span key={d} className="text-xs bg-primary-50 text-primary-700 rounded px-1.5 py-0.5 font-medium">
                {DAY_LABELS[d] ?? d}
              </span>
            ))}
          </div>
        );
      }
      return <span className="text-gray-400">—</span>;
    },
  },
  {
    key: 'period',
    header: 'Période',
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-sm text-gray-600">
          {new Date(row.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          {row.end_date
            ? ` → ${new Date(row.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
            : ' → ∞'}
        </span>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Prix',
    render: (row) => <span className="font-medium text-gray-900">{row.price_formatted}</span>,
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => (
      <Badge variant={row.is_active ? 'success' : 'warning'} dot>
        {row.is_active ? 'Actif' : 'Inactif'}
      </Badge>
    ),
  },
];

export default function TripSchedulesPage() {
  return (
    <CrudPage<TripSchedule>
      title="Plannings de voyages"
      description="Gérer les voyages récurrents et planifiés"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Plannings' }]}
      queryKey={['admin', 'trip-schedules']}
      columns={columns}
      fetchFn={(params) => adminApi.tripSchedules.list(params)}
      deleteFn={(id) => adminApi.tripSchedules.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/trip-schedules/create"
      editPath={(row) => `/admin/trip-schedules/${row.id}/edit`}
      emptyTitle="Aucun planning"
      emptyDescription="Créez votre premier planning de voyages"
    />
  );
}
