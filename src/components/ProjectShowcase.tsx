'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Plus } from '@phosphor-icons/react';
import { featured } from '@/data/content';
import CaseStudy from './CaseStudy';
import { LiquidGL } from './liquidGL';

/*
 * Pinned liquid showcase: each project fills a rounded stage rendered in WebGL (liquidGL.ts).
 * Scrolling moves through the projects; the image wobbles with scroll speed, ripples around
 * the pointer, and the next project rises in behind a wave. Titles come in letter by letter.
 * The render loop only runs while the section is on screen. Without WebGL or with reduced
 * motion, plain images cross-fade instead.
 */

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function ProjectShowcase() {
  const n = featured.length;
  const section = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [glReady, setGlReady] = useState(false);
  const [caseIndex, setCaseIndex] = useState<number | null>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const sec = section.current;
    const cv = canvas.current;
    const st = stage.current;
    if (!sec || !cv || !st) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = reduce ? null : LiquidGL.create(cv, featured.map((f) => f.cover), () => setGlReady(true));

    let raf: number | null = null;
    let visible = false;
    let last = performance.now();
    let prevP = 0;
    let vel = 0;
    let time = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, th: 0 };

    const progress = () => {
      const r = sec.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      return Math.min(1, Math.max(0, -r.top / span)) * (n - 1);
    };

    const frame = (now: number) => {
      raf = null;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;

      const p = progress();
      const a = Math.min(n - 1, Math.floor(p));
      const t = smooth(0.25, 0.75, p - a);
      const current = t > 0.5 ? Math.min(n - 1, a + 1) : a;
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }

      // Scroll speed (projects per second), eased
      const v = (p - prevP) / Math.max(dt, 0.001);
      prevP = p;
      vel += (Math.max(-3, Math.min(3, v)) * 0.35 - vel) * 0.12;

      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      mouse.hover += (mouse.th - mouse.hover) * 0.08;

      if (gl) {
        gl.resize();
        gl.render({ a, b: Math.min(n - 1, a + 1), t, time, vel, mx: mouse.x, my: mouse.y, hover: mouse.hover });
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(sec);

    const onMove = (e: PointerEvent) => {
      const r = st.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = (e.clientY - r.top) / r.height;
      mouse.th = 1;
    };
    const onLeave = () => {
      mouse.th = 0;
    };
    st.addEventListener('pointermove', onMove);
    st.addEventListener('pointerleave', onLeave);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      st.removeEventListener('pointermove', onMove);
      st.removeEventListener('pointerleave', onLeave);
      gl?.dispose();
    };
  }, [n]);

  const jump = (i: number) => {
    const sec = section.current;
    if (!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const span = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * i) / (n - 1), behavior: 'smooth' });
  };

  const p = featured[active];

  return (
    <>
      <div ref={section} className="relative mt-12 md:mt-16" style={{ height: `${n * 100}dvh` }}>
        <div className="sticky top-0 h-[100dvh] p-3 md:p-4">
          <div
            ref={stage}
            className="relative isolate size-full overflow-hidden rounded-[1.75rem] bg-zinc-950 ring-1 ring-white/10 md:rounded-[2.25rem]"
          >
            {/* Fallback / first paint: plain cross-fading images */}
            {featured.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.id}
                src={f.cover}
                alt=""
                aria-hidden
                loading={i < 2 ? 'eager' : 'lazy'}
                className={`absolute inset-0 size-full object-cover brightness-75 transition-opacity duration-700 ease-out-expo ${
                  glReady ? 'opacity-0' : i === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <canvas
              ref={canvas}
              aria-hidden
              className={`absolute inset-0 size-full transition-opacity duration-700 ${glReady ? 'opacity-100' : 'opacity-0'}`}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/25 to-zinc-950/30"
            />

            {/* Project names: where you are, and a way to jump */}
            <ol className="absolute right-5 top-5 flex flex-col items-end gap-1.5 md:right-8 md:top-8">
              {featured.map((f, i) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={i === active ? 'true' : undefined}
                    className={`label transition-[color,opacity,transform] duration-500 ease-out-expo hover:text-zinc-50 ${
                      i === active ? 'translate-x-0 text-zinc-50' : 'translate-x-1 text-zinc-500'
                    }`}
                  >
                    {f.title}
                  </button>
                </li>
              ))}
            </ol>

            <div className="absolute inset-x-0 bottom-0 grid grid-cols-1 gap-6 p-6 md:grid-cols-12 md:items-end md:gap-8 md:p-12">
              <div className="md:col-span-8">
                <p key={`ctx-${p.id}`} className="row-in label text-zinc-300">
                  {p.context}
                </p>
                <h3
                  key={p.id}
                  aria-label={p.title}
                  className="mt-3 overflow-hidden pb-[0.06em] font-display text-[14vw] font-bold uppercase leading-[0.84] tracking-tight text-zinc-50 md:text-[8.4vw] 2xl:text-[9rem]"
                >
                  {Array.from(p.title).map((ch, k) => (
                    <span key={k} aria-hidden className="pl-letter inline-block" style={{ '--k': k } as CSSProperties}>
                      {ch === ' ' ? ' ' : ch}
                    </span>
                  ))}
                </h3>
                <p key={`tag-${p.id}`} className="row-in mt-4 text-lg font-medium tracking-tight text-zinc-100 md:text-2xl" style={{ '--i': 2 } as CSSProperties}>
                  {p.tagline}
                </p>
              </div>

              <div key={`side-${p.id}`} className="row-in flex flex-col gap-5 md:col-span-4" style={{ '--i': 3 } as CSSProperties}>
                <p className="hidden max-w-[42ch] text-sm leading-relaxed text-zinc-300 md:block">{p.desc}</p>
                <p className="font-mono text-xs text-zinc-400">{p.stack.join(', ')}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCaseIndex(active)}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <Plus size={14} weight="regular" aria-hidden />
                    Voir le projet
                  </button>
                  {p.links[0] && (
                    <a
                      href={p.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 active:scale-[0.98]"
                    >
                      {p.links[0].label}
                      <ArrowUpRight size={14} weight="regular" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CaseStudy index={caseIndex} onIndex={setCaseIndex} onClose={() => setCaseIndex(null)} />
    </>
  );
}
