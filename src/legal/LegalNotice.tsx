import { asset, contactHref } from '@/data/content';
import { paths, type Locale } from '@/i18n/config';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Mentions légales (LCEN, art. 6) dans les trois langues. La version française fait foi. */
export default function LegalNotice({ locale }: { locale: Locale }) {
  const privacy = asset(paths.privacy[locale]);

  if (locale === 'en')
    return (
      <>
        <p>
          In accordance with article 6 of French law no. 2004-575 of 21 June 2004 on confidence in the digital economy
          (LCEN), here is the information about the website <strong>tamhaev.dev</strong>. The French version of this
          notice is the authoritative one.
        </p>
        <h2>Publisher and publication director</h2>
        <p>
          Rahim Tamhaev, private individual. Personal, non-commercial website presenting his work.
          <br />
          Contact:{' '}
          <a href={contactHref} {...ext}>
            LinkedIn
          </a>
        </p>
        <h2>Hosting</h2>
        <p>
          GitHub Pages, a service of GitHub, Inc.
          <br />
          88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States
          <br />
          <a href="https://github.com" {...ext}>
            github.com
          </a>
        </p>
        <h2>Intellectual property</h2>
        <p>
          The photographs, videos, texts, visuals and code of this website belong to Rahim Tamhaev unless stated
          otherwise. Any reproduction or reuse without prior written permission is prohibited. Third-party names and
          logos mentioned belong to their respective owners.
        </p>
        <h2>Credits</h2>
        <ul>
          <li>Geist and Geist Mono (Vercel), Barlow Condensed and Oswald typefaces, under the SIL Open Font License.</li>
          <li>
            Logo (RT monogram) created with the AI of{' '}
            <a href="https://www.recraft.ai" {...ext}>
              Recraft
            </a>
            , then adapted for the website.
          </li>
          <li>Phosphor icons, under the MIT license.</li>
          <li>Videos hosted on YouTube, played only with your consent.</li>
        </ul>
        <h2>Personal data and cookies</h2>
        <p>
          This website sets no cookies and does not track visitors. Details are in the <a href={privacy}>privacy policy</a>.
        </p>
        <h2>External links</h2>
        <p>
          Links to other websites (GitHub, LinkedIn, Instagram, YouTube, project websites) are provided for information.
          Their content and data policies are the responsibility of their publishers.
        </p>
      </>
    );

  if (locale === 'ru')
    return (
      <>
        <p>
          В соответствии со статьёй 6 французского закона № 2004-575 от 21 июня 2004 года о доверии в цифровой экономике
          (LCEN) ниже приведены сведения о сайте <strong>tamhaev.dev</strong>. Юридическую силу имеет французская версия
          этого текста.
        </p>
        <h2>Владелец сайта и ответственный за публикации</h2>
        <p>
          Рахим Тамхаев, частное лицо. Личный некоммерческий сайт с портфолио работ.
          <br />
          Связь:{' '}
          <a href={contactHref} {...ext}>
            LinkedIn
          </a>
        </p>
        <h2>Хостинг</h2>
        <p>
          GitHub Pages, сервис компании GitHub, Inc.
          <br />
          88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, США
          <br />
          <a href="https://github.com" {...ext}>
            github.com
          </a>
        </p>
        <h2>Интеллектуальная собственность</h2>
        <p>
          Фотографии, видео, тексты, графика и код этого сайта принадлежат Рахиму Тамхаеву, если не указано иное. Любое
          воспроизведение или использование без предварительного письменного разрешения запрещено. Упомянутые названия и
          логотипы сторонних брендов принадлежат их владельцам.
        </p>
        <h2>Благодарности</h2>
        <ul>
          <li>Шрифты Geist и Geist Mono (Vercel), Barlow Condensed и Oswald по лицензии SIL Open Font License.</li>
          <li>
            Логотип (монограмма RT) создан с помощью ИИ{' '}
            <a href="https://www.recraft.ai" {...ext}>
              Recraft
            </a>{' '}
            и доработан для сайта.
          </li>
          <li>Иконки Phosphor по лицензии MIT.</li>
          <li>Видео размещены на YouTube и воспроизводятся только с вашего согласия.</li>
        </ul>
        <h2>Персональные данные и cookie</h2>
        <p>
          Сайт не устанавливает cookie и не ведёт статистику посещений. Подробности — в{' '}
          <a href={privacy}>политике конфиденциальности</a>.
        </p>
        <h2>Внешние ссылки</h2>
        <p>
          Ссылки на другие сайты (GitHub, LinkedIn, Instagram, YouTube, сайты проектов) даны для информации. За их
          содержание и обработку данных отвечают их владельцы.
        </p>
      </>
    );

  return (
    <>
      <p>
        Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique
        (LCEN), voici les informations relatives au site <strong>tamhaev.dev</strong>.
      </p>
      <h2>Éditeur et directeur de la publication</h2>
      <p>
        Rahim Tamhaev, personne physique. Site personnel non commercial présentant son travail.
        <br />
        Contact :{' '}
        <a href={contactHref} {...ext}>
          LinkedIn
        </a>
      </p>
      <h2>Hébergement</h2>
      <p>
        GitHub Pages, service de GitHub, Inc.
        <br />
        88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis
        <br />
        <a href="https://github.com" {...ext}>
          github.com
        </a>
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les photographies, vidéos, textes, visuels et le code de ce site sont la propriété de Rahim Tamhaev, sauf mention
        contraire. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite. Les noms et
        logos de marques tierces citées appartiennent à leurs propriétaires respectifs.
      </p>
      <h2>Crédits</h2>
      <ul>
        <li>Polices Geist et Geist Mono (Vercel), Barlow Condensed et Oswald, sous licence SIL Open Font License.</li>
        <li>
          Logo (monogramme RT) créé avec l’intelligence artificielle de{' '}
          <a href="https://www.recraft.ai" {...ext}>
            Recraft
          </a>
          , puis adapté pour le site.
        </li>
        <li>Icônes Phosphor, sous licence MIT.</li>
        <li>Vidéos hébergées par YouTube, lues uniquement avec votre accord.</li>
      </ul>
      <h2>Données personnelles et cookies</h2>
      <p>
        Le site ne dépose aucun cookie et ne mesure pas l’audience. Le détail est expliqué dans la{' '}
        <a href={privacy}>politique de confidentialité</a>.
      </p>
      <h2>Liens externes</h2>
      <p>
        Les liens vers d’autres sites (GitHub, LinkedIn, Instagram, YouTube, sites de projets) sont fournis à titre
        d’information. Leur contenu et leur politique de données relèvent de leurs éditeurs.
      </p>
    </>
  );
}
