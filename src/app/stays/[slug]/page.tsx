import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { stayRepository } from '@/lib/stays';
import { parseFilters, related } from '@/lib/domain';
import { Gallery } from '@/components/gallery';
import { BookingPanel, ShareButton } from '@/components/booking';
import { SaveButton, Modal } from '@/components/controls';
import { StayCard } from '@/components/stay-card';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const stay = stayRepository.find((await params).slug);
  return {
    title: stay ? `${stay.retreat} · ${stay.name}` : 'Stay not found',
    description: stay?.tagline,
    alternates: stay ? { canonical: `/stays/${stay.slug}` } : undefined,
    openGraph: stay
      ? {
          title: `${stay.retreat} · ${stay.name}`,
          description: stay.tagline,
          images: [{ url: stay.images[0].src, width: 1536, height: 1024 }],
        }
      : undefined,
  };
}
export default async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const stay = stayRepository.find((await params).slug);
  if (!stay) notFound();
  const raw = await searchParams;
  const q = new URLSearchParams();
  Object.entries(raw).forEach(([k, v]) => {
    if (typeof v === 'string') q.set(k, v);
  });
  const trip = parseFilters(q);
  return (
    <main id="main" className="page detail-page">
      <div className="detail-breadcrumb">
        <Link href={`/stays?${q.toString()}`}>
          <ArrowLeft size={16} /> Back to the collection
        </Link>
        <div>
          <ShareButton />
          <SaveButton id={stay.id} name={stay.name} full />
        </div>
      </div>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            {stay.mood.toUpperCase()} / {stay.region.toUpperCase()}, {stay.country.toUpperCase()}
          </p>
          <h1>
            {stay.retreat}
            <em> · {stay.name.replace('The ', '')}</em>
          </h1>
        </div>
        <p className="rating">
          <Star size={15} fill="currentColor" /> {stay.rating.toFixed(2)}{' '}
          <span>({stay.reviews} reviews)</span>
        </p>
      </div>
      <Gallery stay={stay} />
      <div className="detail-columns">
        <div className="detail-content">
          <p className="eyebrow">YOUR OWN LITTLE CORNER OF {stay.country.toUpperCase()}</p>
          <h2>{stay.tagline}</h2>
          <div className="capacity-row">
            <span>
              <Users size={18} />
              {stay.capacity} guests
            </span>
            <span>
              <BedDouble size={18} />
              {stay.bedrooms} bedrooms · {stay.beds} beds
            </span>
            <span>
              <Bath size={18} />
              {stay.bathrooms} bath{stay.bathrooms > 1 ? 's' : ''}
            </span>
          </div>
          <p className="description">{stay.description}</p>
          <div className="detail-section" data-reveal>
            <h3>The small things, considered.</h3>
            <div className="amenity-grid">
              {stay.amenities.slice(0, 4).map((a) => (
                <span key={a}>
                  <Check size={17} />
                  {a}
                </span>
              ))}
            </div>
            <Modal
              title="Everything you need"
              className="text-link"
              trigger={`View all ${stay.amenities.length} amenities`}
            >
              <div className="amenity-grid">
                {stay.amenities.map((a) => (
                  <span key={a}>
                    <Check size={17} />
                    {a}
                  </span>
                ))}
              </div>
              <p className="muted">
                Fresh linen, towels and basic toiletries are included with every stay.
              </p>
            </Modal>
          </div>
          <div className="detail-section" data-reveal>
            <h3>Before you arrive.</h3>
            <div className="practical">
              <Clock size={20} />
              <div>
                <strong>A little time to settle in</strong>
                <p>
                  Check-in from 15:00. Check-out by 11:00. An entire private{' '}
                  {stay.type.toLowerCase()} at {stay.retreat}.
                </p>
              </div>
            </div>
            <div className="practical">
              <ShieldCheck size={20} />
              <div>
                <strong>{stay.flexible ? 'Plans can change' : 'A considered commitment'}</strong>
                <p>
                  Free cancellation until {stay.flexible ? '7' : '14'} days before arrival. After
                  that, accommodation is non-refundable. Cleaning and local tax are refunded.
                </p>
              </div>
            </div>
          </div>
          <div className="detail-section" data-reveal>
            <h3>A sense of place.</h3>
            <p className="location-note">
              <MapPin size={20} />
              {stay.region}, {stay.country}
            </p>
            <p className="description">
              {stay.mood === 'Alpine'
                ? 'Mountain paths, pine forests and small villages. A car is recommended for exploring the valleys.'
                : stay.mood === 'Coast'
                  ? 'Coastal walks and quiet coves. A car makes it easier to explore the island beyond the terrace.'
                  : stay.mood === 'Desert'
                    ? 'Open stone desert southwest of Marrakech. Plan a car transfer and bring layers for cool evenings.'
                    : 'Forest paths and still water near the Arctic Circle. Plan your arrival by car and prepare for changing weather.'}
            </p>
            <p className="muted">The map shows the region, rather than an exact street address.</p>
          </div>
        </div>
        <BookingPanel stay={stay} initial={trip} />
      </div>
      <section className="related-section" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE MORE INSPIRATION</p>
            <h2>Another way to stay.</h2>
          </div>
        </div>
        <div className="card-grid">
          {related(stayRepository.list(), stay).map((s) => (
            <StayCard stay={s} key={s.id} trip={trip} />
          ))}
        </div>
      </section>
    </main>
  );
}
