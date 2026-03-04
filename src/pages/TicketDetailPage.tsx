import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  QrCode,
  User,
  MapPin,
  Calendar,
  Clock,
  Bus,
  Shield,
} from 'lucide-react';
import { ticketApi } from '@/lib/api';
import type { Ticket } from '@/types';
import clsx from 'clsx';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  active: { label: 'Actif', class: 'bg-green-100 text-green-800' },
  validated: { label: 'Validé', class: 'bg-blue-100 text-blue-800' },
  boarded: { label: 'Embarqué', class: 'bg-indigo-100 text-indigo-800' },
  used: { label: 'Utilisé', class: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Annulé', class: 'bg-red-100 text-red-800' },
  expired: { label: 'Expiré', class: 'bg-yellow-100 text-yellow-800' },
};

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!ticketId) return;
    ticketApi.show(ticketId).then((res) => setTicket(res.data.data));
  }, [ticketId]);

  if (!ticket) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  const statusKey = typeof ticket.status === 'string' ? ticket.status : 'active';
  const st = STATUS_MAP[statusKey] ?? STATUS_MAP.active;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Ticket Card */}
      <div className="bg-white rounded-2xl border-2 border-primary-200 overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">LIPTRA</h2>
            <span
              className={clsx(
                'text-xs font-medium px-2 py-1 rounded-full',
                st.class,
              )}
            >
              {st.label}
            </span>
          </div>
          <p className="text-sm opacity-80 mt-1">E-Ticket de transport</p>
        </div>

        {/* Route */}
        <div className="px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-gray-900">
                {ticket.booking?.trip.route.departure_city.name}
              </p>
              <p className="text-xs text-gray-500">Départ</p>
            </div>
            <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-gray-900">
                {ticket.booking?.trip.route.arrival_city.name}
              </p>
              <p className="text-xs text-gray-500">Arrivée</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 text-sm border-b">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(ticket.booking?.trip.departure_at ?? '').toLocaleDateString(
                  'fr-FR',
                  { day: 'numeric', month: 'short', year: 'numeric' },
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Heure</p>
              <p className="font-medium text-gray-900">
                {new Date(ticket.booking?.trip.departure_at ?? '').toLocaleTimeString(
                  'fr-FR',
                  { hour: '2-digit', minute: '2-digit' },
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Passager</p>
              <p className="font-medium text-gray-900">
                {ticket.passenger_full_name}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Bus className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-gray-500">Siège</p>
              <p className="font-medium text-gray-900">
                {ticket.seat_number ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* QR + Code */}
        <div className="px-6 py-6 text-center">
          <div className="inline-flex items-center justify-center w-40 h-40 bg-gray-100 rounded-xl mb-4">
            <QrCode className="h-24 w-24 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Présentez ce QR code à l'agent
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <p className="text-xs text-gray-500 mb-1">Code de validation</p>
            <p className="text-3xl font-mono font-bold tracking-widest text-primary-600">
              {ticket.validation_code}
            </p>
          </div>
        </div>

        {/* Ticket number */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5" />
            Ticket sécurisé
          </div>
          <span className="font-mono text-xs text-gray-500">
            {ticket.ticket_number}
          </span>
        </div>
      </div>
    </div>
  );
}
