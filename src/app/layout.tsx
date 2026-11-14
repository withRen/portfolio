import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DESCRIPTION, NAME, OG_BASE, SITE, TITLE } from '@/lib/seo';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['700'], variable: '--font-barlow', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: `%s · ${NAME}` },
  description: DESCRIPTION,
  applicationName: NAME,
  alternates: { canonical: '/' },
  // Les liens sortants n'envoient que le nom de domaine, jamais l'adresse complète de la page
  referrer: 'strict-origin-when-cross-origin',
  authors: [{ name: NAME, url: SITE }],
  creator: NAME,
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'profile',
    firstName: 'Rahim',
    lastName: 'Tamhaev',
    ...OG_BASE,
    url: '/',
    title: TITLE,
    description: 'Développement web, mobile, desktop et VR, vidéo et photographie.',
  },
  icons: { apple: '/apple-touch-icon.png' },
  twitter: { card: 'summary_large_image', images: ['/og.png'], title: TITLE, description: 'Développement web, mobile, desktop et VR, vidéo et photographie.' },
};

export const viewport: Viewport = { themeColor: '#09090b' };

const SCROLL_MODE = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var native=window.CSS&&CSS.supports('animation-timeline: view()')&&!/[?&]sd=js/.test(location.search);d.classList.add(native?'sd-native':'sd-js')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Pick the scroll animation mode before first paint (see globals.css and ScrollDriver) */}
        <script dangerouslySetInnerHTML={{ __html: SCROLL_MODE }} />
        <noscript>
          <style>{'.site-loader{display:none}'}</style>
        </noscript>
      </head>
      <body className="font-sans text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
