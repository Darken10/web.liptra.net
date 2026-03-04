import { adminApi } from '@/lib/api';
import type { User } from '@/types';
import type { Column } from '@/components/ui';
import { Avatar, Badge, StatusBadge } from '@/components/ui';
import CrudPage from './CrudPage';
import { ROLE_LABELS } from '@/lib/permissions';
import type { UserRole } from '@/types';

const columns: Column<User>[] = [
  {
    key: 'user',
    header: 'Utilisateur',
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name ?? ''} size="sm" />
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Téléphone',
    render: (row) => <span className="text-gray-600">{row.phone || '—'}</span>,
  },
  {
    key: 'role',
    header: 'Rôle',
    render: (row) => {
      const role = row.role ?? row.roles?.[0];
      return role ? (
        <Badge variant="primary">{ROLE_LABELS[role as UserRole] ?? role}</Badge>
      ) : (
        <Badge>Utilisateur</Badge>
      );
    },
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => <StatusBadge type="user" value={row.status ?? 'active'} />,
  },
  {
    key: 'created_at',
    header: 'Inscription',
    render: (row) =>
      row.created_at
        ? new Date(row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—',
  },
];

export default function UsersPage() {
  return (
    <CrudPage<User>
      title="Utilisateurs"
      description="Gérer les comptes utilisateurs de la plateforme"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Utilisateurs' }]}
      queryKey={['admin', 'users']}
      columns={columns}
      fetchFn={(params) => adminApi.users.list(params)}
      deleteFn={(id) => adminApi.users.delete(id)}
      rowKey={(row) => row.id}
      createPath="/admin/users/create"
      editPath={(row) => `/admin/users/${row.id}/edit`}
      emptyTitle="Aucun utilisateur"
      emptyDescription="Aucun utilisateur trouvé"
    />
  );
}
