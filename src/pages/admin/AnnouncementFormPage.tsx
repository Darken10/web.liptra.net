import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Textarea, Toggle, Alert, PageLoader } from '@/components/ui';
import type { Company } from '@/types';

export default function AnnouncementFormPage() {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!announcementId;

  const [form, setForm] = useState({
    title: '',
    content: '',
    image: '',
    company_id: '',
    is_published: false,
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
    queryKey: ['admin', 'announcements', announcementId],
    queryFn: async () => {
      if (!announcementId) return null;
      const res = await adminApi.announcements.show(announcementId);
      const a = res.data.data;
      setForm({
        title: a.title ?? '',
        content: a.content ?? '',
        image: a.image ?? '',
        company_id: a.company?.id ?? '',
        is_published: a.is_published ?? false,
      });
      return a;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, image: form.image || null };
      if (isEdit && announcementId) {
        return adminApi.announcements.update(announcementId, payload);
      }
      return adminApi.announcements.create(payload);
    },
    onSuccess: () => navigate('/admin/announcements'),
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
        title={isEdit ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Annonces', href: '/admin/announcements' },
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
        <Input label="Titre" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
        <Textarea label="Contenu" value={form.content} onChange={(e) => updateField('content', e.target.value)} rows={8} required />
        <Input label="URL de l'image" value={form.image} onChange={(e) => updateField('image', e.target.value)} placeholder="https://..." />
        <Toggle
          label="Publier immédiatement"
          description="L'annonce sera visible par tous les utilisateurs"
          checked={form.is_published}
          onChange={(v) => updateField('is_published', v)}
        />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/announcements')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
