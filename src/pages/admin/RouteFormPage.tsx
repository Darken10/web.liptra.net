import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi, cityApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Toggle, Alert, PageLoader } from '@/components/ui';
import type { City, Company } from '@/types';

export default function RouteFormPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!routeId;

  const [form, setForm] = useState({
    departure_city_id: '',
    arrival_city_id: '',
    company_id: '',
    distance_km: '',
    estimated_duration_minutes: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const res = await cityApi.list();
      return res.data.data as City[];
    },
  });

  const { data: companies } = useQuery({
    queryKey: ['admin', 'companies', 'all'],
    queryFn: async () => {
      const res = await adminApi.companies.list({ per_page: '100' });
      return res.data.data.data as Company[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['admin', 'routes', routeId],
    queryFn: async () => {
      if (!routeId) return null;
      const res = await adminApi.routes.show(routeId);
      const r = res.data.data;
      setForm({
        departure_city_id: r.departure_city?.id ?? '',
        arrival_city_id: r.arrival_city?.id ?? '',
        company_id: r.company?.id ?? '',
        distance_km: r.distance_km?.toString() ?? '',
        estimated_duration_minutes: r.estimated_duration_minutes?.toString() ?? '',
        is_active: r.is_active ?? true,
      });
      return r;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
        estimated_duration_minutes: form.estimated_duration_minutes ? parseInt(form.estimated_duration_minutes) : null,
      };
      if (isEdit && routeId) {
        return adminApi.routes.update(routeId, payload);
      }
      return adminApi.routes.create(payload);
    },
    onSuccess: () => navigate('/admin/routes'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  const cityOptions = (cities ?? []).map((c) => ({ value: c.id, label: `${c.name}${c.region ? ` (${c.region})` : ''}` }));

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? 'Modifier l\'itinéraire' : 'Nouvel itinéraire'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Itinéraires', href: '/admin/routes' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Ville de départ" value={form.departure_city_id} onChange={(e) => updateField('departure_city_id', e.target.value)} options={cityOptions} placeholder="Choisir..." />
          <Select label="Ville d'arrivée" value={form.arrival_city_id} onChange={(e) => updateField('arrival_city_id', e.target.value)} options={cityOptions} placeholder="Choisir..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Distance (km)" type="number" value={form.distance_km} onChange={(e) => updateField('distance_km', e.target.value)} />
          <Input label="Durée estimée (minutes)" type="number" value={form.estimated_duration_minutes} onChange={(e) => updateField('estimated_duration_minutes', e.target.value)} />
        </div>
        <Toggle label="Itinéraire actif" checked={form.is_active} onChange={(v) => updateField('is_active', v)} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/routes')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
