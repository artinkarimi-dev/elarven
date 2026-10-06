import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MotionEffects } from '@/components/motion-effects';
import './globals.css';
import './polish.css';
const sans = localFont({
  src: '../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2',
  variable: '--font-sans',
  display: 'swap',
});
const serif = localFont({
  src: '../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2',
  variable: '--font-serif',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Elarven — A little further from ordinary', template: '%s · Elarven' },
  description:
    'Discover exceptional cabins, coastal villas and quiet retreats. Find a place that makes the journey worthwhile.',
  alternates: { canonical: '/' },
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'Elarven — A little further from ordinary',
    description: 'Exceptional stays. Slower journeys.',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <MotionEffects />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
