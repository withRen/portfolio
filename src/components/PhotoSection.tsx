'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { photos } from '@/data/content';
import Lightbox from './Lightbox';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

type Props = { onActiveImage: (src: string) => void };

const navBtn =
  'inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-zinc-100 backdrop-blur-md transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-30';

export default function PhotoSection({ onActiveImage }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const center = useCallback((i: number) => {
    const t = track.current;
    const el = t?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (!t || !el) return;
    t.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - t.clientWidth / 2, behavior: 'smooth' });
  }, []);

  // Distance to center (0 = centered, 1 = one card away) drives scale and opacity
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
    setActive((prev) => (prev === best ? prev : best));
  }, []);

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
    const ro = new ResizeObserver(() => measure());
    if (t) ro.observe(t);
    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [measure]);

  useEffect(() => {
    onActiveImage(photos[active].image);
  }, [active, onActiveImage]);

  return (
    <section id="photos" aria-labelledby="photos-title" className="py-24 md:py-32">
      <SectionTitle
        id="photos-title"
        title="Photographie"
        lead="Architectures, détails urbains et scènes naturelles."
        className="mx-auto max-w-[1400px] px-5 md:px-10"
      />

      <Reveal className="mt-12 md:mt-16">
        <div
          ref={track}
          onScroll={onScroll}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              center(Math.min(photos.length - 1, active + 1));
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              center(Math.max(0, active - 1));
            }
          }}
          tabIndex={0}
          role="region"
          aria-roledescription="carrousel"
          aria-label="Photographies"
          className="flex h-[min(72dvh,40rem)] snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden py-6 [scrollbar-width:none] focus-visible:outline-offset-[-3px] md:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          <div aria-hidden className="w-[50vw] shrink-0" />
          {photos.map((p, i) => {
            const isActive = i === active;
            const outer = {
              aspectRatio: String(p.ratio),
              height: `min(100%, ${(84 / p.ratio).toFixed(2)}vw)`,
            } as CSSProperties;
            return (
              <button
                key={p.id}
                data-i={i}
                type="button"
                onClick={() => (isActive ? setLightbox(i) : center(i))}
                aria-label={isActive ? `${p.title}, agrandir` : p.title}
                className={`relative block shrink-0 snap-center ${isActive ? 'cursor-zoom-in' : ''}`}
                style={outer}
              >
                <span
                  className="block size-full overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)] ring-1 ring-white/10"
                  style={{
                    transform: 'scale(calc(1 - var(--d, 1) * 0.13))',
                    opacity: 'calc(1 - var(--d, 1) * 0.55)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={`Photographie, ${p.title.toLowerCase()}`}
                    loading={i < 4 ? 'eager' : 'lazy'}
                    draggable={false}
                    className="size-full object-cover"
                  />
                </span>
              </button>
            );
          })}
          <div aria-hidden className="w-[50vw] shrink-0" />
        </div>
      </Reveal>

      <div className="mx-auto mt-6 flex max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10">
        <p aria-live="polite" className="text-sm text-zinc-300">
          {photos[active].title}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Photo précédente"
            disabled={active === 0}
            onClick={() => center(active - 1)}
            className={navBtn}
          >
            <CaretLeft size={18} weight="regular" />
          </button>
          <button
            type="button"
            aria-label="Photo suivante"
            disabled={active === photos.length - 1}
            onClick={() => center(active + 1)}
            className={navBtn}
          >
            <CaretRight size={18} weight="regular" />
          </button>
        </div>
      </div>

      <Lightbox photos={photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
