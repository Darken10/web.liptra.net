import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, QrCode } from 'lucide-react';
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
        <div className="space-y-6">
          {bookings.map((b) => {
            const status = STATUS_MAP[b.payment_status] ?? STATUS_MAP.pending;
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border p-5"
              >
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <span className="font-mono text-sm text-primary-600 font-bold block mb-1">
                      {b.booking_reference}
                    </span>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      <span className="font-medium">
                        {b.trip.route.departure_city.name} →{' '}
                        {b.trip.route.arrival_city.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                  </div>
                  <span
                    className={clsx(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      status.class,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Tickets:</p>
                  {b.tickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/tickets/${ticket.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="font-mono text-sm font-medium text-gray-900">
                            {ticket.ticket_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            Passager: {ticket.passenger_name}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-primary-100 text-primary-700">
                        Voir détails
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-end items-center text-sm mt-4 pt-4 border-t">
                  <span className="font-bold text-primary-600">
                    {b.total_amount_formatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
