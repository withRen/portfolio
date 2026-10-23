'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { videos, ytThumb } from '@/data/content';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';
import VideoPlayer from './VideoPlayer';

const embed = (id: string, params: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?${params}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;

const glassBtn =
  'inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 active:scale-[0.98]';

/**
 * Netflix-style billboard: the selected film fills a near full-screen rounded frame
 * with a muted preview behind its title, a row of films below, and a full-screen player.
 * The preview only loads while the billboard is on screen, on wide screens, with motion allowed.
 */
export default function VideoSection() {
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const [canPreview, setCanPreview] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [thumb, setThumb] = useState<Record<string, string>>({});
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  const film = videos[current];
  const showPreview = canPreview && inView && !playing;

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setCanPreview(wide.matches && !calm.matches);
    sync();
    wide.addEventListener('change', sync);
    calm.addEventListener('change', sync);
    const el = stage.current;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      wide.removeEventListener('change', sync);
      calm.removeEventListener('change', sync);
    };
  }, []);

  // Reset the preview when the film changes or the billboard leaves the screen
  useEffect(() => {
    setReady(false);
    setMuted(true);
  }, [current, inView]);

  // Size the iframe so a 16:9 video covers the whole frame, like object-fit: cover
  useEffect(() => {
    const el = stage.current;
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
  }, [showPreview, current]);

  const command = (func: string) =>
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');

  const toggleSound = () => {
    command(muted ? 'unMute' : 'mute');
    setMuted(!muted);
  };

  const src = (id: string) => thumb[id] ?? ytThumb(id);

  return (
    <section id="videos" aria-labelledby="videos-title" className="py-24 md:py-32">
      <SectionTitle
        id="videos-title"
        title="Vidéo"
        lead="Courts-métrages, publicités produits et projets créatifs, du tournage à l'étalonnage."
        className="mx-auto max-w-[1400px] px-5 md:px-10"
      />

      <Reveal className="sd-zoom mt-12 px-3 md:mt-16 md:px-5">
        <div
          ref={stage}
          className="relative isolate h-[min(86dvh,58rem)] min-h-[30rem] overflow-hidden rounded-[1.75rem] bg-zinc-900 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/10 md:rounded-[2.25rem]"
        >
          <div className="sd-parallax absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={film.id}
              src={src(film.id)}
              alt={`Image tirée de ${film.title}`}
              onError={() => setThumb((t) => ({ ...t, [film.id]: ytThumb(film.id, 'hqdefault') }))}
              className="backdrop-in absolute inset-0 size-full object-cover"
            />
            {showPreview && (
              <iframe
                key={film.id}
                ref={frame}
                title=""
                aria-hidden
                tabIndex={-1}
                allow="autoplay; encrypted-media"
                onLoad={() => setTimeout(() => setReady(true), 900)}
                src={embed(film.id, `autoplay=1&mute=1&controls=0&loop=1&playlist=${film.id}&enablejsapi=1`)}
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
                  ready ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>

          {/* Legibility: fade to the page at the bottom and behind the title on the left */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/10 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 pb-40 md:max-w-3xl md:p-14 md:pb-56">
            <div key={film.id} className="row-in">
              <h3 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-zinc-50 md:text-8xl">
                {film.title}
              </h3>
              <p className="mt-4 text-zinc-300 md:text-lg">{film.type}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying(film.id)}
                className="inline-flex items-center gap-2.5 rounded-full bg-zinc-50 px-7 py-3 font-medium text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Play size={18} weight="fill" />
                Lecture
              </button>
              <a href={film.href} target="_blank" rel="noopener noreferrer" className={glassBtn}>
                YouTube
                <ArrowUpRight size={16} weight="regular" />
              </a>
            </div>
          </div>

          {showPreview && ready && (
            <button
              type="button"
              onClick={toggleSound}
              aria-label={muted ? 'Activer le son de l’extrait' : 'Couper le son de l’extrait'}
              className="absolute right-6 top-6 inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-zinc-950/30 text-zinc-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 md:right-10 md:top-10"
            >
              {muted ? <SpeakerSlash size={18} weight="regular" /> : <SpeakerHigh size={18} weight="regular" />}
            </button>
          )}

          {/* Row of films, overlapping the bottom of the billboard */}
          <div className="absolute inset-x-0 bottom-0 pb-6 md:pb-10">
            <ul
              aria-label="Films"
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 pt-4 [scrollbar-width:none] md:gap-4 md:px-14 [&::-webkit-scrollbar]:hidden"
            >
              {videos.map((v, i) => {
                const active = i === current;
                return (
                  <li key={v.id} className="shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => setCurrent(i)}
                      aria-pressed={active}
                      aria-label={`Afficher ${v.title}`}
                      className={`group relative block aspect-video w-44 overflow-hidden rounded-2xl bg-zinc-900 ring-1 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:scale-[1.04] active:scale-[0.98] md:w-64 ${
                        active ? 'ring-2 ring-zinc-50' : 'ring-white/15'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb[v.id] ?? ytThumb(v.id, 'hqdefault')}
                        alt=""
                        loading="lazy"
                        className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
                          active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`}
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/90 to-transparent px-3 pb-2.5 pt-8 text-left text-sm font-medium text-zinc-50">
                        {v.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>

      <VideoPlayer id={playing} title={videos.find((v) => v.id === playing)?.title} onClose={() => setPlaying(null)} />
    </section>
  );
}
