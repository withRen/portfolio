/*
 * Langues du site. Le français reste à la racine (tamhaev.dev/), l'anglais et le russe
 * ont leur propre dossier (/en/, /ru/). Chaque page déclare sa langue et ses équivalents
 * (hreflang) pour que Google propose la bonne version à chacun.
 */

export const locales = ['fr', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

/** Texte disponible dans les trois langues */
export type T = Record<Locale, string>;

export type PageKey = 'home' | 'legal' | 'privacy';

/** Adresse de chaque page dans chaque langue (sans le domaine) */
export const paths: Record<PageKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en/', ru: '/ru/' },
  legal: { fr: '/mentions-legales/', en: '/en/legal-notice/', ru: '/ru/legal-notice/' },
  privacy: { fr: '/confidentialite/', en: '/en/privacy/', ru: '/ru/privacy/' },
};

export const languageNames: Record<Locale, string> = { fr: 'Français', en: 'English', ru: 'Русский' };
export const ogLocale: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US', ru: 'ru_RU' };
export const htmlLang: Record<Locale, string> = { fr: 'fr-FR', en: 'en', ru: 'ru' };

/** hreflang pour les métadonnées Next : chaque version + x-default (français) */
export function languageAlternates(page: PageKey) {
  return {
    'fr-FR': paths[page].fr,
    en: paths[page].en,
    ru: paths[page].ru,
    'x-default': paths[page].fr,
  };
}
