import { adminApi } from '@/lib/api';
import type { Booking } from '@/types';
import type { Column } from '@/components/ui';
import { StatusBadge } from '@/components/ui';
import CrudPage from './CrudPage';
import { useNavigate } from 'react-router-dom';

const columns: Column<Booking>[] = [
  {
    key: 'reference',
    header: 'Référence',
    render: (row) => (
      <span className="font-mono font-medium text-primary-600">{row.booking_reference}</span>
    ),
  },
  {
    key: 'trip',
    header: 'Voyage',
    render: (row) => (
      <div>
        <p className="text-sm text-gray-900">
          {row.trip?.route?.departure_city?.name} → {row.trip?.route?.arrival_city?.name}
        </p>
        <p className="text-xs text-gray-500">
          {row.trip?.departure_at
            ? new Date(row.trip.departure_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : '—'}
        </p>
      </div>
    ),
  },
  {
    key: 'tickets_count',
    header: 'Passagers',
    render: (row) => <span className="text-gray-600">{row.tickets?.length ?? 0}</span>,
  },
  {
    key: 'amount',
    header: 'Montant',
    render: (row) => (
      <span className="font-semibold text-gray-900">{row.total_amount_formatted}</span>
    ),
  },
  {
    key: 'payment_status',
    header: 'Paiement',
    render: (row) => <StatusBadge type="payment" value={row.payment_status} />,
  },
  {
    key: 'payment_method',
    header: 'Méthode',
    render: (row) => (
      <span className="text-gray-600">{row.payment_method_label ?? row.payment_method ?? '—'}</span>
    ),
  },
  {
    key: 'created_at',
    header: 'Date',
    render: (row) =>
      new Date(row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
  },
];

export default function BookingsPage() {
  const navigate = useNavigate();

  return (
    <CrudPage<Booking>
      title="Réservations"
      description="Consulter les réservations de la plateforme"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Réservations' }]}
      queryKey={['admin', 'bookings']}
      columns={columns}
      fetchFn={(params) => adminApi.bookings.list(params)}
      rowKey={(row) => row.id}
      viewPath={(row) => `/admin/bookings/${row.id}`}
      onRowClick={(row) => navigate(`/admin/bookings/${row.id}`)}
      canCreate={false}
      canEdit={false}
      canDelete={false}
      emptyTitle="Aucune réservation"
      emptyDescription="Aucune réservation trouvée"
    />
  );
}
