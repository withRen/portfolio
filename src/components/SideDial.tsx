'use client';

import { useEffect, useRef, useState } from 'react';

export type DialId = 'intro' | 'all' | 'dev' | 'video' | 'photo';

const items: { id: DialId; label: string }[] = [
  { id: 'intro', label: 'Intro' },
  { id: 'all', label: 'Tout' },
  { id: 'dev', label: 'Dev' },
  { id: 'video', label: 'Vidéo' },
  { id: 'photo', label: 'Photo' },
];

const W = 120;
const H = 240;
const STEP = 22; // degrees between two labels on the arc
const rad = (d: number) => (d * Math.PI) / 180;

const ticks = Array.from({ length: 29 }, (_, i) => -84 + i * 6);

type Props = { active: DialId; onSelect: (id: DialId) => void };

export default function SideDial({ active, onSelect }: Props) {
  const [hover, setHover] = useState(false);
  const [flash, setFlash] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  // Open briefly when the current section changes
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 1800);
  }, [active]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const enter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHover(true);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHover(false), 250);
  };

  const open = hover || flash;
  const activeIndex = items.findIndex((i) => i.id === active);

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed left-0 top-1/2 z-40 -translate-y-1/2"
      style={{ width: W, height: H }}
      onFocus={enter}
      onBlur={leave}
    >
      {/* Half disc: collapses to a small bar on the screen edge */}
      <div
        aria-hidden
        className="absolute inset-0 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition-[clip-path] duration-500 ease-out-expo"
        style={{
          clipPath: open
            ? `inset(0px 0px 0px 0px round 0 ${W}px ${W}px 0)`
            : `inset(${H / 2 - 26}px ${W - 6}px ${H / 2 - 26}px 0px round 0 6px 6px 0)`,
        }}
      />

      {/* Hotspot and toggle for the collapsed bar */}
      <button
        type="button"
        aria-label="Ouvrir le menu des sections"
        aria-expanded={open}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onClick={() => (open ? setHover(false) : enter())}
        className={`pointer-events-auto absolute left-0 top-1/2 h-24 w-8 -translate-y-1/2 ${open ? 'hidden' : ''}`}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${open ? 'pointer-events-auto opacity-100 delay-150' : 'opacity-0'}`}
        onPointerEnter={enter}
        onPointerLeave={leave}
        style={{ clipPath: `inset(0px 0px 0px 0px round 0 ${W}px ${W}px 0)` }}
      >
        <svg width={W} height={H} className="absolute inset-0" aria-hidden>
          {ticks.map((a) => (
            <line
              key={a}
              x1={Math.cos(rad(a)) * 108}
              y1={H / 2 + Math.sin(rad(a)) * 108}
              x2={Math.cos(rad(a)) * (a % 30 === 0 ? 98 : 102)}
              y2={H / 2 + Math.sin(rad(a)) * (a % 30 === 0 ? 98 : 102)}
              stroke="white"
              strokeOpacity={a === 0 ? 0 : 0.28}
              strokeWidth="1"
            />
          ))}
          <line x1="102" y1={H / 2} x2="114" y2={H / 2} stroke="var(--color-accent)" strokeWidth="1.5" />
        </svg>

        {items.map((item, i) => {
          const d = i - activeIndex;
          const a = d * STEP;
          const visible = Math.abs(d) <= 2;
          const x = 14 + 52 * Math.cos(rad(a));
          const y = H / 2 + 100 * Math.sin(rad(a));
          const isActive = d === 0;
          return (
            <button
              key={item.id}
              type="button"
              tabIndex={open && visible ? 0 : -1}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(item.id)}
              className={`label absolute left-0 top-0 whitespace-nowrap transition-[transform,opacity,color] duration-500 ease-out-expo hover:text-zinc-50 ${
                isActive ? 'text-zinc-50' : 'text-zinc-500'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${isActive ? 1.15 : 0.9})`,
                opacity: !visible ? 0 : isActive ? 1 : Math.abs(d) === 1 ? 0.75 : 0.35,
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
