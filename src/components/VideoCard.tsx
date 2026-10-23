'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from '@phosphor-icons/react';
import { ytThumb, type Video } from '@/data/content';

type Props = { video: Video; featured?: boolean };

/** Thumbnail that plays a muted preview after a short hover (pointer devices only). */
export default function VideoCard({ video, featured }: Props) {
  const [previewing, setPreviewing] = useState(false);
  const [src, setSrc] = useState(ytThumb(video.id));
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
    if (ok) timer.current = setTimeout(() => setPreviewing(true), 400);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setPreviewing(false);
  };

  return (
    <a
      href={video.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="group flex h-full flex-col active:scale-[0.99]"
    >
      <span className="relative block min-h-0 flex-1 overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_30px_60px_-28px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
        <span className="block aspect-video size-full md:aspect-auto" />
        <span className="sd-parallax absolute inset-0 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Image tirée de ${video.title}`}
            loading="lazy"
            onError={() => setSrc(ytThumb(video.id, 'hqdefault'))}
            className={`absolute inset-0 size-full object-cover transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.03] ${
              previewing ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </span>
        {previewing && (
          <iframe
            title=""
            aria-hidden
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${video.id}&playsinline=1`}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[130%] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        )}
        <span
          aria-hidden
          className={`absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full border border-white/20 bg-zinc-950/40 text-zinc-50 backdrop-blur-md transition-[opacity,transform] duration-500 ease-out-expo group-hover:scale-105 ${
            featured ? 'size-14' : 'size-11'
          } ${previewing ? 'opacity-0' : 'opacity-100'}`}
        >
          <Play size={featured ? 20 : 16} weight="fill" />
        </span>
      </span>
      <span className="mt-4 block">
        <span
          className={`block font-medium tracking-tight text-zinc-50 transition-colors duration-300 group-hover:text-accent ${
            featured ? 'text-2xl md:text-3xl' : 'text-base'
          }`}
        >
          {video.title}
        </span>
        <span className="mt-1 block text-sm text-zinc-400">{video.type}</span>
      </span>
    </a>
  );
}
