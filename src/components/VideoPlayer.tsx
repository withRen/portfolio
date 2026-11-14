'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, X } from '@phosphor-icons/react';
import { useI18n } from '@/i18n/context';
import { allowsYouTube, setYouTubeConsent, useYouTubeConsent } from '@/lib/consent';

type Props = { id: string | null; title?: string; onClose: () => void };

/*
 * Tant que le visiteur n'a pas accepté YouTube, on affiche la miniature locale et un
 * message clair au lieu de l'iframe : rien n'est envoyé à Google avant le clic.
 * Accepter et refuser demandent le même effort (recommandation CNIL).
 */
function YouTubeGate({ id, title }: { id: string; title?: string }) {
  const { t, href } = useI18n();
  const [remember, setRemember] = useState(false);
  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-5 overflow-hidden p-6 text-center md:p-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/films/${id}.jpg`} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-30 blur-sm" />
      <p className="max-w-[46ch] text-sm leading-relaxed text-zinc-200 md:text-base">
        {t.gate.text}{' '}
        <a href={href('privacy')} className="underline underline-offset-4 hover:text-zinc-50">
          {t.gate.more}
        </a>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setYouTubeConsent('granted', remember)}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Play size={16} weight="fill" aria-hidden />
          {t.gate.playHere}
        </button>
        <a
          href={`https://youtu.be/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
        >
          {t.gate.openYouTube}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-zinc-50" />
        {t.gate.remember}
      </label>
      <span className="sr-only">{title}</span>
    </div>
  );
}

/** Full-screen player in a native dialog: plays with sound, stops when closed. */
export default function VideoPlayer({ id, title, onClose }: Props) {
  const { t } = useI18n();
  const consent = useYouTubeConsent();
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
      aria-label={title ? t.video.player(title) : t.video.playerFallback}
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
          aria-label={t.video.closePlayer}
          onClick={() => dialog.current?.close()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96]"
        >
          <X size={18} weight="regular" />
        </button>
      </div>
      <div data-stage="true" className="flex min-h-0 flex-1 items-center justify-center px-3 pb-6 md:px-10 md:pb-10">
        {id && (
          <div className="row-in aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10 md:rounded-[2.25rem]">
            {allowsYouTube(consent) ? (
              <iframe
                title={title ?? t.video.iframe}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                className="size-full border-0"
              />
            ) : (
              <YouTubeGate id={id} title={title} />
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
