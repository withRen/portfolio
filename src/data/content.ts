export type Row = {
  title: string;
  desc?: string;
  tags: string[];
  href?: string;
  preview?: string;
  status?: string;
};

export const navLinks = [
  { href: '#dev', label: 'Développement' },
  { href: '#audiovisuel', label: 'Audiovisuel' },
  { href: '#photographie', label: 'Photographie' },
  { href: '#outils', label: 'Outils' },
  { href: '#contact', label: 'Contact' },
];

export const projects: Row[] = [
  {
    title: 'Nightly',
    desc: 'Application macOS pour améliorer la qualité du sommeil, avec suivi intelligent et recommandations personnalisées.',
    tags: ['Swift', 'macOS', 'Open source'],
    href: 'https://github.com/Armfy/Nightly',
  },
  {
    title: 'LegoShop',
    desc: 'Plateforme e-commerce complète : wishlist, catalogue de sets, notation et messagerie entre passionnés. Projet académique SAE 203.',
    tags: ['PHP', 'MySQL', 'JavaScript'],
    href: 'https://web-mmi2.iutbeziers.fr/~rahim.tamhaev/SAE203/',
  },
  {
    title: 'Aim Trainer Pro',
    desc: "Logiciel desktop d'entraînement à la visée, avec métriques statistiques et graphiques de précision.",
    tags: ['Electron', 'TypeScript', 'Desktop'],
    href: 'https://github.com/Armfy/aim-trainer-pro',
  },
  {
    title: 'Immanence',
    desc: "Conception et développement d'un thème sur mesure pour des retraites de bien-être. Interface personnalisée et back-office optimisé. Site client en ligne.",
    tags: ['WordPress', 'PHP', 'UI / UX'],
    href: 'https://www.imma-nence.com/',
    preview: '/photos/immanence_thumbnail.png',
  },
  {
    title: 'Zwyx',
    desc: "Compagnon de productivité pour l'écosystème Apple : tâches, notes et rappels dans une interface native.",
    tags: ['Swift', 'SwiftUI', 'macOS / iOS'],
    href: 'https://github.com/Armfy/Zwyx',
  },
  {
    title: 'Horizon',
    desc: "Application de gestion de vie quotidienne et d'organisation personnelle, avec synchronisation cloud multi-plateformes.",
    tags: ['SwiftUI', 'Kotlin'],
    status: 'En cours',
  },
];

export const featuredVideo = {
  id: '2CmLxsLWXKE',
  title: 'Was that the right way',
  type: 'Court-métrage narratif',
  href: 'https://youtu.be/2CmLxsLWXKE',
};

const yt = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const videos: Row[] = [
  { title: 'Pub de montre', tags: ['Publicité produit'], href: 'https://youtu.be/zNx36iwjhD8', preview: yt('zNx36iwjhD8') },
  { title: 'Publicité sur la musique', tags: ['Court-métrage publicitaire'], href: 'https://youtu.be/aPt2vD_mj0k', preview: yt('aPt2vD_mj0k') },
  { title: 'Europe en 2100', tags: ['Documentaire fictif'], href: 'https://youtu.be/OSng25-tAkc', preview: yt('OSng25-tAkc') },
  { title: 'Amentia', tags: ['Projet créatif'], href: 'https://youtu.be/LTE60C6riRU', preview: yt('LTE60C6riRU') },
  { title: 'Intro Kill Bill', tags: ['Générique alternatif'], href: 'https://youtu.be/IzuP73MLAhQ', preview: yt('IzuP73MLAhQ') },
];

export type Photo = { file: string; title: string; w: number; h: number };

const p = (file: string, title: string, h: number): Photo => ({ file, title, w: 1000, h });

// Three columns, balanced by total height. Order here is the lightbox order.
export const photoColumns: Photo[][] = [
  [
    p('DSC00328-Enhanced-NR-2', 'Sans titre', 1500),
    p('20250525_131001', 'Mai 2025', 750),
    p('IMG_0361', 'Sans titre', 1333),
    p('hellebore_1', 'Hellébore I', 666),
    p('20250525_140010', 'Mai 2025', 1333),
    p('park_ducks', 'Scène de parc', 666),
    p('IMG_20250118_173738', 'Janvier 2025', 750),
  ],
  [
    p('corner_building', 'Corner Building', 1501),
    p('20250525_132308', 'Mai 2025', 750),
    p('DSC00342-Enhanced-NR', 'Sans titre', 1500),
    p('hellebore_2', 'Hellébore II', 666),
    p('IMG_20240929_212728', 'Septembre 2024', 1333),
    p('IMG_0356', 'Sans titre', 1333),
  ],
  [
    p('20250525_140729', 'Mai 2025', 750),
    p('DSC00334-Enhanced-NR', 'Sans titre', 1500),
    p('20250525_132728', 'Mai 2025', 1333),
    p('hellebore_3', 'Hellébore III', 666),
    p('IMG_20250118_173535', 'Janvier 2025', 1333),
    p('IMG_20250118_173443', 'Janvier 2025', 1333),
  ],
];

export const tools = [
  { name: 'MacBook Pro M1' },
  { name: 'Sony ZV-E10 II', note: '25 mm f/1.7' },
  { name: 'Figma' },
  { name: 'DaVinci Resolve' },
  { name: 'VS Code' },
  { name: 'Xcode' },
];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Armfy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahim-tamhaev' },
  { label: 'Instagram', href: 'https://www.instagram.com/rahimwith/' },
];
