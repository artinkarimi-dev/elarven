import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="empty page">
      <p className="eyebrow">A SMALL DETOUR · 404</p>
      <h1>This path ends here.</h1>
      <p>There are still extraordinary places waiting to be found.</p>
      <Link className="button" href="/stays">
        Explore the stays
      </Link>
    </main>
  );
}
