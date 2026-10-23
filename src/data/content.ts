export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

export type Kind = 'dev' | 'video' | 'photo';

export type Work = {
  id: string;
  kind: Kind;
  title: string;
  tags: string[];
  href?: string;
  desc?: string;
  status?: string;
  image?: string;
  imageFallback?: string;
  ratio: number; // width / height
};

export const kindLabel: Record<Kind, string> = {
  dev: 'Développement',
  video: 'Vidéo',
  photo: 'Photo',
};

const video = (id: string, title: string, type: string): Work => ({
  id: `video-${id}`,
  kind: 'video',
  title,
  tags: [type],
  href: `https://youtu.be/${id}`,
  image: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
  imageFallback: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  ratio: 16 / 9,
});

const photo = (file: string, title: string, h: number): Work => ({
  id: `photo-${file}`,
  kind: 'photo',
  title,
  tags: [],
  image: asset(`/photos/${file}.webp`),
  ratio: 1000 / h,
});

const dev = (w: Omit<Work, 'kind' | 'ratio' | 'id'> & { id: string }): Work => ({
  ...w,
  id: `dev-${w.id}`,
  kind: 'dev',
  ratio: 4 / 3,
});

export const works: Work[] = [
  dev({
    id: 'nightly',
    title: 'Nightly',
    desc: 'Application macOS pour améliorer la qualité du sommeil, avec suivi intelligent et recommandations personnalisées.',
    tags: ['Swift', 'macOS', 'Open source'],
    href: 'https://github.com/Armfy/Nightly',
  }),
  dev({
    id: 'legoshop',
    title: 'LegoShop',
    desc: 'Plateforme e-commerce complète : wishlist, catalogue de sets, notation et messagerie entre passionnés. Projet académique SAE 203.',
    tags: ['PHP', 'MySQL', 'JavaScript'],
    href: 'https://web-mmi2.iutbeziers.fr/~rahim.tamhaev/SAE203/',
  }),
  dev({
    id: 'aim-trainer-pro',
    title: 'Aim Trainer Pro',
    desc: "Logiciel desktop d'entraînement à la visée, avec métriques statistiques et graphiques de précision.",
    tags: ['Electron', 'TypeScript', 'Desktop'],
    href: 'https://github.com/Armfy/aim-trainer-pro',
  }),
  dev({
    id: 'immanence',
    title: 'Immanence',
    desc: "Conception et développement d'un thème sur mesure pour des retraites de bien-être. Interface personnalisée et back-office optimisé. Site client en ligne.",
    tags: ['WordPress', 'PHP', 'UI / UX'],
    href: 'https://www.imma-nence.com/',
    image: asset('/photos/immanence_thumbnail.png'),
  }),
  dev({
    id: 'zwyx',
    title: 'Zwyx',
    desc: "Compagnon de productivité pour l'écosystème Apple : tâches, notes et rappels dans une interface native.",
    tags: ['Swift', 'SwiftUI', 'macOS / iOS'],
    href: 'https://github.com/Armfy/Zwyx',
  }),
  dev({
    id: 'horizon',
    title: 'Horizon',
    desc: "Application de gestion de vie quotidienne et d'organisation personnelle, avec synchronisation cloud multi-plateformes.",
    tags: ['SwiftUI', 'Kotlin'],
    status: 'En cours',
  }),

  video('2CmLxsLWXKE', 'Was that the right way', 'Court-métrage narratif'),
  video('zNx36iwjhD8', 'Pub de montre', 'Publicité produit'),
  video('aPt2vD_mj0k', 'Publicité sur la musique', 'Court-métrage publicitaire'),
  video('OSng25-tAkc', 'Europe en 2100', 'Documentaire fictif'),
  video('LTE60C6riRU', 'Amentia', 'Projet créatif'),
  video('IzuP73MLAhQ', 'Intro Kill Bill', 'Générique alternatif'),

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

export const tools = [
  'MacBook Pro M1',
  'Sony ZV-E10 II, 25 mm f/1.7',
  'Figma',
  'DaVinci Resolve',
  'VS Code',
  'Xcode',
];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Armfy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahim-tamhaev' },
  { label: 'Instagram', href: 'https://www.instagram.com/rahimwith/' },
];
