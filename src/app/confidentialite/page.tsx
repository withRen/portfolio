import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { contactHref } from '@/data/content';

export const metadata: Metadata = {
  title: 'Politique de confidentialité · Rahim Tamhaev',
  description: 'Données personnelles, cookies et vidéos YouTube sur tamhaev.dev.',
  alternates: { canonical: '/confidentialite/' },
  openGraph: { url: '/confidentialite/', title: 'Politique de confidentialité · Rahim Tamhaev' },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="14 novembre 2026">
      <p>
        Ce site est un portfolio personnel. Il a été conçu pour collecter le moins de données possible, conformément au
        Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Rahim Tamhaev, joignable via{' '}
        <a href={contactHref} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        .
      </p>

      <h2>Ce que le site ne fait pas</h2>
      <ul>
        <li>Aucun cookie déposé par le site.</li>
        <li>Aucune mesure d’audience, aucun outil de statistiques, aucune publicité.</li>
        <li>Aucun formulaire, aucun compte : vous ne saisissez aucune donnée.</li>
        <li>
          Les polices, images et miniatures des vidéos sont servies directement par le site, sans appel à un service
          tiers.
        </li>
      </ul>

      <h2>Hébergement et journaux techniques</h2>
      <p>
        Le site est hébergé par GitHub Pages (GitHub, Inc., États-Unis). Pour assurer la sécurité du service, GitHub
        peut enregistrer l’adresse IP des visiteurs dans ses journaux techniques. Ce traitement relève de GitHub :{' '}
        <a
          href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
          target="_blank"
          rel="noopener noreferrer"
        >
          déclaration de confidentialité de GitHub
        </a>
        .
      </p>

      <h2>Vidéos YouTube</h2>
      <p>
        Les films sont hébergés par YouTube (Google Ireland Limited et Google LLC). Le lecteur et les extraits ne sont
        chargés que si vous l’acceptez, au moment de lire une vidéo ou depuis le panneau « Cookies et confidentialité »
        en bas de page. Google peut alors déposer des cookies et collecter des données de navigation, avec de possibles
        transferts vers les États-Unis encadrés par le EU-U.S. Data Privacy Framework. Sans votre accord, rien n’est
        envoyé à Google, et vous pouvez ouvrir chaque vidéo directement sur YouTube.
      </p>
      <p>
        Pour en savoir plus :{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          règles de confidentialité de Google
        </a>
        .
      </p>

      <h2>Stockage local</h2>
      <p>
        Si vous faites un choix pour YouTube et demandez à le retenir, il est enregistré dans votre navigateur
        (stockage local, clé <code>consent.youtube</code>) pendant 6 mois au plus. Cette information sert uniquement à
        respecter votre choix ; vous pouvez la modifier à tout moment depuis le panneau « Cookies et confidentialité ».
      </p>

      <h2>Liens externes</h2>
      <p>
        Les liens vers GitHub, LinkedIn, Instagram, YouTube ou les sites de projets ouvrent des services tiers soumis à
        leur propre politique de confidentialité.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de limitation du traitement
        de vos données. Pour l’exercer, écrivez-moi via LinkedIn. Si vous estimez que vos droits ne sont pas respectés,
        vous pouvez adresser une réclamation à la{' '}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          CNIL
        </a>
        .
      </p>
    </LegalPage>
  );
}
