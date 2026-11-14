import type { MetadataRoute } from 'next';
import { getContent } from '@/data/content';
import { languageAlternates, locales, paths, type PageKey } from '@/i18n/config';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-static';

// Date de la dernière vraie mise à jour du contenu (à changer quand le portfolio évolue)
const UPDATED = new Date('2026-11-14');

const abs = (path: string) => `${SITE}${path}`;
const alternates = (page: PageKey) => ({
  languages: Object.fromEntries(Object.entries(languageAlternates(page)).map(([k, v]) => [k, abs(v)])),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const { featured, photos } = getContent('fr');
  const images = [...featured.map((p) => p.cover), ...photos.map((p) => p.image)].map(abs);
  return locales.flatMap((l) => [
    { url: abs(paths.home[l]), lastModified: UPDATED, changeFrequency: 'monthly' as const, priority: 1, images, alternates: alternates('home') },
    { url: abs(paths.legal[l]), lastModified: UPDATED, changeFrequency: 'yearly' as const, priority: 0.2, alternates: alternates('legal') },
    { url: abs(paths.privacy[l]), lastModified: UPDATED, changeFrequency: 'yearly' as const, priority: 0.2, alternates: alternates('privacy') },
  ]);
}
