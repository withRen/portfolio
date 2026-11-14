'use client';

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import { ArrowUpRight, CaretLeft, CaretRight, HandSwipeLeft } from '@phosphor-icons/react';
import type { Featured } from '@/data/content';
import { useI18n } from '@/i18n/context';

/*
 * Projets dev, présentés directement en grand : un projet à la fois, grande image et
 * informations complètes, sans clic pour ouvrir.
 *
 * Ordinateur : la section reste en place pendant le scroll et chaque tranche de scroll
 * affiche le projet suivant. La nouvelle image se dévoile en rideau depuis le sens du
 * défilement pendant que l'ancienne recule, puis le texte arrive ligne par ligne.
 *
 * Mobile : un paquet de cartes qu'on balaie du doigt, comme sur une appli de swipe.
 * La carte suit le doigt en pivotant, la suivante attend dessous et grandit ; au-delà
 * d'un seuil (ou d'un geste rapide) la carte part sur le côté. Le scroll vertical de la
 * page reste libre.
 */

/** Hauteur de scroll consacrée à chaque projet (ordinateur), en fraction d'écran */
const STEP = 0.75;
/** Durée de la transition en rideau (doit couvrir les animations pv-* de globals.css) */
const LEAVE_MS = 1000;
/** Mobile : distance (fraction de largeur) ou vitesse (px/ms) qui valide un swipe */
const SWIPE_DISTANCE = 0.28;
const SWIPE_SPEED = 0.45;
const FLY_MS = 320;

type Mode = 'scroll' | 'swipe';
type Shown = { i: number; dir: 1 | -1; from: number | null; mode: Mode };
type Drag = { id: number; x: number; y: number; t: number; axis: 'x' | 'y' | null; dx: number };

const BEHIND = 'translateY(14px) scale(0.92)';

function Cover({
  p,
  className,
  style,
  decorative,
  ref,
}: {
  p: Featured;
  className: string;
  style?: CSSProperties;
  decorative?: boolean;
  ref?: Ref<HTMLImageElement>;
}) {
  const { t } = useI18n();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={p.cover}
      alt={decorative ? '' : t.dev.preview(p.title)}
      draggable={false}
      style={{ objectPosition: p.focus, aspectRatio: p.ratio ?? 16 / 10, ...style }}
      className={`max-h-full w-full max-w-[72rem] select-none self-center justify-self-center rounded-[1.25rem] object-cover ring-1 ring-white/10 [grid-area:1/1] md:w-auto ${className}`}
    />
  );
}

