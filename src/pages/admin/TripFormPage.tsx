import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Alert, PageLoader } from '@/components/ui';
import type { AdminRoute, AdminBus, AdminDriver, AdminStation, Company } from '@/types';

export default function TripFormPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!tripId;

  const [form, setForm] = useState({
    company_id: '',
    route_id: '',
    bus_id: '',
    driver_id: '',
    departure_station_id: '',
    arrival_station_id: '',
    departure_at: '',
    estimated_arrival_at: '',
    price: '',
    status: 'scheduled',
  });
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
    queryKey: ['admin', 'trips', tripId],
    queryFn: async () => {
      if (!tripId) return null;
      const res = await adminApi.trips.show(tripId);
      const t = res.data.data;
      setForm({
        company_id: t.company?.id ?? '',
        route_id: t.route?.id ?? '',
        bus_id: t.bus?.id ?? '',
        driver_id: t.driver?.id ?? '',
        departure_station_id: t.departure_station?.id ?? '',
        arrival_station_id: t.arrival_station?.id ?? '',
        departure_at: t.departure_at ? t.departure_at.slice(0, 16) : '',
        estimated_arrival_at: t.estimated_arrival_at ? t.estimated_arrival_at.slice(0, 16) : '',
        price: t.price?.toString() ?? '',
        status: t.status ?? 'scheduled',
      });
      return t;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        price: form.price ? parseInt(form.price) : 0,
        estimated_arrival_at: form.estimated_arrival_at || null,
      };
      if (isEdit && tripId) {
        return adminApi.trips.update(tripId, payload);
      }
      return adminApi.trips.create(payload);
    },
    onSuccess: () => navigate('/admin/trips'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  const statusOptions = [
    { value: 'scheduled', label: 'Programmé' },
    { value: 'boarding', label: 'Embarquement' },
    { value: 'departed', label: 'En route' },
    { value: 'arrived', label: 'Arrivé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'delayed', label: 'Retardé' },
  ];

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Modifier le voyage' : 'Nouveau voyage'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Voyages', href: '/admin/trips' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
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
          options={(routes ?? []).map((r) => ({ value: r.id, label: `${r.departure_city?.name} → ${r.arrival_city?.name}` }))}
          placeholder="Choisir un itinéraire"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Bus"
            value={form.bus_id}
            onChange={(e) => updateField('bus_id', e.target.value)}
            options={(buses ?? []).map((b) => ({ value: b.id, label: `${b.registration_number} (${b.total_seats} pl.)` }))}
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
            options={(stations ?? []).map((s) => ({ value: s.id, label: `${s.name} - ${s.city?.name}` }))}
            placeholder="Choisir..."
          />
          <Select
            label="Gare d'arrivée"
            value={form.arrival_station_id}
            onChange={(e) => updateField('arrival_station_id', e.target.value)}
            options={(stations ?? []).map((s) => ({ value: s.id, label: `${s.name} - ${s.city?.name}` }))}
            placeholder="Choisir..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Départ" type="datetime-local" value={form.departure_at} onChange={(e) => updateField('departure_at', e.target.value)} required />
          <Input label="Arrivée estimée" type="datetime-local" value={form.estimated_arrival_at} onChange={(e) => updateField('estimated_arrival_at', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Prix (XOF)" type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
          {isEdit && (
            <Select label="Statut" value={form.status} onChange={(e) => updateField('status', e.target.value)} options={statusOptions} />
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/trips')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
