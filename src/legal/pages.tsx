import type { Metadata } from 'next';
import Site from '@/components/Site';
import LegalPage from '@/components/LegalPage';
import type { Locale, T } from '@/i18n/config';
import { homeJsonLd, jsonLd, pageMetadata } from '@/lib/seo';
import LegalNotice from './LegalNotice';
import Privacy from './Privacy';

/*
 * Pages partagées par les trois langues : chaque fichier de route (src/app/…)
 * se contente d'appeler ces fonctions avec sa langue.
 */

const UPDATED: T = { fr: '14 novembre 2026', en: 'November 14, 2026', ru: '14 ноября 2026 г.' };

const LEGAL = {
  title: { fr: 'Mentions légales', en: 'Legal notice', ru: 'Правовая информация' } as T,
  description: {
    fr: 'Éditeur, hébergeur et propriété intellectuelle du site tamhaev.dev.',
    en: 'Publisher, host and intellectual property of tamhaev.dev.',
    ru: 'Владелец, хостинг и интеллектуальная собственность сайта tamhaev.dev.',
  } as T,
};

const PRIVACY = {
  title: { fr: 'Politique de confidentialité', en: 'Privacy policy', ru: 'Политика конфиденциальности' } as T,
  description: {
    fr: 'Données personnelles, cookies et vidéos YouTube sur tamhaev.dev.',
    en: 'Personal data, cookies and YouTube videos on tamhaev.dev.',
    ru: 'Персональные данные, cookie и видео YouTube на tamhaev.dev.',
  } as T,
};

export const homeMetadata = (locale: Locale): Metadata => pageMetadata(locale, 'home');

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd(locale)) }} />
      <Site locale={locale} />
    </>
  );
}

export const legalMetadata = (locale: Locale): Metadata =>
  pageMetadata(locale, 'legal', { title: LEGAL.title[locale], description: LEGAL.description[locale] });

export function LegalNoticePage({ locale }: { locale: Locale }) {
  return (
    <LegalPage locale={locale} page="legal" title={LEGAL.title[locale]} updated={UPDATED[locale]}>
      <LegalNotice locale={locale} />
    </LegalPage>
  );
}

export const privacyMetadata = (locale: Locale): Metadata =>
  pageMetadata(locale, 'privacy', { title: PRIVACY.title[locale], description: PRIVACY.description[locale] });

export function PrivacyPage({ locale }: { locale: Locale }) {
  return (
    <LegalPage locale={locale} page="privacy" title={PRIVACY.title[locale]} updated={UPDATED[locale]}>
      <Privacy locale={locale} />
    </LegalPage>
  );
}
