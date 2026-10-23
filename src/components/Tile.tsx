'use client';

import { useState } from 'react';
import { kindLabel, type Work } from '@/data/content';

export default function Tile({ work }: { work: Work }) {
  const [src, setSrc] = useState(work.image);

  if (!src) {
    return (
      <div className="flex size-full flex-col justify-between bg-zinc-900 p-5 md:p-6">
        <span className="label text-zinc-500">{kindLabel[work.kind]}</span>
        <div>
          <p className="text-3xl font-semibold leading-none tracking-tighter text-zinc-100">{work.title}</p>
          <p className="label mt-3 text-zinc-500">{work.status ?? work.tags.join(' · ')}</p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={work.kind === 'photo' ? `Photographie, ${work.title.toLowerCase()}` : `Aperçu de ${work.title}`}
      loading="lazy"
      draggable={false}
      onError={() => work.imageFallback && setSrc(work.imageFallback)}
      className="size-full bg-zinc-900 object-cover"
    />
  );
}
