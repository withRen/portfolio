import { PrivacyPage, privacyMetadata } from '@/legal/pages';

export const metadata = privacyMetadata('ru');

export default function Page() {
  return <PrivacyPage locale="ru" />;
}
