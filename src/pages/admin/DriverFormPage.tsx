import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Toggle, Alert, PageLoader } from '@/components/ui';
import type { Company } from '@/types';

const licenseTypeOptions = [
  { value: 'B', label: 'B - Véhicule léger' },
  { value: 'C', label: 'C - Poids lourd' },
  { value: 'D', label: 'D - Transport en commun' },
  { value: 'E', label: 'E - Remorque' },
];

export default function DriverFormPage() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!driverId;

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    company_id: '',
    license_number: '',
    license_type: 'D',
    license_expiry: '',
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
    queryKey: ['admin', 'drivers', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const res = await adminApi.drivers.show(driverId);
      const d = res.data.data;
      setForm({
        firstname: d.firstname ?? '',
        lastname: d.lastname ?? '',
        phone: d.phone ?? '',
        company_id: d.company?.id ?? '',
        license_number: d.license_number ?? '',
        license_type: d.license_type ?? 'D',
        license_expiry: d.license_expiry?.split('T')[0] ?? '',
        is_active: d.is_active ?? true,
      });
      return d;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, license_expiry: form.license_expiry || null };
      if (isEdit && driverId) {
        return adminApi.drivers.update(driverId, payload);
      }
      return adminApi.drivers.create(payload);
    },
    onSuccess: () => navigate('/admin/drivers'),
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
        title={isEdit ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Chauffeurs', href: '/admin/drivers' },
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
          <Input label="Prénom" value={form.firstname} onChange={(e) => updateField('firstname', e.target.value)} required />
          <Input label="Nom" value={form.lastname} onChange={(e) => updateField('lastname', e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Téléphone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
          <Select
            label="Compagnie"
            value={form.company_id}
            onChange={(e) => updateField('company_id', e.target.value)}
            options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Choisir une compagnie"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="N° de permis" value={form.license_number} onChange={(e) => updateField('license_number', e.target.value)} required />
          <Select label="Type de permis" value={form.license_type} onChange={(e) => updateField('license_type', e.target.value)} options={licenseTypeOptions} />
          <Input label="Date d'expiration" type="date" value={form.license_expiry} onChange={(e) => updateField('license_expiry', e.target.value)} />
        </div>
        <Toggle label="Chauffeur actif" checked={form.is_active} onChange={(v) => updateField('is_active', v)} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/drivers')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
