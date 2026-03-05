import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnnouncementImage } from '@/types';

interface ImageGridProps {
  images: AnnouncementImage[];
  fallbackImage?: string | null;
  alt?: string;
  maxVisible?: number;
}

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: { url: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const goPrev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const goNext = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm transition cursor-pointer"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <img
        src={images[index].url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default function ImageGrid({ images, fallbackImage, alt = '', maxVisible = 4 }: ImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = images.length > 0
    ? images
    : fallbackImage
      ? [{ id: 'fallback', url: fallbackImage, order: 0 }]
      : [];

  if (allImages.length === 0) return null;

  const visible = allImages.slice(0, maxVisible);
  const remaining = allImages.length - maxVisible;

  return (
    <>
      <div
        className={`grid gap-1 rounded-xl overflow-hidden ${
          visible.length === 1
            ? 'grid-cols-1'
            : visible.length === 2
              ? 'grid-cols-2'
              : visible.length === 3
                ? 'grid-cols-2 grid-rows-2'
                : 'grid-cols-2 grid-rows-2'
        }`}
      >
        {visible.map((img, i) => (
          <button
            key={img.id}
            className={`relative overflow-hidden cursor-pointer group ${
              visible.length === 3 && i === 0 ? 'row-span-2' : ''
            }`}
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={img.url}
              alt={alt}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                visible.length === 1
                  ? 'h-80 sm:h-96'
                  : visible.length === 2
                    ? 'h-64'
                    : visible.length === 3 && i === 0
                      ? 'h-full min-h-64'
                      : 'h-48'
              }`}
            />
            {i === maxVisible - 1 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white text-3xl font-bold">+{remaining}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
