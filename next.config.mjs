const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  // Une seule page 404 pour les trois langues (src/app/global-not-found.tsx)
  experimental: { globalNotFound: true },
};

export default nextConfig;
