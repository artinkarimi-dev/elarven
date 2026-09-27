'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mountain, Waves, Trees, Sun } from 'lucide-react';
import { stays, moods, type Mood } from '@/lib/stays';
import { StayCard } from './stay-card';
const icons = { Alpine: Mountain, Coast: Waves, Desert: Sun, Forest: Trees };
export function Discovery() {
  const [mood, setMood] = useState<Mood | 'All'>('All');
  const selected =
    mood === 'All'
      ? stays.filter((s) => s.featured).slice(0, 3)
      : stays.filter((s) => s.mood === mood);
  return (
    <section className="section discovery" id="discover">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COLLECTION · 12 CONSIDERED STAYS</p>
          <h2>
            Where do you want to <em>feel?</em>
          </h2>
        </div>
        <Link href="/stays" className="text-link">
          Explore all stays <ArrowRight size={18} />
        </Link>
      </div>
      <div className="mood-tabs" role="group" aria-label="Explore by landscape">
        <button aria-pressed={mood === 'All'} onClick={() => setMood('All')}>
          All places
        </button>
        {moods.map((m) => {
          const Icon = icons[m];
          return (
            <button key={m} aria-pressed={mood === m} onClick={() => setMood(m)}>
              <Icon size={18} />
              {m}
            </button>
          );
        })}
        <span>Different landscapes. The same feeling.</span>
      </div>
      <div className="card-grid" key={mood}>
        {selected.map((s) => (
          <StayCard key={s.id} stay={s} />
        ))}
      </div>
    </section>
  );
}
