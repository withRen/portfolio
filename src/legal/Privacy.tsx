import { contactHref } from '@/data/content';
import type { Locale } from '@/i18n/config';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const GITHUB_PRIVACY = 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement';
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';
const CNIL = 'https://www.cnil.fr/fr/plaintes';

/** Politique de confidentialité (RGPD) dans les trois langues. La version française fait foi. */
export default function Privacy({ locale }: { locale: Locale }) {
  if (locale === 'en')
    return (
      <>
        <p>
          This website is a personal portfolio. It was designed to collect as little data as possible, in accordance with
          the General Data Protection Regulation (GDPR) and the French Data Protection Act. The French version of this
          policy is the authoritative one.
        </p>
        <h2>Data controller</h2>
        <p>
          Rahim Tamhaev, reachable via{' '}
          <a href={contactHref} {...ext}>
            LinkedIn
          </a>
          .
        </p>
        <h2>What this website does not do</h2>
        <ul>
          <li>No cookies set by the website.</li>
          <li>No audience measurement, no analytics tools, no advertising.</li>
          <li>No forms, no accounts: you never enter any data.</li>
          <li>Fonts, images and video thumbnails are served by the website itself, with no call to a third-party service.</li>
        </ul>
        <h2>Hosting and server logs</h2>
        <p>
          The website is hosted on GitHub Pages (GitHub, Inc., United States). To keep the service secure, GitHub may
          record visitors’ IP addresses in its server logs. This processing is GitHub’s responsibility:{' '}
          <a href={GITHUB_PRIVACY} {...ext}>
            GitHub privacy statement
          </a>
          .
        </p>
        <h2>YouTube videos</h2>
        <p>
          The films are hosted on YouTube (Google Ireland Limited and Google LLC). The player and previews only load if
          you agree, when you play a video or from the “Cookies and privacy” panel at the bottom of the page. Google may
          then set cookies and collect browsing data, with possible transfers to the United States covered by the EU-U.S.
          Data Privacy Framework. Without your consent, nothing is sent to Google, and you can open each video directly on
          YouTube.
        </p>
        <p>
          Learn more:{' '}
          <a href={GOOGLE_PRIVACY} {...ext}>
            Google privacy policy
          </a>
          .
        </p>
        <h2>Local storage</h2>
        <p>
          If you make a choice about YouTube and ask for it to be remembered, it is saved in your browser (local storage,
          key <code>consent.youtube</code>) for at most 6 months. It is only used to respect your choice, which you can
          change at any time from the “Cookies and privacy” panel.
        </p>
        <h2>External links</h2>
        <p>
          Links to GitHub, LinkedIn, Instagram, YouTube or project websites open third-party services subject to their own
          privacy policies.
        </p>
        <h2>Your rights</h2>
        <p>
          You have the right to access, rectify, erase, object to and restrict the processing of your data. To exercise
          these rights, write to me via LinkedIn. If you believe your rights are not respected, you can lodge a complaint
          with the{' '}
          <a href={CNIL} {...ext}>
            CNIL
          </a>{' '}
          (French data protection authority).
        </p>
      </>
    );

  if (locale === 'ru')
    return (
      <>
        <p>
          Этот сайт — личное портфолио. Он устроен так, чтобы собирать как можно меньше данных, в соответствии с Общим
          регламентом по защите данных ЕС (GDPR) и французским законом «Об информатике и свободах». Юридическую силу имеет
          французская версия этого текста.
        </p>
        <h2>Ответственный за обработку данных</h2>
        <p>
          Рахим Тамхаев, связаться можно через{' '}
          <a href={contactHref} {...ext}>
            LinkedIn
          </a>
          .
        </p>
        <h2>Чего этот сайт не делает</h2>
        <ul>
          <li>Сайт не устанавливает cookie.</li>
          <li>Никакой статистики посещений, аналитики и рекламы.</li>
          <li>Никаких форм и аккаунтов: вы не вводите никаких данных.</li>
          <li>Шрифты, изображения и превью видео загружаются с самого сайта, без обращения к сторонним сервисам.</li>
        </ul>
        <h2>Хостинг и технические журналы</h2>
        <p>
          Сайт размещён на GitHub Pages (GitHub, Inc., США). В целях безопасности GitHub может записывать IP-адреса
          посетителей в свои технические журналы. За эту обработку отвечает GitHub:{' '}
          <a href={GITHUB_PRIVACY} {...ext}>
            заявление GitHub о конфиденциальности
          </a>
          .
        </p>
        <h2>Видео YouTube</h2>
        <p>
          Фильмы размещены на YouTube (Google Ireland Limited и Google LLC). Плеер и фрагменты загружаются только с вашего
          согласия — когда вы запускаете видео или включаете их в панели «Cookie и конфиденциальность» внизу страницы.
          После этого Google может устанавливать cookie и собирать данные о просмотре; возможна передача данных в США в
          рамках EU-U.S. Data Privacy Framework. Без вашего согласия Google ничего не получает, а каждое видео можно
          открыть прямо на YouTube.
        </p>
        <p>
          Подробнее:{' '}
          <a href={GOOGLE_PRIVACY} {...ext}>
            политика конфиденциальности Google
          </a>
          .
        </p>
        <h2>Локальное хранилище</h2>
        <p>
          Если вы делаете выбор насчёт YouTube и просите его запомнить, он сохраняется в вашем браузере (локальное
          хранилище, ключ <code>consent.youtube</code>) не более чем на 6 месяцев. Эта запись нужна только для того,
          чтобы учитывать ваш выбор; изменить его можно в любой момент в панели «Cookie и конфиденциальность».
        </p>
        <h2>Внешние ссылки</h2>
        <p>
          Ссылки на GitHub, LinkedIn, Instagram, YouTube и сайты проектов ведут на сторонние сервисы со своими политиками
          конфиденциальности.
        </p>
        <h2>Ваши права</h2>
        <p>
          Вы вправе получить доступ к своим данным, исправить или удалить их, возразить против обработки или ограничить
          её. Для этого напишите мне в LinkedIn. Если вы считаете, что ваши права нарушены, вы можете подать жалобу в{' '}
          <a href={CNIL} {...ext}>
            CNIL
          </a>{' '}
          (французский орган по защите данных).
        </p>
      </>
    );

  return (
    <>
      <p>
        Ce site est un portfolio personnel. Il a été conçu pour collecter le moins de données possible, conformément au
        Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>
      <h2>Responsable du traitement</h2>
      <p>
        Rahim Tamhaev, joignable via{' '}
        <a href={contactHref} {...ext}>
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
          Les polices, images et miniatures des vidéos sont servies directement par le site, sans appel à un service tiers.
        </li>
      </ul>
      <h2>Hébergement et journaux techniques</h2>
      <p>
        Le site est hébergé par GitHub Pages (GitHub, Inc., États-Unis). Pour assurer la sécurité du service, GitHub peut
        enregistrer l’adresse IP des visiteurs dans ses journaux techniques. Ce traitement relève de GitHub :{' '}
        <a href={GITHUB_PRIVACY} {...ext}>
          déclaration de confidentialité de GitHub
        </a>
        .
      </p>
      <h2>Vidéos YouTube</h2>
      <p>
        Les films sont hébergés par YouTube (Google Ireland Limited et Google LLC). Le lecteur et les extraits ne sont
        chargés que si vous l’acceptez, au moment de lire une vidéo ou depuis le panneau « Cookies et confidentialité » en
        bas de page. Google peut alors déposer des cookies et collecter des données de navigation, avec de possibles
        transferts vers les États-Unis encadrés par le EU-U.S. Data Privacy Framework. Sans votre accord, rien n’est envoyé
        à Google, et vous pouvez ouvrir chaque vidéo directement sur YouTube.
      </p>
      <p>
        Pour en savoir plus :{' '}
        <a href={GOOGLE_PRIVACY} {...ext}>
          règles de confidentialité de Google
        </a>
        .
      </p>
      <h2>Stockage local</h2>
      <p>
        Si vous faites un choix pour YouTube et demandez à le retenir, il est enregistré dans votre navigateur (stockage
        local, clé <code>consent.youtube</code>) pendant 6 mois au plus. Cette information sert uniquement à respecter votre
        choix ; vous pouvez la modifier à tout moment depuis le panneau « Cookies et confidentialité ».
      </p>
      <h2>Liens externes</h2>
      <p>
        Les liens vers GitHub, LinkedIn, Instagram, YouTube ou les sites de projets ouvrent des services tiers soumis à
        leur propre politique de confidentialité.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de limitation du traitement de
        vos données. Pour l’exercer, écrivez-moi via LinkedIn. Si vous estimez que vos droits ne sont pas respectés, vous
        pouvez adresser une réclamation à la{' '}
        <a href={CNIL} {...ext}>
          CNIL
        </a>
        .
      </p>
    </>
  );
}
