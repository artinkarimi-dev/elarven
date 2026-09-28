import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { formats: ['image/avif', 'image/webp'] },
  devIndicators: false,
  output: 'standalone',
  // Sharp loads Windows DLLs at runtime; static tracing only finds its .node entry.
  outputFileTracingIncludes: { '/*': ['./node_modules/@img/sharp-*/lib/*.dll'] },
};
export default config;
