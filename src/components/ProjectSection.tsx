import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { otherProjects } from '@/data/content';
import ProjectStrip from './ProjectStrip';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

export default function ProjectSection() {
  return (
    <section id="dev" aria-labelledby="dev-title" className="pt-24 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionTitle
          id="dev-title"
          title="Développement"
          lead="Jeux, outils créatifs et sites sur mesure. Les projets sur lesquels j'ai le plus appris."
        />
      </div>
      <ProjectStrip />

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
