'use client';

import { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';

type Props = { id: string | null; title?: string; onClose: () => void };

/** Full-screen player in a native dialog: plays with sound, stops when closed. */
export default function VideoPlayer({ id, title, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (id && !d.open) {
      opener.current = document.activeElement as HTMLElement;
      d.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!id && d.open) d.close();
  }, [id]);

  return (
    <dialog
      ref={dialog}
      aria-label={title ? `Lecture de ${title}` : 'Lecteur vidéo'}
      onClose={() => {
        document.body.style.overflow = '';
        onClose();
        opener.current?.focus({ preventScroll: true });
      }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t === dialog.current || t.dataset.stage) dialog.current?.close();
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-zinc-100 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-6">
        <span className="truncate text-sm text-zinc-300">{title}</span>
        <button
          type="button"
          aria-label="Fermer le lecteur"
          onClick={() => dialog.current?.close()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96]"
        >
          <X size={18} weight="regular" />
        </button>
      </div>
      <div data-stage="true" className="flex min-h-0 flex-1 items-center justify-center px-3 pb-6 md:px-10 md:pb-10">
        {id && (
          <div className="row-in aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10 md:rounded-[2.25rem]">
            <iframe
              title={title ?? 'Vidéo'}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              className="size-full border-0"
            />
          </div>
        )}
      </div>
    </dialog>
  );
}
