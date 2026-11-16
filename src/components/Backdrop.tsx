'use client';

import { useEffect, useRef, useState } from 'react';

type Layer = { id: number; src: string };

/**
 * Fond flou et assombri qui change en fondu enchaîné quand `src` change.
 * Jusqu'à trois couches coexistent : si on survole vite plusieurs photos, le fondu en
 * cours n'est jamais coupé net, le suivant se pose simplement par-dessus.
 */
export default function Backdrop({ src }: { src: string }) {
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, src }]);
  const counter = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLayers((prev) =>
      prev[prev.length - 1].src === src ? prev : [...prev.slice(-2), { id: ++counter.current, src }],
    );
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLayers((prev) => prev.slice(-1)), 1600);
  }, [src]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      {/* L'animation reste sur chaque nouvelle couche : la retirer en plein fondu ferait sauter l'opacité */}
      {layers.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={l.id}
          src={l.src}
          alt=""
          draggable={false}
          className={`absolute inset-0 size-full scale-125 object-cover blur-2xl brightness-[0.33] saturate-[1.25] ${
            l.id > 0 ? 'backdrop-in' : ''
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[rgb(10_11_12/0.3)]" />
    </div>
  );
}
