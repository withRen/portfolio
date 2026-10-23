'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import { socials, tools } from '@/data/content';
import Panel from './Panel';

export type PanelId = 'about' | 'contact' | null;

export default function InfoPanel({ panel, onClose }: { panel: PanelId; onClose: () => void }) {
  return (
      <Panel
        open={panel !== null}
        title={panel === 'contact' ? 'Contact' : 'À propos'}
        onClose={onClose}
      >
        {panel === 'about' && (
          <div className="flex flex-col gap-10">
            <p className="max-w-[30ch] text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              Mi-développeur, mi-vidéaste. Je code des interfaces et je filme des histoires.
            </p>
            <p className="max-w-[48ch] leading-relaxed text-zinc-400">
              Étudiant en BUT MMI. Développement web, mobile et desktop, création audiovisuelle et photographie.
            </p>
            <div>
              <p className="label mb-3 text-zinc-500">Outils</p>
              <ul className="flex flex-col divide-y divide-zinc-800 border-y border-zinc-800">
                {tools.map((t) => (
                  <li key={t} className="py-3 text-zinc-300">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="label text-zinc-600">&copy; 2026 Rahim Tamhaev</p>
          </div>
        )}
        {panel === 'contact' && (
          <div className="flex flex-col gap-10">
            <p className="text-5xl font-semibold leading-[0.95] tracking-tighter md:text-6xl">
              Un projet,
              <br />
              une idée ?
            </p>
            <a
              href="https://www.linkedin.com/in/rahim-tamhaev"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 self-start border-b border-zinc-600 pb-2 text-xl font-medium tracking-tight transition-colors duration-300 hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              Écrire sur LinkedIn
              <ArrowUpRight
                size={22}
                weight="regular"
                aria-hidden
                className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
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
          </div>
        )}
      </Panel>
  );
}
