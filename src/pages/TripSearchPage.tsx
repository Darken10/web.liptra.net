import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Users,
  Wifi,
  Wind,
  Usb,
  ArrowRight,
  ArrowRightLeft,
  SlidersHorizontal,
  Calendar,
} from 'lucide-react';
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

  const swapCities = () => {
    setDepartureCityId(arrivalCityId);
    setArrivalCityId(departureCityId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 shadow-[var(--shadow-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rechercher un voyage</h1>
              <p className="text-sm text-gray-500">Trouvez le trajet idéal parmi toutes les compagnies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Départ
              </label>
              <select
                value={departureCityId}
                onChange={(e) => setDepartureCityId(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCities}
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all self-end mb-0.5 cursor-pointer"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Arrivée
              </label>
              <select
                value={arrivalCityId}
                onChange={(e) => setArrivalCityId(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <Button onClick={handleSearch} loading={loading} className="!py-2.5">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!loading && trips.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-gray-900 font-bold">{trips.length}</span> voyage{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
            </p>
            <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrer
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 animate-pulse-soft">
              <Search className="h-8 w-8 text-primary-400" />
            </div>
            <p className="text-gray-500 font-medium">Recherche en cours...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-5">
              <MapPin className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-700 text-lg font-bold mb-2">Aucun voyage trouvé</p>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Essayez de modifier vos critères de recherche ou choisissez une autre date
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

  const seatsLow = trip.available_seats <= 5;

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Route + Info */}
          <div className="flex-1 min-w-0">
            {/* Cities */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
                <span>{trip.route.departure_city.name}</span>
                <ArrowRight className="h-5 w-5 text-primary-400 shrink-0" />
                <span>{trip.route.arrival_city.name}</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                {departureDate}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                {departureTime}
              </span>
              {trip.route.estimated_duration_minutes && (
                <span className="text-sm text-gray-400">
                  ~{Math.round(trip.route.estimated_duration_minutes / 60)}h
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                {trip.company.name}
              </span>
              <span className="text-xs font-medium bg-primary-50 text-primary-700 px-3 py-1 rounded-lg">
                {trip.bus.comfort_type_label}
              </span>
              {trip.bus.has_air_conditioning && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  <Wind className="h-3 w-3" /> Clim
                </span>
              )}
              {trip.bus.has_wifi && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Wifi className="h-3 w-3" /> WiFi
                </span>
              )}
              {trip.bus.has_usb_charging && (
                <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                  <Usb className="h-3 w-3" /> USB
                </span>
              )}
            </div>
          </div>

          {/* Price + Seats */}
          <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary-600">
                {trip.price_formatted}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">par personne</p>
            </div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
              seatsLow
                ? 'bg-accent-50 text-accent-700'
                : 'bg-success-50 text-success-700'
            }`}>
              <Users className="h-3.5 w-3.5" />
              {trip.available_seats} place{trip.available_seats > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent on hover */}
      <div className="h-1 bg-gray-50 group-hover:gradient-primary transition-all duration-300" />
    </Link>
  );
}
