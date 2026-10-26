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

const STEP = 26; // degrees between two sections on the wheel
const W = 460; // wheel width (px); it scales down on narrow screens
const R = W / 2;
const rad = (d: number) => (d * Math.PI) / 180;
const ticks = Array.from({ length: 121 }, (_, i) => -180 + i * 3);

/**
 * Best-effort haptic tick: Android (Vibration API, after a first gesture) and iOS Safari 17.4+
 * (a hidden native switch plays the system haptic). Mac and Windows trackpads are not reachable
 * from a web page.
 */
function haptic(iosSwitch: HTMLLabelElement | null) {
  if (typeof navigator === 'undefined') return;
  const activated =
    (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? true;
  if ('vibrate' in navigator && activated) {
    try {
      navigator.vibrate(8);
    } catch {
      /* not allowed yet */
    }
  }
  const ios =
    /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) iosSwitch?.click();
}

// Section tops in page coordinates
const tops = () =>
  items.map((it) => {
    const el = document.getElementById(it.id);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });

// Continuous position along the sections (2.5 = halfway from the 3rd to the 4th) and back
function posFromScroll(t: number[]) {
  const y = window.scrollY + window.innerHeight * 0.35;
  for (let i = t.length - 1; i >= 0; i--) {
    if (y >= t[i]) {
      if (i === t.length - 1) return i;
      return i + (y - t[i]) / Math.max(1, t[i + 1] - t[i]);
    }
  }
  return 0;
}
function scrollFromPos(pos: number, t: number[]) {
  const i = Math.min(t.length - 1, Math.floor(pos));
  const f = pos - i;
  const next = t[i + 1] ?? t[i];
  return t[i] + f * (next - t[i]) - window.innerHeight * 0.35;
}

type Props = { active: DialId; onSelect: (id: DialId) => void };

/**
 * Section selector modelled on the iPhone Camera zoom control: a small pill at the bottom;
 * press and slide (or hover with a mouse) and it opens into a half wheel with ticks and
 * labels that turns with the page. Sliding the wheel scrubs through the page.
 */
export default function CameraDial({ active, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [readout, setReadout] = useState(0);
  const [fit, setFit] = useState(1);
  const ring = useRef<SVGGElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const iosSwitch = useRef<HTMLLabelElement>(null);
  const drag = useRef<{ x: number; pos: number; moved: boolean; last: number; t: number[] } | null>(null);
  const posRef = useRef(0);
  const first = useRef(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draw the wheel at a given position (no React render: direct DOM writes)
  const draw = (pos: number) => {
    posRef.current = pos;
    ring.current?.setAttribute('transform', `rotate(${(-pos * STEP).toFixed(2)} ${R} ${R})`);
    labels.current.forEach((el, i) => {
      if (!el) return;
      const a = (i - pos) * STEP;
      const dist = Math.abs(i - pos);
      const x = R + Math.sin(rad(a)) * (R - 46);
      const y = R - Math.cos(rad(a)) * (R - 46);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${a.toFixed(2)}deg)`;
      el.style.opacity = String(Math.max(0, 1 - dist * 0.32));
    });
    const r = Math.round(pos);
    setReadout((v) => (v === r ? v : r));
  };

  // Follow the page
  useEffect(() => {
    let raf: number | null = null;
    const apply = () => {
      raf = null;
      if (drag.current) return;
      const pos = posFromScroll(tops());
      draw(pos);
      setVisible(pos > 0.55 || window.scrollY > window.innerHeight * 2.2);
      setFit(Math.min(1, (window.innerWidth - 24) / W));
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

  // Tick on every section change
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    haptic(iosSwitch.current);
  }, [active]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = (delay = 350) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  };

  // Press and slide to scrub through the page
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, pos: posRef.current, moved: false, last: Math.round(posRef.current), t: tops() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      show();
    }
    const scale = Math.min(1, (window.innerWidth - 24) / W);
    const pxPerStep = (R - 46) * rad(STEP) * scale;
    const pos = Math.max(0, Math.min(items.length - 1, d.pos - dx / pxPerStep));
    draw(pos);
    window.scrollTo({ top: scrollFromPos(pos, d.t), behavior: 'instant' as ScrollBehavior });
    const r = Math.round(pos);
    if (r !== d.last) {
      d.last = r;
      haptic(iosSwitch.current);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    e.preventDefault();
    onSelect(items[Math.round(posRef.current)].id);
    hide(700);
  };

  const activeIndex = items.findIndex((i) => i.id === active);

  return (
    <nav
      aria-label="Sections"
      className={`pointer-events-none fixed inset-x-0 bottom-3 z-40 flex flex-col items-center transition-[opacity,transform] duration-500 ease-out-expo md:bottom-5 ${
        visible ? 'opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Hidden native switch: clicking its label gives a haptic tick on iOS Safari */}
      <input type="checkbox" id="dial-haptic" aria-hidden tabIndex={-1} className="sr-only" {...{ switch: '' }} />
      <label ref={iosSwitch} htmlFor="dial-haptic" aria-hidden className="sr-only" />

      {/* The wheel: a half disc that opens above the pill */}
      <div
        aria-hidden
        className="pointer-events-none relative origin-bottom transition-[opacity,transform] duration-500 ease-out-expo"
        style={{
          width: W,
          height: R,
          marginBottom: -R * 0.35 * fit,
          transform: `scale(${((open ? 1 : 0.6) * fit).toFixed(3)})`,
          opacity: open ? 1 : 0,
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-t-full bg-zinc-950/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] ring-1 ring-white/10 backdrop-blur-xl" />
        <svg width={W} height={R} className="absolute inset-0 overflow-visible">
          <g ref={ring}>
            {ticks.map((a) => {
              const major = (a / STEP) % 1 === 0;
              const r1 = R - 8;
              const r2 = R - (major ? 22 : 15);
              return (
                <line
                  key={a}
                  x1={R + Math.sin(rad(a)) * r1}
                  y1={R - Math.cos(rad(a)) * r1}
                  x2={R + Math.sin(rad(a)) * r2}
                  y2={R - Math.cos(rad(a)) * r2}
                  stroke="white"
                  strokeOpacity={major ? 0.7 : 0.3}
                  strokeWidth={major ? 1.4 : 1}
                />
              );
            })}
          </g>
        </svg>
        {/* Fixed marker at the top, like the camera's yellow notch */}
        <span className="absolute left-1/2 top-0.5 size-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-accent" />
        {items.map((it, i) => (
          <span
            key={it.id}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={`label absolute left-0 top-0 whitespace-nowrap ${i === readout ? 'text-accent' : 'text-zinc-200'}`}
          >
            {it.label}
          </span>
        ))}
      </div>

      {/* The pill: one stop per section; the current one shows its name */}
      <div
        className="pointer-events-auto relative flex touch-none select-none items-center gap-1 rounded-full bg-zinc-950/60 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_40px_-12px_rgb(0_0_0/0.8)] ring-1 ring-white/10 backdrop-blur-xl"
        onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !drag.current && hide()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
          hide();
        }}
      >
        {items.map((it, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={it.id}
              type="button"
              onClick={(e) => {
                if (e.defaultPrevented) return;
                onSelect(it.id);
              }}
              aria-current={isActive ? 'true' : undefined}
              aria-label={it.label}
              className={`flex h-9 items-center justify-center rounded-full font-medium transition-[width,background-color,color] duration-500 ease-out-expo ${
                isActive
                  ? 'w-[4.75rem] bg-white/10 text-[13px] text-accent'
                  : 'w-9 text-[11px] text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
              }`}
            >
              {isActive ? it.label : <span className="size-1.5 rounded-full bg-current" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
