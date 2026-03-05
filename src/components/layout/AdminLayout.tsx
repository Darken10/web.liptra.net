import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar, { type UserRole } from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_ROLES: UserRole[] = ['super-admin', 'admin', 'chef-gare', 'agent', 'bagagiste'];

export default function AdminLayout() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = ((user as unknown as Record<string, unknown>).role as UserRole) ?? 'user';

  if (!ADMIN_ROLES.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar userRole={userRole} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">
            <Sidebar userRole={userRole} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
