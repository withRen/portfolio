import type { Locale, T } from '@/i18n/config';

export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

export type Photo = { id: string; title: string; alt: string; image: string; ratio: number };

export type Video = {
  id: string;
  title: string;
  type: string;
  href: string;
  /** Date de mise en ligne sur YouTube (ISO 8601), pour les données structurées */
  uploaded: string;
  /** Durée au format ISO 8601 */
  duration: string;
};

export type Featured = {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  context: string;
  stack: string[];
  cover: string;
  /** object-position used when the cover is cropped */
  focus?: string;
  /** Proportions de l'image (largeur / hauteur), 16/10 par défaut */
  ratio?: number;
  links: { label: string; href: string }[];
};

export type Tools = { group: string; items: string[] }[];

/* ------------------------------------------------------------------ */
/* Données sources : chaque texte existe en français, anglais et russe */
/* ------------------------------------------------------------------ */

const UNTITLED: T = { fr: 'Sans titre', en: 'Untitled', ru: 'Без названия' };
const MAY_2025: T = { fr: 'Mai 2025', en: 'May 2025', ru: 'Май 2025' };
const JAN_2025: T = { fr: 'Janvier 2025', en: 'January 2025', ru: 'Январь 2025' };

const photoSrc: { file: string; h: number; title: T; alt: T }[] = [
  {
    file: 'DSC00328-Enhanced-NR-2',
    h: 1500,
    title: UNTITLED,
    alt: {
      fr: 'Bateau de plaisance amarré le long d’un quai, sous un ciel bleu et nuageux',
      en: 'Pleasure boat moored along a quay under a blue, cloudy sky',
      ru: 'Прогулочный катер у причала под голубым облачным небом',
    },
  },
  {
    file: '20250525_131001',
    h: 750,
    title: MAY_2025,
    alt: {
      fr: 'Sentier de gravier au pied d’une falaise creusée, bordé de fleurs roses',
      en: 'Gravel path at the foot of a hollowed-out cliff, lined with pink flowers',
      ru: 'Гравийная тропа у подножия скалы с нишей, вдоль неё растут розовые цветы',
    },
  },
  {
    file: 'IMG_0361',
    h: 1333,
    title: UNTITLED,
    alt: {
      fr: 'Façade de brique et de pierre d’un bâtiment du XIXe siècle, vue en contre-plongée',
      en: 'Brick and stone façade of a 19th-century building, seen from below',
      ru: 'Кирпично-каменный фасад здания XIX века, снятый снизу',
    },
  },
  {
    file: 'hellebore_1',
    h: 666,
    title: { fr: 'Hellébore I', en: 'Hellebore I', ru: 'Морозник I' },
    alt: {
      fr: 'Feuilles et fleurs vertes d’hellébore en lumière rasante',
      en: 'Green hellebore leaves and flowers in low, raking light',
      ru: 'Зелёные листья и цветы морозника в косом свете',
    },
  },
  {
    file: '20250525_140010',
    h: 1333,
    title: MAY_2025,
    alt: {
      fr: 'Ruisseau au fond d’une gorge calcaire, entre falaises et végétation',
      en: 'Stream at the bottom of a limestone gorge, between cliffs and greenery',
      ru: 'Ручей на дне известнякового ущелья среди скал и зелени',
    },
  },
  {
    file: 'park_ducks',
    h: 666,
    title: { fr: 'Scène de parc', en: 'Park scene', ru: 'В парке' },
    alt: {
      fr: 'Canal bordé d’une passerelle à garde-corps, avec des canards sur l’eau',
      en: 'Canal lined with a railed walkway, with ducks on the water',
      ru: 'Канал с пешеходной дорожкой и перилами, на воде утки',
    },
  },
  {
    file: 'IMG_20250118_173738',
    h: 750,
    title: JAN_2025,
    alt: {
      fr: 'Vieilles maisons de pierre au pied d’une colline boisée, en hiver',
      en: 'Old stone houses at the foot of a wooded hill in winter',
      ru: 'Старые каменные дома у подножия лесистого холма зимой',
    },
  },
  {
    file: 'corner_building',
    h: 1501,
    title: { fr: 'Corner Building', en: 'Corner Building', ru: 'Угловой дом' },
    alt: {
      fr: 'Immeuble d’angle haussmannien aux balcons en fer forgé, dans une rue ensoleillée',
      en: 'Haussmann-style corner building with wrought-iron balconies on a sunny street',
      ru: 'Угловой дом в османовском стиле с коваными балконами на солнечной улице',
    },
  },
  {
    file: '20250525_132308',
    h: 750,
    title: MAY_2025,
    alt: {
      fr: 'Arche naturelle de roche ouvrant sur une vallée verdoyante',
      en: 'Natural rock arch opening onto a green valley',
      ru: 'Природная каменная арка с видом на зелёную долину',
    },
  },
  {
    file: 'DSC00342-Enhanced-NR',
    h: 1500,
    title: UNTITLED,
    alt: {
      fr: 'Ruelle pavée de nuit, éclairée par une lanterne et la vitrine d’un restaurant',
      en: 'Cobbled alley at night, lit by a lantern and a restaurant window',
      ru: 'Мощёный переулок ночью, освещённый фонарём и витриной ресторана',
    },
  },
  {
    file: 'hellebore_2',
    h: 666,
    title: { fr: 'Hellébore II', en: 'Hellebore II', ru: 'Морозник II' },
    alt: {
      fr: 'Touffe d’hellébore aux fleurs vert pâle, fond sombre',
      en: 'Clump of hellebore with pale green flowers against a dark background',
      ru: 'Куст морозника с бледно-зелёными цветами на тёмном фоне',
    },
  },
  {
    file: 'IMG_20240929_212728',
    h: 1333,
    title: { fr: 'Septembre 2024', en: 'September 2024', ru: 'Сентябрь 2024' },
    alt: {
      fr: 'Tour de brique et de pierre d’une villa ancienne, entourée d’arbres',
      en: 'Brick and stone tower of an old villa surrounded by trees',
      ru: 'Кирпично-каменная башня старинной виллы среди деревьев',
    },
  },
  {
    file: 'IMG_0356',
    h: 1333,
    title: UNTITLED,
    alt: {
      fr: 'Tourelle d’un bâtiment en brique rouge et pierre blanche sous un ciel couvert',
      en: 'Turret of a red-brick and white-stone building under an overcast sky',
      ru: 'Башенка здания из красного кирпича и белого камня под пасмурным небом',
    },
  },
  {
    file: '20250525_140729',
    h: 750,
    title: MAY_2025,
    alt: {
      fr: 'Chemin fleuri dans une gorge, menant à un pont de pierre à arches',
      en: 'Flowered path through a gorge leading to an arched stone bridge',
      ru: 'Цветущая тропа в ущелье, ведущая к арочному каменному мосту',
    },
  },
  {
    file: 'DSC00334-Enhanced-NR',
    h: 1500,
    title: UNTITLED,
    alt: {
      fr: 'Fontaine de pierre et moto garée sur une place pavée, de nuit',
      en: 'Stone fountain and a motorcycle parked on a cobbled square at night',
      ru: 'Каменный фонтан и мотоцикл на мощёной площади ночью',
    },
  },
  {
    file: '20250525_132728',
    h: 1333,
    title: MAY_2025,
    alt: {
      fr: 'Chemin longeant un ruisseau au pied de falaises calcaires',
      en: 'Path along a stream at the foot of limestone cliffs',
      ru: 'Тропа вдоль ручья у подножия известняковых скал',
    },
  },
  {
    file: 'hellebore_3',
    h: 666,
    title: { fr: 'Hellébore III', en: 'Hellebore III', ru: 'Морозник III' },
    alt: {
      fr: 'Fleurs d’hellébore vertes parmi des feuilles découpées',
      en: 'Green hellebore flowers among deeply cut leaves',
      ru: 'Зелёные цветы морозника среди резных листьев',
    },
  },
  {
    file: 'IMG_20250118_173535',
    h: 1333,
    title: JAN_2025,
    alt: {
      fr: 'Silhouette marchant sur une route de montagne au crépuscule, près d’un passage piéton',
      en: 'Figure walking along a mountain road at dusk, near a pedestrian crossing',
      ru: 'Силуэт человека на горной дороге в сумерках, у пешеходного перехода',
    },
  },
  {
    file: 'IMG_20250118_173443',
    h: 1333,
    title: JAN_2025,
    alt: {
      fr: 'Village de pierre au crépuscule, à travers des branches nues',
      en: 'Stone village at dusk, seen through bare branches',
      ru: 'Каменная деревня в сумерках сквозь голые ветви',
    },
  },
];

