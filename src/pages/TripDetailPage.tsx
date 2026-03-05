import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Bus,
  Wind,
  Wifi,
  Usb,
  ArrowRight,
  Shield,
  Building2,
  Armchair,
} from 'lucide-react';
import { tripApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Trip } from '@/types';
import Button from '@/components/ui/Button';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    tripApi
      .show(id)
      .then((res) => setTrip(res.data.data))
      .catch(() => setTrip(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center animate-pulse-soft">
          <Bus className="h-8 w-8 text-primary-400" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-32">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-10 w-10 text-gray-300" />
        </div>
        <p className="text-gray-700 text-lg font-bold">Voyage non trouvé</p>
      </div>
    );
  }

  const departureDate = new Date(trip.departure_at);
  const seatsLow = trip.available_seats <= 5;

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${trip.id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top banner */}
      <div className="gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold mb-3">
            <span>{trip.route.departure_city.name}</span>
            <ArrowRight className="h-6 w-6 text-primary-300 shrink-0" />
            <span>{trip.route.arrival_city.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-primary-200 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {departureDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left - Trip details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Trip info card */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                Détails du voyage
              </h2>
              <div className="space-y-4">
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Compagnie" value={trip.company.name} />
                <InfoRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Heure de départ"
                  value={departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                />
                {trip.route.estimated_duration_minutes && (
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Durée estimée"
                    value={`${Math.floor(trip.route.estimated_duration_minutes / 60)}h${trip.route.estimated_duration_minutes % 60 ? `${trip.route.estimated_duration_minutes % 60}min` : ''}`}
                  />
                )}
                <InfoRow
                  icon={<Users className="h-4 w-4" />}
                  label="Places disponibles"
                  value={`${trip.available_seats} place${trip.available_seats > 1 ? 's' : ''}`}
                  highlight={seatsLow}
                />
              </div>
            </div>

            {/* Bus info card */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary-500" />
                Informations sur le bus
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <BusStat label="Marque" value={trip.bus.brand ?? '-'} />
                <BusStat label="Confort" value={trip.bus.comfort_type_label} />
                <BusStat label="Capacité" value={`${trip.bus.total_seats} places`} />
                <BusStat label="Immatriculation" value={trip.bus.registration_number} />
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
                {trip.bus.has_air_conditioning && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 px-4 py-2 rounded-xl">
                    <Wind className="h-4 w-4" /> Climatisé
                  </span>
                )}
                {trip.bus.has_wifi && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-xl">
                    <Wifi className="h-4 w-4" /> WiFi
                  </span>
                )}
                {trip.bus.has_usb_charging && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-700 bg-purple-50 px-4 py-2 rounded-xl">
                    <Usb className="h-4 w-4" /> Prise USB
                  </span>
                )}
                {!trip.bus.has_air_conditioning && !trip.bus.has_wifi && !trip.bus.has_usb_charging && (
                  <span className="text-sm text-gray-400">Équipements standard</span>
                )}
              </div>
            </div>
          </div>

          {/* Right - Booking card (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 p-6 lg:sticky lg:top-24">
              <div className="text-center mb-5">
                <p className="text-sm text-gray-500 mb-1">Prix par passager</p>
                <p className="text-4xl font-extrabold text-primary-600">
                  {trip.price_formatted}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm bg-gray-50 rounded-xl p-3">
                  <Shield className="h-4 w-4 text-success-500 shrink-0" />
                  <span className="text-gray-600">Paiement sécurisé Mobile Money</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-gray-50 rounded-xl p-3">
                  <Armchair className="h-4 w-4 text-primary-500 shrink-0" />
                  <span className="text-gray-600">E-ticket avec QR Code</span>
                </div>
              </div>

              {seatsLow && trip.available_seats > 0 && (
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold text-accent-700 bg-accent-50 px-3 py-1.5 rounded-lg">
                    Plus que {trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} !
                  </span>
                </div>
              )}

              <Button
                onClick={handleBook}
                size="lg"
                className="w-full"
                disabled={trip.available_seats === 0}
              >
                {trip.available_seats === 0 ? 'Complet' : 'Réserver maintenant'}
              </Button>

              {trip.available_seats === 0 && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Ce voyage est complet. Recherchez un autre horaire.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-500 w-36">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-accent-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function BusStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}
