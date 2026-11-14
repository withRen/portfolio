import type { MetadataRoute } from 'next';
import { DESCRIPTION, NAME, TITLE } from '@/lib/seo';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: TITLE,
    short_name: NAME,
    description: DESCRIPTION,
    lang: 'fr',
    start_url: '/',
    display: 'browser',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