// Miniatures copiées dans public/films (scripts/fetch-thumbs.sh) : aucune requête vers
// les serveurs de Google tant que le visiteur n'a pas choisi de lire une vidéo (RGPD).
export const ytThumb = (id: string) => asset(`/films/${id}.jpg`);

const videoSrc: { id: string; title: T; type: T; uploaded: string; duration: string }[] = [
  {
    id: 'zNx36iwjhD8',
    title: { fr: 'Pub de montre', en: 'Watch commercial', ru: 'Реклама часов' },
    type: { fr: 'Publicité produit', en: 'Product ad', ru: 'Реклама продукта' },
    uploaded: '2025-11-23',
    duration: 'PT1M19S',
  },
  {
    id: 'aPt2vD_mj0k',
    title: { fr: 'Publicité sur la musique', en: 'Music commercial', ru: 'Реклама о музыке' },
    type: { fr: 'Court-métrage publicitaire', en: 'Short promotional film', ru: 'Рекламный короткий метр' },
    uploaded: '2025-05-31',
    duration: 'PT1M',
  },
  {
    id: 'OSng25-tAkc',
    title: { fr: 'Europe en 2100', en: 'Europe in 2100', ru: 'Европа в 2100 году' },
    type: { fr: 'Documentaire fictif', en: 'Mockumentary', ru: 'Псевдодокументальный фильм' },
    uploaded: '2025-05-23',
    duration: 'PT1M56S',
  },
  {
    id: 'LTE60C6riRU',
    title: { fr: 'Amentia', en: 'Amentia', ru: 'Amentia' },
    type: { fr: 'Projet créatif', en: 'Creative project', ru: 'Творческий проект' },
    uploaded: '2025-06-07',
    duration: 'PT49S',
  },
  {
    id: 'IzuP73MLAhQ',
    title: { fr: 'Intro Kill Bill', en: 'Kill Bill intro', ru: 'Заставка «Убить Билла»' },
    type: { fr: 'Générique alternatif', en: 'Alternative opening titles', ru: 'Альтернативная заставка' },
    uploaded: '2026-02-26',
    duration: 'PT21S',
  },
];

