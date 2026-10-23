'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

export function useCursorPreview() {
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

  const handlers = (src?: string) => ({
    onMouseEnter: (e: MouseEvent) => {
      if (!src || !box.current || !img.current) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      img.current.src = src;
      active.current = true;
      target.current = { x: e.clientX + 24, y: e.clientY - 80 };
      current.current = { ...target.current };
      box.current.style.opacity = '1';
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    onMouseMove: (e: MouseEvent) => {
      target.current = { x: e.clientX + 24, y: e.clientY - 80 };
    },
    onMouseLeave: () => {
      active.current = false;
      if (box.current) box.current.style.opacity = '0';
    },
  });

  const node = (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[11.5rem] w-72 overflow-hidden rounded-sm bg-zinc-900 opacity-0 transition-opacity duration-300 [will-change:transform] [@media(hover:hover)]:block"
      style={{ transform: 'translate3d(-999px, -999px, 0)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} alt="" className="size-full object-cover" />
    </div>
  );

  return { handlers, node };
}
