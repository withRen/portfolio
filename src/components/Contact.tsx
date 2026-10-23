import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { socials } from '@/data/content';
import Reveal from './Reveal';

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-zinc-800 pb-8 pt-24 md:pt-48">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <span className="label mb-8 block text-zinc-500">05 — Contact</span>
          <h2 id="contact-title" className="text-5xl font-semibold leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl">
            Un projet,
            <br />
            une idée ?
          </h2>
        </Reveal>
        <Reveal className="mt-10 md:mt-16">
          <a
            href="https://www.linkedin.com/in/rahim-tamhaev"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 border-b border-zinc-600 pb-2 text-2xl font-medium tracking-tight transition-colors duration-300 hover:border-accent hover:text-accent active:scale-[0.98] md:text-3xl"
          >
            Écrire sur LinkedIn
            <ArrowUpRight
              size={28}
              weight="regular"
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-zinc-800 pt-6 md:mt-36">
          <span className="label text-zinc-500">&copy; 2026 Rahim Tamhaev</span>
          <ul className="label flex gap-7 text-zinc-500">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </section>
  );
}
