import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Textarea, Alert, PageLoader } from '@/components/ui';
import type { AdminRoute, AdminBus, AdminDriver, AdminStation, Company, TripScheduleType } from '@/types';
import { Calendar, Clock, Plus, X, Repeat, CalendarDays, CalendarClock } from 'lucide-react';

const DAY_OPTIONS = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' },
];

const SCHEDULE_TYPES: { value: TripScheduleType; label: string; description: string; icon: typeof Calendar }[] = [
  {
    value: 'one_time',
    label: 'Voyage unique',
    description: 'Un seul voyage à une date et heure précises',
    icon: CalendarClock,
  },
  {
    value: 'daily',
    label: 'Quotidien',
    description: 'Se répète chaque jour aux mêmes horaires',
    icon: CalendarDays,
  },
  {
    value: 'weekly',
    label: 'Hebdomadaire',
    description: 'Se répète certains jours de la semaine',
    icon: Repeat,
  },
];

function TimeSlots({ times, onChange }: { times: string[]; onChange: (times: string[]) => void }) {
  const addTime = () => onChange([...times, '08:00']);
  const removeTime = (index: number) => onChange(times.filter((_, i) => i !== index));
  const updateTime = (index: number, value: string) =>
    onChange(times.map((t, i) => (i === index ? value : t)));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Clock className="h-4 w-4 inline mr-1.5" />
        Horaires de départ
      </label>
      <div className="space-y-2">
        {times.map((time, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => updateTime(index, e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-primary-400 focus:ring-0 outline-none transition-colors"
            />
            {times.length > 1 && (
              <button
                type="button"
                onClick={() => removeTime(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addTime}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Ajouter un horaire
      </button>
    </div>
  );
}

function DayPicker({ selectedDays, onChange }: { selectedDays: number[]; onChange: (days: number[]) => void }) {
  const toggle = (day: number) =>
    onChange(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day].sort()
    );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Calendar className="h-4 w-4 inline mr-1.5" />
        Jours de la semaine
      </label>
      <div className="flex flex-wrap gap-2">
        {DAY_OPTIONS.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggle(day.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-primary-50 border-primary-400 text-primary-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TripScheduleFormPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!scheduleId;

  const [scheduleType, setScheduleType] = useState<TripScheduleType>('daily');
  const [form, setForm] = useState({
    company_id: '',
    route_id: '',
    bus_id: '',
    driver_id: '',
    departure_station_id: '',
    arrival_station_id: '',
    price: '',
    estimated_duration_minutes: '',
    notes: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    one_time_date: '',
    one_time_time: '08:00',
  });
  const [departureTimes, setDepartureTimes] = useState<string[]>(['08:00']);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);
  const [error, setError] = useState<string | null>(null);

  const { data: companies } = useQuery({
    queryKey: ['admin', 'companies', 'all'],
    queryFn: async () => {
      const res = await adminApi.companies.list({ per_page: '100' });
      return res.data.data.data as Company[];
    },
  });

  const { data: routes } = useQuery({
    queryKey: ['admin', 'routes', 'all'],
    queryFn: async () => {
      const res = await adminApi.routes.list({ per_page: '200' });
      return res.data.data.data as AdminRoute[];
    },
  });

  const { data: buses } = useQuery({
    queryKey: ['admin', 'buses', 'all'],
    queryFn: async () => {
      const res = await adminApi.buses.list({ per_page: '200' });
      return res.data.data.data as AdminBus[];
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ['admin', 'drivers', 'all'],
    queryFn: async () => {
      const res = await adminApi.drivers.list({ per_page: '200' });
      return res.data.data.data as AdminDriver[];
    },
  });

  const { data: stations } = useQuery({
    queryKey: ['admin', 'stations', 'all'],
    queryFn: async () => {
      const res = await adminApi.stations.list({ per_page: '200' });
      return res.data.data.data as AdminStation[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['admin', 'trip-schedules', scheduleId],
    queryFn: async () => {
      if (!scheduleId) return null;
      const res = await adminApi.tripSchedules.show(scheduleId);
      const s = res.data.data;
      setScheduleType(s.schedule_type);
      setForm({
        company_id: s.company?.id ?? '',
        route_id: s.route?.id ?? '',
        bus_id: s.bus?.id ?? '',
        driver_id: s.driver?.id ?? '',
        departure_station_id: s.departure_station?.id ?? '',
        arrival_station_id: s.arrival_station?.id ?? '',
        price: s.price?.toString() ?? '',
        estimated_duration_minutes: s.estimated_duration_minutes?.toString() ?? '',
        notes: s.notes ?? '',
        start_date: s.start_date ?? '',
        end_date: s.end_date ?? '',
        one_time_date: s.one_time_departure_at ? s.one_time_departure_at.slice(0, 10) : '',
        one_time_time: s.one_time_departure_at ? s.one_time_departure_at.slice(11, 16) : '08:00',
      });
      setDepartureTimes(s.departure_times ?? ['08:00']);
      setDaysOfWeek(s.days_of_week ?? [1, 2, 3, 4, 5]);
      return s;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        company_id: form.company_id,
        route_id: form.route_id,
        bus_id: form.bus_id,
        driver_id: form.driver_id,
        departure_station_id: form.departure_station_id,
        arrival_station_id: form.arrival_station_id,
        schedule_type: scheduleType,
        price: form.price ? parseInt(form.price) : 0,
        estimated_duration_minutes: form.estimated_duration_minutes ? parseInt(form.estimated_duration_minutes) : null,
        notes: form.notes || null,
        is_active: true,
      };

      if (scheduleType === 'one_time') {
        payload.departure_times = [form.one_time_time];
        payload.start_date = form.one_time_date;
        payload.one_time_departure_at = `${form.one_time_date}T${form.one_time_time}:00`;
      } else if (scheduleType === 'daily') {
        payload.departure_times = departureTimes;
        payload.start_date = form.start_date;
        payload.end_date = form.end_date || null;
      } else {
        payload.departure_times = departureTimes;
        payload.days_of_week = daysOfWeek;
        payload.start_date = form.start_date;
        payload.end_date = form.end_date || null;
      }

      if (isEdit && scheduleId) {
        return adminApi.tripSchedules.update(scheduleId, payload);
      }
      return adminApi.tripSchedules.create(payload);
    },
    onSuccess: () => navigate('/admin/trip-schedules'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Modifier le planning' : 'Nouveau planning de voyages'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Plannings', href: '/admin/trip-schedules' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-6">
        {/* Step 1: Schedule type selection */}
        {!isEdit && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Type de planning</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCHEDULE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = scheduleType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setScheduleType(type.value)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-primary-400 bg-primary-50 shadow-sm ring-1 ring-primary-200'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Trip details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">Détails du voyage</h3>

          <Select
            label="Compagnie"
            value={form.company_id}
            onChange={(e) => updateField('company_id', e.target.value)}
            options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Choisir une compagnie"
          />

          <Select
            label="Itinéraire"
            value={form.route_id}
            onChange={(e) => updateField('route_id', e.target.value)}
            options={(routes ?? []).map((r) => ({
              value: r.id,
              label: `${r.departure_city?.name} → ${r.arrival_city?.name}`,
            }))}
            placeholder="Choisir un itinéraire"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Bus"
              value={form.bus_id}
              onChange={(e) => updateField('bus_id', e.target.value)}
              options={(buses ?? []).map((b) => ({
                value: b.id,
                label: `${b.registration_number} (${b.total_seats} pl.)`,
              }))}
              placeholder="Choisir un bus"
            />
            <Select
              label="Chauffeur"
              value={form.driver_id}
              onChange={(e) => updateField('driver_id', e.target.value)}
              options={(drivers ?? []).map((d) => ({ value: d.id, label: d.full_name }))}
              placeholder="Choisir un chauffeur"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Gare de départ"
              value={form.departure_station_id}
              onChange={(e) => updateField('departure_station_id', e.target.value)}
              options={(stations ?? []).map((s) => ({
                value: s.id,
                label: `${s.name} - ${s.city?.name}`,
              }))}
              placeholder="Choisir..."
            />
            <Select
              label="Gare d'arrivée"
              value={form.arrival_station_id}
              onChange={(e) => updateField('arrival_station_id', e.target.value)}
              options={(stations ?? []).map((s) => ({
                value: s.id,
                label: `${s.name} - ${s.city?.name}`,
              }))}
              placeholder="Choisir..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Prix (XOF)"
              type="number"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              required
            />
            <Input
              label="Durée estimée (minutes)"
              type="number"
              value={form.estimated_duration_minutes}
              onChange={(e) => updateField('estimated_duration_minutes', e.target.value)}
              placeholder="Ex: 240"
            />
          </div>
        </div>

        {/* Step 3: Schedule-specific fields */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">
            {scheduleType === 'one_time' && 'Date et heure du voyage'}
            {scheduleType === 'daily' && 'Horaires quotidiens'}
            {scheduleType === 'weekly' && 'Planning hebdomadaire'}
          </h3>

          {scheduleType === 'one_time' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date du voyage"
                type="date"
                value={form.one_time_date}
                onChange={(e) => updateField('one_time_date', e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Heure de départ</label>
                <input
                  type="time"
                  value={form.one_time_time}
                  onChange={(e) => updateField('one_time_time', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-primary-400 focus:ring-0 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {scheduleType === 'daily' && (
            <>
              <TimeSlots times={departureTimes} onChange={setDepartureTimes} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date de début"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                  required
                />
                <Input
                  label="Date de fin (optionnel)"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateField('end_date', e.target.value)}
                />
              </div>
            </>
          )}

          {scheduleType === 'weekly' && (
            <>
              <DayPicker selectedDays={daysOfWeek} onChange={setDaysOfWeek} />
              <TimeSlots times={departureTimes} onChange={setDepartureTimes} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date de début"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                  required
                />
                <Input
                  label="Date de fin (optionnel)"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateField('end_date', e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <Textarea
            label="Notes (optionnel)"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            placeholder="Informations complémentaires sur ce planning..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/trip-schedules')}>
            Annuler
          </Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer le planning'}
          </Button>
        </div>
      </div>
    </div>
  );
}
