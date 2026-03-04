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
} from 'lucide-react';
import { announcementApi } from '@/lib/api';
import type { Announcement, Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

const REACTIONS = [
  { type: 'like', icon: ThumbsUp, label: "J'aime" },
  { type: 'love', icon: HeartIcon, label: "J'adore" },
  { type: 'haha', icon: Laugh, label: 'Haha' },
  { type: 'wow', icon: Eye, label: 'Wow' },
  { type: 'sad', icon: Frown, label: 'Triste' },
  { type: 'angry', icon: Angry, label: 'Grrr' },
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
    <div className="border-l-2 border-gray-100 pl-4">
      <div className="bg-gray-50 rounded-lg p-3 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
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
        <p className="text-sm text-gray-700">{comment.body}</p>
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs text-primary-600 mt-2 hover:underline"
        >
          Répondre
        </button>
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="flex gap-2 mb-3">
          <input
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
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
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {announcement.image && (
        <img
          src={announcement.image}
          alt={announcement.title}
          className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {announcement.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <Calendar className="h-4 w-4" />
        {new Date(
          announcement.published_at ?? announcement.created_at ?? '',
        ).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        {announcement.author && (
          <span>
            par{' '}
            <strong>
              {announcement.author.firstname} {announcement.author.lastname}
            </strong>
          </span>
        )}
      </div>

      <div className="prose prose-gray max-w-none mb-8">
        <p className="whitespace-pre-line text-gray-700">
          {announcement.content}
        </p>
      </div>

      {/* Reactions */}
      <div className="border-t border-b py-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {REACTIONS.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => handleReact(type)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition',
                'hover:bg-primary-50 hover:border-primary-300',
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Commentaires
          {announcement.comments && (
            <span className="text-sm text-gray-400 font-normal">
              ({announcement.comments.length})
            </span>
          )}
        </h3>

        {user && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
              placeholder="Écrire un commentaire..."
            />
            <Button loading={submitting} type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}

        {announcement.comments && announcement.comments.length > 0 ? (
          <div className="space-y-4">
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
          <p className="text-sm text-gray-400">
            Aucun commentaire pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
