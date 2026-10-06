'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Share2 } from 'lucide-react';
import { type Stay } from '@/lib/stays';
import { money, price, serialize, validateDates, validGuests, type Trip } from '@/lib/domain';
import { TripInputs } from './controls';
import { useStays } from './providers';
export function Breakdown({
  stay,
  trip,
  rate = 'standard',
}: {
  stay: Stay;
  trip: Trip;
  rate?: 'standard' | 'flexible';
}) {
  const p = price(stay, trip, rate);
  if (!p) return null;
  return (
    <div className="price-breakdown">
      <dl>
        <div>
          <dt>
            {money(p.nightly)} × {p.nights} nights
          </dt>
          <dd>{money(p.accommodation)}</dd>
        </div>
        <div>
          <dt>Cleaning</dt>
          <dd>{money(p.cleaning)}</dd>
        </div>
        <div>
          <dt>Service fee · {stay.servicePercent * 100}%</dt>
          <dd>{money(p.service)}</dd>
        </div>
        <div>
          <dt>Local tax · adults only</dt>
          <dd>{money(p.tax)}</dd>
        </div>
        <div className="total">
          <dt>
            Total <span>EUR</span>
          </dt>
          <dd>{money(p.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
export function BookingPanel({ stay, initial }: { stay: Stay; initial: Trip }) {
  const [trip, setTrip] = useState(initial);
  const issue =
    validateDates(trip.checkin, trip.checkout, stay.blocked) ||
    (!validGuests(trip, stay.capacity)
      ? `This stay welcomes up to ${stay.capacity} guests.`
      : null);
  const p = price(stay, trip);
  return (
    <>
      <aside className="booking-panel" id="availability">
        <div className="booking-price">
          <span>
            <strong>{money(stay.rate)}</strong> / night
          </span>
          <span>Entire {stay.type.toLowerCase()}</span>
        </div>
        <p className="muted">Your time away starts here.</p>
        <div className="booking-fields">
          <TripInputs trip={trip} onChange={setTrip} capacity={stay.capacity} />
        </div>
        <div aria-live="polite">
          {issue ? (
            <p className="form-error">{issue}</p>
          ) : (
            <p className="availability">
              <Check size={15} /> These dates are open
            </p>
          )}
        </div>
        <Breakdown stay={stay} trip={trip} />
        {issue ? (
          <button type="button" className="button full" disabled>
            Choose available dates
          </button>
        ) : (
          <Link className="button full" href={`/reserve/${stay.slug}?${serialize(trip)}`}>
            Reserve this stay <ArrowRight size={18} />
          </Link>
        )}
        <p className="booking-note">Review your details before confirming.</p>
      </aside>
      <div className="mobile-booking">
        <div>
          <strong>{money(stay.rate)}</strong>
          <span> / night</span>
          <small>{!issue && p ? `${money(p.total)} total` : 'Choose your dates'}</small>
        </div>
        <a className="button" href="#availability">
          Check dates <ArrowRight size={16} />
        </a>
      </div>
    </>
  );
}
export function ShareButton() {
  const [message, setMessage] = useState('Share');
  const { announce } = useStays();
  return (
    <button
      className="share-button"
      type="button"
      onClick={async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title: document.title, url: window.location.href });
            setMessage('Shared');
            announce('Stay shared successfully.');
            return;
          } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
          }
        }

        try {
          await navigator.clipboard.writeText(window.location.href);
          setMessage('Link copied');
          announce('Stay link copied to clipboard.');
        } catch {
          setMessage('Copy the address above');
          announce('Copy this page’s address from your browser to share it.');
        }
      }}
    >
      <Share2 size={17} />
      {message}
    </button>
  );
}
