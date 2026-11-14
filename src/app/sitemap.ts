import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const pages = ['/', '/mentions-legales/', '/confidentialite/'];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `https://tamhaev.dev${path}`, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.3 }));
}
