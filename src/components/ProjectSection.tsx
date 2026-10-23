import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { featured, otherProjects, type Featured } from '@/data/content';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

/*
 * Featured projects as a sticky stack: each card pins near the top and recedes
 * (scale + dim) while the next one slides over it. The receding is driven by the
 * NEXT slot's view timeline (timeline-scope on the list), all in CSS (globals.css, .ps-*).
 * Each card alternates its composition so the stack never repeats the same layout twice in a row.
 */

const Chip = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full bg-white/[0.07] px-3 py-1.5 font-mono text-xs text-zinc-300 ring-1 ring-white/10">
    {children}
  </span>
);

function Media({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-[1.25rem] bg-zinc-900 ring-1 ring-white/10 ${className}`}>
      <span className="sd-parallax absolute inset-0 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
      </span>
    </span>
  );
}

function Info({ p, size = 'lg' }: { p: Featured; size?: 'lg' | 'xl' }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-zinc-400">{p.context}</p>
        <h3
          className={`mt-3 font-display font-bold uppercase leading-[0.88] tracking-tight text-zinc-50 ${
            size === 'xl' ? 'text-5xl md:text-8xl' : 'text-5xl md:text-7xl'
          }`}
        >
          {p.title}
        </h3>
        <p className="mt-4 text-lg font-medium tracking-tight text-zinc-100 md:text-xl">{p.tagline}</p>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-zinc-400">{p.desc}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
      {p.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
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
      )}
    </div>
  );
}

function Card({ p }: { p: Featured }) {
  const alt = `Aperçu de ${p.title}`;

  if (p.layout === 'full') {
    // Screenshot bleeds in from the right edge and fades under the text column
    return (
      <div className="relative md:h-full md:min-h-[32rem]">
        <span className="relative block aspect-[16/10] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[64%] md:[mask-image:linear-gradient(to_right,transparent,black_30%)]">
          <span className="sd-parallax absolute inset-0 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover} alt={alt} loading="lazy" className="size-full object-cover" />
          </span>
        </span>
        <div className="relative -mt-8 p-7 pt-0 md:absolute md:inset-y-0 md:left-0 md:mt-0 md:flex md:w-[46%] md:items-end md:p-14">
          <Info p={p} size="xl" />
        </div>
      </div>
    );
  }

  if (p.layout === 'stack') {
    return (
      <div className="flex h-full flex-col gap-6 p-5 md:gap-8 md:p-8">
        <Media src={p.cover} alt={alt} className="aspect-[16/9] md:aspect-auto md:min-h-0 md:flex-1" />
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Info p={p} />
          </div>
          {p.extra && (
            <Media
              src={p.extra}
              alt={`Lanceur du serveur ${p.title} dans le terminal`}
              className="aspect-[16/9] md:col-span-5"
            />
          )}
        </div>
      </div>
    );
  }

  const reverse = p.layout === 'split-reverse';
  return (
    <div className="grid h-full grid-cols-1 gap-6 p-5 md:grid-cols-12 md:gap-10 md:p-8">
      <div
        className={`flex flex-col gap-4 md:col-span-7 ${reverse ? 'md:order-1' : 'md:order-2'}`}
      >
        <Media src={p.cover} alt={alt} className="aspect-[16/10] md:aspect-auto md:min-h-0 md:flex-1" />
        {p.extra && <Media src={p.extra} alt={`Autre vue de ${p.title}`} className="hidden aspect-[16/7] md:block" />}
      </div>
      <div
        className={`flex flex-col justify-end md:col-span-5 md:py-6 ${reverse ? 'md:order-2' : 'md:order-1'}`}
      >
        <Info p={p} />
      </div>
    </div>
  );
}

export default function ProjectSection() {
  const scope = { timelineScope: featured.map((_, i) => `--ps-${i}`).join(', ') } as CSSProperties;

  return (
    <section id="dev" aria-labelledby="dev-title" className="py-24 md:py-32">
      <SectionTitle
        id="dev-title"
        title="Développement"
        lead="Jeux, outils créatifs et sites sur mesure. Les projets sur lesquels j'ai le plus appris."
        className="mx-auto max-w-[1400px] px-5 md:px-10"
      />

      <ol className="ps-list mx-auto mt-12 flex max-w-[1400px] flex-col gap-6 px-3 md:mt-16 md:gap-0 md:px-6" style={scope}>
        {featured.map((p, i) => {
          const next = featured[i + 1] ? `--ps-${i + 1}` : undefined;
          return (
            <li key={p.id} className="ps-slot" style={{ viewTimelineName: `--ps-${i}` } as CSSProperties}>
              <article
                aria-labelledby={`${p.id}-title`}
                className={`ps-card glass relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950/40 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_40px_100px_-40px_rgb(0_0_0/0.9)] backdrop-blur-xl md:rounded-[2.25rem] ${
                  next ? 'ps-recede' : ''
                }`}
                style={next ? ({ animationTimeline: next } as CSSProperties) : undefined}
              >
                {/* Each card is tinted by its own cover, blurred */}
                <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="size-full scale-125 object-cover opacity-60 blur-3xl brightness-[0.35] saturate-150"
                  />
                </span>
                <span id={`${p.id}-title`} className="sr-only">
                  {p.title}
                </span>
                <Card p={p} />
              </article>
            </li>
          );
        })}
      </ol>

      <div className="mx-auto mt-24 max-w-[1400px] px-5 md:mt-32 md:px-10">
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
