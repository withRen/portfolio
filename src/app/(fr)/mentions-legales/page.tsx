import { LegalNoticePage, legalMetadata } from '@/legal/pages';

export const metadata = legalMetadata('fr');

export default function Page() {
  return <LegalNoticePage locale="fr" />;
}
