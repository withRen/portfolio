'use client';

import { useEffect, useRef } from 'react';
import type { Work } from '@/data/content';

type Props = {
  photos: Work[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

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

  const btn =
    'rounded-full border border-white/20 px-5 py-2.5 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]';

  return (
    <dialog
      ref={dialog}
      aria-label="Galerie photo"
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
      <div className="label flex items-center justify-between px-5 py-4 text-zinc-400 md:px-10 md:py-5">
        <span>{index !== null && `${pad(index + 1)} / ${pad(photos.length)}`}</span>
        <button type="button" onClick={() => dialog.current?.close()} className={btn}>
          Fermer
        </button>
      </div>
      <div data-stage="true" className="flex min-h-0 items-center justify-center px-5 md:px-10">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.image}
            alt={`Photographie, ${photo.title.toLowerCase()}`}
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
        )}
      </div>
      <div className="label flex items-center justify-between px-5 py-4 text-zinc-400 md:px-10 md:py-5">
        <span>{photo?.title}</span>
        <div className="flex gap-2">
          <button type="button" aria-label="Photo précédente" onClick={() => go(-1)} className={btn}>
            Préc.
          </button>
          <button type="button" aria-label="Photo suivante" onClick={() => go(1)} className={btn}>
            Suiv.
          </button>
        </div>
      </div>
    </dialog>
  );
}
