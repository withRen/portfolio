'use client';

import { useEffect, useState } from 'react';
import { navLinks } from '@/data/content';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 h-[4.5rem] border-b bg-zinc-950/90 backdrop-blur-md transition-colors duration-500 ${
          scrolled ? 'border-zinc-800' : 'border-transparent'
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#top" aria-label="Rahim Tamhaev, accueil" className="text-lg font-semibold tracking-tighter">
            RT
          </a>
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex gap-9">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`label group relative py-2 transition-colors duration-300 hover:text-zinc-100 ${
                      active === l.href ? 'text-zinc-100' : 'text-zinc-500'
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute inset-x-0 bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-100 ${
                        active === l.href ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="label py-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-30 flex flex-col justify-center gap-1 bg-zinc-950 px-5 pb-8 pt-[4.5rem] transition-[opacity,visibility] duration-500 ease-out-expo md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="text-[clamp(2.25rem,11vw,3.5rem)] font-semibold leading-[1.1] tracking-tighter text-zinc-400 active:text-accent"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
