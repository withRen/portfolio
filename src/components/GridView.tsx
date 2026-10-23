'use client';

import type { CSSProperties } from 'react';
import { kindLabel, type Work } from '@/data/content';
import Tile from './Tile';

type Props = { items: Work[]; onPhoto: (w: Work) => void };

export default function GridView({ items, onPhoto }: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-3 gap-y-6 px-5 pb-10 pt-1 md:grid-cols-3 md:gap-x-5 md:gap-y-8 md:px-10 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((w, i) => {
          const inner = (
            <>
              <span className="block aspect-[4/3] overflow-hidden rounded-sm bg-zinc-900">
                <span className="block size-full grayscale transition-[filter,transform] duration-500 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0">
                  <Tile work={w} />
                </span>
              </span>
              <span className="mt-3 block">
                <span className="block text-sm font-medium leading-tight tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-accent">
                  {w.title}
                </span>
                <span className="label mt-1 block text-zinc-500">
                  {kindLabel[w.kind]}
                  {w.tags[0] ? ` · ${w.tags[0]}` : ''}
                </span>
              </span>
            </>
          );
          const cls = 'group block w-full text-left transition-transform duration-200 active:scale-[0.98]';
          const style = { '--i': Math.min(i, 14) } as CSSProperties;
          return (
            <li key={w.id} className="row-in" style={style}>
              {w.href ? (
                <a href={w.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : w.kind === 'photo' ? (
                <button type="button" onClick={() => onPhoto(w)} className={`${cls} cursor-zoom-in`}>
                  {inner}
                </button>
              ) : (
                <div className="group block w-full">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
