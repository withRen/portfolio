import Site from '@/components/Site';
import { homeJsonLd, jsonLd } from '@/lib/seo';

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd()) }} />
      <Site />
    </>
  );
}
