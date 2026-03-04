import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Users, Wifi, Wind, Usb } from 'lucide-react';
import { cityApi, tripApi } from '@/lib/api';
import type { City, Trip } from '@/types';
import Button from '@/components/ui/Button';

export default function TripSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [departureCityId, setDepartureCityId] = useState('');
  const [arrivalCityId, setArrivalCityId] = useState('');
  const [date, setDate] = useState(searchParams.get('date') ?? '');

  useEffect(() => {
    cityApi.list().then((res) => setCities(res.data.data));
  }, []);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (departureCityId) params.departure_city_id = departureCityId;
    if (arrivalCityId) params.arrival_city_id = arrivalCityId;
    if (date) params.date = date;

    try {
      const res = await tripApi.search(params);
      setTrips(res.data.data.data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (departureCityId) params.set('departure_city_id', departureCityId);
    if (arrivalCityId) params.set('arrival_city_id', arrivalCityId);
    if (date) params.set('date', date);
    setSearchParams(params);
    fetchTrips();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Rechercher un voyage
      </h1>

      {/* Search bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <select
              value={departureCityId}
              onChange={(e) => setDepartureCityId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <select
              value={arrivalCityId}
              onChange={(e) => setArrivalCityId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full" loading={loading}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun voyage trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const departureTime = new Date(trip.departure_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const departureDate = new Date(trip.departure_at).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="block bg-white rounded-xl border hover:shadow-md transition p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Route info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>{trip.route.departure_city.name}</span>
            <span className="text-gray-400">→</span>
            <span>{trip.route.arrival_city.name}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {departureDate} à {departureTime}
            </span>
            {trip.route.estimated_duration_minutes && (
              <span>~{Math.round(trip.route.estimated_duration_minutes / 60)}h</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {trip.company.name}
            </span>
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
              {trip.bus.comfort_type.label}
            </span>
            {trip.bus.has_ac && <Wind className="h-3.5 w-3.5 text-blue-500" />}
            {trip.bus.has_wifi && <Wifi className="h-3.5 w-3.5 text-green-500" />}
            {trip.bus.has_usb && <Usb className="h-3.5 w-3.5 text-purple-500" />}
          </div>
        </div>

        {/* Price & seats */}
        <div className="text-right sm:text-center shrink-0">
          <div className="text-2xl font-bold text-primary-600">
            {trip.price_formatted}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 justify-end sm:justify-center mt-1">
            <Users className="h-4 w-4" />
            {trip.available_seats} place{trip.available_seats > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  );
}
