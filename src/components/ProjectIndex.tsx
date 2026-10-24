'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { ArrowRight, ArrowUpRight, X } from '@phosphor-icons/react';
import { featured, type Featured } from '@/data/content';

/*
 * Typographic project index (inspired by Awwwards SOTD dev portfolios such as dennissnellenberg.com):
 * - big names, the others dim when one is hovered;
 * - a rounded preview follows the cursor and slides between project images;
 * - a click opens a full-screen case study, the image morphing into place (View Transitions API).
 * Touch screens get the image inline in each row instead of the cursor preview.
 */

const HERO = 'pj-hero';

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown };

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white/[0.07] px-3 py-1.5 font-mono text-xs text-zinc-300 ring-1 ring-white/10">
      {children}
    </span>
  );
}

export default function ProjectIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const shown = useRef(false);

  // Cursor-follow preview, eased in a rAF loop that only runs while it is visible or settling
  const tick = () => {
    const el = preview.current;
    if (!el) return;
    const t = target.current;
    const p = pos.current;
    p.x += (t.x - p.x) * 0.14;
    p.y += (t.y - p.y) * 0.14;
    const tilt = Math.max(-8, Math.min(8, (t.x - p.x) * 0.05));
    el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg) scale(${shown.current ? 1 : 0.6})`;
    raf.current = shown.current || Math.abs(t.x - p.x) + Math.abs(t.y - p.y) > 0.5 ? requestAnimationFrame(tick) : null;
  };

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const onMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  const onEnterList = (e: React.PointerEvent) => {
    if (!finePointer()) return;
    pos.current = { x: e.clientX, y: e.clientY };
    target.current = { ...pos.current };
    shown.current = true;
    if (preview.current) preview.current.style.opacity = '1';
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  const onLeaveList = () => {
    shown.current = false;
    setHovered(null);
    if (preview.current) preview.current.style.opacity = '0';
  };

  const openCase = (i: number) => {
    opener.current = document.activeElement as HTMLElement;
    const doc = document as DocWithVT;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const img = preview.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    const show = () => {
      flushSync(() => setOpen(i));
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    };
    if (doc.startViewTransition && !reduce && img && shown.current) {
      // The preview image becomes the case-study hero
      img.style.viewTransitionName = HERO;
      doc.startViewTransition(() => {
        img.style.viewTransitionName = '';
        show();
      });
    } else {
      show();
    }
  };

  const closeCase = () => dialog.current?.close();
  const p: Featured | null = open !== null ? featured[open] : null;
  const next = open !== null ? (open + 1) % featured.length : 0;

  return (
    <>
      <ol
        className="pi-list mt-12 md:mt-20"
        onPointerEnter={onEnterList}
        onPointerMove={onMove}
        onPointerLeave={onLeaveList}
      >
        {featured.map((f, i) => {
          const dim = hovered !== null && hovered !== i;
          return (
            <li key={f.id} className="border-t border-white/10 last:border-b">
              <button
                type="button"
                onClick={() => openCase(i)}
                onPointerEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                aria-haspopup="dialog"
                className={`group grid w-full grid-cols-1 items-end gap-4 py-7 text-left transition-opacity duration-500 ease-out-expo md:grid-cols-12 md:gap-6 md:py-9 ${
                  dim ? 'md:opacity-30' : 'opacity-100'
                }`}
              >
                <span className="block overflow-hidden md:col-span-8">
                  <span className="pi-line block font-display text-[13vw] font-bold uppercase leading-[0.85] tracking-tight text-zinc-50 transition-transform duration-700 ease-out-expo group-hover:translate-x-4 md:text-[6.4vw] 2xl:text-[6rem]">
                    {f.title}
                  </span>
                </span>
                {/* Touch screens: the image lives in the row */}
                <span className="block aspect-[16/10] overflow-hidden rounded-[1.25rem] ring-1 ring-white/10 [@media(hover:hover)_and_(pointer:fine)]:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.cover} alt="" loading="lazy" className="size-full object-cover" />
                </span>
                <span className="flex items-end justify-between gap-6 md:col-span-4">
                  <span className="min-w-0">
                    <span className="block text-sm text-zinc-300">{f.tagline}</span>
                    <span className="mt-1 block font-mono text-xs text-zinc-500">{f.stack.join(', ')}</span>
                  </span>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-[background-color,color,border-color,transform] duration-500 ease-out-expo group-hover:-rotate-45 group-hover:border-zinc-50 group-hover:bg-zinc-50 group-hover:text-zinc-950">
                    <ArrowRight size={18} weight="regular" aria-hidden />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Cursor preview: a vertical track of covers, slid to the hovered project */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden aspect-[16/10] w-[min(30vw,28rem)] overflow-hidden rounded-[1.25rem] opacity-0 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/15 transition-opacity duration-300 [will-change:transform] [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ transform: 'translate3d(-999px,-999px,0)' }}
      >
        <div
          className="h-full transition-transform duration-700 ease-out-expo"
          style={{ transform: `translateY(${-(hovered ?? 0) * 100}%)` } as CSSProperties}
        >
          {featured.map((f, i) => (
            <div key={f.id} data-i={i} className="h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.cover}
                alt=""
                className={`size-full object-cover transition-transform duration-1000 ease-out-expo ${hovered === i ? 'scale-100' : 'scale-125'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Case study */}
      <dialog
        ref={dialog}
        aria-label={p ? p.title : 'Projet'}
        onClose={() => {
          setOpen(null);
          document.body.style.overflow = '';
          opener.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === dialog.current) closeCase();
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto bg-transparent p-0 text-zinc-100"
      >
        {p && (
          <div key={p.id} className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 md:px-8 md:pt-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeCase}
                aria-label="Fermer le projet"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96]"
              >
                <X size={18} weight="regular" />
              </button>
            </div>

            <div
              className="mt-4 aspect-[16/9] max-h-[68dvh] w-full overflow-hidden rounded-[1.75rem] bg-zinc-900 ring-1 ring-white/10 md:rounded-[2.25rem]"
              style={{ viewTransitionName: HERO } as CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover} alt={`Aperçu de ${p.title}`} className="size-full object-cover" />
            </div>

            <div className="row-in mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-12 md:gap-6">
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
                    <Chip key={s}>{s}</Chip>
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
                        className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
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
                flushSync(() => setOpen(next));
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
    </>
  );
}
