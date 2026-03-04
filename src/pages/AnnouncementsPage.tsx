import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, Heart } from 'lucide-react';
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
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Actualités</h1>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Aucune actualité pour le moment
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {announcements.map((a) => (
            <Link
              key={a.id}
              to={`/announcements/${a.id}`}
              className="group bg-white rounded-xl border overflow-hidden hover:shadow-md transition"
            >
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="font-semibold text-gray-900 group-hover:text-primary-600 transition line-clamp-2 mb-2">
                  {a.title}
                </h2>
                {a.content && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                    {a.content}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(a.published_at ?? a.created_at ?? '').toLocaleDateString(
                      'fr-FR',
                      { day: 'numeric', month: 'short', year: 'numeric' },
                    )}
                  </span>
                  {a.comments_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {a.comments_count}
                    </span>
                  )}
                  {a.reactions_count !== undefined && (
                    <span className="flex items-center gap-1">
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
