import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Toggle, Alert, PageLoader } from '@/components/ui';

export default function CityFormPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!cityId;

  const [form, setForm] = useState({
    name: '',
    region: '',
    latitude: '',
    longitude: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['admin', 'cities', cityId],
    queryFn: async () => {
      if (!cityId) return null;
      const res = await adminApi.cities.show(cityId);
      const c = res.data.data;
      setForm({
        name: c.name ?? '',
        region: c.region ?? '',
        latitude: c.latitude?.toString() ?? '',
        longitude: c.longitude?.toString() ?? '',
        is_active: c.is_active ?? true,
      });
      return c;
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
      if (isEdit && cityId) {
        return adminApi.cities.update(cityId, payload);
      }
      return adminApi.cities.create(payload);
    },
    onSuccess: () => navigate('/admin/cities'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? 'Modifier la ville' : 'Nouvelle ville'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Villes', href: '/admin/cities' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nom de la ville" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          <Input label="Région" value={form.region} onChange={(e) => updateField('region', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Latitude" type="number" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} placeholder="ex: 12.3456" />
          <Input label="Longitude" type="number" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} placeholder="ex: -1.5167" />
        </div>
        <Toggle label="Ville active" description="Les villes inactives ne seront pas affichées" checked={form.is_active} onChange={(v) => updateField('is_active', v)} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/cities')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
