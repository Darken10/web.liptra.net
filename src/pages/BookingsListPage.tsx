import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { bookingApi } from '@/lib/api';
import type { Booking } from '@/types';
import clsx from 'clsx';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', class: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminée', class: 'bg-gray-100 text-gray-800' },
};

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.list().then((res) => {
      setBookings(res.data.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mes réservations
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Aucune réservation pour le moment</p>
          <Link
            to="/trips"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Rechercher un voyage
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const status = STATUS_MAP[b.payment_status] ?? STATUS_MAP.pending;
            return (
              <Link
                key={b.id}
                to={`/bookings/${b.id}`}
                className="block bg-white rounded-xl border p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm text-primary-600 font-bold">
                    {b.booking_reference}
                  </span>
                  <span
                    className={clsx(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      status.class,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span className="font-medium">
                    {b.trip.route.departure_city.name} →{' '}
                    {b.trip.route.arrival_city.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4" />
                  {new Date(b.trip.departure_at).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {b.tickets.length} ticket{b.tickets.length > 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-primary-600">
                    {b.total_amount_formatted}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
