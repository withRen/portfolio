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
  video('2CmLxsLWXKE', 'Was that the right way', 'Court-métrage narratif'),
  video('zNx36iwjhD8', 'Pub de montre', 'Publicité produit'),
  video('aPt2vD_mj0k', 'Publicité sur la musique', 'Court-métrage publicitaire'),
  video('OSng25-tAkc', 'Europe en 2100', 'Documentaire fictif'),
  video('LTE60C6riRU', 'Amentia', 'Projet créatif'),
  video('IzuP73MLAhQ', 'Intro Kill Bill', 'Générique alternatif'),
];

export const projects: Project[] = [
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
    id: 'immanence',
    title: 'Immanence',
    desc: 'Thème WordPress sur mesure pour des retraites de bien-être, avec interface personnalisée et back-office optimisé. Site client en ligne.',
    stack: ['WordPress', 'PHP', 'UI / UX'],
    href: 'https://www.imma-nence.com/',
    image: asset('/photos/immanence_thumbnail.png'),
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
