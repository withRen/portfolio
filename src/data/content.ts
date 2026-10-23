export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

export type Photo = { id: string; title: string; image: string; ratio: number };

export type Video = { id: string; title: string; type: string; href: string };

export type Project = {
  id: string;
  title: string;
  desc: string;
  stack: string[];
  href?: string;
  image?: string;
  status?: string;
};

export type Featured = {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  context: string;
  stack: string[];
  cover: string;
  extra?: string;
  links: { label: string; href: string }[];
  layout: 'split' | 'stack' | 'split-reverse' | 'full';
};


const photo = (file: string, title: string, h: number): Photo => ({
  id: file,
  title,
  image: asset(`/photos/${file}.webp`),
  ratio: 1000 / h,
});

export const photos: Photo[] = [
  photo('DSC00328-Enhanced-NR-2', 'Sans titre', 1500),
  photo('20250525_131001', 'Mai 2025', 750),
  photo('IMG_0361', 'Sans titre', 1333),
  photo('hellebore_1', 'Hellébore I', 666),
  photo('20250525_140010', 'Mai 2025', 1333),
  photo('park_ducks', 'Scène de parc', 666),
  photo('IMG_20250118_173738', 'Janvier 2025', 750),
  photo('corner_building', 'Corner Building', 1501),
  photo('20250525_132308', 'Mai 2025', 750),
  photo('DSC00342-Enhanced-NR', 'Sans titre', 1500),
  photo('hellebore_2', 'Hellébore II', 666),
  photo('IMG_20240929_212728', 'Septembre 2024', 1333),
  photo('IMG_0356', 'Sans titre', 1333),
  photo('20250525_140729', 'Mai 2025', 750),
  photo('DSC00334-Enhanced-NR', 'Sans titre', 1500),
  photo('20250525_132728', 'Mai 2025', 1333),
  photo('hellebore_3', 'Hellébore III', 666),
  photo('IMG_20250118_173535', 'Janvier 2025', 1333),
  photo('IMG_20250118_173443', 'Janvier 2025', 1333),
];

export const ytThumb = (id: string, size: 'maxresdefault' | 'hqdefault' = 'maxresdefault') =>
  `https://img.youtube.com/vi/${id}/${size}.jpg`;

const video = (id: string, title: string, type: string): Video => ({
  id,
  title,
  type,
  href: `https://youtu.be/${id}`,
});

export const videos: Video[] = [
  video('zNx36iwjhD8', 'Pub de montre', 'Publicité produit'),
  video('aPt2vD_mj0k', 'Publicité sur la musique', 'Court-métrage publicitaire'),
  video('OSng25-tAkc', 'Europe en 2100', 'Documentaire fictif'),
  video('LTE60C6riRU', 'Amentia', 'Projet créatif'),
  video('IzuP73MLAhQ', 'Intro Kill Bill', 'Générique alternatif'),
];