type FeaturedSrc = Omit<Featured, 'tagline' | 'desc' | 'context' | 'links'> & {
  tagline: T;
  desc: T;
  context: T;
  links: { label: T; href: string }[];
};

const featuredSrc: FeaturedSrc[] = [
  {
    id: 'escapor',
    title: 'The Last Escapor',
    tagline: {
      fr: 'Survival shooter en réalité virtuelle.',
      en: 'A virtual reality survival shooter.',
      ru: 'Шутер на выживание в виртуальной реальности.',
    },
    desc: {
      fr: 'Seul dans un bunker, tu cloues des planches au marteau sur les ouvertures et tu tires sur les zombies en surveillant les caméras.',
      en: 'Alone in a bunker, you hammer planks over the openings and shoot zombies while keeping an eye on the security cameras.',
      ru: 'Один в бункере: заколачиваешь проёмы досками и отстреливаешь зомби, следя за камерами наблюдения.',
    },
    context: {
      fr: 'SAÉ 5.D.01, BUT MMI 3',
      en: 'University project SAÉ 5.D.01, BUT MMI year 3',
      ru: 'Учебный проект SAÉ 5.D.01, BUT MMI, 3-й курс',
    },
    stack: ['Unity 6', 'C#', 'XR Interaction Toolkit', 'Meta Quest 3'],
    cover: asset('/projects/escapor.jpg'),
    ratio: 16 / 9,
    focus: '50% 35%',
    links: [{ label: { fr: 'Code source', en: 'Source code', ru: 'Исходный код' }, href: 'https://github.com/withRen/SAE501' }],
  },
  {
    id: 'mmi-town',
    title: 'MMI Town V2',
    tagline: {
      fr: 'Le serveur Minecraft des étudiants MMI de Béziers.',
      en: 'The Minecraft server for MMI students in Béziers.',
      ru: 'Minecraft-сервер для студентов MMI в Безье.',
    },
    desc: {
      fr: 'Un hub multijeux : lobby central et trois mondes isolés (survie avec métiers, Loup-Garou de Thiercelieux, PvP en 3 contre 3), connexion sécurisée et bot Discord.',
      en: 'A multi-game hub: a central lobby and three separate worlds (survival with jobs, Werewolves of Miller’s Hollow, 3v3 PvP), secure login and a Discord bot.',
      ru: 'Игровой хаб: центральное лобби и три отдельных мира (выживание с профессиями, «Оборотни», PvP 3 на 3), защищённый вход и Discord-бот.',
    },
    context: { fr: 'Projet communautaire', en: 'Community project', ru: 'Проект для сообщества' },
    stack: ['Java', 'Paper 26.3', 'Python', 'discord.py'],
    cover: asset('/projects/mmi-town.jpg'),
    ratio: 16 / 9,
    focus: '50% 40%',
    links: [],
  },
  {
    id: 'pulse',
    title: 'Pulse',
    tagline: { fr: 'Un générateur de sons qui bat.', en: 'A sound generator with a pulse.', ru: 'Генератор звука с пульсом.' },
    desc: {
      fr: "Fréquences, formes d'onde, battement de 20 à 240 BPM, pads au clavier et timeline à quatre pistes exportée en WAV. Sans aucune librairie.",
      en: 'Frequencies, waveforms, a beat from 20 to 240 BPM, keyboard pads and a four-track timeline exported to WAV. No libraries at all.',
      ru: 'Частоты, формы волны, ритм от 20 до 240 BPM, пэды на клавиатуре и четырёхдорожечный таймлайн с экспортом в WAV. Без единой библиотеки.',
    },
    context: { fr: 'Devtober 2026, jour 01', en: 'Devtober 2026, day 01', ru: 'Devtober 2026, день 01' },
    stack: ['JavaScript', 'Web Audio API'],
    cover: asset('/projects/devtober-pulse.jpg'),
    focus: '50% 48%',
    links: [{ label: { fr: 'Essayer', en: 'Try it', ru: 'Попробовать' }, href: 'https://withren.github.io/devtober/day-01-pulse/' }],
  },
  {
    id: 'loop',
    title: 'Loop',
    tagline: { fr: "Un générateur de fonds d'écran.", en: 'A wallpaper generator.', ru: 'Генератор обоев.' },
    desc: {
      fr: 'Des milliers de particules en boucle : forme dessinée à la main, rendu en points, ASCII ou vecteurs, export à la résolution de ton écran.',
      en: 'Thousands of looping particles: a hand-drawn shape, rendered as dots, ASCII or vectors, exported at your screen’s resolution.',
      ru: 'Тысячи частиц в бесконечном цикле: нарисованная от руки форма, отрисовка точками, ASCII или векторами, экспорт в разрешении твоего экрана.',
    },
    context: { fr: 'Devtober 2026, jour 02', en: 'Devtober 2026, day 02', ru: 'Devtober 2026, день 02' },
    stack: ['JavaScript', 'WebGL 2'],
    cover: asset('/projects/devtober-loop.jpg'),
    focus: '38% 40%',
    links: [
      {
        label: { fr: 'Ouvrir le générateur', en: 'Open the generator', ru: 'Открыть генератор' },
        href: 'https://withren.github.io/devtober/day-02-loop/',
      },
    ],
  },
  {
    id: 'bloom',
    title: 'Bloom',
    tagline: { fr: 'Une chambre noire dans le navigateur.', en: 'A darkroom in your browser.', ru: 'Фотолаборатория в браузере.' },
    desc: {
      fr: 'Ouvre une photo ou un RAW, développe-la, ajoute du bloom, des LUT et un débruitage par IA. Tout est calculé sur la carte graphique.',
      en: 'Open a photo or a RAW file, develop it, add bloom, LUTs and AI denoising. Everything runs on the GPU.',
      ru: 'Открой фото или RAW, прояви его, добавь свечение (bloom), LUT и шумоподавление на базе ИИ. Всё считается на видеокарте.',
    },
    context: { fr: 'Devtober 2026, jour 03', en: 'Devtober 2026, day 03', ru: 'Devtober 2026, день 03' },
    stack: ['JavaScript', 'WebGPU', 'LibRaw'],
    cover: asset('/projects/devtober-bloom.jpg'),
    focus: '40% 45%',
    links: [
      {
        label: { fr: 'Développer une photo', en: 'Develop a photo', ru: 'Проявить фото' },
        href: 'https://withren.github.io/devtober/day-03-bloom/',
      },
    ],
  },
  {
    id: 'immanence',
    title: 'Immanence',
    tagline: { fr: 'Séjours bien-être à Djerba.', en: 'Wellness retreats in Djerba.', ru: 'Велнес-ретриты на Джербе.' },
    desc: {
      fr: 'Thème WordPress sur mesure pour des retraites de bien-être, avec interface personnalisée et back-office optimisé.',
      en: 'A custom WordPress theme for wellness retreats, with a tailored interface and a streamlined back office.',
      ru: 'Индивидуальная тема WordPress для велнес-ретритов: собственный интерфейс и удобная админ-панель.',
    },
    context: { fr: 'Site client en ligne', en: 'Live client website', ru: 'Клиентский сайт, онлайн' },
    stack: ['WordPress', 'PHP', 'UI / UX'],
    cover: asset('/projects/immanence.jpg'),
    focus: '68% 60%',
    links: [{ label: { fr: 'Voir le site', en: 'Visit the site', ru: 'Открыть сайт' }, href: 'https://www.imma-nence.com/' }],
  },
];

