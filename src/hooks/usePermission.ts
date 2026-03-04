import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import { hasPermission, hasAnyPermission, hasRole, isAdminRole } from '@/lib/permissions';

export function usePermission() {
  const { user } = useAuth();

  const userRole: UserRole = (user?.role as UserRole) ?? 'user';
  const userPermissions: string[] = user?.permissions ?? [];

  return {
    userRole,
    userPermissions,
    can: (permission: string) => hasPermission(userPermissions, permission),
    canAny: (permissions: string[]) => hasAnyPermission(userPermissions, permissions),
    is: (roles: UserRole[]) => hasRole(userRole, roles),
    isAdmin: () => isAdminRole(userRole),
    isSuperAdmin: () => userRole === 'super-admin',
  };
}
