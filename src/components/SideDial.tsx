'use client';

import { useEffect, useRef, useState } from 'react';

export type DialId = 'top' | 'photos' | 'videos' | 'dev' | 'contact';

const items: { id: DialId; label: string }[] = [
  { id: 'top', label: 'Intro' },
  { id: 'photos', label: 'Photo' },
  { id: 'videos', label: 'Vidéo' },
  { id: 'dev', label: 'Dev' },
  { id: 'contact', label: 'Contact' },
];

const W = 120;
const H = 240;
const STEP = 30; // degrees between two labels on the wheel
const LABEL_R = 34; // labels start at this radius and read outward
const rad = (d: number) => (d * Math.PI) / 180;

// A full ring of ticks, so the wheel can turn without running out of them
const ticks = Array.from({ length: 60 }, (_, i) => -180 + i * 6);

/**
 * Best-effort haptic tick. Web pages cannot drive Mac or Windows trackpad haptics;
 * this covers Android (Vibration API) and iOS Safari 17.4+ (toggling a native
 * switch control plays the system haptic).
 */
function haptic(iosSwitch: HTMLLabelElement | null) {
  if (typeof navigator === 'undefined') return;
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      /* ignored: not allowed before a user gesture */
    }
  }
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) iosSwitch?.click();
}

type Props = { active: DialId; onSelect: (id: DialId) => void };

export default function SideDial({ active, onSelect }: Props) {
  const [hover, setHover] = useState(false);
  const [flash, setFlash] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  const ring = useRef<SVGGElement>(null);
  const arms = useRef<(HTMLDivElement | null)[]>([]);
  const iosSwitch = useRef<HTMLLabelElement>(null);

  // Open briefly and tick when the current section changes
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    haptic(iosSwitch.current);
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 1300);
  }, [active]);

  // Continuous position along the sections (2.4 = 40% through the 3rd one) turns the wheel
  useEffect(() => {
    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const mid = window.scrollY + window.innerHeight / 2;
      let pos = 0;
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (mid >= top) pos = i + Math.min(1, (mid - top) / Math.max(1, el.offsetHeight)) - 0.5;
      });
      pos = Math.max(0, Math.min(items.length - 1, pos));
      ring.current?.setAttribute('transform', `rotate(${(-pos * STEP).toFixed(2)} 0 ${H / 2})`);
      arms.current.forEach((arm, i) => {
        if (!arm) return;
        const d = i - pos;
        const dist = Math.abs(d);
        arm.style.transform = `rotate(${(d * STEP).toFixed(2)}deg)`;
        arm.style.opacity = String(Math.max(0, 1 - dist * 0.38));
        const label = arm.firstElementChild as HTMLElement | null;
        if (label) label.style.transform = `translateY(-50%) scale(${(1.12 - Math.min(dist, 1) * 0.22).toFixed(3)})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
      {/* Hidden native switch: clicking its label gives a haptic tick on iOS Safari */}
      <input type="checkbox" id="dial-haptic" aria-hidden tabIndex={-1} className="sr-only" {...{ switch: '' }} />
      <label ref={iosSwitch} htmlFor="dial-haptic" aria-hidden className="sr-only" />

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
          <g ref={ring}>
            {ticks.map((a) => {
              const major = a % 30 === 0;
              return (
                <line
                  key={a}
                  x1={Math.cos(rad(a)) * 110}
                  y1={H / 2 + Math.sin(rad(a)) * 110}
                  x2={Math.cos(rad(a)) * (major ? 99 : 104)}
                  y2={H / 2 + Math.sin(rad(a)) * (major ? 99 : 104)}
                  stroke="white"
                  strokeOpacity={major ? 0.45 : 0.22}
                  strokeWidth="1"
                />
              );
            })}
          </g>
          <line x1="100" y1={H / 2} x2="116" y2={H / 2} stroke="var(--color-accent)" strokeWidth="1.5" />
        </svg>

        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            // Zero-size arm pinned at the wheel centre; rotating it tilts the label along the wheel
            <div
              key={item.id}
              ref={(el) => {
                arms.current[i] = el;
              }}
              className="absolute left-0 h-0 w-0 origin-left"
              style={{ top: H / 2 }}
            >
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSelect(item.id)}
                className={`label absolute top-0 origin-left whitespace-nowrap py-1 transition-colors duration-300 hover:text-zinc-50 ${
                  isActive ? 'text-zinc-50' : 'text-zinc-500'
                }`}
                style={{ left: LABEL_R }}
              >
                {item.label}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
