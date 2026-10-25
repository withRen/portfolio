'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';

/*
 * Loading screen in the spirit of the dunes: the logo above a thin dune line that
 * flows endlessly, with a light running along it. It is in the server HTML so it can
 * cover the page while scripts, fonts and the hero image load, but it only fades in
 * after a short delay (CSS), so fast loads never see it. Hidden without JavaScript.
 */

const W = 220;
const H = 40;

// Two periods of a soft, slightly asymmetric dune curve, repeated so it can scroll seamlessly
function dunePath(width: number, periods: number) {
  const pts: string[] = [];
  const steps = 120;
  for (let k = 0; k <= steps; k++) {
    const x = (k / steps) * width;
    const t = (k / steps) * periods * Math.PI * 2;
    const y = H / 2 + Math.sin(t) * 7 + Math.sin(t * 2 + 0.8) * 2.5;
    pts.push(`${k === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const LINE = dunePath(W * 2, 4);

export default function Loader() {
  const [state, setState] = useState<'loading' | 'leaving' | 'gone'>('loading');

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setState('leaving');
      setTimeout(() => setState('gone'), 700);
    };

    const hero = document.querySelector<HTMLImageElement>('#top img');
    const ready = Promise.all([
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
      document.fonts?.ready ?? Promise.resolve(),
      hero && !hero.complete ? hero.decode().catch(() => undefined) : Promise.resolve(),
    ]);
    ready.then(finish);
    const failsafe = setTimeout(finish, 8000);
    return () => clearTimeout(failsafe);
  }, []);

  if (state === 'gone') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Chargement du site"
      className={`site-loader fixed inset-0 z-[200] grid place-items-center bg-zinc-950 ${
        state === 'leaving' ? 'site-loader-out' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <Logo className="site-loader-logo size-9 text-zinc-100" title="" />
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
          className="overflow-visible [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]"
        >
          <g className="site-loader-flow">
            <path d={LINE} fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.25" />
            <path
              d={LINE}
              fill="none"
              stroke="rgb(255 255 255 / 0.9)"
              strokeWidth="1.25"
              strokeLinecap="round"
              pathLength={100}
              className="site-loader-light"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
