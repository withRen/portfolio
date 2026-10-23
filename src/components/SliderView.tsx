'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import type { Work } from '@/data/content';
import Tile from './Tile';

type Props = {
  items: Work[];
  active: number;
  onActive: (i: number) => void;
  onPhoto: (w: Work) => void;
  registerGo: (go: (delta: number) => void) => void;
};

export default function SliderView({ items, active, onActive, onPhoto, registerGo }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const center = useCallback((i: number) => {
    const el = track.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, []);

  // Continuous distance-to-center (0 at center, 1 one card away) drives scale and opacity
  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    t.querySelectorAll<HTMLElement>('[data-i]').forEach((el) => {
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      el.style.setProperty('--d', Math.min(1, dist / (el.offsetWidth * 0.9 + 24)).toFixed(3));
      if (dist < bestDist) {
        bestDist = dist;
        best = Number(el.dataset.i);
      }
    });
    onActive(best);
  }, [onActive]);

  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      measure();
    });
  };

  useEffect(() => {
    const t = track.current;
    const first = t?.querySelector<HTMLElement>('[data-i="0"]');
    if (t && first) t.scrollLeft = first.offsetLeft + first.offsetWidth / 2 - t.clientWidth / 2;
    measure();
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('resize', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    registerGo((delta) => center(Math.max(0, Math.min(items.length - 1, active + delta))));
  }, [registerGo, center, items.length, active]);

  return (
    <div
      ref={track}
      onScroll={onScroll}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          center(Math.min(items.length - 1, active + 1));
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          center(Math.max(0, active - 1));
        }
      }}
      tabIndex={0}
      role="region"
      aria-label="Réalisations, défilement horizontal"
      className="flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden py-4 [scrollbar-width:none] focus-visible:outline-offset-[-3px] md:gap-6 [&::-webkit-scrollbar]:hidden"
    >
      <div aria-hidden className="w-[50vw] shrink-0" />
      {items.map((w, i) => {
        const isActive = i === active;
        const outer: CSSProperties = {
          aspectRatio: String(w.ratio),
          height: `min(100%, 36rem, ${(84 / w.ratio).toFixed(2)}vw)`,
          '--i': Math.min(i, 8),
        } as CSSProperties;
        const inner: CSSProperties = {
          transform: 'scale(calc(1 - var(--d, 1) * 0.13))',
          opacity: 'calc(1 - var(--d, 1) * 0.55)',
        };
        const card = (
          <span
            className="block size-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] ring-1 ring-white/10 md:rounded-[2.25rem]"
            style={inner}
          >
            <Tile work={w} />
          </span>
        );
        const cls = 'row-in relative block shrink-0 snap-center text-left';
        const handle = (e: React.MouseEvent) => {
          if (!isActive) {
            e.preventDefault();
            center(i);
            return;
          }
          if (w.kind === 'photo') onPhoto(w);
        };
        return w.href ? (
          <a
            key={w.id}
            data-i={i}
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handle}
            className={cls}
            style={outer}
            draggable={false}
          >
            {card}
          </a>
        ) : w.kind === 'photo' ? (
          <button
            key={w.id}
            data-i={i}
            type="button"
            onClick={handle}
            className={`${cls} ${isActive ? 'cursor-zoom-in' : ''}`}
            style={outer}
            aria-label={`${w.title}${isActive ? ', agrandir' : ''}`}
          >
            {card}
          </button>
        ) : (
          <div key={w.id} data-i={i} className={cls} style={outer} onClick={handle}>
            {card}
          </div>
        );
      })}
      <div aria-hidden className="w-[50vw] shrink-0" />
    </div>
  );
}
