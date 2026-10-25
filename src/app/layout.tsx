import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['700'], variable: '--font-barlow', display: 'swap' });

export const metadata: Metadata = {
  title: 'Rahim Tamhaev, développeur et vidéaste',
  description:
    'Portfolio de Rahim Tamhaev, étudiant BUT MMI : développement web, mobile et desktop, création audiovisuelle et photographie.',
  openGraph: {
    type: 'website',
    title: 'Rahim Tamhaev, développeur et vidéaste',
    description: 'Développement web, mobile et desktop, création audiovisuelle et photographie.',
  },
};

export const viewport: Viewport = { themeColor: '#09090b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <head>
        <noscript>
          <style>{'.site-loader{display:none}'}</style>
        </noscript>
      </head>
      <body className="font-sans text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
