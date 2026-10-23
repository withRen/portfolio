'use client';

import { useState } from 'react';
import { photos, type Photo } from '@/data/content';
import Lightbox from './Lightbox';

type Props = { onActiveImage: (src: string) => void };

/*
 * Pinned photo wall (inspired by multi-column editorial grids such as markclennon.com):
 * the section is pinned while its columns slide in opposite directions with the scroll.
 * Pure CSS scroll-driven animations (globals.css, .pg-*); without support or with
 * reduced motion it falls back to a static grid in the normal flow.
 */
const COLS = 4;
const columns: { photo: Photo; index: number }[][] = Array.from({ length: COLS }, () => []);
photos.forEach((photo, index) => columns[index % COLS].push({ photo, index }));

export default function PhotoSection({ onActiveImage }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="photos" aria-labelledby="photos-title" className="pg-section relative">
      <div className="pg-stage relative">
        <div className="pg-grid grid grid-cols-2 gap-3 px-3 md:grid-cols-4 md:gap-4 md:px-4">
          {columns.map((col, c) => (
            <div
              key={c}
              className={`flex flex-col gap-3 md:gap-4 ${c % 2 ? 'pg-col-down' : 'pg-col-up'} ${
                c >= 2 ? 'max-md:hidden' : ''
              }`}
            >
              {/* On mobile the two visible columns also take the photos of the hidden ones */}
              {(c < 2 ? [...col, ...columns[c + 2]] : col).map(({ photo, index }, k) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightbox(index)}
                  onMouseEnter={() => onActiveImage(photo.image)}
                  onFocus={() => onActiveImage(photo.image)}
                  aria-label={`${photo.title}, agrandir`}
                  className={`pg-tile group block w-full cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-zinc-900 ring-1 ring-white/10 transition-[opacity,transform] duration-500 ease-out-expo active:scale-[0.98] ${
                    c < 2 && k >= col.length ? 'md:hidden' : ''
                  }`}
                  style={{ aspectRatio: String(photo.ratio) }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image}
                    alt={`Photographie, ${photo.title.toLowerCase()}`}
                    loading="lazy"
                    draggable={false}
                    className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_center,rgb(9_9_11/0.6),transparent_75%)]"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-zinc-50 mix-blend-difference">
          <h2
            id="photos-title"
            className="pg-title font-display text-[22vw] font-bold uppercase leading-[0.8] tracking-tight md:text-[15vw]"
          >
            Photo
          </h2>
          <p className="mt-4 max-w-[30ch] text-sm md:mt-6 md:text-base">
            Architectures, détails urbains et scènes naturelles.
          </p>
        </div>
      </div>

      <Lightbox photos={photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
