'use client';

import { useEffect, useRef, useState } from 'react';

type Layer = { id: number; src: string };

/** Blurred, darkened, translucent backdrop that cross-fades when `src` changes. */
export default function Backdrop({ src }: { src: string }) {
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, src }]);
  const counter = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLayers((prev) =>
      prev[prev.length - 1].src === src ? prev : [...prev.slice(-1), { id: ++counter.current, src }],
    );
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLayers((prev) => prev.slice(-1)), 1300);
  }, [src]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      {layers.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={l.id}
          src={l.src}
          alt=""
          draggable={false}
          className={`absolute inset-0 size-full scale-125 object-cover blur-2xl brightness-[0.33] saturate-[1.25] ${
            i > 0 ? 'backdrop-in' : ''
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[rgb(10_11_12/0.3)]" />
    </div>
  );
}
