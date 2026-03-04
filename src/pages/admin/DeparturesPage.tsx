import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, Bus as BusIcon, Users } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Trip } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import { StatusBadge, Badge, PageLoader, EmptyState } from '@/components/ui';

export default function DeparturesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'departures'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await adminApi.trips.list({ date: today, per_page: '50' });
      return res.data.data.data as Trip[];
    },
    refetchInterval: 30000,
  });

  if (isLoading) return <PageLoader message="Chargement des départs..." />;

  const trips = data ?? [];
  const now = new Date();

  const upcoming = trips.filter((t) => new Date(t.departure_at) >= now);
  const departed = trips.filter((t) => new Date(t.departure_at) < now);

  const renderTripCard = (trip: Trip) => (
    <div
      key={trip.id}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-500" />
          <span className="font-semibold text-gray-900">
            {trip.route?.departure_city?.name} → {trip.route?.arrival_city?.name}
          </span>
        </div>
        <StatusBadge type="trip" value={trip.status?.value ?? 'scheduled'} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Départ</p>
            <p className="font-medium">
              {new Date(trip.departure_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BusIcon className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Bus</p>
            <p className="font-medium">{trip.bus?.registration_number ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Places dispo</p>
            <Badge variant={trip.available_seats > 0 ? 'success' : 'danger'} size="sm">
              {trip.available_seats}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Compagnie</p>
          <p className="font-medium text-gray-700">{trip.company?.name}</p>
        </div>
      </div>

      {trip.driver && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
          Chauffeur: <span className="font-medium">{trip.driver.full_name}</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Départs du jour"
        description={`${trips.length} voyage(s) programmé(s) — Mise à jour auto. toutes les 30s`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Départs' }]}
      />

      {trips.length === 0 ? (
        <EmptyState
          icon={<BusIcon className="h-12 w-12 text-gray-300" />}
          title="Aucun départ aujourd'hui"
          description="Aucun voyage n'est programmé pour aujourd'hui"
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                À venir ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map(renderTripCard)}
              </div>
            </div>
          )}

          {departed.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-500 mb-4">
                Déjà partis ({departed.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {departed.map(renderTripCard)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
