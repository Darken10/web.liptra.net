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
  MapPin,
  Calendar,
  Clock,
  PartyPopper,
} from 'lucide-react';
import { tripApi, bookingApi } from '@/lib/api';
import type { Trip, PassengerForm, PaymentMethod, Booking } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string; color: string }[] = [
  { value: 'orange-money', label: 'Orange Money', icon: '🟠', color: 'border-orange-300 bg-orange-50' },
  { value: 'moov-money', label: 'Moov Money', icon: '🔵', color: 'border-blue-300 bg-blue-50' },
  { value: 'coris-money-plus', label: 'Coris Money Plus', icon: '🟢', color: 'border-green-300 bg-green-50' },
  { value: 'wave', label: 'Wave', icon: '🌊', color: 'border-cyan-300 bg-cyan-50' },
  { value: 'cash', label: 'Espèces', icon: '💵', color: 'border-gray-300 bg-gray-50' },
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
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center animate-pulse-soft">
          <CreditCard className="h-8 w-8 text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, label: 'Passagers', icon: Users },
            { n: 2, label: 'Paiement', icon: CreditCard },
            { n: 3, label: 'Confirmation', icon: CheckCircle },
          ].map(({ n, label, icon: Icon }, i) => (
            <div key={n} className="flex items-center">
              {i > 0 && (
                <div className={clsx(
                  'w-16 sm:w-24 h-0.5 transition-colors duration-500',
                  step >= n ? 'gradient-primary' : 'bg-gray-200',
                )} />
              )}
              <div className="flex flex-col items-center">
                <div className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300',
                  step > n
                    ? 'bg-success-100 text-success-600'
                    : step === n
                    ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-100 text-gray-400',
                )}>
                  {step > n ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={clsx(
                  'text-xs mt-2 font-medium hidden sm:block',
                  step >= n ? 'text-primary-700' : 'text-gray-400',
                )}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trip summary card */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {trip.route.departure_city.name} → {trip.route.arrival_city.name}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(trip.departure_at).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(trip.departure_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary-600">
                {totalAmount.toLocaleString('fr-FR')} FCFA
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {passengers.length} passager{passengers.length > 1 ? 's' : ''} × {trip.price.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-danger-50 text-danger-700 text-sm rounded-2xl p-4 mb-6 border border-danger-100 font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Passengers */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            {passengers.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-gray-900">Passager {i + 1}</h3>
                  </div>
                  {passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(i)}
                      className="text-gray-400 hover:text-danger-500 p-2 hover:bg-danger-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    value={p.passenger_firstname}
                    onChange={(e) => updatePassenger(i, 'passenger_firstname', e.target.value)}
                    placeholder="Ex: Amadou"
                    required
                  />
                  <Input
                    label="Nom"
                    value={p.passenger_lastname}
                    onChange={(e) => updatePassenger(i, 'passenger_lastname', e.target.value)}
                    placeholder="Ex: Ouédraogo"
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={p.passenger_phone}
                    onChange={(e) => updatePassenger(i, 'passenger_phone', e.target.value)}
                    placeholder="+226 70 00 00 00"
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Relation
                    </label>
                    <select
                      value={p.passenger_relation}
                      onChange={(e) => updatePassenger(i, 'passenger_relation', e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:border-primary-500 focus:outline-none transition-colors"
                    >
                      {PASSENGER_RELATIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button variant="outline" onClick={addPassenger}>
                <Plus className="h-4 w-4 mr-1.5" /> Ajouter un passager
              </Button>
              <Button onClick={() => setStep(2)} size="lg">
                Continuer <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">
                Choisissez votre moyen de paiement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={clsx(
                      'rounded-2xl border-2 p-4 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer',
                      paymentMethod === pm.value
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    )}
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-semibold text-gray-900">{pm.label}</span>
                    {paymentMethod === pm.value && (
                      <CheckCircle className="h-5 w-5 text-primary-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                {passengers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</div>
                      <span className="text-gray-700 font-medium">
                        {p.passenger_firstname} {p.passenger_lastname}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {trip.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
                <div className="border-t-2 border-gray-100 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-primary-600">
                    {totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Retour
              </Button>
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!paymentMethod}
                size="lg"
              >
                Confirmer et payer
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && booking && (
          <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 p-8 sm:p-10 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5">
              <PartyPopper className="h-10 w-10 text-success-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Réservation confirmée !
            </h2>
            <p className="text-gray-500 mb-6">
              Votre référence :{' '}
              <span className="font-mono font-extrabold text-primary-600 text-lg bg-primary-50 px-3 py-1 rounded-lg">
                {booking.booking_reference}
              </span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-md mx-auto text-left">
              <h3 className="font-bold text-gray-900 mb-4">Vos tickets</h3>
              {booking.tickets.map((ticket) => (
                <div key={ticket.id} className="border-b border-gray-200 last:border-0 py-3">
                  <p className="font-semibold text-gray-900">{ticket.passenger_full_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket : <span className="font-mono">{ticket.ticket_number}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Code : <span className="font-mono font-bold text-primary-600">{ticket.validation_code}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/bookings')}>
                Mes réservations
              </Button>
              <Button onClick={() => navigate('/trips')}>
                Nouveau voyage <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
