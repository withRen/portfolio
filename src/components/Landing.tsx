'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/data/content';
import WaveCanvas from './WaveCanvas';

type Props = { onPanel: (p: 'about' | 'contact') => void };

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

const underline = 'border-b border-current pb-0.5 transition-opacity duration-300 hover:opacity-60';

export default function Landing({ onPanel }: Props) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 768px)');
    let raf: number | null = null;

    if (reduce && section.current) section.current.style.height = '100dvh';

    const apply = () => {
      raf = null;
      const vh = window.innerHeight;
      const raw = reduce ? 1 : clamp(window.scrollY / (vh * 0.9));
      const p = smooth(raw);
      const end = wide.matches ? { x: 19, t: 31, b: 13 } : { x: 6, t: 30, b: 20 };

      if (frame.current) {
        frame.current.style.clipPath = `inset(${(end.t * p).toFixed(2)}% ${(end.x * p).toFixed(2)}% ${(end.b * p).toFixed(2)}% ${(end.x * p).toFixed(2)}% round ${(20 * p).toFixed(1)}px)`;
        frame.current.style.pointerEvents = p > 0.9 ? 'auto' : 'none';
      }
      if (backdrop.current) backdrop.current.style.opacity = p.toFixed(3);
      if (shadow.current) {
        const st = shadow.current.style;
        st.top = `${(end.t * p).toFixed(2)}%`;
        st.bottom = `${(end.b * p).toFixed(2)}%`;
        st.left = st.right = `${(end.x * p).toFixed(2)}%`;
        st.borderRadius = `${(20 * p).toFixed(1)}px`;
        st.opacity = clamp(p * 1.5).toFixed(3);
      }
      if (img.current) img.current.style.transform = `scale(${(1.15 - 0.15 * p).toFixed(4)})`;
      if (title.current) {
        const o = clamp((p - 0.5) / 0.4);
        title.current.style.opacity = o.toFixed(3);
        title.current.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`;
      }
      if (hint.current) hint.current.style.opacity = (1 - clamp(p / 0.25)).toFixed(3);
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

  const toCatalogue = () => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={section} id="top" aria-label="Introduction" className="relative h-[200dvh] text-zinc-50">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-zinc-950">
        <div ref={backdrop} aria-hidden className="absolute inset-0 opacity-0 will-change-[opacity]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/photos/dunes.png')}
            alt=""
            draggable={false}
            className="absolute inset-0 size-full scale-125 object-cover blur-2xl brightness-[0.33] saturate-[1.25]"
          />
          <div className="absolute inset-0 bg-[rgb(10_11_12/0.3)]" />
        </div>

        <div
          ref={shadow}
          aria-hidden
          className="absolute bg-black opacity-0 shadow-[0_40px_100px_-10px_rgb(0_0_0/0.65),0_14px_36px_rgb(0_0_0/0.4)]"
        />

        <div
          ref={title}
          className="pointer-events-none absolute inset-x-0 top-[8%] px-5 text-center opacity-0 md:top-[7%]"
        >
          <h1 className="font-display text-[clamp(3rem,14vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-tight md:text-[clamp(4rem,9.5vw,10rem)]">
            Rahim
            <br className="md:hidden" /> Tamhaev
          </h1>
          <p className="label mt-3 text-zinc-300 md:mt-4">Développement · Vidéo · Photographie</p>
        </div>

        <div ref={frame} className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}>
          <button
            type="button"
            onClick={toCatalogue}
            aria-label="Voir le catalogue"
            className="block size-full cursor-pointer overflow-hidden"
          >
            <div
              ref={img}
              className="relative size-full origin-center will-change-transform"
              style={{ transform: 'scale(1.15)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/photos/dunes.png')}
                alt="Dunes sombres sous un ciel clair"
                draggable={false}
                className="absolute inset-0 size-full object-cover"
              />
              <WaveCanvas src={asset('/photos/dunes.png')} />
            </div>
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 text-white mix-blend-difference">
          <div className="pointer-events-auto absolute left-5 top-5 flex items-center gap-3 md:left-10 md:top-8">
            <span className="text-lg font-semibold tracking-tighter">RT</span>
            <span className="label hidden leading-snug lg:block">
              Rahim Tamhaev
              <br />
              Développeur et vidéaste
            </span>
          </div>

          <button
            type="button"
            onClick={toCatalogue}
            className={`label pointer-events-auto absolute right-5 top-5 md:right-10 md:top-8 ${underline}`}
          >
            Voir le catalogue
          </button>

          <div className="pointer-events-auto absolute bottom-6 left-5 flex flex-col items-start gap-3 md:bottom-8 md:left-10">
            <button type="button" onClick={() => onPanel('about')} className={`label ${underline}`}>
              À propos
            </button>
            <button type="button" onClick={() => onPanel('contact')} className={`label ${underline}`}>
              Me contacter
            </button>
          </div>

          <div ref={hint} aria-hidden className="absolute bottom-6 right-5 md:bottom-8 md:right-10">
            <svg width="22" height="34" viewBox="0 0 22 34" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="20" height="32" rx="10" />
              <line x1="11" y1="8" x2="11" y2="13" className="wheel" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
