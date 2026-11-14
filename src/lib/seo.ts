import type { Metadata } from 'next';
import { getContent, socials } from '@/data/content';
import { htmlLang, languageAlternates, locales, ogLocale, paths, type Locale, type PageKey } from '@/i18n/config';
import { dictionaries } from '@/i18n/dictionaries';

/*
 * Référencement : métadonnées par langue (hreflang, Open Graph) et données structurées
 * schema.org (JSON-LD). Ces données décrivent le portfolio aux moteurs de recherche et
 * aux moteurs de réponse (Google, Bing, ChatGPT, Perplexity, Claude…), y compris les
 * projets que le carrousel n'affiche qu'un par un.
 */

export const SITE = 'https://tamhaev.dev';
export const NAME = 'Rahim Tamhaev';

/** Image de partage de chaque langue (routes src/app/og*.png) */
export const OG_PATH: Record<Locale, string> = { fr: '/og.png', en: '/og-en.png', ru: '/og-ru.png' };

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE}${path}`);

/** Métadonnées communes à toutes les pages d'une langue (posées par le layout) */
export function siteMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale].meta;
  return {
    metadataBase: new URL(SITE),
    title: { default: t.title, template: `%s · ${NAME}` },
    description: t.description,
    applicationName: NAME,
    // Les liens sortants n'envoient que le nom de domaine, jamais l'adresse complète de la page
    referrer: 'strict-origin-when-cross-origin',
    authors: [{ name: NAME, url: SITE }],
    creator: NAME,
    robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    formatDetection: { telephone: false, email: false, address: false },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

/** Métadonnées propres à une page : adresse canonique, versions dans les autres langues, aperçu de partage */
export function pageMetadata(locale: Locale, page: PageKey, opts: { title?: string; description?: string } = {}): Metadata {
  const t = dictionaries[locale].meta;
  const title = opts.title ? `${opts.title} · ${NAME}` : t.title;
  const description = opts.description ?? (page === 'home' ? t.short : t.description);
  const image = { url: OG_PATH[locale], width: 1200, height: 630, alt: t.title };
  return {
    ...(opts.title ? { title: opts.title } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    alternates: { canonical: paths[page][locale], languages: languageAlternates(page) },
    openGraph: {
      type: page === 'home' ? 'profile' : 'article',
      ...(page === 'home' ? { firstName: 'Rahim', lastName: 'Tamhaev' } : {}),
      siteName: NAME,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url: paths[page][locale],
      title,
      description,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

const KNOWS: Record<Locale, string[]> = {
  fr: ['Développement web', 'Développement mobile', 'Réalité virtuelle', 'Réalisation vidéo', 'Montage vidéo', 'Étalonnage', 'Photographie'],
  en: ['Web development', 'Mobile development', 'Virtual reality', 'Filmmaking', 'Video editing', 'Color grading', 'Photography'],
  ru: ['Веб-разработка', 'Мобильная разработка', 'Виртуальная реальность', 'Видеосъёмка', 'Видеомонтаж', 'Цветокоррекция', 'Фотография'],
};
const TECH = ['Unity', 'C#', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Swift', 'SwiftUI', 'Kotlin', 'PHP', 'WordPress', 'WebGL', 'WebGPU', 'Web Audio API', 'UI / UX'];

const PERSON = `${SITE}/#rahim`;
const WEBSITE = `${SITE}/#site`;

export function homeJsonLd(locale: Locale) {
  const t = dictionaries[locale].meta;
  const { featured, videos } = getContent(locale);
  const home = abs(paths.home[locale]);
  const lang = htmlLang[locale];

  const person = {
    '@type': 'Person',
    '@id': PERSON,
    name: NAME,
    ...(locale === 'ru' ? { alternateName: 'Рахим Тамхаев' } : {}),
    givenName: 'Rahim',
    familyName: 'Tamhaev',
    url: `${SITE}/`,
    image: abs('/icon-512.png'),
    jobTitle: t.jobTitle,
    description: t.bio,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'IUT de Béziers, Université de Montpellier',
      url: 'https://iut-beziers.edu.umontpellier.fr/',
    },
    knowsLanguage: ['fr', 'en', 'ru'],
    knowsAbout: [...KNOWS[locale], ...TECH],
    sameAs: socials.map((s) => s.href),
  };

  const projects = featured.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CreativeWork',
      name: p.title,
      headline: p.tagline,
      description: p.desc,
      keywords: p.stack.join(', '),
      creator: { '@id': PERSON },
      inLanguage: lang,
      image: abs(p.cover),
      ...(p.links[0] ? { url: p.links[0].href } : {}),
    },
  }));

  // Les vidéos sont parfois publiées sur la chaîne d'un camarade : on ne s'attribue
  // aucun rôle précis, elles sont seulement rattachées au portfolio.
  const films = videos.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'VideoObject',
      name: v.title,
      description: t.videoDesc(v.type),
      thumbnailUrl: abs(`/films/${v.id}.jpg`),
      uploadDate: v.uploaded,
      duration: v.duration,
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE,
        url: `${SITE}/`,
        name: NAME,
        inLanguage: locales.map((l) => htmlLang[l]),
        publisher: { '@id': PERSON },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${home}#page`,
        url: home,
        name: t.title,
        description: t.description,
        isPartOf: { '@id': WEBSITE },
        inLanguage: lang,
        mainEntity: person,
        hasPart: [
          { '@type': 'ItemList', name: t.projectsList, itemListElement: projects },
          { '@type': 'ItemList', name: t.videosList, itemListElement: films },
        ],
      },
    ],
  };
}

/** Sérialisation sûre dans une balise <script> */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
