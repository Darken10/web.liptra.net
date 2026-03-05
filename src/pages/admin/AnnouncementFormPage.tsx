import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Input, Select, Textarea, Toggle, Alert, PageLoader } from '@/components/ui';
import type { Company, Tag, AnnouncementImage } from '@/types';
import { X, Upload, ImagePlus, Plus, Check } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Aucune catégorie' },
  { value: 'Info Trafic', label: 'Info Trafic' },
  { value: 'Promotion', label: 'Promotion' },
  { value: 'Événement', label: 'Événement' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Sécurité', label: 'Sécurité' },
  { value: 'Général', label: 'Général' },
];

function TagSelector({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366f1');
  const [creating, setCreating] = useState(false);

  const { data: tags = [], refetch } = useQuery({
    queryKey: ['admin', 'tags'],
    queryFn: async () => {
      const res = await adminApi.tags.list();
      return res.data.data as Tag[];
    },
  });

  const toggleTag = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((t) => t !== id)
        : [...selectedIds, id],
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setCreating(true);
    const res = await adminApi.tags.create({
      name: newTagName.trim(),
      color: newTagColor,
    });
    const newTag = res.data.data as Tag;
    onChange([...selectedIds, newTag.id]);
    setNewTagName('');
    setShowCreate(false);
    setCreating(false);
    refetch();
  };

  const PRESET_COLORS = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => {
          const isSelected = selectedIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border-2 transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor: isSelected ? `${tag.color}20` : 'transparent',
                borderColor: isSelected ? tag.color : '#e5e7eb',
                color: isSelected ? tag.color : '#6b7280',
              }}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              {tag.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouveau
        </button>
      </div>

      {showCreate && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nom du tag..."
            className="flex-1 text-sm rounded-lg border border-gray-200 px-3 py-2 focus:border-primary-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <div className="flex gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewTagColor(c)}
                className="w-6 h-6 rounded-full border-2 transition-transform cursor-pointer"
                style={{
                  backgroundColor: c,
                  borderColor: newTagColor === c ? '#1f2937' : 'transparent',
                  transform: newTagColor === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleCreateTag}
            loading={creating}
            type="button"
          >
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}

interface ImageFile {
  id: string;
  file?: File;
  preview: string;
  existing?: boolean;
  existingId?: string;
}

function ImageUploader({
  images,
  onChange,
}: {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageFile[] = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        }));
      onChange([...images, ...newImages]);
    },
    [images, onChange],
  );

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img && !img.existing) {
      URL.revokeObjectURL(img.preview);
    }
    onChange(images.filter((i) => i.id !== id));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images <span className="text-gray-400 font-normal">(optionnel, max 10)</span>
      </label>

      {/* Current images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
            >
              <img
                src={img.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {isDragging ? (
            <ImagePlus className="h-8 w-8 text-primary-400" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <p className="text-sm font-medium text-gray-600">
            {isDragging
              ? 'Déposez les images ici'
              : 'Glissez-déposez vos images ou cliquez pour parcourir'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 5 Mo par image</p>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementFormPage() {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!announcementId;

  const [form, setForm] = useState({
    title: '',
    content: '',
    company_id: '',
    category: '',
    is_published: false,
  });
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
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
        company_id: a.company?.id ?? '',
        category: a.category ?? '',
        is_published: a.is_published ?? false,
      });
      setTagIds((a.tags ?? []).map((t: Tag) => t.id));
      const existingImages: ImageFile[] = (a.images ?? []).map((img: AnnouncementImage) => ({
        id: img.id,
        preview: img.url,
        existing: true,
        existingId: img.id,
      }));
      setImageFiles(existingImages);
      return a;
    },
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('company_id', form.company_id);
      if (form.category) {
        formData.append('category', form.category);
      }
      formData.append('is_published', form.is_published ? '1' : '0');

      tagIds.forEach((id) => formData.append('tag_ids[]', id));

      const newFiles = imageFiles.filter((img) => !img.existing && img.file);
      newFiles.forEach((img) => {
        formData.append('images[]', img.file!);
      });

      if (isEdit && announcementId) {
        removedImageIds.forEach((id) => formData.append('remove_image_ids[]', id));
        formData.append('_method', 'PUT');
        return adminApi.announcements.update(announcementId, formData);
      }
      return adminApi.announcements.create(formData);
    },
    onSuccess: () => navigate('/admin/announcements'),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? 'Erreur lors de la sauvegarde');
    },
  });

  const updateField = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageChange = (newImages: ImageFile[]) => {
    const removed = imageFiles.filter(
      (old) =>
        old.existing && !newImages.find((n) => n.id === old.id),
    );
    setRemovedImageIds((prev) => [
      ...prev,
      ...removed.filter((r) => r.existingId).map((r) => r.existingId!),
    ]);
    setImageFiles(newImages);
  };

  if (isEdit && isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={isEdit ? "Modifier l'annonce" : 'Nouvelle annonce'}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Annonces', href: '/admin/announcements' },
          { label: isEdit ? 'Modifier' : 'Créer' },
        ]}
      />

      {error && (
        <Alert
          variant="danger"
          dismissible
          onDismiss={() => setError(null)}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Select
            label="Compagnie"
            value={form.company_id}
            onChange={(e) => updateField('company_id', e.target.value)}
            options={(companies ?? []).map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            placeholder="Choisir une compagnie"
          />
          <Select
            label="Catégorie"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            options={CATEGORIES}
          />
        </div>

        <Input
          label="Titre"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          required
        />

        <Textarea
          label="Contenu"
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          rows={8}
          required
        />

        <TagSelector selectedIds={tagIds} onChange={setTagIds} />

        <ImageUploader images={imageFiles} onChange={handleImageChange} />

        <Toggle
          label="Publier immédiatement"
          description="L'annonce sera visible par tous les utilisateurs"
          checked={form.is_published}
          onChange={(v) => updateField('is_published', v)}
        />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/announcements')}
          >
            Annuler
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
