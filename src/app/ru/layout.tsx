import type { Viewport } from 'next';
import RootHtml from '@/components/RootHtml';
import { siteMetadata } from '@/lib/seo';

export const metadata = siteMetadata('ru');
export const viewport: Viewport = { themeColor: '#09090b' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="ru">{children}</RootHtml>;
}
