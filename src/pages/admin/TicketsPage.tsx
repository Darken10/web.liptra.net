import { adminApi } from '@/lib/api';
import type { Ticket } from '@/types';
import type { Column } from '@/components/ui';
import { StatusBadge, Badge } from '@/components/ui';
import CrudPage from './CrudPage';

const columns: Column<Ticket>[] = [
  {
    key: 'ticket_number',
    header: 'N° Ticket',
    render: (row) => (
      <span className="font-mono font-medium text-primary-600">{row.ticket_number}</span>
    ),
  },
  {
    key: 'passenger',
    header: 'Passager',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.passenger_full_name}</p>
        <p className="text-xs text-gray-500">{row.passenger_phone}</p>
      </div>
    ),
  },
  {
    key: 'trip',
    header: 'Voyage',
    render: (row) => (
      <span className="text-gray-600 text-sm">
        {row.trip?.route?.departure_city?.name} → {row.trip?.route?.arrival_city?.name}
      </span>
    ),
  },
  {
    key: 'seat',
    header: 'Siège',
    render: (row) => (
      <Badge variant="primary">{row.seat_number ?? '—'}</Badge>
    ),
  },
  {
    key: 'baggage',
    header: 'Bagages',
    render: (row) => (
      <Badge variant={row.baggage_checked ? 'success' : 'default'} dot>
        {row.baggage_checked ? 'Vérifié' : 'Non vérifié'}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => <StatusBadge type="ticket" value={row.status} />,
  },
  {
    key: 'created_at',
    header: 'Date',
    render: (row) =>
      new Date(row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
  },
];

export default function TicketsPage() {
  return (
    <CrudPage<Ticket>
      title="Tickets"
      description="Consulter et gérer les tickets émis"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tickets' }]}
      queryKey={['admin', 'tickets']}
      columns={columns}
      fetchFn={(params) => adminApi.tickets.list(params)}
      rowKey={(row) => row.id}
      viewPath={(row) => `/admin/tickets/${row.id}`}
      canCreate={false}
      canEdit={false}
      canDelete={false}
      emptyTitle="Aucun ticket"
      emptyDescription="Aucun ticket émis"
    />
  );
}
