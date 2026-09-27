import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
};
export default config;
