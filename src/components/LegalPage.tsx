import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { asset } from '@/data/content';
import { paths, type Locale, type PageKey } from '@/i18n/config';
import { dictionaries } from '@/i18n/dictionaries';
import LangSwitch from './LangSwitch';
import Logo from './Logo';

type Props = { locale: Locale; page: PageKey; title: string; updated: string; children: React.ReactNode };

/** Mise en page commune des pages légales : lisible, sobre, sans animation. */
export default function LegalPage({ locale, page, title, updated, children }: Props) {
  const t = dictionaries[locale].legalPage;
  const home = asset(paths.home[locale]);
  return (
    <>
      <header className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-10">
        <a href={home} className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-zinc-50">
          <Logo className="size-7 text-zinc-100" title="" />
          Rahim Tamhaev
        </a>
        <div className="flex items-center gap-5">
          <LangSwitch locale={locale} page={page} className="text-sm text-zinc-300" />
          <a
            href={home}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={14} aria-hidden />
            {t.back}
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-[72ch] px-5 pb-32 pt-12 md:pt-20">
        <h1 className="text-4xl font-semibold leading-none tracking-tighter text-zinc-50 md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-400">
          {t.updated} {updated}
        </p>
        <div className="legal mt-12">{children}</div>
      </main>
    </>
  );
}
