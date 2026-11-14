import { htmlLang, type Locale } from '@/i18n/config';
import { fontVariables } from '@/lib/fonts';
import '@/app/globals.css';

const SCROLL_MODE = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var native=window.CSS&&CSS.supports('animation-timeline: view()')&&!/[?&]sd=js/.test(location.search);d.classList.add(native?'sd-native':'sd-js')}}catch(e){}`;

/** Document HTML commun aux trois langues : seule la langue déclarée change. */
export default function RootHtml({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
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
