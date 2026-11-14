import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { markIcon } from '@/lib/logo';

/*
 * Image d'aperçu des partages (LinkedIn, Discord, iMessage…), générée au build.
 * Route avec extension pour que GitHub Pages la serve bien en image/png.
 */
export const dynamic = 'force-static';
const size = { width: 1200, height: 630 };

const LOGO = markIcon({ fg: '#09090b', bg: '#f4f4f5' });

export async function GET() {
  const dunes = await readFile(join(process.cwd(), 'public/photos/dunes.png'));
  const bg = `data:image/png;base64,${dunes.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#09090b' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={1200} height={675} style={{ position: 'absolute', top: -20, left: 0, objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.72) 50%, rgba(9,9,11,0.15) 100%)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, width: 1200, height: 630 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`} alt="" width={72} height={72} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 92, color: '#fafafa', letterSpacing: -3, lineHeight: 1 }}>Rahim Tamhaev</div>
            <div style={{ fontSize: 40, color: '#d4d4d8', marginTop: 20 }}>Développeur et vidéaste</div>
            <div style={{ fontSize: 26, color: '#a1a1aa', marginTop: 28 }}>Web · Mobile · VR · Vidéo · Photo — tamhaev.dev</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
