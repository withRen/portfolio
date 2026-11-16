'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useI18n } from '@/i18n/context';

type Item = { id: string; title: string; thumb: string };

type Props = {
  label: string;
  items: Item[];
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  /** Miniatures cliquables à côté du compteur (ordinateur) */
  thumbs?: boolean;
  className?: string;
};

/*
 * Barre de navigation commune aux suites de contenus (vidéos, projets) :
 * ‹ 01 / 07 › puis les miniatures. Même composant, même place, même comportement,
 * pour qu'on navigue partout de la même façon.
 */
export default function MediaNav({ label, items, active, onPrev, onNext, onSelect, thumbs = true, className = '' }: Props) {
  const { t } = useI18n();
  const n = items.length;
  const pad = (i: number) => String(i).padStart(2, '0');
  const btn =
    'inline-flex size-9 items-center justify-center rounded-full text-zinc-100 transition-colors duration-300 hover:bg-white/15 active:scale-95';

  return (
    <nav aria-label={label} className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1 rounded-full bg-zinc-950/55 p-1 ring-1 ring-white/10 backdrop-blur-md">
        <button type="button" onClick={onPrev} aria-label={t.nav.prev} className={btn}>
          <CaretLeft size={16} aria-hidden />
        </button>
        <span className="label min-w-[4.5rem] text-center tabular-nums text-zinc-200" aria-live="polite">
          {pad(Math.max(0, active) + 1)} / {pad(n)}
        </span>
        <button type="button" onClick={onNext} aria-label={t.nav.next} className={btn}>
          <CaretRight size={16} aria-hidden />
        </button>
      </div>
      {thumbs && (
        <ul className="hidden gap-2 md:flex">
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={t.nav.goTo(it.title)}
                aria-current={i === active ? 'true' : undefined}
                className={`relative block aspect-video w-16 overflow-hidden rounded-lg ring-1 transition-[opacity,box-shadow] duration-500 ease-out-expo hover:opacity-100 ${
                  i === active ? 'opacity-100 ring-2 ring-zinc-50' : 'opacity-45 ring-white/20'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.thumb} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
