import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-static';

/*
 * Tout le site est ouvert aux moteurs de recherche et aux moteurs de réponse (IA).
 * Les robots d'IA sont cités explicitement pour lever toute ambiguïté.
 */
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'MistralAI-User',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: AI_BOTS, allow: '/' }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
