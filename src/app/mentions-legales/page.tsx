import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { asset, contactHref } from '@/data/content';

export const metadata: Metadata = {
  title: 'Mentions légales · Rahim Tamhaev',
  description: 'Éditeur, hébergeur et propriété intellectuelle du site tamhaev.dev.',
  alternates: { canonical: '/mentions-legales/' },
  openGraph: { url: '/mentions-legales/', title: 'Mentions légales · Rahim Tamhaev' },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="14 novembre 2026">
      <p>
        Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique
        (LCEN), voici les informations relatives au site <strong>tamhaev.dev</strong>.
      </p>

      <h2>Éditeur et directeur de la publication</h2>
      <p>
        Rahim Tamhaev, personne physique. Site personnel non commercial présentant son travail.
        <br />
        Contact :{' '}
        <a href={contactHref} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>

      <h2>Hébergement</h2>
      <p>
        GitHub Pages, service de GitHub, Inc.
        <br />
        88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis
        <br />
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          github.com
        </a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les photographies, vidéos, textes, visuels et le code de ce site sont la propriété de Rahim Tamhaev, sauf
        mention contraire. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite. Les
        noms et logos de marques tierces citées appartiennent à leurs propriétaires respectifs.
      </p>

      <h2>Crédits</h2>
      <ul>
        <li>Polices Geist et Geist Mono (Vercel) et Barlow Condensed, sous licence SIL Open Font License.</li>
        <li>Icônes Phosphor, sous licence MIT.</li>
        <li>Vidéos hébergées par YouTube, lues uniquement avec votre accord.</li>
      </ul>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le site ne dépose aucun cookie et ne mesure pas l’audience. Le détail est expliqué dans la{' '}
        <a href={asset('/confidentialite/')}>politique de confidentialité</a>.
      </p>

      <h2>Liens externes</h2>
      <p>
        Les liens vers d’autres sites (GitHub, LinkedIn, Instagram, YouTube, sites de projets) sont fournis à titre
        d’information. Leur contenu et leur politique de données relèvent de leurs éditeurs.
      </p>
    </LegalPage>
  );
}
