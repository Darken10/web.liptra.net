import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MessageCircle,
  Heart,
  Megaphone,
  Loader2,
  Share2,
  Building2,
  User,
} from 'lucide-react';
import { announcementApi } from '@/lib/api';
import type { Announcement } from '@/types';
import ImageGrid from '@/components/ui/ImageGrid';

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const dateStr = new Date(
    announcement.published_at ?? announcement.created_at ?? '',
  ).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-200 overflow-hidden">
      {/* Author header */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
        <div className="flex-shrink-0">
          {announcement.company?.logo ? (
            <img
              src={announcement.company.logo}
              alt={announcement.company.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ring-2 ring-gray-100">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {announcement.company && (
              <span className="font-bold text-gray-900 text-[15px] leading-tight">
                {announcement.company.name}
              </span>
            )}
            {announcement.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">
                {announcement.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
            {announcement.author && (
              <>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {announcement.author.firstname} {announcement.author.lastname}
                </span>
                <span>·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dateStr}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {announcement.tags && announcement.tags.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap gap-1.5">
          {announcement.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
                border: `1px solid ${tag.color}30`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <Link to={`/announcements/${announcement.id}`} className="block">
        <div className="px-5 pb-3">
          <h2 className="font-bold text-gray-900 text-lg leading-snug mb-1.5 hover:text-primary-600 transition-colors">
            {announcement.title}
          </h2>
          {announcement.content && (
            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
              {announcement.content}
            </p>
          )}
        </div>

        {/* Images */}
        <ImageGrid
          images={announcement.images ?? []}
          fallbackImage={announcement.image}
          alt={announcement.title}
        />
      </Link>

      {/* Engagement bar */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
            <Heart className="h-4.5 w-4.5" />
            <span className="font-medium">
              {announcement.reactions_count ?? 0}
            </span>
          </span>
          <Link
            to={`/announcements/${announcement.id}`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            <span className="font-medium">
              {announcement.comments_count ?? 0}
            </span>
          </Link>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors cursor-pointer">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">Partager</span>
        </button>
      </div>
    </article>
  );
}

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Actualités
        </h1>
        <p className="text-gray-400 mt-1.5">
          Restez informé des dernières nouvelles et annonces
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)]">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Megaphone className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Aucune actualité
          </h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            Il n'y a pas d'actualités pour le moment. Revenez bientôt !
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
