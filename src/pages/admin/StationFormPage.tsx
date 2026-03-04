import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi, cityApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Toggle, Alert, PageLoader } from '@/components/ui';
import type { City, Company } from '@/types';

export default function StationFormPage() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!stationId;

  const [form, setForm] = useState({
    name: '',
    city_id: '',
    company_id: '',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
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
    queryKey: ['admin', 'stations', stationId],
    queryFn: async () => {
      if (!stationId) return null;
      const res = await adminApi.stations.show(stationId);
      const s = res.data.data;
      setForm({
        name: s.name ?? '',
        city_id: s.city?.id ?? '',
        company_id: s.company?.id ?? '',
        address: s.address ?? '',
        phone: s.phone ?? '',
        latitude: s.latitude?.toString() ?? '',
        longitude: s.longitude?.toString() ?? '',
        is_active: s.is_active ?? true,
      });
      return s;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };
      if (isEdit && stationId) {
        return adminApi.stations.update(stationId, payload);
      }
      return adminApi.stations.create(payload);
    },
    onSuccess: () => navigate('/admin/stations'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Modifier la gare' : 'Nouvelle gare'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Gares', href: '/admin/stations' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <Input label="Nom de la gare" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Ville"
            value={form.city_id}
            onChange={(e) => updateField('city_id', e.target.value)}
            options={(cities ?? []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Choisir une ville"
          />
          <Select
            label="Compagnie"
            value={form.company_id}
            onChange={(e) => updateField('company_id', e.target.value)}
            options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Choisir une compagnie"
          />
        </div>
        <Input label="Adresse" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
        <Input label="Téléphone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Latitude" type="number" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} />
          <Input label="Longitude" type="number" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} />
        </div>
        <Toggle label="Gare active" checked={form.is_active} onChange={(v) => updateField('is_active', v)} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/stations')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
