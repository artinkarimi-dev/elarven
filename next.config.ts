import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2_592_000,
  },
  devIndicators: false,
  output: 'standalone',
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Sharp loads Windows DLLs at runtime; static tracing only finds its .node entry.
  outputFileTracingIncludes: { '/*': ['./node_modules/@img/sharp-*/lib/*.dll'] },
};

export default config;
