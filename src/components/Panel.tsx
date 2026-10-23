'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode };

export default function Panel({ open, title, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
      className="m-0 ml-auto h-[100dvh] max-h-none w-full max-w-xl overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-0 text-zinc-100"
    >
      <div className="flex min-h-full flex-col px-6 py-5 md:px-10 md:py-6">
        <div className="label flex items-center justify-between text-zinc-500">
          <span>{title}</span>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="rounded-sm border border-zinc-700 px-4 py-2.5 text-zinc-300 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]"
          >
            Fermer
          </button>
        </div>
        <div className="flex-1 py-12">{children}</div>
      </div>
    </dialog>
  );
}