export default function ProjectStrip() {
  const { t, content } = useI18n();
  const featured = content.featured;
  const n = featured.length;
  const [shown, setShown] = useState<Shown>({ i: 0, dir: 1, from: null, mode: 'scroll' });
  const [mobile, setMobile] = useState(false);
  const [peekDir, setPeekDir] = useState<1 | -1>(1);
  const [swiped, setSwiped] = useState(false);
  const section = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLImageElement>(null);
  const behind = useRef<HTMLImageElement>(null);
  const drag = useRef<Drag | null>(null);
  const flying = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = shown.i;

  // Mobile = écran étroit : paquet de cartes au lieu du scroll épinglé
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Ordinateur : le projet affiché suit la progression dans la section
  useEffect(() => {
    if (mobile) return;
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
        leaveTimer.current = setTimeout(() => setShown((x) => ({ ...x, from: null })), LEAVE_MS);
        return { i, dir: i > s.i ? 1 : -1, from: s.i, mode: 'scroll' };
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
  }, [n, mobile]);

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile : paquet de cartes ---------- */

  // Position de la carte du dessus et de celle du dessous pour un déplacement dx
  const paint = (dx: number, animate: boolean) => {
    const c = card.current;
    const b = behind.current;
    const w = c?.parentElement?.clientWidth || window.innerWidth;
    const k = Math.min(1, Math.abs(dx) / (w * 0.5));
    const ease = animate ? `${FLY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : '0s';
    if (c) {
      c.style.transition = `transform ${ease}, opacity ${ease}`;
      c.style.transform = dx ? `translateX(${dx}px) rotate(${dx / 22}deg)` : '';
    }
    if (b) {
      b.style.transition = `transform ${ease}, filter ${ease}`;
      b.style.transform = `translateY(${14 * (1 - k)}px) scale(${0.92 + 0.08 * k})`;
      b.style.filter = `brightness(${0.45 + 0.4 * k})`;
    }
  };

  // dir 1 = projet suivant (la carte part à gauche), -1 = précédent (elle part à droite)
  const fly = (dir: 1 | -1) => {
    if (flying.current) return;
    setSwiped(true);
    const commit = () => {
      flying.current = false;
      setShown((s) => ({ i: (s.i + dir + n) % n, dir, from: null, mode: 'swipe' }));
    };
    if (reduced()) return commit();
    flying.current = true;
    setPeekDir(dir);
    // Laisse React poser la bonne carte dessous avant de lancer le mouvement
    setTimeout(() => {
      const w = card.current?.parentElement?.clientWidth || window.innerWidth;
      paint(-dir * w * 1.25, true);
      if (card.current) card.current.style.opacity = '0';
      setTimeout(commit, FLY_MS - 40);
    }, 16);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!mobile || flying.current || (e.target as HTMLElement).closest('a, button')) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), axis: null, dx: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.axis) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        d.axis = 'x';
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > 10) {
        drag.current = null; // geste vertical : on laisse la page défiler
        return;
      } else return;
    }
    d.dx = dx;
    const dir = dx < 0 ? 1 : -1;
    if (dir !== peekDir) setPeekDir(dir);
    paint(dx, false);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || d.axis !== 'x') return;
    const w = card.current?.parentElement?.clientWidth || window.innerWidth;
    const speed = Math.abs(d.dx) / Math.max(1, performance.now() - d.t);
    if (Math.abs(d.dx) > w * SWIPE_DISTANCE || (speed > SWIPE_SPEED && Math.abs(d.dx) > 30)) fly(d.dx < 0 ? 1 : -1);
    else paint(0, true); // pas assez loin : la carte revient en place
  };

  /* ---------- Navigation commune ---------- */

  const go = (i: number) => {
    const target = (i + n) % n;
    if (mobile) {
      if (target === active) return;
      // Saut direct depuis la règle : transition en rideau
      setSwiped(true);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => setShown((x) => ({ ...x, from: null })), LEAVE_MS);
      setShown({ i: target, dir: target > active ? 1 : -1, from: active, mode: 'scroll' });
      return;
    }
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + target * window.innerHeight * STEP;
    window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
  };
  const step = (dir: 1 | -1) => (mobile ? fly(dir) : go(active + dir));

  const p = featured[active];
  const prev = featured[(active - 1 + n) % n];
  const next = featured[(active + 1) % n];
  const peek = featured[(active + peekDir + n) % n];
  const leaving = shown.from !== null && shown.from !== active ? featured[shown.from] : null;
  const dirStyle = { '--d': shown.dir } as CSSProperties;
  const line = (k: number) => ({ '--d': shown.dir, '--k': k }) as CSSProperties;
  const enterClass = shown.mode === 'swipe' ? 'pv-settle z-10' : shown.from === null ? 'pv-in z-10' : 'pv-enter z-10';

  return (
    <div
      ref={section}
      className="relative"
      style={{ height: mobile ? '100dvh' : `calc(100dvh + ${(n - 1) * STEP * 100}dvh)` }}
    >
      <div
        className="sticky top-0 flex h-[100dvh] touch-pan-y flex-col overflow-hidden"
        role="region"
        aria-roledescription={t.dev.carousel}
        aria-label={t.dev.region}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Règle : un trait par projet, cliquable */}
        <nav aria-label={t.dev.choose} className="flex flex-col items-center gap-1 pt-6 md:pt-8">
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
          {/* Mobile : indice de geste, jusqu'au premier swipe */}
          <p
            aria-hidden
            className={`label flex items-center gap-2 text-zinc-500 transition-opacity duration-500 md:hidden ${
              swiped ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <HandSwipeLeft size={16} className="pv-hint-arrow" />
            {t.dev.swipeHint}
          </p>
        </nav>

        {/* Image du projet, avec ses voisins qui attendent sur les côtés (ordinateur) */}
        <div className="relative flex min-h-0 flex-1 px-5 py-4 md:px-[9vw] md:py-5">
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

          {/* Toutes les cartes partagent la même case de grille */}
          <div className="grid min-h-0 w-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]">
            {mobile && !leaving && (
              <Cover
                key={`b-${peek.id}`}
                ref={behind}
                p={peek}
                decorative
                className="pointer-events-none origin-bottom"
                style={{ transform: BEHIND, filter: 'brightness(0.45)' }}
              />
            )}
            {leaving && <Cover key={`out-${leaving.id}`} p={leaving} decorative style={dirStyle} className="pv-leave pointer-events-none" />}
            <Cover key={p.id} ref={card} p={p} style={dirStyle} className={`${enterClass} will-change-transform`} />
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
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                  {s}
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
                  onClick={() => step(-1)}
                  aria-label={t.dev.prev}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-zinc-100 active:scale-95"
                >
                  <CaretLeft size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.dev.next}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-zinc-100 active:scale-95"
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
