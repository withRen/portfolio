'use client';

import { useCallback, useEffect, useRef } from 'react';
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

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    t.querySelectorAll<HTMLElement>('[data-i]').forEach((el) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
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
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
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
      className="flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto overflow-y-hidden px-0 py-2 [scrollbar-width:none] focus-visible:outline-offset-[-3px] md:gap-5 [&::-webkit-scrollbar]:hidden"
    >
      <div aria-hidden className="w-[50vw] shrink-0" />
      {items.map((w, i) => {
        const isActive = i === active;
        const cls = `relative block shrink-0 snap-center overflow-hidden rounded-sm text-left transition-[filter,opacity] duration-500 ease-out-expo ${
          isActive ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale'
        }`;
        const style = { aspectRatio: String(w.ratio), height: `min(100%, 30rem, ${(86 / w.ratio).toFixed(2)}vw)` };
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
            style={style}
            draggable={false}
          >
            <Tile work={w} />
          </a>
        ) : w.kind === 'photo' ? (
          <button
            key={w.id}
            data-i={i}
            type="button"
            onClick={handle}
            className={`${cls} ${isActive ? 'cursor-zoom-in' : ''}`}
            style={style}
            aria-label={`${w.title}${isActive ? ', agrandir' : ''}`}
          >
            <Tile work={w} />
          </button>
        ) : (
          <div key={w.id} data-i={i} className={cls} style={style} onClick={handle}>
            <Tile work={w} />
          </div>
        );
      })}
      <div aria-hidden className="w-[50vw] shrink-0" />
    </div>
  );
}
