'use client';

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import { ArrowUpRight, CaretLeft, CaretRight, HandSwipeLeft } from '@phosphor-icons/react';
import type { Featured } from '@/data/content';
import { useI18n } from '@/i18n/context';

/*
 * Projets dev, présentés directement en grand, sans clic pour ouvrir.
 *
 * Ordinateur : la section reste en place pendant le scroll et chaque tranche de scroll
 * affiche le projet suivant. La nouvelle image se dévoile en rideau depuis le sens du
 * défilement pendant que l'ancienne recule, puis le texte arrive ligne par ligne.
 *
 * Mobile : un paquet de cartes plein écran qu'on balaie du doigt. Toute la carte
 * (image, texte, liens) suit le doigt en pivotant, la suivante attend dessous et grandit ;
 * au-delà d'un seuil ou d'un geste rapide, la carte part sur le côté. Le scroll vertical
 * de la page reste libre. Hauteur en svh : elle ne bouge pas quand la barre d'adresse
 * du navigateur apparaît ou disparaît.
 */

const MOBILE_QUERY = '(max-width: 767px)';

export default function ProjectStrip() {
  const n = useI18n().content.featured.length;
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // La hauteur est fixée en CSS (et non après coup en JS) pour que rien ne saute au chargement
  return (
    <div
      className="relative h-[100svh] md:h-[var(--strip-h)]"
      style={{ '--strip-h': `calc(100svh + ${(n - 1) * STEP * 100}svh)` } as CSSProperties}
    >
      {mobile ? <MobileDeck /> : <DesktopStage />}
    </div>
  );
}

/* ================================================================== */
/* Ordinateur : scroll épinglé, transition en rideau                  */
/* ================================================================== */

/** Hauteur de scroll consacrée à chaque projet, en fraction d'écran */
const STEP = 0.75;
/** Durée de la transition en rideau (doit couvrir les animations pv-* de globals.css) */
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
      className={`max-h-full w-auto max-w-[72rem] self-center justify-self-center rounded-[1.25rem] object-cover ring-1 ring-white/10 [grid-area:1/1] ${className}`}
    />
  );
}

