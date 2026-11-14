import { getContent, socials } from '@/data/content';
import { dictionaries } from '@/i18n/dictionaries';
import { NAME, SITE } from '@/lib/seo';

const { featured, tools, videos } = getContent('fr');
const DESCRIPTION = dictionaries.fr.meta.description;

/*
 * /llms.txt : résumé du portfolio en Markdown pour les moteurs de réponse (ChatGPT,
 * Claude, Perplexity…), selon la proposition llmstxt.org. Généré au build à partir des
 * mêmes données que la page, il reste donc toujours à jour.
 */
export const dynamic = 'force-static';

export function GET() {
  const lines = [
    `# ${NAME}`,
    '',
    `> ${DESCRIPTION}`,
    '',
    `${NAME} est étudiant en BUT Métiers du Multimédia et de l’Internet (MMI) à l’IUT de Béziers (Université de Montpellier). Il développe des applications web, mobiles, desktop et en réalité virtuelle, et réalise des vidéos et des photographies. Site : ${SITE}/`,
    '',
    '## Projets de développement',
    '',
    ...featured.map((p) => {
      const link = p.links[0] ? ` Lien : ${p.links[0].href}` : '';
      return `- **${p.title}** (${p.context}) : ${p.tagline} ${p.desc} Technologies : ${p.stack.join(', ')}.${link}`;
    }),
    '',
    '## Vidéos',
    '',
    ...videos.map((v) => `- [${v.title}](https://www.youtube.com/watch?v=${v.id}) : ${v.type.toLowerCase()}.`),
    '',
    '## Outils',
    '',
    ...tools.map((t) => `- ${t.group} : ${t.items.join(', ')}`),
    '',
    '## Contact et profils',
    '',
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    '',
    '## Autres langues',
    '',
    `- [English version](${SITE}/en/) : the full portfolio in English.`,
    `- [Версия на русском](${SITE}/ru/) : полное портфолио на русском языке.`,
    '',
    '## Optional',
    '',
    `- [Mentions légales](${SITE}/mentions-legales/)`,
    `- [Politique de confidentialité](${SITE}/confidentialite/)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
