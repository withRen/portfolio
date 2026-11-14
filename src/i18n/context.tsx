'use client';

import { createContext, useContext } from 'react';
import { asset, getContent, type Content } from '@/data/content';
import { paths, type Locale, type PageKey } from './config';
import { dictionaries, type Dict } from './dictionaries';

type I18n = { locale: Locale; t: Dict; content: Content; href: (page: PageKey, locale?: Locale) => string };

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value: I18n = {
    locale,
    t: dictionaries[locale],
    content: getContent(locale),
    href: (page, l = locale) => asset(paths[page][l]),
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Langue courante, textes de l'interface et contenu traduit */
export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé dans un I18nProvider');
  return ctx;
}
