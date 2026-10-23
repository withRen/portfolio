import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { projects, type Project } from '@/data/content';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

// Asymmetric 12-column rhythm: 7/5, 5/7, 6/6
const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7', 'md:col-span-6', 'md:col-span-6'];

const glass =
  'glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-30px_rgb(0_0_0/0.7)] backdrop-blur-xl';

function Card({ p }: { p: Project }) {
  const body = (
    <>
      {p.image && (
        <span className="relative block aspect-[16/9] overflow-hidden border-b border-white/10">
          <span className="sd-parallax absolute inset-0 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={`Aperçu du site ${p.title}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
          </span>
        </span>
      )}
      <span className="flex flex-1 flex-col justify-between gap-10 p-7 md:p-9">
        <span className="flex items-start justify-between gap-6">
          <span>
            <span className="block text-3xl font-semibold leading-none tracking-tighter text-zinc-50 md:text-4xl">
              {p.title}
            </span>
            <span className="mt-4 block max-w-[46ch] leading-relaxed text-zinc-400">{p.desc}</span>
          </span>
          {p.href ? (
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-zinc-950">
              <ArrowUpRight size={18} weight="regular" aria-hidden />
            </span>
          ) : (
            p.status && (
              <span className="shrink-0 rounded-full border border-accent/40 px-3 py-1.5 text-xs font-medium text-accent">
                {p.status}
              </span>
            )
          )}
        </span>
        <span className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-zinc-300">
              {s}
            </span>
          ))}
        </span>
      </span>
    </>
  );

  return p.href ? (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${glass} transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-white/20 active:scale-[0.99]`}
    >
      {body}
    </a>
  ) : (
    <div className={`group ${glass}`}>{body}</div>
  );
}

export default function ProjectSection() {
  return (
    <section id="dev" aria-labelledby="dev-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionTitle
          id="dev-title"
          title="Développement"
          lead="Applications natives pour l'écosystème Apple, sites sur mesure et outils desktop."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-12 md:gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.id} index={i % 2} className={`${i % 2 ? 'sd-rise-late' : 'sd-rise'} ${spans[i]}`}>
              <Card p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
