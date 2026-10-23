'use client';

import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/data/content';
import Reveal from './Reveal';

type Props = { columns: Photo[][] };

const src = (p: Photo) => `/photos/${p.file}.webp`;
const pad = (n: number) => String(n).padStart(2, '0');

function Shot({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <Reveal index={index}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Agrandir : ${photo.title}`}
        className="group block w-full cursor-zoom-in text-left transition-transform duration-200 active:scale-[0.98]"
      >
        <span
          className={`block overflow-hidden rounded-sm bg-zinc-900 ${loaded ? '' : 'skeleton'}`}
          style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={ref}
            src={src(photo)}
            width={photo.w}
            height={photo.h}
            alt={`Photographie, ${photo.title.toLowerCase()}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-auto w-full transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.04] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </span>
        <span className="label mt-3 block text-zinc-500 transition-colors duration-300 group-hover:text-zinc-100">
          {photo.title}
        </span>
      </button>
    </Reveal>
  );
}

export default function Gallery({ columns }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  const flat = columns.flat();
  const offsets = columns.reduce<number[]>((acc, col, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + columns[i - 1].length);
    return acc;
  }, []);

  const show = (i: number) => setIndex((i + flat.length) % flat.length);
  const open = (i: number) => {
    opener.current = document.activeElement as HTMLElement;
    setIndex(i);
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
  };
  const close = () => dialog.current?.close();

  const current = flat[index];
  const colPad = ['', 'md:pt-36', 'md:pt-16'];

  return (
    <>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8">
        {columns.map((col, c) => (
          <div key={c} className={`flex flex-col gap-8 md:gap-16 ${colPad[c]}`}>
            {col.map((photo, i) => (
              <Shot key={photo.file} photo={photo} index={i} onOpen={() => open(offsets[c] + i)} />
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label="Galerie photo"
        onClose={() => {
          document.body.style.overflow = '';
          opener.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t === dialog.current || t.dataset.stage) close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') show(index - 1);
          if (e.key === 'ArrowRight') show(index + 1);
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-zinc-100 open:grid open:grid-rows-[auto_1fr_auto]"
      >
        <div className="label flex items-center justify-between px-5 py-4 text-zinc-400 md:px-10 md:py-5">
          <span>
            {pad(index + 1)} / {pad(flat.length)}
          </span>
          <button
            type="button"
            onClick={close}
            className="rounded-sm border border-zinc-700 px-4 py-2.5 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]"
          >
            Fermer
          </button>
        </div>
        <div data-stage="true" className="flex min-h-0 items-center justify-center px-5 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src(current)}
            alt={`Photographie, ${current.title.toLowerCase()}`}
            className="max-h-full max-w-full rounded-sm object-contain"
          />
        </div>
        <div className="label flex items-center justify-between px-5 py-4 text-zinc-400 md:px-10 md:py-5">
          <span>{current.title}</span>
          <div className="flex gap-2">
            {(['Préc.', 'Suiv.'] as const).map((l, n) => (
              <button
                key={l}
                type="button"
                aria-label={n === 0 ? 'Photo précédente' : 'Photo suivante'}
                onClick={() => show(index + (n === 0 ? -1 : 1))}
                className="rounded-sm border border-zinc-700 px-4 py-2.5 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
