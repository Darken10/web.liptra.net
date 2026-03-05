import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  QrCode,
  ArrowRight,
  Search,
  Loader2,
} from 'lucide-react';
import { bookingApi } from '@/lib/api';
import type { Booking } from '@/types';
import clsx from 'clsx';
import Button from '@/components/ui/Button';

const STATUS_MAP: Record<string, { label: string; class: string; dot: string }> = {
  pending: { label: 'En attente', class: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmée', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Annulée', class: 'bg-danger-50 text-danger-700 border-danger-200', dot: 'bg-danger-500' },
  completed: { label: 'Terminée', class: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
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
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Chargement de vos réservations…</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Mes réservations
          </h1>
          {bookings.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {bookings.length} réservation{bookings.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link to="/trips">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1.5" />
            Nouveau voyage
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)]">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Ticket className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune réservation</h3>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Vous n'avez pas encore effectué de réservation. Trouvez votre prochain voyage !
          </p>
          <Link to="/trips">
            <Button>
              Rechercher un voyage
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => {
            const status = STATUS_MAP[b.payment_status] ?? STATUS_MAP.pending;
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-mono text-sm text-primary-600 font-bold block mb-2">
                        {b.booking_reference}
                      </span>
                      <div className="flex items-center gap-2 text-gray-800 mb-1.5">
                        <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                        <span className="font-bold">
                          {b.trip.route.departure_city.name}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                        <span className="font-bold">
                          {b.trip.route.arrival_city.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
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
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={clsx(
                          'text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5',
                          status.class,
                        )}
                      >
                        <span className={clsx('w-1.5 h-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </span>
                      <span className="font-extrabold text-primary-600 text-lg">
                        {b.total_amount_formatted}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Tickets ({b.tickets.length})
                    </p>
                    {b.tickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        to={`/tickets/${ticket.id}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group border border-transparent hover:border-primary-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-primary-200 transition-colors">
                            <QrCode className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-semibold text-gray-900">
                              {ticket.ticket_number}
                            </p>
                            <p className="text-xs text-gray-400">
                            {ticket.passenger_full_name}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
