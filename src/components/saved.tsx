'use client';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useStays } from './providers';
import { stays } from '@/lib/stays';
import { StayCard } from './stay-card';
export function Saved() {
  const { saved } = useStays();
  const selected = stays.filter((s) => saved.includes(s.id));
  return (
    <main id="main" className="page">
      <div className="page-intro">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>Places to come back to.</h1>
        <p>
          {selected.length
            ? `${selected.length} ${selected.length === 1 ? 'place' : 'places'} worth keeping close.`
            : 'A little inspiration for your next journey.'}
        </p>
      </div>
      {selected.length ? (
        <div className="card-grid">
          {selected.map((s) => (
            <StayCard key={s.id} stay={s} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Heart size={36} strokeWidth={1} />
          <h2>Your next escape starts here.</h2>
          <p>
            Tap the heart on any stay to keep it in your collection. Your saved places stay with
            this browser.
          </p>
          <Link href="/stays" className="button">
            Find a place you love <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </main>
  );
}
