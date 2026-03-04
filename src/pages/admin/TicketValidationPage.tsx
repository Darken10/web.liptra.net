import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QrCode, Hash, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Ticket as TicketType } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Alert, Badge, StatusBadge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function TicketValidationPage() {
  const [mode, setMode] = useState<'code' | 'qr'>('code');
  const [input, setInput] = useState('');
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateMutation = useMutation({
    mutationFn: async () => {
      const data = mode === 'qr' ? { qr_code_data: input } : { validation_code: input };
      const res = await adminApi.tickets.validate(data);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTicket(data);
      setSuccess('Ticket validé avec succès !');
      setError(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la validation');
      setSuccess(null);
      setTicket(null);
    },
  });

  const boardMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.tickets.board(id);
      return res.data.data;
    },
    onSuccess: (data) => {
      setTicket(data);
      setSuccess('Embarquement enregistré !');
    },
    onError: () => setError('Erreur lors de l\'embarquement'),
  });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Validation des tickets"
        description="Scanner ou saisir un code pour valider un ticket"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Validation' }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode('code'); setInput(''); setTicket(null); setError(null); setSuccess(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'code' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Hash className="h-4 w-4" /> Code de validation
          </button>
          <button
            onClick={() => { setMode('qr'); setInput(''); setTicket(null); setError(null); setSuccess(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'qr' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <QrCode className="h-4 w-4" /> Données QR Code
          </button>
        </div>

        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'code' ? 'Saisir le code de validation...' : 'Coller les données du QR Code...'}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && input && validateMutation.mutate()}
          />
          <Button onClick={() => validateMutation.mutate()} loading={validateMutation.isPending} disabled={!input}>
            Valider
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
              <Ticket className="h-5 w-5 text-primary-600" />
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

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <StatusBadge type="ticket" value={ticket.status} />
                  <Badge variant={ticket.baggage_checked ? 'success' : 'default'} dot>
                    {ticket.baggage_checked ? 'Bagages vérifiés' : 'Bagages non vérifiés'}
                  </Badge>
                </div>
                {ticket.status === 'validated' && (
                  <Button size="sm" onClick={() => boardMutation.mutate(ticket.id)} loading={boardMutation.isPending}>
                    Embarquer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
