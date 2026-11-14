'use client';

import { useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { useI18n } from '@/i18n/context';
import { allowsYouTube, setYouTubeConsent, useYouTubeConsent } from '@/lib/consent';

/*
 * Panneau « Cookies et confidentialité » : le site n'a qu'un seul service optionnel
 * (YouTube). Le visiteur peut retirer son accord aussi facilement qu'il l'a donné.
 */
export default function PrivacySettings({ className = '' }: { className?: string }) {
  const { t, href } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const consent = useYouTubeConsent();
  const on = allowsYouTube(consent);

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className={className}>
        {t.privacy.button}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="privacy-title"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-[min(34rem,calc(100%-2.5rem))] rounded-[1.75rem] bg-zinc-900 p-0 text-zinc-100 ring-1 ring-white/10 backdrop:bg-zinc-950/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="privacy-title" className="text-xl font-semibold tracking-tight">
              {t.privacy.button}
            </h2>
            <button
              type="button"
              aria-label={t.privacy.close}
              onClick={() => dialog.current?.close()}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:bg-white/10 hover:text-zinc-50"
            >
              <X size={16} aria-hidden />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300">
            {t.privacy.intro}
          </p>

          <div className="flex items-start justify-between gap-6 rounded-2xl border border-white/10 p-4">
            <div>
              <p id="yt-label" className="font-medium">
                {t.privacy.ytLabel}
              </p>
              <p id="yt-desc" className="mt-1 text-sm leading-relaxed text-zinc-400">
                {t.privacy.ytDesc}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-labelledby="yt-label"
              aria-describedby="yt-desc"
              onClick={() => setYouTubeConsent(on ? 'denied' : 'granted')}
              className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                on ? 'bg-accent' : 'bg-zinc-700'
              }`}
            >
              <span
                aria-hidden
                className={`absolute top-1 size-5 rounded-full bg-zinc-50 transition-transform duration-300 ${
                  on ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            {t.privacy.stored}{' '}
            <a href={href('privacy')} className="text-zinc-200 underline underline-offset-4 hover:text-zinc-50">
              {t.privacy.policy}
            </a>
          </p>
        </div>
      </dialog>
    </>
  );
}
