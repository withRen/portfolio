'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { Featured } from '@/data/content';
import { useI18n } from '@/i18n/context';

/*
 * Projets dev, présentés directement en grand : un projet à la fois, grande image et
 * informations complètes, sans clic pour ouvrir. La section reste en place pendant le
 * scroll et chaque tranche de scroll affiche le projet suivant (pas de calage forcé).
 * Changement de projet : la nouvelle image se dévoile en rideau depuis le sens du
 * défilement pendant que l'ancienne recule, puis le texte arrive ligne par ligne.
 */

/** Hauteur de scroll consacrée à chaque projet, en fraction d'écran */
const STEP = 0.75;
/** Durée de la transition (doit couvrir les animations pv-* de globals.css) */
const LEAVE_MS = 1000;

type Shown = { i: number; dir: 1 | -1; from: number | null };

function Cover({ p, className, style, decorative }: { p: Featured; className: string; style?: CSSProperties; decorative?: boolean }) {
  const { t } = useI18n();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.cover}
      alt={decorative ? '' : t.dev.preview(p.title)}
      style={{ objectPosition: p.focus, aspectRatio: p.ratio ?? 16 / 10, ...style }}
      className={`max-h-full w-full max-w-[72rem] self-center justify-self-center rounded-[1.25rem] object-cover ring-1 ring-white/10 [grid-area:1/1] md:w-auto ${className}`}
    />
  );
}

export default function ProjectStrip() {
  const { t, content } = useI18n();
  const featured = content.featured;
  const n = featured.length;
  const [shown, setShown] = useState<Shown>({ i: 0, dir: 1, from: null });
  const section = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = shown.i;

  // Le projet affiché suit la progression dans la section
  useEffect(() => {
    let raf: number | null = null;
    const pick = () => {
      raf = null;
      const el = section.current;
      if (!el) return;
      const step = window.innerHeight * STEP;
      const scrolled = -el.getBoundingClientRect().top;
      const i = Math.min(n - 1, Math.max(0, Math.floor((scrolled + step * 0.5) / step)));
      setShown((s) => {
        if (s.i === i) return s;
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = setTimeout(() => setShown((t) => ({ ...t, from: null })), LEAVE_MS);
        return { i, dir: i > s.i ? 1 : -1, from: s.i };
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, [n]);

  // Aller à un projet = faire défiler jusqu'à sa tranche
  const go = (i: number) => {
    const el = section.current;
    if (!el) return;
    const target = (i + n) % n;
    const top = el.getBoundingClientRect().top + window.scrollY + target * window.innerHeight * STEP;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  const p = featured[active];
  const prev = featured[(active - 1 + n) % n];
  const next = featured[(active + 1) % n];
  const leaving = shown.from !== null && shown.from !== active ? featured[shown.from] : null;
  const dirStyle = { '--d': shown.dir } as CSSProperties;
  const line = (k: number) => ({ '--d': shown.dir, '--k': k }) as CSSProperties;

  return (
    <div ref={section} className="relative" style={{ height: `calc(100dvh + ${(n - 1) * STEP * 100}dvh)` }}>
      <div
        className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden"
        role="region"
        aria-roledescription={t.dev.carousel}
        aria-label={t.dev.region}
      >
        {/* Règle : un trait par projet, cliquable */}
        <nav aria-label={t.dev.choose} className="flex justify-center pt-6 md:pt-8">
          <ul className="flex items-end gap-1">
            {featured.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={f.title}
                  aria-current={i === active ? 'true' : undefined}
                  className="group flex h-8 items-end px-2"
                >
                  <span
                    className={`block w-px transition-[height,background-color] duration-500 ${
                      i === active ? 'h-6 bg-zinc-50' : 'h-3 bg-zinc-600 group-hover:bg-zinc-300'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Image du projet, avec ses voisins qui attendent sur les côtés */}
        <div className="relative flex min-h-0 flex-1 px-5 py-5 md:px-[9vw]">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label={t.dev.prevNamed(prev.title)}
            className="group absolute left-0 top-1/2 z-20 hidden h-[56%] w-[5vw] -translate-y-1/2 overflow-hidden rounded-r-xl md:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={prev.id} src={prev.cover} alt="" loading="lazy" style={dirStyle} className="pv-peek size-full object-cover brightness-[0.4] grayscale transition-[filter] duration-500 group-hover:brightness-75" />
            <CaretLeft size={20} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-50" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label={t.dev.nextNamed(next.title)}
            className="group absolute right-0 top-1/2 z-20 hidden h-[56%] w-[5vw] -translate-y-1/2 overflow-hidden rounded-l-xl md:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={next.id} src={next.cover} alt="" loading="lazy" style={dirStyle} className="pv-peek size-full object-cover brightness-[0.4] grayscale transition-[filter] duration-500 group-hover:brightness-75" />
            <CaretRight size={20} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-50" />
          </button>

          {/* Les deux images partagent la même case : l'ancienne recule, la nouvelle se dévoile */}
          <div className="grid min-h-0 w-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]">
            {leaving && <Cover key={`out-${leaving.id}`} p={leaving} decorative style={dirStyle} className="pv-leave pointer-events-none" />}
            <Cover key={p.id} p={p} style={dirStyle} className={shown.from === null ? 'pv-in' : 'pv-enter z-10'} />
          </div>
        </div>

        {/* Informations complètes, lisibles sans clic */}
        <div
          key={`d-${p.id}`}
          aria-live="polite"
          className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-3 px-5 pb-24 md:grid-cols-12 md:items-end md:gap-8 md:px-10 md:pb-24"
        >
          <div className="md:col-span-5">
            <p className="pv-line label text-zinc-500" style={line(0)}>
              {p.context}
              <span className="ml-3 text-zinc-600">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
            </p>
            <h3 className="pv-line mt-2 text-2xl font-semibold leading-tight tracking-tight text-zinc-50 md:text-4xl" style={line(1)}>
              {p.title}
            </h3>
            <p className="pv-line mt-1 text-zinc-300 md:text-lg" style={line(2)}>
              {p.tagline}
            </p>
          </div>
          <p className="pv-line line-clamp-4 text-sm leading-relaxed text-zinc-400 md:col-span-4 md:line-clamp-none md:text-base" style={line(3)}>
            {p.desc}
          </p>
          <div className="pv-line flex flex-col gap-3 md:col-span-3 md:items-end" style={line(4)}>
            <ul aria-label={t.dev.tech} className="flex flex-wrap gap-1.5 md:justify-end">
              {p.stack.map((t) => (
                <li key={t} className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              {p.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
                    i === 0 ? 'bg-zinc-50 text-zinc-950' : 'border border-white/20 bg-white/5 text-zinc-100 hover:bg-white/15'
                  }`}
                >
                  {l.label}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              ))}
              <span className="ml-auto flex gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label={t.dev.prev}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-zinc-100"
                >
                  <CaretLeft size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label={t.dev.next}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-zinc-100"
                >
                  <CaretRight size={16} aria-hidden />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
