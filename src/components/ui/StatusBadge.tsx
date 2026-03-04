import Badge from './Badge';

type StatusVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';

interface StatusMap {
  [key: string]: { label: string; variant: StatusVariant };
}

const tripStatusMap: StatusMap = {
  scheduled: { label: 'Programmé', variant: 'primary' },
  boarding: { label: 'Embarquement', variant: 'info' },
  departed: { label: 'En route', variant: 'success' },
  arrived: { label: 'Arrivé', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'danger' },
  delayed: { label: 'Retardé', variant: 'warning' },
};

const ticketStatusMap: StatusMap = {
  pending: { label: 'En attente', variant: 'warning' },
  paid: { label: 'Payé', variant: 'primary' },
  validated: { label: 'Validé', variant: 'info' },
  boarded: { label: 'Embarqué', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'danger' },
  expired: { label: 'Expiré', variant: 'default' },
  refunded: { label: 'Remboursé', variant: 'warning' },
};

const paymentStatusMap: StatusMap = {
  pending: { label: 'En attente', variant: 'warning' },
  processing: { label: 'En cours', variant: 'info' },
  completed: { label: 'Complété', variant: 'success' },
  failed: { label: 'Échoué', variant: 'danger' },
  refunded: { label: 'Remboursé', variant: 'warning' },
};

const userStatusMap: StatusMap = {
  active: { label: 'Actif', variant: 'success' },
  inactive: { label: 'Inactif', variant: 'default' },
  pending: { label: 'En attente', variant: 'warning' },
  banned: { label: 'Banni', variant: 'danger' },
};

const allMaps: Record<string, StatusMap> = {
  trip: tripStatusMap,
  ticket: ticketStatusMap,
  payment: paymentStatusMap,
  user: userStatusMap,
};

interface StatusBadgeProps {
  type: 'trip' | 'ticket' | 'payment' | 'user';
  value: string;
  dot?: boolean;
}

export default function StatusBadge({ type, value, dot = true }: StatusBadgeProps) {
  const map = allMaps[type];
  const config = map?.[value] ?? { label: value, variant: 'default' as StatusVariant };

  return (
    <Badge variant={config.variant} dot={dot}>
      {config.label}
    </Badge>
  );
}
