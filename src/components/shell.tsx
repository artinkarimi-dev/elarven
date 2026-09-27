'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useStays } from './providers';
export function Header() {
  const path = usePathname();
  const { saved } = useStays();
  return (
    <header className={`header ${path === '/' ? 'header-home' : ''}`}>
      <Link href="/" className="wordmark" aria-label="Elarven home">
        elarven<span>✳</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/stays" aria-current={path === '/stays' ? 'page' : undefined}>
          Find a stay
        </Link>
        <Link className="nav-story" href="/#our-way">
          Our way of staying
        </Link>
      </nav>
      <Link className="saved-nav" href="/saved" aria-label={`Saved stays, ${saved.length} saved`}>
        <Heart size={18} />
        <span>Saved</span>
        {saved.length > 0 && <b>{saved.length}</b>}
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link className="wordmark" href="/">
          elarven<span>✳</span>
        </Link>
        <p>A place to stay. A reason to go.</p>
      </div>
      <div>
        <Link href="/stays">
          Explore all stays <ArrowUpRight size={16} />
        </Link>
        <Link href="/saved">
          Your saved places <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Elarven</span>
        <span>Thoughtfully chosen. Quietly extraordinary.</span>
        <span>EUR · English</span>
      </div>
    </footer>
  );
}
