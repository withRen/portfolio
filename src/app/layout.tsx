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
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2309090b'/%3E%3Ctext x='16' y='22' font-family='Helvetica,Arial,sans-serif' font-size='16' font-weight='700' text-anchor='middle' fill='%23f4f4f5'%3ERT%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: '#09090b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
