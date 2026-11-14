import type { Metadata } from 'next';
import RootHtml from '@/components/RootHtml';
import Logo from '@/components/Logo';
import { asset } from '@/data/content';

export const metadata: Metadata = {
  title: 'Page introuvable · Rahim Tamhaev',
  robots: { index: false, follow: true },
};

/* Page 404 commune aux trois langues (GitHub Pages sert 404.html pour toute adresse inconnue). */
export default function GlobalNotFound() {
  const links = [
    { href: '/', lang: 'fr', text: 'Page introuvable.', cta: 'Retour à l’accueil' },
    { href: '/en/', lang: 'en', text: 'Page not found.', cta: 'Back to the homepage' },
    { href: '/ru/', lang: 'ru', text: 'Страница не найдена.', cta: 'На главную' },
  ];
  return (
    <RootHtml locale="fr">
      <main className="mx-auto flex min-h-[100dvh] max-w-[72ch] flex-col justify-center gap-10 px-5">
        <Logo className="w-14 text-zinc-100" title="Rahim Tamhaev" />
        <h1 className="font-display text-8xl font-bold leading-none text-zinc-50">404</h1>
        <ul className="flex flex-col gap-4">
          {links.map((l) => (
            <li key={l.lang} lang={l.lang} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-zinc-300">{l.text}</span>
              <a href={asset(l.href)} hrefLang={l.lang} className="text-zinc-50 underline underline-offset-4 hover:text-accent">
                {l.cta}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </RootHtml>
  );
}
