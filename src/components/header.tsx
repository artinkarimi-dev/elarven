'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useStays } from './providers';

export function Header() {
  const path = usePathname();
  const { saved } = useStays();
  const onStays = path.startsWith('/stays') || path.startsWith('/reserve');

  return (
    <header className={`header ${path === '/' ? 'header-home' : ''}`}>
      <Link href="/" className="wordmark" aria-label="Elarven home">
        elarven<span>✳</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/stays" aria-current={onStays ? 'page' : undefined}>
          Find a stay
        </Link>
        <Link className="nav-story" href="/#our-way">
          Our way of staying
        </Link>
      </nav>
      <Link
        className="saved-nav"
        href="/saved"
        aria-current={path === '/saved' ? 'page' : undefined}
        aria-label={`Saved stays, ${saved.length} saved`}
      >
        <Heart size={18} />
        <span>Saved</span>
        {saved.length > 0 && <b>{saved.length}</b>}
      </Link>
    </header>
  );
}
