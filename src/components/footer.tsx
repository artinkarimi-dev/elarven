import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="eyebrow">GO SOMEWHERE WORTH REMEMBERING</p>
        <Link className="wordmark" href="/">
          elarven<span>✳</span>
        </Link>
        <p>A place to stay. A reason to go.</p>
      </div>
      <div>
        <Link href="/stays">
          Explore all stays <ArrowUpRight size={16} />
        </Link>
        <Link href="/stays?mood=Alpine">
          Into the mountains <ArrowUpRight size={16} />
        </Link>
        <Link href="/stays?mood=Coast">
          Follow the coast <ArrowUpRight size={16} />
        </Link>
        <Link href="/saved">
          Your saved places <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getUTCFullYear()} Elarven</span>
        <span>Thoughtfully chosen. Quietly extraordinary.</span>
        <span>EUR · English</span>
      </div>
    </footer>
  );
}
