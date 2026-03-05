import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  MessageCircle,
  Send,
  ThumbsUp,
  Heart as HeartIcon,
  Laugh,
  Frown,
  Angry,
  Eye,
  Loader2,
  User,
  Building2,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { announcementApi } from '@/lib/api';
import type { Announcement, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import ImageGrid from '@/components/ui/ImageGrid';
import clsx from 'clsx';

const REACTIONS = [
  { type: 'like', icon: ThumbsUp, label: "J'aime", color: 'text-blue-500' },
  { type: 'love', icon: HeartIcon, label: "J'adore", color: 'text-red-500' },
  { type: 'haha', icon: Laugh, label: 'Haha', color: 'text-amber-500' },
  { type: 'wow', icon: Eye, label: 'Wow', color: 'text-purple-500' },
  { type: 'sad', icon: Frown, label: 'Triste', color: 'text-yellow-600' },
  { type: 'angry', icon: Angry, label: 'Grrr', color: 'text-orange-600' },
];

function CommentThread({ comment, announcementId, onReply }: {
  comment: Comment;
  announcementId: string;
  onReply: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSubmitting(true);
    await announcementApi.comment(announcementId, {
      body: replyBody,
      parent_id: comment.id,
    });
    setReplyBody('');
    setShowReply(false);
    setSubmitting(false);
    onReply();
  };

  return (
    <div className="border-l-2 border-primary-100 pl-4">
      <div className="bg-gray-50 rounded-xl p-4 mb-2">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {comment.user.firstname} {comment.user.lastname}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs text-primary-600 mt-2.5 font-medium hover:text-primary-700 transition-colors"
        >
          Répondre
        </button>
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="flex gap-2 mb-3 ml-2">
          <input
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-primary-400 focus:ring-0 outline-none transition-colors"
            placeholder="Votre réponse..."
          />
          <Button size="sm" loading={submitting} type="submit">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}

      {comment.replies?.map((reply) => (
        <CommentThread
          key={reply.id}
          comment={reply}
          announcementId={announcementId}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

export default function AnnouncementDetailPage() {
  const { announcementId } = useParams<{ announcementId: string }>();
  const { user } = useAuth();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncement = () => {
    if (!announcementId) return;
    announcementApi.show(announcementId).then((res) =>
      setAnnouncement(res.data.data),
    );
  };

  useEffect(fetchAnnouncement, [announcementId]);

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !announcementId) return;
    setSubmitting(true);
    await announcementApi.comment(announcementId, { body: commentBody });
    setCommentBody('');
    setSubmitting(false);
    fetchAnnouncement();
  };

  const handleReact = async (type: string) => {
    if (!announcementId) return;
    await announcementApi.react(announcementId, type);
    fetchAnnouncement();
  };

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link
        to="/announcements"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux actualités
      </Link>

      <article className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] overflow-hidden">
        {/* Author header */}
        <div className="px-5 pt-5 pb-3 flex items-start gap-3">
          <div className="flex-shrink-0">
            {announcement.company?.logo ? (
              <img
                src={announcement.company.logo}
                alt={announcement.company.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ring-2 ring-gray-100">
                <Building2 className="h-5 w-5 text-primary-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {announcement.company && (
                <span className="font-bold text-gray-900 text-base">
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
                {new Date(
                  announcement.published_at ?? announcement.created_at ?? '',
                ).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
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

        {/* Title & Content */}
        <div className="px-5 pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
            {announcement.title}
          </h1>
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-line text-gray-600 leading-relaxed text-[15px]">
              {announcement.content}
            </p>
          </div>
        </div>

        {/* Images */}
        <ImageGrid
          images={announcement.images ?? []}
          fallbackImage={announcement.image}
          alt={announcement.title}
        />

        {/* Reactions bar */}
        <div className="px-5 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {REACTIONS.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => handleReact(type)}
                className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer',
                  'border-gray-100 text-gray-500 hover:bg-gray-50',
                  'active:scale-95',
                )}
                title={label}
              >
                <Icon className={clsx('h-4 w-4', color)} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Engagement summary */}
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <HeartIcon className="h-4 w-4 text-red-400" />
              <span className="font-medium">{announcement.reactions?.length ?? 0} réactions</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary-400" />
              <span className="font-medium">{announcement.comments?.length ?? 0} commentaires</span>
            </span>
          </div>
          <button className="flex items-center gap-1.5 hover:text-primary-600 transition-colors cursor-pointer">
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium">Partager</span>
          </button>
        </div>
      </article>

      {/* Comments section */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-soft)] p-5">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2.5 text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-primary-600" />
          </div>
          Commentaires
          {announcement.comments && (
            <span className="text-sm text-gray-400 font-normal ml-1">
              ({announcement.comments.length})
            </span>
          )}
        </h3>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="flex-1 rounded-full border-2 border-gray-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-0 outline-none transition-colors hover:border-gray-300 bg-gray-50"
              placeholder="Écrire un commentaire..."
            />
            <Button loading={submitting} type="submit" className="rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}

        {announcement.comments && announcement.comments.length > 0 ? (
          <div className="space-y-3">
            {announcement.comments.map((c) => (
              <CommentThread
                key={c.id}
                comment={c}
                announcementId={announcement.id}
                onReply={fetchAnnouncement}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              Soyez le premier à commenter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
