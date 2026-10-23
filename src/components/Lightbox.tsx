'use client';

import { useEffect, useRef } from 'react';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import type { Photo } from '@/data/content';

type Props = {
  photos: Photo[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const btn =
  'inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96]';

export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (isOpen && !d.open) {
      opener.current = document.activeElement as HTMLElement;
      d.showModal();
    }
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const photo = index !== null ? photos[index] : null;
  const go = (delta: number) => {
    if (index === null) return;
    onIndex((index + delta + photos.length) % photos.length);
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Photo en plein écran"
      onClose={() => {
        onClose();
        opener.current?.focus({ preventScroll: true });
      }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === dialog.current || t.dataset.stage) dialog.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-zinc-100 open:grid open:grid-rows-[auto_1fr_auto]"
    >
      <div className="flex justify-end px-5 py-4 md:px-10 md:py-6">
        <button type="button" aria-label="Fermer" onClick={() => dialog.current?.close()} className={btn}>
          <X size={18} weight="regular" />
        </button>
      </div>
      <div data-stage="true" className="flex min-h-0 items-center justify-center px-5 md:px-16">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.image}
            alt={`Photographie, ${photo.title.toLowerCase()}`}
            className="max-h-full max-w-full rounded-[1.75rem] object-contain"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-6">
        <span className="text-sm text-zinc-300">{photo?.title}</span>
        <div className="flex gap-2">
          <button type="button" aria-label="Photo précédente" onClick={() => go(-1)} className={btn}>
            <CaretLeft size={18} weight="regular" />
          </button>
          <button type="button" aria-label="Photo suivante" onClick={() => go(1)} className={btn}>
            <CaretRight size={18} weight="regular" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
