'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

type Props = { id: string; title: string; type: string; href: string };

export default function FeaturedVideo({ id, title, type, href }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const [src, setSrc] = useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const enter = () => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    timer.current = setTimeout(() => setPreviewing(true), 350);
  };

  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setPreviewing(false);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-zinc-900 md:aspect-[21/9]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Image tirée du court-métrage ${title}`}
        onError={() => setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)}
        className={`absolute inset-0 size-full object-cover transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.03] ${
          previewing ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {previewing && (
        <iframe
          title=""
          aria-hidden
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${id}&playsinline=1`}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[120%] -translate-x-1/2 -translate-y-1/2 border-0"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start justify-between gap-4 bg-gradient-to-t from-zinc-950/80 to-transparent p-5 md:flex-row md:items-end md:p-8">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tighter md:text-5xl">{title}</h3>
          <p className="label mt-3 text-zinc-300">{type}</p>
        </div>
        <span className="label inline-flex shrink-0 items-center gap-2 rounded-sm border border-zinc-600 px-4 py-3 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-zinc-950 group-active:scale-[0.98]">
          Voir sur YouTube
          <ArrowUpRight size={14} weight="regular" aria-hidden />
        </span>
      </div>
    </a>
  );
}
