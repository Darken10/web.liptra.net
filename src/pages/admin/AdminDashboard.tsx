import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Building2,
  Calendar,
  BookOpen,
  Banknote,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/lib/api';
import type { DashboardStats } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import { StatCard, StatusBadge, PageLoader } from '@/components/ui';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await adminApi.dashboard();
      return res.data.data as DashboardStats;
    },
  });

  if (isLoading || !data) return <PageLoader message="Chargement du tableau de bord..." />;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de la plateforme"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Utilisateurs"
          value={data.total_users}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: data.users_trend, label: 'ce mois' }}
        />
        <StatCard
          label="Compagnies"
          value={data.total_companies}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          label="Voyages"
          value={data.total_trips}
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: data.trips_trend, label: 'ce mois' }}
        />
        <StatCard
          label="Réservations"
          value={data.total_bookings}
          icon={<BookOpen className="h-5 w-5" />}
          trend={{ value: data.bookings_trend, label: 'ce mois' }}
        />
        <StatCard
          label="Revenus"
          value={formatCurrency(data.total_revenue)}
          icon={<Banknote className="h-5 w-5" />}
          trend={{ value: data.revenue_trend, label: 'ce mois' }}
        />
        <StatCard
          label="Tickets"
          value={data.total_tickets}
          icon={<Ticket className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-base font-semibold text-gray-900">Réservations récentes</h2>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recent_bookings.map((booking) => (
              <div key={booking.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.booking_reference}</p>
                  <p className="text-xs text-gray-500">
                    {booking.trip?.route?.departure_city?.name} → {booking.trip?.route?.arrival_city?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{booking.total_amount_formatted}</p>
                  <StatusBadge type="payment" value={booking.payment_status} />
                </div>
              </div>
            ))}
            {!data.recent_bookings.length && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Aucune réservation récente</p>
            )}
          </div>
        </div>

        {/* Upcoming trips */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-base font-semibold text-gray-900">Prochains voyages</h2>
            <button
              onClick={() => navigate('/admin/trips')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {data.upcoming_trips.map((trip) => (
              <div key={trip.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {trip.route?.departure_city?.name} → {trip.route?.arrival_city?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {trip.company?.name} — {new Date(trip.departure_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{trip.available_seats} places</p>
                  <StatusBadge type="trip" value={trip.status ?? 'scheduled'} />
                </div>
              </div>
            ))}
            {!data.upcoming_trips.length && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Aucun voyage à venir</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
