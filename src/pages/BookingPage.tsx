import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  CheckCircle,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { tripApi, bookingApi } from '@/lib/api';
import type { Trip, PassengerForm, PaymentMethod, Booking } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; color: string }[] = [
  { value: 'orange-money', label: 'Orange Money', color: 'bg-orange-50 border-orange-300 text-orange-700' },
  { value: 'moov-money', label: 'Moov Money', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { value: 'coris-money-plus', label: 'Coris Money Plus', color: 'bg-green-50 border-green-300 text-green-700' },
  { value: 'wave', label: 'Wave', color: 'bg-cyan-50 border-cyan-300 text-cyan-700' },
  { value: 'cash', label: 'Espèces', color: 'bg-gray-50 border-gray-300 text-gray-700' },
];

const PASSENGER_RELATIONS = [
  { value: 'self', label: 'Moi-même' },
  { value: 'spouse', label: 'Conjoint(e)' },
  { value: 'child', label: 'Enfant' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Frère/Sœur' },
  { value: 'friend', label: 'Ami(e)' },
  { value: 'colleague', label: 'Collègue' },
  { value: 'other', label: 'Autre' },
];

const emptyPassenger: PassengerForm = {
  passenger_firstname: '',
  passenger_lastname: '',
  passenger_phone: '',
  passenger_email: '',
  passenger_relation: 'self',
  seat_number: '',
};

export default function BookingPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState<PassengerForm[]>([{ ...emptyPassenger }]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tripId) return;
    tripApi.show(tripId).then((res) => setTrip(res.data.data));
  }, [tripId]);

  const addPassenger = () => {
    if (passengers.length >= 10) return;
    setPassengers([...passengers, { ...emptyPassenger, passenger_relation: 'friend' }]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const totalAmount = trip ? trip.price * passengers.length : 0;

  const handleSubmit = async () => {
    if (!trip || !paymentMethod) return;
    setLoading(true);
    setError('');
    try {
      const res = await bookingApi.create({
        trip_id: trip.id,
        passengers,
        payment_method: paymentMethod,
      });
      setBooking(res.data.data);
      setStep(3);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Erreur lors de la réservation';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {[
          { n: 1, label: 'Passagers', icon: Users },
          { n: 2, label: 'Paiement', icon: CreditCard },
          { n: 3, label: 'Confirmation', icon: CheckCircle },
        ].map(({ n, label, icon: Icon }, i) => (
          <div key={n} className="flex items-center">
            {i > 0 && (
              <div
                className={clsx(
                  'w-12 sm:w-20 h-0.5',
                  step >= n ? 'bg-primary-500' : 'bg-gray-200',
                )}
              />
            )}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                  step >= n
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 text-gray-500 hidden sm:block">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trip summary */}
      <div className="bg-primary-50 rounded-xl border border-primary-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">
              {trip.route.departure_city.name} → {trip.route.arrival_city.name}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(trip.departure_at).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              à{' '}
              {new Date(trip.departure_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">
              {totalAmount.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-xs text-gray-500">
              {passengers.length} passager{passengers.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Passengers */}
      {step === 1 && (
        <div className="space-y-6">
          {passengers.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  Passager {i + 1}
                </h3>
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(i)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={p.passenger_firstname}
                  onChange={(e) =>
                    updatePassenger(i, 'passenger_firstname', e.target.value)
                  }
                  required
                />
                <Input
                  label="Nom"
                  value={p.passenger_lastname}
                  onChange={(e) =>
                    updatePassenger(i, 'passenger_lastname', e.target.value)
                  }
                  required
                />
                <Input
                  label="Téléphone"
                  value={p.passenger_phone}
                  onChange={(e) =>
                    updatePassenger(i, 'passenger_phone', e.target.value)
                  }
                  placeholder="+226 70 00 00 00"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relation
                  </label>
                  <select
                    value={p.passenger_relation}
                    onChange={(e) =>
                      updatePassenger(i, 'passenger_relation', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {PASSENGER_RELATIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={addPassenger}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter un passager
            </Button>
            <Button onClick={() => setStep(2)}>
              Continuer <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Choisissez votre moyen de paiement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.value}
                  onClick={() => setPaymentMethod(pm.value)}
                  className={clsx(
                    'rounded-lg border-2 p-4 text-left transition',
                    paymentMethod === pm.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <span className="font-medium">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              {passengers.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">
                    {p.passenger_firstname} {p.passenger_lastname}
                  </span>
                  <span className="font-medium">
                    {trip.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">
                  {totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!paymentMethod}
            >
              Confirmer et payer
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && booking && (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <CheckCircle className="h-16 w-16 text-accent-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre référence :{' '}
            <span className="font-mono font-bold text-primary-600 text-lg">
              {booking.booking_reference}
            </span>
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-md mx-auto text-left">
            <h3 className="font-semibold mb-3">Vos tickets</h3>
            {booking.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border-b last:border-0 py-3"
              >
                <p className="font-medium">{ticket.passenger_full_name}</p>
                <p className="text-sm text-gray-500">
                  Ticket : {ticket.ticket_number}
                </p>
                <p className="text-sm text-gray-500">
                  Code : <span className="font-mono font-bold">{ticket.validation_code}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/bookings')}
            >
              Mes réservations
            </Button>
            <Button onClick={() => navigate('/trips')}>
              Nouveau voyage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