function DesktopStage() {
  const { t, content } = useI18n();
  const featured = content.featured;
  const n = featured.length;
  const [shown, setShown] = useState<Shown>({ i: 0, dir: 1, from: null });
  const stage = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = shown.i;

  // Le projet affiché suit la progression dans la section
  useEffect(() => {
    let raf: number | null = null;
    const pick = () => {
      raf = null;
      const el = stage.current?.parentElement;
      if (!el) return;
      const step = window.innerHeight * STEP;
      const scrolled = -el.getBoundingClientRect().top;
      const i = Math.min(n - 1, Math.max(0, Math.floor((scrolled + step * 0.5) / step)));
      setShown((s) => {
        if (s.i === i) return s;
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = setTimeout(() => setShown((x) => ({ ...x, from: null })), LEAVE_MS);
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
    const el = stage.current?.parentElement;
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
    <div
      ref={stage}
      className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden"
      role="region"
      aria-roledescription={t.dev.carousel}
      aria-label={t.dev.region}
    >
      {/* Règle : un trait par projet, cliquable */}
      <nav aria-label={t.dev.choose} className="flex justify-center pt-8">
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
      <div className="relative flex min-h-0 flex-1 px-[9vw] py-5">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label={t.dev.prevNamed(prev.title)}
          className="group absolute left-0 top-1/2 z-20 h-[56%] w-[5vw] -translate-y-1/2 overflow-hidden rounded-r-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={prev.id} src={prev.cover} alt="" loading="lazy" style={dirStyle} className="pv-peek size-full object-cover brightness-[0.4] grayscale transition-[filter] duration-500 group-hover:brightness-75" />
          <CaretLeft size={20} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-50" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label={t.dev.nextNamed(next.title)}
          className="group absolute right-0 top-1/2 z-20 h-[56%] w-[5vw] -translate-y-1/2 overflow-hidden rounded-l-xl"
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
      <div key={`d-${p.id}`} aria-live="polite" className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-end gap-8 px-10 pb-24">
        <div className="col-span-5">
          <p className="pv-line label text-zinc-500" style={line(0)}>
            {p.context}
            <span className="ml-3 text-zinc-600">
              {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </p>
          <h3 className="pv-line mt-2 text-4xl font-semibold leading-tight tracking-tight text-zinc-50" style={line(1)}>
            {p.title}
          </h3>
          <p className="pv-line mt-1 text-lg text-zinc-300" style={line(2)}>
            {p.tagline}
          </p>
        </div>
        <p className="pv-line col-span-4 leading-relaxed text-zinc-400" style={line(3)}>
          {p.desc}
        </p>
        <div className="pv-line col-span-3 flex flex-col items-end gap-3" style={line(4)}>
          <Stack p={p} label={t.dev.tech} className="justify-end" />
          <Links p={p} className="justify-end" />
        </div>
      </div>
    </div>
  );
}

function Stack({ p, label, className = '' }: { p: Featured; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-1.5 ${className}`}>
      {p.stack.map((s) => (
        <li key={s} className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
          {s}
        </li>
      ))}
    </ul>
  );
}

function Links({ p, className = '', tabIndex }: { p: Featured; className?: string; tabIndex?: number }) {
  if (!p.links.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {p.links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={tabIndex}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
            i === 0 ? 'bg-zinc-50 text-zinc-950' : 'border border-white/20 bg-white/5 text-zinc-100 hover:bg-white/15'
          }`}
        >
          {l.label}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Mobile : paquet de cartes plein écran                              */
/* ================================================================== */

/** Distance (fraction de largeur) ou vitesse (px/ms) qui valide un swipe */
const SWIPE_DISTANCE = 0.25;
const SWIPE_SPEED = 0.5;
const FLY_MS = 340;
const BEHIND = { transform: 'translateY(16px) scale(0.93)', filter: 'brightness(0.45)' };

type Drag = { id: number; x: number; y: number; t: number; axis: 'x' | 'y' | null; dx: number };

function DeckCard({
  p,
  index,
  n,
  back,
  ref,
  className = '',
  style,
  hint,
}: {
  p: Featured;
  index: number;
  n: number;
  back?: boolean;
  ref?: Ref<HTMLElement>;
  className?: string;
  style?: CSSProperties;
  hint?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <article
      ref={ref}
      aria-hidden={back || undefined}
      inert={back || undefined}
      style={style}
      className={`absolute inset-0 flex select-none flex-col overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10 ${className}`}
    >
      {/* Fond : la même image, floutée, pour remplir la carte */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.cover} alt="" aria-hidden draggable={false} className="absolute inset-0 size-full scale-125 object-cover opacity-50 blur-2xl" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/10 via-zinc-950/70 via-45% to-zinc-950" />

      {/* Barres de progression, comme des stories */}
      <div aria-hidden className="relative flex gap-1 px-4 pt-4">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={`h-[3px] flex-1 rounded-full ${i === index ? 'bg-zinc-50' : 'bg-white/25'}`} />
        ))}
      </div>

      {/* Image centrée dans l'espace libre, l'indice de geste juste dessous */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.cover}
          alt={back ? '' : t.dev.preview(p.title)}
          draggable={false}
          style={{ objectPosition: p.focus, aspectRatio: p.ratio ?? 16 / 10 }}
          className="min-h-0 w-full shrink rounded-2xl object-cover ring-1 ring-white/10"
        />
        {hint}
      </div>

      <div className="relative flex flex-col gap-3 p-5 pt-2">
        <p className="label text-zinc-400">{p.context}</p>
        <div>
          <h3 className="text-[2rem] font-semibold leading-none tracking-tight text-zinc-50">{p.title}</h3>
          <p className="mt-2 text-zinc-200">{p.tagline}</p>
        </div>
        <p className="line-clamp-5 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
        <Stack p={p} label={t.dev.tech} />
        <Links p={p} className="mt-1" tabIndex={back ? -1 : undefined} />
      </div>
    </article>
  );
}

function MobileDeck() {
  const { t, content } = useI18n();
  const featured = content.featured;
  const n = featured.length;
  const [active, setActive] = useState(0);
  const [peekDir, setPeekDir] = useState<1 | -1>(1);
  const [swiped, setSwiped] = useState(false);
  const [settling, setSettling] = useState(false);
  const deck = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLElement>(null);
  const under = useRef<HTMLElement>(null);
  const drag = useRef<Drag | null>(null);
  const flying = useRef(false);

  const width = () => deck.current?.clientWidth || window.innerWidth;

  // Position de la carte du dessus et de celle du dessous pour un déplacement dx
  const paint = (dx: number, animate: boolean) => {
    const k = Math.min(1, Math.abs(dx) / (width() * 0.5));
    const ease = animate ? `${FLY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)` : '0s';
    const c = top.current;
    const b = under.current;
    if (c) {
      c.style.transition = `transform ${ease}, opacity ${ease}`;
      c.style.transform = dx ? `translateX(${dx}px) rotate(${dx / 24}deg)` : '';
    }
    if (b) {
      b.style.transition = `transform ${ease}, filter ${ease}`;
      b.style.transform = `translateY(${16 * (1 - k)}px) scale(${0.93 + 0.07 * k})`;
      b.style.filter = `brightness(${0.45 + 0.55 * k})`;
    }
  };

  // dir 1 = projet suivant (la carte part à gauche), -1 = précédent (elle part à droite)
  const fly = (dir: 1 | -1) => {
    if (flying.current) return;
    setSwiped(true);
    const commit = () => {
      flying.current = false;
      setSettling(true);
      setActive((i) => (i + dir + n) % n);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return commit();
    flying.current = true;
    setPeekDir(dir);
    // Laisse React poser la bonne carte dessous avant de lancer le mouvement
    setTimeout(() => {
      paint(-dir * width() * 1.3, true);
      if (top.current) top.current.style.opacity = '0';
      setTimeout(commit, FLY_MS - 20);
    }, 16);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (flying.current || (e.target as HTMLElement).closest('a, button')) return;
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
        deck.current?.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > 10) {
        drag.current = null; // geste vertical : la page défile normalement
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
    const speed = Math.abs(d.dx) / Math.max(1, performance.now() - d.t);
    if (Math.abs(d.dx) > width() * SWIPE_DISTANCE || (speed > SWIPE_SPEED && Math.abs(d.dx) > 40)) fly(d.dx < 0 ? 1 : -1);
    else paint(0, true); // pas assez loin : la carte revient en place
  };

  const p = featured[active];
  const peekIndex = (active + peekDir + n) % n;

  return (
    <div className="flex h-[100svh] flex-col px-3 pb-[5.5rem] pt-3" role="region" aria-roledescription={t.dev.carousel} aria-label={t.dev.region}>
      <div
        ref={deck}
        className="relative min-h-0 flex-1 touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <DeckCard key={`under-${featured[peekIndex].id}`} ref={under} p={featured[peekIndex]} index={peekIndex} n={n} back style={BEHIND} />
        <DeckCard
          key={p.id}
          ref={top}
          p={p}
          index={active}
          n={n}
          className={`z-10 will-change-transform ${settling ? 'pv-settle' : ''}`}
          hint={
            swiped ? null : (
              // Indice de geste, jusqu'au premier swipe
              <p aria-hidden className="label flex items-center gap-2 whitespace-nowrap text-zinc-300">
                <HandSwipeLeft size={16} className="pv-hint-arrow" />
                {t.dev.swipeHint}
              </p>
            )
          }
        />
      </div>

      {/* Boutons (accessibilité et clavier), même animation que le swipe */}
      <div className="flex items-center justify-between px-2 pt-3">
        <span aria-live="polite" className="sr-only">
          {p.title}
        </span>
        <button
          type="button"
          onClick={() => fly(-1)}
          aria-label={t.dev.prev}
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-zinc-100 active:scale-95"
        >
          <CaretLeft size={18} aria-hidden />
        </button>
        <span className="label text-zinc-500">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => fly(1)}
          aria-label={t.dev.next}
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-zinc-100 active:scale-95"
        >
          <CaretRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
