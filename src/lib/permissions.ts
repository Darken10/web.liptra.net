import type { UserRole } from '@/types';

export const PERMISSIONS = {
  MANAGE_COMPANIES: 'manage-companies',
  VIEW_COMPANIES: 'view-companies',
  MANAGE_TRIPS: 'manage-trips',
  VIEW_TRIPS: 'view-trips',
  MANAGE_BUSES: 'manage-buses',
  VIEW_BUSES: 'view-buses',
  MANAGE_DRIVERS: 'manage-drivers',
  VIEW_DRIVERS: 'view-drivers',
  MANAGE_ANNOUNCEMENTS: 'manage-announcements',
  VIEW_ANNOUNCEMENTS: 'view-announcements',
  MANAGE_TICKETS: 'manage-tickets',
  VIEW_TICKETS: 'view-tickets',
  SCAN_TICKETS: 'scan-tickets',
  VALIDATE_TICKETS: 'validate-tickets',
  VIEW_SALES: 'view-sales',
  MANAGE_DEPARTURES: 'manage-departures',
  SUPERVISE_AGENTS: 'supervise-agents',
  MANAGE_BAGGAGE: 'manage-baggage',
  MANAGE_USERS: 'manage-users',
  VIEW_USERS: 'view-users',
  MANAGE_ROLES: 'manage-roles',
  MANAGE_SETTINGS: 'manage-settings',
  PURCHASE_TICKETS: 'purchase-tickets',
  INTERACT_POSTS: 'interact-posts',
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  'super-admin': 'Super Administrateur',
  admin: 'Administrateur Compagnie',
  'chef-gare': 'Chef de Gare',
  agent: 'Agent',
  bagagiste: 'Bagagiste',
  user: 'Utilisateur',
};

export const ADMIN_ROLES: UserRole[] = ['super-admin', 'admin', 'chef-gare', 'agent', 'bagagiste'];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function hasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  return permissions.some((p) => userPermissions.includes(p));
}

export function hasRole(userRole: UserRole, roles: UserRole[]): boolean {
  return roles.includes(userRole);
}
