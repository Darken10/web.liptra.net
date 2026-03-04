import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Textarea, Alert, PageLoader } from '@/components/ui';

export default function CompanyFormPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!companyId;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['admin', 'companies', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      const res = await adminApi.companies.show(companyId);
      const c = res.data.data;
      setForm({
        name: c.name ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        address: c.address ?? '',
        description: c.description ?? '',
      });
      return c;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEdit && companyId) {
        return adminApi.companies.update(companyId, form);
      }
      return adminApi.companies.create(form);
    },
    onSuccess: () => navigate('/admin/companies'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? 'Modifier la compagnie' : 'Nouvelle compagnie'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Compagnies', href: '/admin/companies' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert variant="danger" dismissible onDismiss={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <Input label="Nom de la compagnie" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
          <Input label="Téléphone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
        </div>
        <Input label="Adresse" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
        <Textarea label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/companies')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
