'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { kindLabel, works, type Kind, type Work } from '@/data/content';
import GridView from './GridView';
import Lightbox from './Lightbox';
import ListView from './ListView';
import SliderView from './SliderView';

type Filter = 'all' | Kind;
type View = 'list' | 'grid' | 'slider';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'dev', label: 'Dev' },
  { id: 'video', label: 'Vidéo' },
  { id: 'photo', label: 'Photo' },
];

const views: { id: View; label: string }[] = [
  { id: 'list', label: 'Liste' },
  { id: 'grid', label: 'Grille' },
  { id: 'slider', label: 'Slider' },
];

const pad = (n: number) => String(n).padStart(2, '0');

const tab = (on: boolean) =>
  `label whitespace-nowrap border-b py-1 transition-colors duration-300 hover:text-zinc-100 ${
    on ? 'border-accent text-zinc-100' : 'border-transparent text-zinc-500'
  }`;

function ViewSwitch({ view, onChange, className }: { view: View; onChange: (v: View) => void; className?: string }) {
  return (
    <div role="group" aria-label="Mode d'affichage" className={`flex gap-5 ${className ?? ''}`}>
      {views.map((v) => (
        <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => onChange(v.id)} className={tab(view === v.id)}>
          {v.label}
        </button>
      ))}
    </div>
  );
}

export default function Portfolio({ onPanel }: { onPanel: (p: 'about' | 'contact') => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('list');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const go = useRef<(delta: number) => void>(() => {});
  const registerGo = useCallback((fn: (delta: number) => void) => {
    go.current = fn;
  }, []);

  const items = useMemo(() => (filter === 'all' ? works : works.filter((w) => w.kind === filter)), [filter]);
  const photos = useMemo(() => items.filter((w) => w.kind === 'photo'), [items]);
  const counts = useMemo(
    () => ({
      all: works.length,
      dev: works.filter((w) => w.kind === 'dev').length,
      video: works.filter((w) => w.kind === 'video').length,
      photo: works.filter((w) => w.kind === 'photo').length,
    }),
    [],
  );

  const openPhoto = (w: Work) => setLightbox(photos.findIndex((p) => p.id === w.id));
  const changeFilter = (f: Filter) => {
    setFilter(f);
    setActive(0);
  };
  const changeView = (v: View) => {
    setView(v);
    setActive(0);
  };

  const current = items[Math.min(active, items.length - 1)];
  const isSlider = view === 'slider';

  return (
    <div id="catalogue" className="grid h-[100dvh] grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto]">
      <header className="border-b border-zinc-800">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10">
          <div className="flex items-center gap-5">
            <h2 className="sr-only">Catalogue des réalisations</h2>
            <span aria-hidden className="text-lg font-semibold tracking-tighter">
              RT
            </span>
            <p aria-hidden className="label hidden leading-snug text-zinc-500 lg:block">
              Rahim Tamhaev
              <br />
              Développeur et vidéaste
            </p>
          </div>

          <nav
            aria-label="Filtres"
            className="order-3 col-span-2 flex gap-6 overflow-x-auto [scrollbar-width:none] md:order-none md:col-span-1 [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
                className={tab(filter === f.id)}
              >
                {f.label}
                <span className="ml-0.5 text-zinc-600">({counts[f.id]})</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-6">
            <ViewSwitch view={view} onChange={changeView} className="hidden md:flex" />
            <span aria-hidden className="hidden h-4 w-px bg-zinc-800 md:block" />
            <button type="button" onClick={() => onPanel('about')} className={tab(false)}>
              À propos
            </button>
            <button type="button" onClick={() => onPanel('contact')} className={tab(false)}>
              Contact
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-0 pt-5" id="contenu">
        {view === 'list' && <ListView key={`list-${filter}`} items={items} onPhoto={openPhoto} />}
        {view === 'grid' && <GridView key={`grid-${filter}`} items={items} onPhoto={openPhoto} />}
        {isSlider && (
          <SliderView
            key={`slider-${filter}`}
            items={items}
            active={active}
            onActive={setActive}
            onPhoto={openPhoto}
            registerGo={registerGo}
          />
        )}
      </main>

      <footer className="relative border-t border-zinc-800">
        {isSlider && (
          <span
            aria-hidden
            className="absolute -top-px left-0 h-px bg-accent transition-[width] duration-500 ease-out-expo"
            style={{ width: `${((Math.min(active, items.length - 1) + 1) / items.length) * 100}%` }}
          />
        )}
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 px-5 py-4 md:grid-cols-3 md:px-10">
          <p className="label order-1 text-zinc-500">
            {filters.find((f) => f.id === filter)?.label}({items.length})
          </p>

          <p aria-live="polite" className="label order-3 col-span-2 min-h-[2.4em] leading-snug text-zinc-300 md:order-2 md:col-span-1 md:text-center">
            {isSlider && current && (
              <>
                {current.title}
                <br />
                <span className="text-zinc-500">
                  {kindLabel[current.kind]}
                  {current.tags[0] ? ` · ${current.tags[0]}` : ''}
                </span>
              </>
            )}
          </p>

          <div className="order-2 flex items-center justify-end gap-4 md:order-3">
            {isSlider ? (
              <>
                <span className="label text-zinc-500">
                  {pad(Math.min(active, items.length - 1) + 1)} / {pad(items.length)}
                </span>
                <button
                  type="button"
                  aria-label="Précédent"
                  onClick={() => go.current(-1)}
                  className="label rounded-sm border border-zinc-700 px-3 py-2 text-zinc-300 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]"
                >
                  Préc.
                </button>
                <button
                  type="button"
                  aria-label="Suivant"
                  onClick={() => go.current(1)}
                  className="label rounded-sm border border-zinc-700 px-3 py-2 text-zinc-300 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]"
                >
                  Suiv.
                </button>
              </>
            ) : (
              <ViewSwitch view={view} onChange={changeView} className="md:hidden" />
            )}
          </div>
          {isSlider && <ViewSwitch view={view} onChange={changeView} className="order-4 col-span-2 md:hidden" />}
        </div>
      </footer>

      <Lightbox
        photos={photos}
        index={lightbox}
        onIndex={setLightbox}
        onClose={() => setLightbox(null)}
      />

    </div>
  );
}
