import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Bus,
  MapPin,
  Route,
  Calendar,
  Ticket,
  BookOpen,
  Megaphone,
  Settings,
  UserCog,
  MapPinned,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Luggage,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export type UserRole = 'super-admin' | 'admin' | 'chef-gare' | 'agent' | 'bagagiste' | 'user';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  children?: { label: string; href: string }[];
}

interface SidebarSection {
  title: string;
  items: NavItem[];
}

const sidebarNav: SidebarSection[] = [
  {
    title: 'Général',
    items: [
      {
        label: 'Tableau de bord',
        href: '/admin',
        icon: LayoutDashboard,
        roles: ['super-admin', 'admin', 'chef-gare', 'agent', 'bagagiste'],
      },
    ],
  },
  {
    title: 'Gestion',
    items: [
      {
        label: 'Utilisateurs',
        href: '/admin/users',
        icon: Users,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Compagnies',
        href: '/admin/companies',
        icon: Building2,
        roles: ['super-admin'],
      },
      {
        label: 'Villes',
        href: '/admin/cities',
        icon: MapPin,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Gares',
        href: '/admin/stations',
        icon: MapPinned,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Bus',
        href: '/admin/buses',
        icon: Bus,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Chauffeurs',
        href: '/admin/drivers',
        icon: UserCog,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Itinéraires',
        href: '/admin/routes',
        icon: Route,
        roles: ['super-admin', 'admin'],
      },
    ],
  },
  {
    title: 'Opérations',
    items: [
      {
        label: 'Voyages',
        href: '/admin/trips',
        icon: Calendar,
        roles: ['super-admin', 'admin', 'chef-gare'],
      },
      {
        label: 'Réservations',
        href: '/admin/bookings',
        icon: BookOpen,
        roles: ['super-admin', 'admin'],
      },
      {
        label: 'Tickets',
        href: '/admin/tickets',
        icon: Ticket,
        roles: ['super-admin', 'admin', 'chef-gare', 'agent'],
      },
      {
        label: 'Annonces',
        href: '/admin/announcements',
        icon: Megaphone,
        roles: ['super-admin', 'admin'],
      },
    ],
  },
  {
    title: 'Station',
    items: [
      {
        label: 'Départs du jour',
        href: '/admin/departures',
        icon: CircleDot,
        roles: ['chef-gare'],
      },
      {
        label: 'Validation tickets',
        href: '/admin/ticket-validation',
        icon: ClipboardCheck,
        roles: ['chef-gare', 'agent'],
      },
      {
        label: 'Bagages',
        href: '/admin/baggage',
        icon: Luggage,
        roles: ['bagagiste'],
      },
    ],
  },
  {
    title: 'Système',
    items: [
      {
        label: 'Rôles & Permissions',
        href: '/admin/roles',
        icon: Settings,
        roles: ['super-admin'],
      },
    ],
  },
];

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredSections = sidebarNav
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((section) => section.items.length > 0);

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        'h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 sticky top-0',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <Bus className="h-7 w-7 text-primary-400" />
            <span className="text-lg font-bold text-white">LIPTRA</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-hide">
        {filteredSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-600/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          {!collapsed && <span>Retour au site</span>}
        </Link>
      </div>
    </aside>
  );
}
