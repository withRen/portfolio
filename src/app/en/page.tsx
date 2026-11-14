import { HomePage, homeMetadata } from '@/legal/pages';

export const metadata = homeMetadata('en');

export default function Page() {
  return <HomePage locale="en" />;
}
