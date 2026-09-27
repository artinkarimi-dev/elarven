import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
};
export default config;
