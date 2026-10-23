import { tools } from '@/data/content';
import Reveal from './Reveal';

export default function Tools() {
  return (
    <section id="outils" aria-labelledby="tools-title" className="border-t border-zinc-800 py-12 md:py-20">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-5 md:grid-cols-12 md:px-10">
        <Reveal as="h2" className="label pt-2 text-zinc-500 md:col-span-3">
          <span id="tools-title">04 — Outils</span>
        </Reveal>
        <Reveal
          as="ul"
          className="text-xl leading-[1.4] tracking-tight text-zinc-400 md:col-span-8 md:col-start-5 md:text-3xl"
        >
          {tools.map((t, i) => (
            <li key={t.name} className="inline">
              {t.name}
              {t.note && <span className="label ml-2 align-middle text-zinc-600">{t.note}</span>}
              {i < tools.length - 1 && <span className="text-zinc-700"> / </span>}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
