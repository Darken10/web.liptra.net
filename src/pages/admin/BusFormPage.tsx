import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Toggle, Alert, PageLoader } from '@/components/ui';
import type { Company } from '@/types';

const comfortOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: 'Premium' },
];

export default function BusFormPage() {
  const { busId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!busId;

  const [form, setForm] = useState({
    registration_number: '',
    company_id: '',
    brand: '',
    model: '',
    total_seats: '',
    comfort_type: 'standard',
    color: '',
    manufacture_year: '',
    mileage: '',
    has_ac: false,
    has_wifi: false,
    has_usb: false,
    has_toilet: false,
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const { data: companies } = useQuery({
    queryKey: ['admin', 'companies', 'all'],
    queryFn: async () => {
      const res = await adminApi.companies.list({ per_page: '100' });
      return res.data.data.data as Company[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['admin', 'buses', busId],
    queryFn: async () => {
      if (!busId) return null;
      const res = await adminApi.buses.show(busId);
      const b = res.data.data;
      setForm({
        registration_number: b.registration_number ?? '',
        company_id: b.company?.id ?? '',
        brand: b.brand ?? '',
        model: b.model ?? '',
        total_seats: b.total_seats?.toString() ?? '',
        comfort_type: b.comfort_type?.value ?? 'standard',
        color: b.color ?? '',
        manufacture_year: b.manufacture_year?.toString() ?? '',
        mileage: b.mileage?.toString() ?? '',
        has_ac: b.has_ac ?? false,
        has_wifi: b.has_wifi ?? false,
        has_usb: b.has_usb ?? false,
        has_toilet: b.has_toilet ?? false,
        is_active: b.is_active ?? true,
      });
      return b;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        total_seats: form.total_seats ? parseInt(form.total_seats) : null,
        manufacture_year: form.manufacture_year ? parseInt(form.manufacture_year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : null,
      };
      if (isEdit && busId) {
        return adminApi.buses.update(busId, payload);
      }
      return adminApi.buses.create(payload);
    },
    onSuccess: () => navigate('/admin/buses'),
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
        title={isEdit ? 'Modifier le bus' : 'Nouveau bus'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Bus', href: '/admin/buses' },
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
          <Input label="Immatriculation" value={form.registration_number} onChange={(e) => updateField('registration_number', e.target.value)} required />
          <Select
            label="Compagnie"
            value={form.company_id}
            onChange={(e) => updateField('company_id', e.target.value)}
            options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Choisir une compagnie"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Marque" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} />
          <Input label="Modèle" value={form.model} onChange={(e) => updateField('model', e.target.value)} />
          <Input label="Couleur" value={form.color} onChange={(e) => updateField('color', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Nombre de places" type="number" value={form.total_seats} onChange={(e) => updateField('total_seats', e.target.value)} required />
          <Select label="Type de confort" value={form.comfort_type} onChange={(e) => updateField('comfort_type', e.target.value)} options={comfortOptions} />
          <Input label="Année de fabrication" type="number" value={form.manufacture_year} onChange={(e) => updateField('manufacture_year', e.target.value)} />
        </div>
        <Input label="Kilométrage" type="number" value={form.mileage} onChange={(e) => updateField('mileage', e.target.value)} />

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Équipements</p>
          <div className="grid grid-cols-2 gap-3">
            <Toggle label="Climatisation" checked={form.has_ac} onChange={(v) => updateField('has_ac', v)} />
            <Toggle label="WiFi" checked={form.has_wifi} onChange={(v) => updateField('has_wifi', v)} />
            <Toggle label="Prises USB" checked={form.has_usb} onChange={(v) => updateField('has_usb', v)} />
            <Toggle label="Toilettes" checked={form.has_toilet} onChange={(v) => updateField('has_toilet', v)} />
          </div>
        </div>

        <Toggle label="Bus actif" checked={form.is_active} onChange={(v) => updateField('is_active', v)} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/buses')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
