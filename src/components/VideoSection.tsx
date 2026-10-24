'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Play, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { videos, ytThumb, type Video } from '@/data/content';
import VideoPlayer from './VideoPlayer';

/*
 * "Projection room" (inspired by Awwwards SOTD milledollars.fr):
 * the section pins; a small rounded screen opens up to full screen over a giant title,
 * then each scroll step brings the next film in, full screen, with minimal captions.
 * Scroll position drives a registered --vd property in CSS (globals.css, .vd-*);
 * JS only tracks which film is active (IntersectionObserver) to load its muted preview.
 * Without scroll-driven animations or with reduced motion, a static list is shown.
 */

const embed = (id: string, params: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?${params}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;

const glassBtn =
  'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 active:scale-[0.98]';

function Thumb({ v, className = '' }: { v: Video; className?: string }) {
  const [src, setSrc] = useState(ytThumb(v.id));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Image tirée de ${v.title}`}
      loading="lazy"
      draggable={false}
      onError={() => setSrc(ytThumb(v.id, 'hqdefault'))}
      className={`size-full object-cover ${className}`}
    />
  );
}

export default function VideoSection() {
  const n = videos.length;
  const [active, setActive] = useState(-1);
  const [canPreview, setCanPreview] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setCanPreview(wide.matches && !calm.matches);
    sync();
    wide.addEventListener('change', sync);
    calm.addEventListener('change', sync);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sentinels.current.forEach((s) => s && io.observe(s));
    return () => {
      io.disconnect();
      wide.removeEventListener('change', sync);
      calm.removeEventListener('change', sync);
    };
  }, []);

  // A new film resets its preview
  useEffect(() => {
    setReady(false);
    setMuted(true);
  }, [active]);

  // Cover the screen with the 16:9 preview, like object-fit: cover
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const fit = () => {
      const f = frame.current;
      if (!f) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      f.style.width = `${Math.max(w, (h * 16) / 9) * 1.18}px`;
      f.style.height = `${Math.max(h, (w * 9) / 16) * 1.18}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, canPreview]);

  const toggleSound = () => {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: muted ? 'unMute' : 'mute', args: [] }),
      '*',
    );
    setMuted(!muted);
  };

  const jump = (i: number) => sentinels.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const film = active >= 0 ? videos[active] : null;
  const showPreview = canPreview && film !== null && !playing;

  return (
    <section id="videos" aria-labelledby="videos-title">
      <style>{`@keyframes vd-progress { from { --vd: -1; } to { --vd: ${n - 1}; } }`}</style>

      <div className="vd-section relative" style={{ '--n': n } as CSSProperties}>
        {/* One sentinel per film tells JS which one is on screen */}
        {videos.map((v, i) => (
          <div
            key={v.id}
            data-i={i}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
            aria-hidden
            className="vd-sentinel pointer-events-none absolute inset-x-0"
            style={{ '--i': i } as CSSProperties}
          />
        ))}

        <div className="vd-stage">
          <h2
            id="videos-title"
            className="vd-giant font-display font-bold uppercase leading-none tracking-tight text-zinc-50"
          >
            Vidéo
          </h2>

          <div ref={screen} className="vd-screen overflow-hidden bg-zinc-900 ring-1 ring-white/10">
            {videos.map((v, i) => (
              <div
                key={v.id}
                className="vd-film absolute inset-0"
                style={{ '--i': i } as CSSProperties}
                aria-hidden={i !== active}
              >
                <div className="vd-media absolute inset-0">
                  <Thumb v={v} />
                </div>
                {showPreview && i === active && (
                  <iframe
                    key={v.id}
                    ref={frame}
                    title=""
                    aria-hidden
                    tabIndex={-1}
                    allow="autoplay; encrypted-media"
                    onLoad={() => setTimeout(() => setReady(true), 900)}
                    src={embed(v.id, `autoplay=1&mute=1&controls=0&loop=1&playlist=${v.id}&enablejsapi=1`)}
                    className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
                      ready ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
            ))}

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-zinc-950/40"
            />

            {/* Captions: only the film on screen is readable and clickable */}
            <ol className="absolute inset-0">
              {videos.map((v, i) => (
                <li key={v.id} className="vd-caption absolute inset-x-0 bottom-0" style={{ '--i': i } as CSSProperties}>
                  <div className="flex flex-col gap-6 p-6 pb-28 md:flex-row md:items-end md:justify-between md:p-12 md:pb-32">
                    <div>
                      <p className="label text-zinc-300">{v.type}</p>
                      <h3 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.88] tracking-tight text-zinc-50 md:text-8xl">
                        {v.title}
                      </h3>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setPlaying(v.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-2.5 text-sm font-medium text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        <Play size={16} weight="fill" />
                        Lecture
                      </button>
                      <a href={v.href} target="_blank" rel="noopener noreferrer" className={glassBtn}>
                        YouTube
                        <ArrowUpRight size={14} weight="regular" />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {showPreview && ready && (
              <button
                type="button"
                onClick={toggleSound}
                aria-label={muted ? 'Activer le son de l’extrait' : 'Couper le son de l’extrait'}
                className="absolute right-6 top-6 z-30 inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-zinc-950/30 text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 md:right-10 md:top-10"
              >
                {muted ? <SpeakerSlash size={18} weight="regular" /> : <SpeakerHigh size={18} weight="regular" />}
              </button>
            )}

            {/* Film strip: jump to any film */}
            <ul
              aria-label="Films"
              className="vd-strip absolute bottom-5 left-6 right-6 flex gap-2 md:bottom-8 md:left-12 md:right-auto"
            >
              {videos.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={`Aller à ${v.title}`}
                    aria-current={i === active ? 'true' : undefined}
                    className={`relative block aspect-video w-14 overflow-hidden rounded-lg ring-1 transition-[opacity,box-shadow] duration-500 ease-out-expo hover:opacity-100 md:w-20 ${
                      i === active ? 'opacity-100 ring-2 ring-zinc-50' : 'opacity-50 ring-white/20'
                    }`}
                  >
                    <Thumb v={v} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Static fallback */}
      <div className="vd-static mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <h2 className="text-4xl font-semibold leading-none tracking-tighter text-zinc-50 md:text-6xl">Vidéo</h2>
        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
          {videos.map((v) => (
            <li key={v.id}>
              <button type="button" onClick={() => setPlaying(v.id)} className="group block w-full text-left">
                <span className="relative block aspect-video overflow-hidden rounded-[1.75rem] bg-zinc-900 ring-1 ring-white/10">
                  <Thumb v={v} className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
                  <span className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-zinc-950/40 text-zinc-50 backdrop-blur-md">
                    <Play size={16} weight="fill" />
                  </span>
                </span>
                <span className="mt-4 block text-xl font-medium tracking-tight text-zinc-50">{v.title}</span>
                <span className="mt-1 block text-sm text-zinc-400">{v.type}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <VideoPlayer id={playing} title={videos.find((v) => v.id === playing)?.title} onClose={() => setPlaying(null)} />
    </section>
  );
}
