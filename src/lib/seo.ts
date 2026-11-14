import { featured, socials, videos } from '@/data/content';

/*
 * Référencement : constantes du site et données structurées schema.org (JSON-LD).
 * Ces données décrivent le portfolio aux moteurs de recherche et aux moteurs de réponse
 * (Google, Bing, ChatGPT, Perplexity, Claude…), y compris les projets que le carrousel
 * n'affiche qu'un par un.
 */

export const SITE = 'https://tamhaev.dev';
export const NAME = 'Rahim Tamhaev';
export const TITLE = 'Rahim Tamhaev, développeur et vidéaste';
export const DESCRIPTION =
  'Portfolio de Rahim Tamhaev, étudiant en BUT MMI à l’IUT de Béziers : développement web, mobile, desktop et réalité virtuelle, vidéo et photographie.';

/** Champs Open Graph communs, à reprendre dans chaque page qui définit son propre openGraph */
export const OG_BASE = {
  siteName: NAME,
  locale: 'fr_FR',
  images: [{ url: '/og.png', width: 1200, height: 630, alt: TITLE }],
};

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE}${path}`);

const PERSON = `${SITE}/#rahim`;
const WEBSITE = `${SITE}/#site`;

export function homeJsonLd() {
  const person = {
    '@type': 'Person',
    '@id': PERSON,
    name: NAME,
    givenName: 'Rahim',
    familyName: 'Tamhaev',
    url: `${SITE}/`,
    image: abs('/icon.svg'),
    jobTitle: 'Développeur et vidéaste',
    description:
      'Étudiant en BUT Métiers du Multimédia et de l’Internet (MMI). Développe des applications web, mobiles, desktop et en réalité virtuelle, réalise des vidéos et des photographies.',
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'IUT de Béziers, Université de Montpellier',
      url: 'https://iut-beziers.edu.umontpellier.fr/',
    },
    knowsLanguage: ['fr'],
    knowsAbout: [
      'Développement web',
      'Développement mobile',
      'Réalité virtuelle',
      'Unity',
      'C#',
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Node.js',
      'Swift',
      'SwiftUI',
      'Kotlin',
      'PHP',
      'WordPress',
      'WebGL',
      'WebGPU',
      'Web Audio API',
      'Réalisation vidéo',
      'Montage vidéo',
      'Étalonnage',
      'Photographie',
      'UI / UX',
    ],
    sameAs: socials.map((s) => s.href),
  };

  const projects = featured.map((p, i) => {
    const link = p.links[0]?.href;
    const image = p.cover;
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        headline: p.tagline,
        description: p.desc,
        keywords: p.stack.join(', '),
        creator: { '@id': PERSON },
        inLanguage: 'fr',
        ...(image ? { image: abs(image) } : {}),
        ...(link ? { url: link } : {}),
      },
    };
  });

  // Les vidéos sont parfois publiées sur la chaîne d'un camarade : on ne s'attribue
  // aucun rôle précis, elles sont seulement rattachées au portfolio.
  const films = videos.map((v) => ({
    '@type': 'VideoObject',
    name: v.title,
    description: `${v.type}, présenté dans le portfolio de ${NAME}.`,
    thumbnailUrl: abs(`/films/${v.id}.jpg`),
    uploadDate: v.uploaded,
    duration: v.duration,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    inLanguage: 'fr',
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE,
        url: `${SITE}/`,
        name: NAME,
        description: DESCRIPTION,
        inLanguage: 'fr-FR',
        publisher: { '@id': PERSON },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#page`,
        url: `${SITE}/`,
        name: TITLE,
        isPartOf: { '@id': WEBSITE },
        inLanguage: 'fr-FR',
        mainEntity: person,
        hasPart: [
          { '@type': 'ItemList', name: 'Projets de développement', itemListElement: projects },
          { '@type': 'ItemList', name: 'Vidéos', itemListElement: films.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })) },
        ],
      },
    ],
  };
}

/** Sérialisation sûre dans une balise <script> */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
