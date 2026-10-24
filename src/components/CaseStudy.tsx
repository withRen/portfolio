'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, X } from '@phosphor-icons/react';
import { featured } from '@/data/content';

type Props = { index: number | null; onIndex: (i: number) => void; onClose: () => void };

/** Full-screen case study for a featured project, in a native dialog. */
export default function CaseStudy({ index, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (isOpen && !d.open) {
      opener.current = document.activeElement as HTMLElement;
      d.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const p = index !== null ? featured[index] : null;
  const next = index !== null ? (index + 1) % featured.length : 0;
  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-label={p ? p.title : 'Projet'}
      onClose={() => {
        document.body.style.overflow = '';
        onClose();
        opener.current?.focus({ preventScroll: true });
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto bg-transparent p-0 text-zinc-100"
    >
      {p && (
        <div key={p.id} className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 md:px-8 md:pt-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={close}
              aria-label="Fermer le projet"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96]"
            >
              <X size={18} weight="regular" />
            </button>
          </div>

          <div className="row-in mt-4 aspect-[16/9] max-h-[68dvh] w-full overflow-hidden rounded-[1.75rem] bg-zinc-900 ring-1 ring-white/10 md:rounded-[2.25rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt={`Aperçu de ${p.title}`} className="size-full object-cover" />
          </div>

          <div className="row-in mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-12 md:gap-6" style={{ '--i': 1 } as CSSProperties}>
            <div className="md:col-span-7">
              <p className="text-sm text-zinc-400">{p.context}</p>
              <h2 className="mt-3 font-display text-6xl font-bold uppercase leading-[0.86] tracking-tight text-zinc-50 md:text-8xl">
                {p.title}
              </h2>
              <p className="mt-5 text-xl font-medium tracking-tight text-zinc-100 md:text-2xl">{p.tagline}</p>
            </div>
            <div className="flex flex-col gap-6 md:col-span-5 md:pt-8">
              <p className="leading-relaxed text-zinc-300">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full bg-white/[0.07] px-3 py-1.5 font-mono text-xs text-zinc-300 ring-1 ring-white/10">
                    {s}
                  </span>
                ))}
              </div>
              {p.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.links.map((l, i) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
                        i === 0
                          ? 'bg-zinc-50 text-zinc-950'
                          : 'border border-white/20 bg-white/5 text-zinc-100 backdrop-blur-md hover:bg-white/15'
                      }`}
                    >
                      {l.label}
                      <ArrowUpRight size={14} weight="regular" aria-hidden />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {p.extra && (
            <div className="row-in mt-14 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10" style={{ '--i': 2 } as CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.extra} alt={`Autre vue de ${p.title}`} loading="lazy" className="w-full" />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onIndex(next);
              dialog.current?.scrollTo({ top: 0 });
            }}
            className="group mt-16 flex w-full items-end justify-between gap-6 border-t border-white/10 pt-8 text-left"
          >
            <span>
              <span className="block text-sm text-zinc-400">Projet suivant</span>
              <span className="mt-2 block font-display text-4xl font-bold uppercase leading-none tracking-tight text-zinc-50 transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:text-6xl">
                {featured[next].title}
              </span>
            </span>
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors duration-300 group-hover:bg-zinc-50 group-hover:text-zinc-950">
              <ArrowRight size={18} weight="regular" aria-hidden />
            </span>
          </button>
        </div>
      )}
    </dialog>
  );
}
