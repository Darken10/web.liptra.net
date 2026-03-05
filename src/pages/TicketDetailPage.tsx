import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  QrCode,
  User,
  Calendar,
  Clock,
  Bus,
  Shield,
  ArrowRight,
  Ticket as TicketIcon,
  Loader2,
} from 'lucide-react';
import { ticketApi } from '@/lib/api';
import type { Ticket } from '@/types';
import clsx from 'clsx';

const STATUS_MAP: Record<string, { label: string; class: string; dot: string }> = {
  active: { label: 'Actif', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  validated: { label: 'Validé', class: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  boarded: { label: 'Embarqué', class: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  used: { label: 'Utilisé', class: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  cancelled: { label: 'Annulé', class: 'bg-danger-50 text-danger-700 border-danger-200', dot: 'bg-danger-500' },
  expired: { label: 'Expiré', class: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
};

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!ticketId) return;
    ticketApi.show(ticketId).then((res) => setTicket(res.data.data));
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Chargement du ticket…</span>
      </div>
    );
  }

  const statusKey = typeof ticket.status === 'string' ? ticket.status : 'active';
  const st = STATUS_MAP[statusKey] ?? STATUS_MAP.active;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      {/* Ticket Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] border border-gray-100">
        {/* Header */}
        <div className="gradient-hero text-white px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <TicketIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">LIPTRA</h2>
                <p className="text-xs text-primary-200">E-Ticket de transport</p>
              </div>
            </div>
            <span
              className={clsx(
                'text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5',
                st.class,
              )}
            >
              <span className={clsx('w-1.5 h-1.5 rounded-full', st.dot)} />
              {st.label}
            </span>
          </div>
        </div>

        {/* Route */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <p className="text-xl font-extrabold text-gray-900">
                {ticket.booking?.trip?.route?.departure_city?.name ?? '—'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Départ</p>
            </div>
            <div className="flex items-center gap-1.5 text-primary-400 shrink-0">
              <div className="w-8 border-t-2 border-dashed border-primary-200" />
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="flex-1 text-center">
              <p className="text-xl font-extrabold text-gray-900">
                {ticket.booking?.trip?.route?.arrival_city?.name ?? '—'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Arrivée</p>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="ticket-perforation" />

        {/* Info Grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <InfoItem icon={Calendar} label="Date">
            {new Date(ticket.booking?.trip?.departure_at ?? '').toLocaleDateString(
              'fr-FR',
              { day: 'numeric', month: 'short', year: 'numeric' },
            )}
          </InfoItem>
          <InfoItem icon={Clock} label="Heure">
            {new Date(ticket.booking?.trip?.departure_at ?? '').toLocaleTimeString(
              'fr-FR',
              { hour: '2-digit', minute: '2-digit' },
            )}
          </InfoItem>
          <InfoItem icon={User} label="Passager">
            {ticket.passenger_full_name}
          </InfoItem>
          <InfoItem icon={Bus} label="Siège">
            {ticket.seat_number ?? '—'}
          </InfoItem>
        </div>

        {/* QR + Code */}
        <div className="px-6 py-6 text-center border-t border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-44 h-44 bg-gray-50 rounded-2xl mb-4 border-2 border-dashed border-gray-200">
            <QrCode className="h-28 w-28 text-gray-300" />
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Présentez ce QR code à l'agent de contrôle
          </p>

          <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
            <p className="text-xs text-primary-400 mb-1.5 font-medium">Code de validation</p>
            <p className="text-3xl font-mono font-extrabold tracking-[0.25em] text-primary-700">
              {ticket.validation_code}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5" />
            Ticket sécurisé
          </div>
          <span className="font-mono text-xs text-gray-400">
            {ticket.ticket_number}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 text-sm">{children}</p>
      </div>
    </div>
  );
}
