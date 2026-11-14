import { LegalNoticePage, legalMetadata } from '@/legal/pages';

export const metadata = legalMetadata('ru');

export default function Page() {
  return <LegalNoticePage locale="ru" />;
}
