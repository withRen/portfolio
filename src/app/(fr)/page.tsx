import { HomePage, homeMetadata } from '@/legal/pages';

export const metadata = homeMetadata('fr');

export default function Page() {
  return <HomePage locale="fr" />;
}
