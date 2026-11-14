import { PrivacyPage, privacyMetadata } from '@/legal/pages';

export const metadata = privacyMetadata('fr');

export default function Page() {
  return <PrivacyPage locale="fr" />;
}
