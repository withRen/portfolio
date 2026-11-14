import { ImageResponse } from 'next/og';
import { markIcon } from '@/lib/logo';

/* Icône PNG 512 px : manifest, Google et navigateurs sans prise en charge du SVG. */
export const dynamic = 'force-static';

const LOGO = markIcon({ fg: '#f4f4f5', bg: '#09090b' });

export function GET() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`} alt="" width={512} height={512} />,
    { width: 512, height: 512 },
  );
}
