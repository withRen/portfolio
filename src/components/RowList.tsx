'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import type { Row } from '@/data/content';
import Reveal from './Reveal';

type Props = { items: Row[]; variant?: 'project' | 'video' };

export default function RowList({ items, variant = 'project' }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const active = useRef(false);
  const raf = useRef<number | null>(null);

  const tick = () => {
    const b = box.current;
    if (!b) return;
    const t = target.current;
    const c = current.current;
    c.x += (t.x - c.x) * 0.18;
    c.y += (t.y - c.y) * 0.18;
    b.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) scale(${active.current ? 1 : 0.92})`;
    raf.current = active.current || Math.abs(t.x - c.x) > 0.5 ? requestAnimationFrame(tick) : null;
  };

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const enter = (e: React.MouseEvent, src?: string) => {
    if (!src || !canHover() || !box.current || !img.current) return;
    img.current.src = src;
    active.current = true;
    target.current = { x: e.clientX + 24, y: e.clientY - 80 };
    current.current = { ...target.current };
    box.current.style.opacity = '1';
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const move = (e: React.MouseEvent) => {
    target.current = { x: e.clientX + 24, y: e.clientY - 80 };
  };

  const leave = () => {
    active.current = false;
    if (box.current) box.current.style.opacity = '0';
  };

  const titleSize =
    variant === 'video' ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl';
  const rowPad = variant === 'video' ? 'py-5 md:py-6' : 'py-6 md:py-8';

  const content = (item: Row, i: number) => (
    <>
      <span className="label pt-2 text-zinc-600">{String(i + 1).padStart(2, '0')}</span>
      <div>
        <h3
          className={`${titleSize} font-semibold leading-[1.1] tracking-tighter transition-[color,transform] duration-300 ease-out-expo group-hover/row:translate-x-2 group-hover/row:text-accent group-focus-visible/row:text-accent`}
        >
          {item.title}
        </h3>
        {item.desc && (
          <p className="mt-3 max-w-[54ch] text-[0.95em] leading-relaxed text-zinc-400">{item.desc}</p>
        )}
      </div>
      <span className="label col-start-2 row-start-2 leading-loose text-zinc-500 md:col-start-auto md:row-start-auto md:pt-2 md:text-right">
        {item.status && <span className="block text-accent">{item.status}</span>}
        {item.tags.map((t) => (
          <span key={t} className="block">
            {t}
          </span>
        ))}
      </span>
      <span className="col-start-3 row-start-1 justify-self-end pt-2 text-zinc-500 transition-[color,transform] duration-300 ease-out-expo group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-accent md:col-start-auto md:row-start-auto">
        {item.href && <ArrowUpRight size={18} weight="regular" aria-hidden />}
      </span>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover/row:scale-x-100 group-focus-visible/row:scale-x-100" />
    </>
  );

  const grid =
    'group/row relative grid grid-cols-[2.25rem_1fr_1.5rem] items-start gap-x-4 gap-y-3 border-b border-zinc-800 md:grid-cols-[3.25rem_1fr_auto_2rem] md:gap-x-6 ' +
    rowPad;

  return (
    <>
      <ol className="border-t border-zinc-700">
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} index={i}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={grid}
                onMouseEnter={(e) => enter(e, item.preview)}
                onMouseMove={move}
                onMouseLeave={leave}
              >
                {content(item, i)}
              </a>
            ) : (
              <div className={grid}>{content(item, i)}</div>
            )}
          </Reveal>
        ))}
      </ol>
      <div
        ref={box}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[11.5rem] w-72 overflow-hidden rounded-sm bg-zinc-900 opacity-0 transition-opacity duration-300 [will-change:transform] [@media(hover:hover)]:block"
        style={{ transform: 'translate3d(-999px, -999px, 0)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={img} alt="" className="size-full object-cover" />
      </div>
    </>
  );
}