const toolsSrc: { group: T; items: string[] }[] = [
  {
    group: { fr: 'Développement', en: 'Development', ru: 'Разработка' },
    items: ['VS Code', 'Xcode', 'Unity', 'React', 'Node.js', 'Three.js', 'Symfony', 'Django', 'WordPress', 'PrestaShop', 'Framer'],
  },
  { group: { fr: 'Création', en: 'Creative', ru: 'Креатив' }, items: ['Illustrator', 'Premiere Pro', 'InDesign', 'DaVinci Resolve', 'Figma'] },
  { group: { fr: 'Réseau', en: 'Networking', ru: 'Сети' }, items: ['Wireshark', 'Cisco Packet Tracer', 'Proxmox'] },
  { group: { fr: 'Matériel', en: 'Gear', ru: 'Техника' }, items: ['MacBook Pro M1', 'Lumix S5IIX'] },
];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/withRen' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahim-tamhaev' },
  { label: 'Instagram', href: 'https://www.instagram.com/rahimwith/' },
];

export const contactHref = 'https://www.linkedin.com/in/rahim-tamhaev';

/* ------------------------------------------------------------------ */
/* Contenu prêt à afficher dans une langue donnée                      */
/* ------------------------------------------------------------------ */

export type Content = { photos: Photo[]; videos: Video[]; featured: Featured[]; tools: Tools };

const cache = new Map<Locale, Content>();

export function getContent(locale: Locale): Content {
  const hit = cache.get(locale);
  if (hit) return hit;
  const content: Content = {
    photos: photoSrc.map((p) => ({
      id: p.file,
      title: p.title[locale],
      alt: p.alt[locale],
      image: asset(`/photos/${p.file}.webp`),
      ratio: 1000 / p.h,
    })),
    videos: videoSrc.map((v) => ({
      id: v.id,
      title: v.title[locale],
      type: v.type[locale],
      uploaded: v.uploaded,
      duration: v.duration,
      href: `https://youtu.be/${v.id}`,
    })),
    featured: featuredSrc.map((f) => ({
      ...f,
      tagline: f.tagline[locale],
      desc: f.desc[locale],
      context: f.context[locale],
      links: f.links.map((l) => ({ label: l.label[locale], href: l.href })),
    })),
    tools: toolsSrc.map((t) => ({ group: t.group[locale], items: t.items })),
  };
  cache.set(locale, content);
  return content;
}
