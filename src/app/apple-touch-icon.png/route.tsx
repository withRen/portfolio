import { ImageResponse } from 'next/og';
import { markIcon } from '@/lib/logo';

/* Icône d'écran d'accueil iOS (PNG, le SVG n'y est pas pris en charge). */
export const dynamic = 'force-static';
const size = { width: 180, height: 180 };

const LOGO = markIcon({ fg: '#f4f4f5', bg: '#09090b', radius: 0 });

export function GET() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`} alt="" width={180} height={180} />,
    size,
  );
}
