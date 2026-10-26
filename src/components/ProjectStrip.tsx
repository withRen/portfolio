'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { featured } from '@/data/content';

/*
 * Project strip (after aristidebenoist.com, Awwwards SOTD):
 * - a row of narrow black and white slices that pans sideways with the scroll (CSS
 *   scroll-driven, globals.css .ab-*); the hovered slice turns to colour;
 * - a click opens the project: the slice morphs into a large centred image (View
 *   Transitions API), a giant title sits over it, neighbours wait as slices on the edges.
 */

type DocVT = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

const TICKS = 36;

function Ruler({ active, total }: { active: number | null; total: number }) {
  return (
    <div aria-hidden className="flex items-end gap-[5px]">
      {Array.from({ length: TICKS }, (_, k) => {
        const on = active !== null && Math.round((active / Math.max(1, total - 1)) * (TICKS - 1)) === k;
        return (
          <span
            key={k}
            className={`block w-px transition-[height,background-color] duration-500 ease-out-expo ${
              on ? 'h-4 bg-zinc-50' : 'h-2.5 bg-zinc-600'
            }`}
          />
        );
      })}
    </div>
  );
}

export default function ProjectStrip() {
  const n = featured.length;
  const [hovered, setHovered] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const slices = useRef<(HTMLImageElement | null)[]>([]);

  const vt = (update: () => void) => {
    const doc = document as DocVT;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) {
      update();
      return;
    }
    doc.startViewTransition(update);
  };

  const openProject = (i: number) => {
    const slice = slices.current[i];
    if (slice) slice.style.viewTransitionName = 'ab-hero';
    vt(() => {
      if (slice) slice.style.viewTransitionName = '';
      flushSync(() => setOpen(i));
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    });
  };

  const closeProject = () => {
    const i = open;
    vt(() => {
      flushSync(() => setOpen(null));
      dialog.current?.close();
      if (i !== null && slices.current[i]) slices.current[i]!.style.viewTransitionName = 'ab-hero';
    });
    // Clear the name once the morph is done so the next opening can reuse it
    setTimeout(() => {
      if (i !== null && slices.current[i]) slices.current[i]!.style.viewTransitionName = '';
    }, 900);
  };

  const go = (delta: number) => {
    if (open === null) return;
    vt(() => flushSync(() => setOpen((open + delta + n) % n)));
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeProject();
    };
    d.addEventListener('cancel', onCancel);
    return () => d.removeEventListener('cancel', onCancel);
  });

  const p = open !== null ? featured[open] : null;
  const prev = open !== null ? featured[(open - 1 + n) % n] : null;
  const next = open !== null ? featured[(open + 1) % n] : null;
  const shown = featured[hovered];

  // Touch screens have no hover: the slice closest to the centre of the screen is the active one
  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf: number | null = null;
    const pick = () => {
      raf = null;
      const mid = window.innerWidth / 2;
      let best = 0;
      let dist = Infinity;
      slices.current.forEach((img, i) => {
        const r = img?.parentElement?.getBoundingClientRect();
        if (!r) return;
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setHovered((h) => (h === best ? h : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="ab-section relative">
        <div className="ab-stage relative h-[100dvh] overflow-hidden">
          <div className="absolute inset-x-0 top-8 flex justify-center md:top-10">
            <div className="ab-ruler">
              <Ruler active={null} total={n} />
            </div>
          </div>

          <ul
            className="ab-strip absolute flex gap-[1vw]"
          >
            {featured.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => openProject(i)}
                  onPointerEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  aria-label={`Ouvrir ${f.title}`}
                  data-active={i === hovered}
                  className="group relative block h-[46dvh] w-[26vw] overflow-hidden bg-zinc-900 md:h-[48dvh] md:w-[10.5vw]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={(el) => {
                      slices.current[i] = el;
                    }}
                    src={f.cover}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="size-full scale-[1.02] object-cover brightness-75 grayscale transition-[filter,transform] duration-700 ease-out-expo group-hover:scale-110 group-hover:brightness-100 group-hover:grayscale-0 group-focus-visible:grayscale-0 [@media(hover:none)]:group-data-[active=true]:scale-105 [@media(hover:none)]:group-data-[active=true]:brightness-100 [@media(hover:none)]:group-data-[active=true]:grayscale-0"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* The hovered project, quietly, bottom left */}
          <div className="pointer-events-none absolute bottom-24 left-5 md:bottom-12 md:left-10">
            <p key={`c-${shown.id}`} className="row-in label text-zinc-500">
              {shown.context}
            </p>
            <p
              key={shown.id}
              aria-hidden
              className="mt-2 overflow-hidden font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-zinc-50 md:text-6xl"
            >
              {Array.from(shown.title).map((ch, k) => (
                <span key={k} className="pl-letter inline-block" style={{ '--k': k } as CSSProperties}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-label={p ? p.title : 'Projet'}
        onClose={() => {
          setOpen(null);
          document.body.style.overflow = '';
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-zinc-950/85 p-0 text-zinc-100 backdrop-blur-2xl"
      >
        {p && prev && next && (
          <div className="relative size-full">
            <div className="absolute inset-x-0 top-8 flex items-center justify-center gap-4 md:top-10">
              <Ruler active={open} total={n} />
            </div>
            <button
              type="button"
              onClick={closeProject}
              aria-label="Fermer le projet"
              className="absolute right-5 top-5 z-20 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96] md:right-10 md:top-7"
            >
              <X size={18} weight="regular" />
            </button>

            {/* Neighbours wait as slices on the edges */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={`Projet précédent : ${prev.title}`}
              className="group absolute left-0 top-1/2 hidden h-[52dvh] w-[7vw] -translate-y-1/2 overflow-hidden md:block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prev.cover} alt="" className="size-full object-cover brightness-50 grayscale transition-[filter] duration-500 group-hover:brightness-90" />
              <CaretLeft size={20} weight="regular" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-50" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Projet suivant : ${next.title}`}
              className="group absolute right-0 top-1/2 hidden h-[52dvh] w-[7vw] -translate-y-1/2 overflow-hidden md:block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={next.cover} alt="" className="size-full object-cover brightness-50 grayscale transition-[filter] duration-500 group-hover:brightness-90" />
              <CaretRight size={20} weight="regular" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-50" />
            </button>

            {/* Hero image with the giant title over it */}
            <div className="absolute left-1/2 top-[44%] w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 md:w-[min(64vw,72rem)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt={`Aperçu de ${p.title}`}
                className="aspect-[4/5] w-full object-cover md:aspect-[16/10]"
                style={{ viewTransitionName: 'ab-hero' } as CSSProperties}
              />
              <h2
                key={p.id}
                aria-label={p.title}
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden text-center font-display text-[17vw] font-bold uppercase leading-[0.82] tracking-tight text-zinc-50 mix-blend-difference md:text-[11vw]"
              >
                {Array.from(p.title).map((ch, k) => (
                  <span key={k} aria-hidden className="pl-letter inline-block" style={{ '--k': k } as CSSProperties}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </h2>
            </div>

            {/* Quiet details along the bottom */}
            <div
              key={`d-${p.id}`}
              className="row-in absolute inset-x-0 bottom-0 grid grid-cols-1 gap-4 p-5 md:grid-cols-12 md:items-end md:gap-6 md:px-10 md:pb-10"
            >
              <div className="md:col-span-5">
                <p className="label text-zinc-500">{p.context}</p>
                <p className="mt-2 text-lg font-medium tracking-tight text-zinc-50 md:text-xl">{p.tagline}</p>
                <p className="mt-2 hidden max-w-[52ch] text-sm leading-relaxed text-zinc-400 md:block">{p.desc}</p>
              </div>
              <p className="font-mono text-xs text-zinc-400 md:col-span-3 md:text-center">{p.stack.join(', ')}</p>
              <div className="flex flex-wrap gap-2 md:col-span-4 md:justify-end">
                {p.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
                      i === 0
                        ? 'bg-zinc-50 text-zinc-950'
                        : 'border border-white/20 bg-white/5 text-zinc-100 hover:bg-white/15'
                    }`}
                  >
                    {l.label}
                    <ArrowUpRight size={14} weight="regular" aria-hidden />
                  </a>
                ))}
                <div className="flex gap-2 md:hidden">
                  <button type="button" onClick={() => go(-1)} aria-label="Projet précédent" className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-zinc-100">
                    <CaretLeft size={18} weight="regular" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Projet suivant" className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-zinc-100">
                    <CaretRight size={18} weight="regular" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
