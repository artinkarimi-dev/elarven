import Link from 'next/link';
import { Star, ArrowUpRight } from 'lucide-react';
import { type Stay } from '@/lib/stays';
import { money, serialize, type Trip } from '@/lib/domain';
import { SaveButton } from './controls';
import { StayImage } from './stay-image';
export function StayCard({ stay, trip }: { stay: Stay; trip?: Trip }) {
  return (
    <article className="stay-card">
      <div className="card-media">
        <Link
          href={`/stays/${stay.slug}${trip ? '?' + serialize(trip) : ''}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <StayImage
            src={stay.images[0].src}
            alt={stay.images[0].alt}
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 31vw"
          />
          <span className="card-view">
            Explore this stay <ArrowUpRight size={17} />
          </span>
        </Link>
        <span className="card-tag">{stay.mood} escape</span>
        <SaveButton id={stay.id} name={stay.name} />
      </div>
      <div className="card-location">
        <span>
          {stay.region}, {stay.country}
        </span>
        <span className="rating">
          <Star size={12} fill="currentColor" /> {stay.rating.toFixed(2)}
        </span>
      </div>
      <Link className="card-title" href={`/stays/${stay.slug}${trip ? '?' + serialize(trip) : ''}`}>
        {stay.retreat} · {stay.name.replace('The ', '')}
      </Link>
      <p className="card-description">
        {stay.capacity} guests <span>·</span> {stay.bedrooms} bedroom{stay.bedrooms > 1 ? 's' : ''}{' '}
        <span>·</span> {stay.type}
      </p>
      <div className="card-price">
        <span>
          <strong>{money(stay.rate)}</strong> / night
        </span>
        <span>+ fees · total at review</span>
      </div>
    </article>
  );
}
