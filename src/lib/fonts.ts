import { Barlow_Condensed, Geist, Geist_Mono, Oswald } from 'next/font/google';

/*
 * Polices auto-hébergées au build (aucune requête vers Google Fonts).
 * Geist couvre le latin et le cyrillique. Barlow Condensed n'a pas de cyrillique :
 * Oswald prend le relais pour les titres en russe (voir html:lang(ru) dans globals.css).
 * Son sous-ensemble est cyrillique seul et sans police de repli : les lettres latines
 * restent en Barlow Condensed.
 */
export const sans = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-geist-sans', display: 'swap' });
export const mono = Geist_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-geist-mono', display: 'swap' });
export const display = Barlow_Condensed({ subsets: ['latin'], weight: ['700'], variable: '--font-barlow', display: 'swap' });
export const displayCyrillic = Oswald({
  subsets: ['cyrillic'],
  weight: ['700'],
  variable: '--font-oswald',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: [],
});

export const fontVariables = [sans, mono, display, displayCyrillic].map((f) => f.variable).join(' ');
