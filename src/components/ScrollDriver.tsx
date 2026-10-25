'use client';

import { useEffect } from 'react';

/*
 * Fallback engine for browsers without CSS scroll-driven animations (html.sd-js, set in
 * layout.tsx): it writes the progress values the CSS reads, using the same ranges as the
 * native timelines (contain / exit). Updates are batched to one per frame.
 */

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// "contain" range: 0 when the section's top reaches the viewport top, 1 when its bottom reaches the bottom
const contain = (r: DOMRect, vh: number) => clamp(-r.top / Math.max(1, r.height - vh));

export default function ScrollDriver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('sd-js')) return;

    let raf: number | null = null;
    const apply = () => {
      raf = null;
      const vh = window.innerHeight;

      const pg = document.querySelector<HTMLElement>('.pg-section');
      if (pg) {
        const r = pg.getBoundingClientRect();
        pg.style.setProperty('--pgp', contain(r, vh).toFixed(4));
        // "exit 0% to exit 70%": from the bottom edge at the viewport bottom to 30% from the top
        pg.style.setProperty('--pge', clamp((vh - r.bottom) / (vh * 0.7)).toFixed(4));
      }

      const vd = document.querySelector<HTMLElement>('.vd-section');
      if (vd) {
        const n = Number(getComputedStyle(vd).getPropertyValue('--n')) || 1;
        vd.style.setProperty('--vd', (-1 + contain(vd.getBoundingClientRect(), vh) * n).toFixed(4));
      }

      const ab = document.querySelector<HTMLElement>('.ab-section');
      if (ab) ab.style.setProperty('--abp', contain(ab.getBoundingClientRect(), vh).toFixed(4));
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

  return null;
}