export const featured: Featured[] = [
  {
    id: 'escapor',
    title: 'The Last Escapor',
    tagline: 'Survival shooter en réalité virtuelle.',
    desc: 'Seul dans un bunker, tu cloues des planches au marteau sur les ouvertures et tu tires sur les zombies en surveillant les caméras.',
    context: 'SAÉ 5.D.01, BUT MMI 3',
    stack: ['Unity 6', 'C#', 'XR Interaction Toolkit', 'Meta Quest 3'],
    cover: asset('/projects/escapor.jpg'),
    links: [{ label: 'Code source', href: 'https://github.com/withRen/SAE501' }],
    layout: 'split',
  },
  {
    id: 'mmi-town',
    title: 'MMI Town V2',
    tagline: 'Le serveur Minecraft des étudiants MMI de Béziers.',
    desc: 'Un hub multijeux : lobby central et trois mondes isolés (survie avec métiers, Loup-Garou de Thiercelieux, PvP en 3 contre 3), connexion sécurisée et bot Discord.',
    context: 'Projet communautaire',
    stack: ['Java', 'Paper 26.3', 'Python', 'discord.py'],
    cover: asset('/projects/mmi-town.jpg'),
    extra: asset('/projects/mmi-town-launcher.jpg'),
    links: [],
    layout: 'stack',
  },
  {
    id: 'pulse',
    title: 'Pulse',
    tagline: 'Un générateur de sons qui bat.',
    desc: "Fréquences, formes d'onde, battement de 20 à 240 BPM, pads au clavier et timeline à quatre pistes exportée en WAV. Sans aucune librairie.",
    context: 'Devtober 2026, jour 01',
    stack: ['JavaScript', 'Web Audio API'],
    cover: asset('/projects/devtober-pulse.jpg'),
    links: [{ label: 'Essayer', href: 'https://withren.github.io/devtober/day-01-pulse/' }],
    layout: 'split',
  },
  {
    id: 'loop',
    title: 'Loop',
    tagline: "Un générateur de fonds d'écran.",
    desc: "Des milliers de particules en boucle : forme dessinée à la main, rendu en points, ASCII ou vecteurs, export à la résolution de ton écran.",
    context: 'Devtober 2026, jour 02',
    stack: ['JavaScript', 'WebGL 2'],
    cover: asset('/projects/devtober-loop.jpg'),
    links: [{ label: 'Ouvrir le générateur', href: 'https://withren.github.io/devtober/day-02-loop/' }],
    layout: 'split',
  },
  {
    id: 'bloom',
    title: 'Bloom',
    tagline: 'Une chambre noire dans le navigateur.',
    desc: 'Ouvre une photo ou un RAW, développe-la, ajoute du bloom, des LUT et un débruitage par IA. Tout est calculé sur la carte graphique.',
    context: 'Devtober 2026, jour 03',
    stack: ['JavaScript', 'WebGPU', 'LibRaw'],
    cover: asset('/projects/devtober-bloom.jpg'),
    links: [{ label: 'Développer une photo', href: 'https://withren.github.io/devtober/day-03-bloom/' }],
    layout: 'split',
  },
  {
    id: 'immanence',
    title: 'Immanence',
    tagline: 'Séjours bien-être à Djerba.',
    desc: 'Thème WordPress sur mesure pour des retraites de bien-être, avec interface personnalisée et back-office optimisé.',
    context: 'Site client en ligne',
    stack: ['WordPress', 'PHP', 'UI / UX'],
    cover: asset('/projects/immanence.jpg'),
    links: [{ label: 'Voir le site', href: 'https://www.imma-nence.com/' }],
    layout: 'full',
  },
];

export const otherProjects: Project[] = [
  {
    id: 'nightly',
    title: 'Nightly',
    desc: 'Application macOS pour améliorer la qualité du sommeil, avec suivi intelligent et recommandations personnalisées.',
    stack: ['Swift', 'macOS', 'Open source'],
    href: 'https://github.com/Armfy/Nightly',
  },
  {
    id: 'legoshop',
    title: 'LegoShop',
    desc: 'Plateforme e-commerce complète : wishlist, catalogue de sets, notation et messagerie entre passionnés. Projet académique SAE 203.',
    stack: ['PHP', 'MySQL', 'JavaScript'],
    href: 'https://web-mmi2.iutbeziers.fr/~rahim.tamhaev/SAE203/',
  },
  {
    id: 'aim-trainer-pro',
    title: 'Aim Trainer Pro',
    desc: "Logiciel desktop d'entraînement à la visée, avec statistiques et graphiques de précision.",
    stack: ['Electron', 'TypeScript'],
    href: 'https://github.com/Armfy/aim-trainer-pro',
  },
  {
    id: 'zwyx',
    title: 'Zwyx',
    desc: "Compagnon de productivité pour l'écosystème Apple : tâches, notes et rappels dans une interface native.",
    stack: ['Swift', 'SwiftUI', 'macOS', 'iOS'],
    href: 'https://github.com/Armfy/Zwyx',
  },
  {
    id: 'horizon',
    title: 'Horizon',
    desc: "Application d'organisation personnelle et de gestion du quotidien, avec synchronisation cloud multi-plateformes.",
    stack: ['SwiftUI', 'Kotlin'],
    status: 'En cours',
  },
];

export const tools = ['MacBook Pro M1', 'Sony ZV-E10 II', 'Figma', 'DaVinci Resolve', 'VS Code', 'Xcode'];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Armfy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahim-tamhaev' },
  { label: 'Instagram', href: 'https://www.instagram.com/rahimwith/' },
];

export const contactHref = 'https://www.linkedin.com/in/rahim-tamhaev';
