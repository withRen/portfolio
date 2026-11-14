import type { MetadataRoute } from 'next';
import { featured, photos } from '@/data/content';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-static';

// Date de la dernière vraie mise à jour du contenu (à changer quand le portfolio évolue)
const UPDATED = new Date('2026-11-14');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE}/`,
      lastModified: UPDATED,
      changeFrequency: 'monthly',
      priority: 1,
      images: [...featured.map((p) => p.cover), ...photos.map((p) => p.image)].map((src) => `${SITE}${src}`),
    },
    { url: `${SITE}/mentions-legales/`, lastModified: UPDATED, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/confidentialite/`, lastModified: UPDATED, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
