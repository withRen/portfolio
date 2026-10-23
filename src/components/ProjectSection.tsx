import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { featured, otherProjects, type Featured } from '@/data/content';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

/*
 * Featured projects on a 3D arc (inspired by Awwwards SOTD huyml.co):
 * the section pins, a registered custom property --pj runs from 0 to n-1 with the
 * scroll (CSS scroll-driven animation), and every card / info block derives its
 * position from its distance to --pj. Pure CSS, no scroll listener (globals.css, .pj-*).
 * Without support or with reduced motion, a static list (.pj-static) is shown instead.
 */

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full bg-white/[0.07] px-3 py-1.5 font-mono text-xs text-zinc-300 ring-1 ring-white/10">
    {children}
  </span>
);

function Links({ p }: { p: Featured }) {
  if (p.links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {p.links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
            i === 0
              ? 'bg-zinc-50 text-zinc-950'
              : 'border border-white/20 bg-white/5 text-zinc-100 backdrop-blur-md hover:bg-white/15'
          }`}
        >
          {l.label}
          <ArrowUpRight
            size={14}
            weight="regular"
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      ))}
    </div>
  );
}

function Info({ p }: { p: Featured }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-zinc-400">{p.context}</p>
        <h3 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.88] tracking-tight text-zinc-50 md:text-7xl xl:text-8xl">
          {p.title}
        </h3>
        <p className="mt-5 text-lg font-medium tracking-tight text-zinc-100 md:text-xl">{p.tagline}</p>
        <p className="mt-3 max-w-[46ch] leading-relaxed text-zinc-400">{p.desc}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
      <Links p={p} />
    </div>
  );
}

function Cover({ p, className = '' }: { p: Featured; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-[1.75rem] bg-zinc-900 ring-1 ring-white/10 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.cover}
        alt={`Aperçu de ${p.title}`}
        loading="lazy"
        draggable={false}
        className="pj-img size-full object-cover"
      />
    </span>
  );
}

export default function ProjectSection() {
  const n = featured.length;

  return (
    <section id="dev" aria-labelledby="dev-title" className="pt-24 md:pt-32">
      <SectionTitle
        id="dev-title"
        title="Développement"
        lead="Jeux, outils créatifs et sites sur mesure. Les projets sur lesquels j'ai le plus appris."
        className="mx-auto max-w-[1400px] px-5 md:px-10"
      />

      {/* Keyframes depend on the number of projects */}
      <style>{`@keyframes pj-progress { from { --pj: 0; } to { --pj: ${n - 1}; } }`}</style>

      <div className="pj-section mt-8" style={{ '--n': n } as CSSProperties}>
        <div className="pj-stage">
          <div className="pj-arc" aria-hidden>
            {featured.map((p, i) => (
              <div key={p.id} className="pj-card" style={{ '--i': i } as CSSProperties}>
                <Cover p={p} className="size-full shadow-[0_50px_120px_-40px_rgb(0_0_0/0.9)]" />
              </div>
            ))}
          </div>

          <ol className="pj-infos">
            {featured.map((p, i) => (
              <li key={p.id} className="pj-info" style={{ '--i': i } as CSSProperties}>
                <Info p={p} />
              </li>
            ))}
          </ol>

          <div className="pj-rail" aria-hidden>
            {featured.map((p, i) => (
              <span key={p.id} className="pj-tick" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback: no scroll-driven animations, or reduced motion */}
      <ol className="pj-static mx-auto mt-12 flex max-w-[1400px] flex-col gap-16 px-5 md:px-10">
        {featured.map((p) => (
          <li key={p.id} className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
            <Cover p={p} className="aspect-[16/10] md:col-span-7 md:col-start-6 md:row-start-1" />
            <div className="md:col-span-5 md:col-start-1 md:row-start-1">
              <Info p={p} />
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal className="sd-rise">
          <h3 className="text-2xl font-semibold tracking-tighter text-zinc-50 md:text-3xl">Autres projets</h3>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {otherProjects.map((p, i) => {
            const body = (
              <>
                <span className="min-w-0">
                  <span className="flex items-center gap-3">
                    <span className="text-lg font-semibold tracking-tight text-zinc-50 transition-colors duration-300 group-hover:text-accent">
                      {p.title}
                    </span>
                    {p.status && (
                      <span className="rounded-full border border-accent/40 px-2.5 py-0.5 text-xs text-accent">
                        {p.status}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-zinc-400">{p.desc}</span>
                  <span className="mt-3 block font-mono text-xs text-zinc-500">{p.stack.join(', ')}</span>
                </span>
                {p.href && (
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-zinc-950">
                    <ArrowUpRight size={16} weight="regular" aria-hidden />
                  </span>
                )}
              </>
            );
            const cls =
              'group glass flex items-start justify-between gap-6 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-[transform,border-color] duration-500 ease-out-expo';
            return (
              <Reveal as="li" key={p.id} index={i % 2} className={i % 2 ? 'sd-rise-late' : 'sd-rise'}>
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} hover:-translate-y-0.5 hover:border-white/20 active:scale-[0.99]`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
