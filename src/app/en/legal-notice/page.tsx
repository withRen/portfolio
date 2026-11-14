import { LegalNoticePage, legalMetadata } from '@/legal/pages';

export const metadata = legalMetadata('en');

export default function Page() {
  return <LegalNoticePage locale="en" />;
}
