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
      <div className="text-center py-20 text-gray-500">Chargement...</div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Voyage non trouvé</p>
      </div>
    );
  }

  const departureDate = new Date(trip.departure_at);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${trip.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
              <MapPin className="h-6 w-6 text-primary-600 shrink-0" />
              <span>{trip.route.departure_city.name}</span>
              <span className="text-gray-400">→</span>
              <span>{trip.route.arrival_city.name}</span>
            </div>

            <div className="space-y-3">
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
                value={departureDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              />
              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label="Heure de départ"
                value={departureDate.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
              {trip.route.estimated_duration_minutes && (
                <InfoRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Durée estimée"
                  value={`${Math.floor(trip.route.estimated_duration_minutes / 60)}h${trip.route.estimated_duration_minutes % 60 ? `${trip.route.estimated_duration_minutes % 60}min` : ''}`}
                />
              )}
              <InfoRow
                icon={<Bus className="h-4 w-4" />}
                label="Compagnie"
                value={trip.company.name}
              />
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Places disponibles"
                value={`${trip.available_seats} place${trip.available_seats > 1 ? 's' : ''}`}
              />
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-3xl font-extrabold text-primary-600 mb-2">
              {trip.price_formatted}
            </div>
            <p className="text-sm text-gray-500 mb-4">par passager</p>
            <Button
              onClick={handleBook}
              size="lg"
              disabled={trip.available_seats === 0}
            >
              {trip.available_seats === 0 ? 'Complet' : 'Réserver maintenant'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bus info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informations sur le bus
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Marque</p>
            <p className="font-medium">{trip.bus.brand ?? '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Confort</p>
            <p className="font-medium">{trip.bus.comfort_type.label}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Capacité</p>
            <p className="font-medium">{trip.bus.total_seats} places</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Immatriculation</p>
            <p className="font-medium">{trip.bus.registration_number}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {trip.bus.has_ac && (
            <span className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <Wind className="h-4 w-4" /> Climatisé
            </span>
          )}
          {trip.bus.has_wifi && (
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Wifi className="h-4 w-4" /> WiFi
            </span>
          )}
          {trip.bus.has_usb && (
            <span className="flex items-center gap-1 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              <Usb className="h-4 w-4" /> USB
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-500 w-36">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
