import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Package, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Ticket } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Alert, Badge, StatusBadge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function BaggageCheckPage() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchMutation = useMutation({
    mutationFn: async () => {
      const res = await adminApi.tickets.findByNumber(ticketNumber);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTicket(data);
      setError(null);
      setSuccess(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Ticket introuvable');
      setTicket(null);
    },
  });

  const baggageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.tickets.checkBaggage(id);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTicket(data);
      setSuccess('Bagages vérifiés avec succès !');
      setError(null);
    },
    onError: () => setError('Erreur lors de la vérification des bagages'),
  });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Vérification des bagages"
        description="Rechercher un ticket pour vérifier et enregistrer les bagages"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bagages' }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Rechercher par n° de ticket..."
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && ticketNumber && searchMutation.mutate()}
            />
          </div>
          <Button onClick={() => searchMutation.mutate()} loading={searchMutation.isPending} disabled={!ticketNumber}>
            Rechercher
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onDismiss={() => setSuccess(null)} className="mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        </Alert>
      )}

      {ticket && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-600" />
              Ticket {ticket.ticket_number}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Passager</p>
                  <p className="font-medium text-gray-900">{ticket.passenger_full_name}</p>
                  <p className="text-sm text-gray-600">{ticket.passenger_phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Siège</p>
                  <p className="font-medium text-gray-900">{ticket.seat_number ?? 'Non attribué'}</p>
                </div>
              </div>

              {ticket.trip && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-1">Voyage</p>
                  <p className="font-medium text-gray-900">
                    {ticket.trip.route?.departure_city?.name} → {ticket.trip.route?.arrival_city?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.trip.departure_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <StatusBadge type="ticket" value={ticket.status} />
                    <Badge variant={ticket.baggage_checked ? 'success' : 'warning'} dot>
                      {ticket.baggage_checked ? 'Bagages vérifiés' : 'Bagages à vérifier'}
                    </Badge>
                  </div>
                  {!ticket.baggage_checked && (
                    <Button
                      size="sm"
                      onClick={() => baggageMutation.mutate(ticket.id)}
                      loading={baggageMutation.isPending}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Vérifier bagages
                    </Button>
                  )}
                </div>
                {ticket.baggage_checked_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Vérifié le {new Date(ticket.baggage_checked_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
