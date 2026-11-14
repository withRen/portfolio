import { asset } from '@/data/content';
import { dictionaries } from '@/i18n/dictionaries';
import { languageNames, locales, paths, type Locale, type PageKey } from '@/i18n/config';

type Props = { locale: Locale; page: PageKey; className?: string };

/** Sélecteur de langue : FR · EN · RU, chaque lien mène à la même page dans l'autre langue. */
export default function LangSwitch({ locale, page, className = '' }: Props) {
  const t = dictionaries[locale];
  return (
    <nav aria-label={t.lang.label} className={className}>
      <ul className="flex items-center gap-1">
        {locales.map((l) => {
          const current = l === locale;
          return (
            <li key={l}>
              <a
                href={asset(paths[page][l])}
                hrefLang={l}
                lang={l}
                aria-current={current ? 'page' : undefined}
                aria-label={languageNames[l]}
                className={`inline-flex min-h-8 min-w-8 items-center justify-center px-1 uppercase transition-opacity duration-300 ${
                  current ? 'underline decoration-1 underline-offset-[5px]' : 'opacity-55 hover:opacity-100'
                }`}
              >
                {l}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
