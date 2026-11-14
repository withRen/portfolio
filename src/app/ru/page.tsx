import { HomePage, homeMetadata } from '@/legal/pages';

export const metadata = homeMetadata('ru');

export default function Page() {
  return <HomePage locale="ru" />;
}
