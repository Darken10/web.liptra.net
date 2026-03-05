import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Heart, Megaphone, Loader2 } from 'lucide-react';
import { announcementApi } from '@/lib/api';
import type { Announcement } from '@/types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementApi.list().then((res) => {
      setAnnouncements(res.data.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Chargement des actualités…</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Actualités</h1>
        <p className="text-gray-400 mt-1">
          Restez informé des dernières nouvelles et annonces
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)]">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune actualité</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            Il n'y a pas d'actualités pour le moment. Revenez bientôt !
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {announcements.map((a) => (
            <Link
              key={a.id}
              to={`/announcements/${a.id}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {a.image ? (
                <div className="relative overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              ) : (
                <div className="h-32 gradient-hero flex items-center justify-center">
                  <Megaphone className="h-10 w-10 text-white/40" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-bold text-gray-900 group-hover:text-primary-600 transition line-clamp-2 mb-2 text-lg">
                  {a.title}
                </h2>
                {a.content && (
                  <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                    {a.content}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(a.published_at ?? a.created_at ?? '').toLocaleDateString(
                      'fr-FR',
                      { day: 'numeric', month: 'short', year: 'numeric' },
                    )}
                  </span>
                  {a.comments_count !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {a.comments_count}
                    </span>
                  )}
                  {a.reactions_count !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5" />
                      {a.reactions_count}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
