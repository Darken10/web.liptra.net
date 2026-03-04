import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Alert, PageLoader } from '@/components/ui';
import type { UserRole } from '@/types';

const roleOptions = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'admin', label: 'Administrateur Compagnie' },
  { value: 'chef-gare', label: 'Chef de Gare' },
  { value: 'agent', label: 'Agent' },
  { value: 'bagagiste', label: 'Bagagiste' },
  { value: 'super-admin', label: 'Super Administrateur' },
];

const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'pending', label: 'En attente' },
  { value: 'banned', label: 'Banni' },
];

const genderOptions = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'non_binary', label: 'Non-binaire' },
  { value: 'not_specified', label: 'Non précisé' },
];

export default function UserFormPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!userId;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    gender: '',
    status: 'active',
    role: 'user' as UserRole,
  });
  const [error, setError] = useState<string | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await adminApi.users.show(userId);
      const u = res.data.data;
      setForm({
        name: u.name ?? '',
        email: u.email ?? '',
        password: '',
        firstname: u.firstname ?? '',
        lastname: u.lastname ?? '',
        phone: u.phone ?? '',
        gender: u.gender ?? '',
        status: u.status ?? 'active',
        role: (u.role ?? u.roles?.[0] ?? 'user') as UserRole,
      });
      return u;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { ...form };
      if (!payload.password) delete payload.password;
      if (isEdit && userId) {
        return adminApi.users.update(userId, payload);
      }
      return adminApi.users.create(payload);
    },
    onSuccess: () => navigate('/admin/users'),
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
        title={isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Utilisateurs', href: '/admin/users' },
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
          <Input label="Nom d'utilisateur" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Prénom" value={form.firstname} onChange={(e) => updateField('firstname', e.target.value)} />
          <Input label="Nom" value={form.lastname} onChange={(e) => updateField('lastname', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Téléphone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          <Select label="Genre" value={form.gender} onChange={(e) => updateField('gender', e.target.value)} options={genderOptions} placeholder="Sélectionner..." />
        </div>
        {!isEdit && (
          <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Rôle" value={form.role} onChange={(e) => updateField('role', e.target.value)} options={roleOptions} />
          <Select label="Statut" value={form.status} onChange={(e) => updateField('status', e.target.value)} options={statusOptions} />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate('/admin/users')}>Annuler</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
