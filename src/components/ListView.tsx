'use client';

import type { CSSProperties } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { kindLabel, type Work } from '@/data/content';
import { useCursorPreview } from './CursorPreview';

type Props = { items: Work[]; onPhoto: (w: Work) => void };

const grid =
  'group/row relative grid w-full grid-cols-[2rem_1fr_1.5rem] items-start gap-x-4 gap-y-1 border-b border-zinc-800 py-4 text-left md:grid-cols-[3rem_minmax(0,1fr)_9rem_14rem_1.5rem] md:gap-x-6 md:py-5';

export default function ListView({ items, onPhoto }: Props) {
  const { handlers, node } = useCursorPreview();

  const content = (w: Work, i: number) => (
    <>
      <span className="label pt-1.5 text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <h3 className="text-xl font-semibold leading-tight tracking-tighter transition-[color,transform] duration-300 ease-out-expo group-hover/row:translate-x-1.5 group-hover/row:text-accent group-focus-visible/row:text-accent md:text-3xl">
          {w.title}
        </h3>
        {w.desc && <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-zinc-500">{w.desc}</p>}
      </div>
      <span className="label col-start-2 row-start-2 pt-1.5 text-zinc-500 md:col-start-auto md:row-start-auto">
        {kindLabel[w.kind]}
      </span>
      <span className="label hidden pt-1.5 text-zinc-500 md:block">
        {w.status ? <span className="text-accent">{w.status}</span> : w.tags.join(' · ')}
      </span>
      <span className="col-start-3 row-start-1 justify-self-end pt-1.5 text-zinc-500 transition-colors duration-300 group-hover/row:text-accent md:col-start-auto md:row-start-auto">
        {w.href && <ArrowUpRight size={18} weight="regular" aria-hidden />}
      </span>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover/row:scale-x-100 group-focus-visible/row:scale-x-100" />
    </>
  );

  return (
    <div className="h-full overflow-y-auto">
      <ol className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        {items.map((w, i) => {
          const style = { '--i': Math.min(i, 14) } as CSSProperties;
          return (
            <li key={w.id} className="row-in" style={style}>
              {w.href ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={grid}
                  {...handlers(w.image)}
                >
                  {content(w, i)}
                </a>
              ) : w.kind === 'photo' ? (
                <button type="button" onClick={() => onPhoto(w)} className={`${grid} cursor-zoom-in`} {...handlers(w.image)}>
                  {content(w, i)}
                </button>
              ) : (
                <div className={grid}>{content(w, i)}</div>
              )}
            </li>
          );
        })}
      </ol>
      {node}
    </div>
  );
}
