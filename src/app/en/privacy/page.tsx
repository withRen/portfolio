import { PrivacyPage, privacyMetadata } from '@/legal/pages';

export const metadata = privacyMetadata('en');

export default function Page() {
  return <PrivacyPage locale="en" />;
}
