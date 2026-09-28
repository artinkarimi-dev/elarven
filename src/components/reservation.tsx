'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import { type Stay, stayRepository } from '@/lib/stays';
import { price, money, serialize, validateDates, validGuests, type Trip } from '@/lib/domain';
import { contactSchema, type Contact } from '@/lib/reservation';
import { TripInputs } from './controls';
import { Breakdown } from './booking';
import { StayImage } from './stay-image';
import { useStays } from './providers';
const blank: Contact = { firstName: '', lastName: '', email: '', accepted: false };
export function Reservation({
  stay,
  initial,
  initialRate = 'standard',
}: {
  stay: Stay;
  initial: Trip;
  initialRate?: 'standard' | 'flexible';
}) {
  const router = useRouter();
  const { confirm } = useStays();
  const [trip, setTrip] = useState(initial);
  const [rate, setRate] = useState<'standard' | 'flexible'>(initialRate);
  const [contact, setContact] = useState<Contact>(blank);
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [review, setReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const issue =
    validateDates(trip.checkin, trip.checkout, stay.blocked) ||
    (!validGuests(trip, stay.capacity) ? `Choose no more than ${stay.capacity} guests.` : null);
  const total = price(stay, trip, rate);
  function submit() {
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const e of parsed.error.issues) next[e.path[0] as keyof Contact] = e.message;
      setErrors(next);
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    if (issue || !total) return;
    setErrors({});
    setReview(true);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function finish() {
    if (submitting || issue || !total || !contactSchema.safeParse(contact).success) return;
    setSubmitting(true);
    confirm({
      reference: 'EL-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      slug: stay.slug,
      trip,
      total: total.total,
    });
    setContact(blank);
    router.push('/reservation/confirmed');
  }
  const changeTrip = (t: Trip) => {
    setTrip(t);
    setReview(false);
  };
  return (
    <main id="main" className="page reservation-page">
      <Link className="back-link" href={`/stays/${stay.slug}?${serialize(trip)}`}>
        <ArrowLeft size={16} /> Back to your stay
      </Link>
      <div className="page-intro">
        <p className="eyebrow">A FEW DETAILS, THEN YOU’RE THERE</p>
        <h1 ref={heading} tabIndex={-1}>
          {review ? 'One last look.' : 'Make it your getaway.'}
        </h1>
      </div>
      <ol className="reservation-steps">
        <li className="active">
          <span>{review ? <Check size={14} /> : 1}</span>Your details
        </li>
        <li className={review ? 'active' : ''}>
          <span>2</span>Review your stay
        </li>
        <li>
          <span>3</span>All set
        </li>
      </ol>
      <div className="reservation-columns">
        <div>
          {!review ? (
            <form
              ref={form}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <section className="reservation-section">
                <h2>Your time away</h2>
                <TripInputs trip={trip} onChange={changeTrip} capacity={stay.capacity} />
                <label className="field-label">
                  Your rate
                  <select
                    value={rate}
                    onChange={(e) => setRate(e.target.value as 'standard' | 'flexible')}
                  >
                    <option value="standard">Standard · {money(stay.rate)} / night</option>
                    <option value="flexible">
                      Extra flexible · {money(stay.rate + 25)} / night
                    </option>
                  </select>
                </label>
                <p className="muted">
                  {rate === 'flexible'
                    ? 'Cancel free until 48 hours before arrival.'
                    : `Cancel free until ${stay.flexible ? 7 : 14} days before arrival.`}{' '}
                  After that, accommodation is non-refundable; cleaning and local tax are refunded.
                </p>
                {issue && (
                  <p className="form-error" role="alert">
                    {issue}
                  </p>
                )}
              </section>
              <section className="reservation-section">
                <h2>Who’s making the journey?</h2>
                <p className="muted">Add the lead guest’s details.</p>
                <div className="contact-grid">
                  {(['firstName', 'lastName', 'email'] as const).map((field) => (
                    <div key={field} className={field === 'email' ? 'wide' : ''}>
                      <label htmlFor={field}>
                        {field === 'firstName'
                          ? 'First name'
                          : field === 'lastName'
                            ? 'Last name'
                            : 'Email address'}
                      </label>
                      <input
                        id={field}
                        name={field}
                        type={field === 'email' ? 'email' : 'text'}
                        autoComplete={
                          field === 'firstName'
                            ? 'given-name'
                            : field === 'lastName'
                              ? 'family-name'
                              : 'email'
                        }
                        value={contact[field]}
                        onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                        aria-invalid={!!errors[field]}
                        aria-describedby={errors[field] ? `${field}-error` : undefined}
                        maxLength={field === 'email' ? 160 : 80}
                        required
                      />
                      {errors[field] && (
                        <p className="form-error" id={`${field}-error`}>
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={contact.accepted}
                    onChange={(e) => setContact({ ...contact, accepted: e.target.checked })}
                    aria-invalid={!!errors.accepted}
                    aria-describedby={errors.accepted ? 'accepted-error' : undefined}
                  />{' '}
                  I’ve read and accept the cancellation policy above.
                </label>
                {errors.accepted && (
                  <p className="form-error" id="accepted-error">
                    {errors.accepted}
                  </p>
                )}
                <button className="button full" type="submit" disabled={!!issue}>
                  Review reservation <ArrowRight size={17} />
                </button>
              </section>
            </form>
          ) : (
            <section className="reservation-section review-details">
              <h2>Everything in its place.</h2>
              <dl>
                <div>
                  <dt>Lead guest</dt>
                  <dd>
                    {contact.firstName} {contact.lastName}
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{contact.email}</dd>
                </div>
                <div>
                  <dt>Your dates</dt>
                  <dd>
                    {trip.checkin} — {trip.checkout}
                  </dd>
                </div>
                <div>
                  <dt>Your party</dt>
                  <dd>
                    {trip.adults} {trip.adults === 1 ? 'adult' : 'adults'}
                    {trip.children
                      ? ` · ${trip.children} ${trip.children === 1 ? 'child' : 'children'}`
                      : ''}
                  </dd>
                </div>
                <div>
                  <dt>Your rate</dt>
                  <dd>
                    {rate === 'flexible' ? 'Extra flexible' : 'Standard'} · entire{' '}
                    {stay.type.toLowerCase()}
                  </dd>
                </div>
              </dl>
              <p className="policy-note">
                <ShieldCheck size={19} /> Free cancellation until{' '}
                {rate === 'flexible' ? '48 hours' : `${stay.flexible ? 7 : 14} days`} before
                arrival.
              </p>
              <button className="button full" onClick={finish} disabled={submitting}>
                {submitting ? 'Confirming…' : 'Confirm reservation'}
                <ArrowRight size={17} />
              </button>
              <button
                className="edit-details"
                onClick={() => {
                  setReview(false);
                  requestAnimationFrame(() => heading.current?.focus());
                }}
              >
                Edit your details
              </button>
            </section>
          )}
        </div>
        <aside className="reservation-summary">
          <div className="summary-image">
            <StayImage
              src={stay.images[0].src}
              alt={stay.images[0].alt}
              fill
              sizes="(max-width: 900px) 90vw, 35vw"
            />
          </div>
          <div className="summary-body">
            <p className="eyebrow">
              {stay.region}, {stay.country}
            </p>
            <h2>{stay.retreat}</h2>
            <p>
              {stay.name} · {stay.type}
            </p>
            <Breakdown stay={stay} trip={trip} rate={rate} />
            <p className="muted">
              <ShieldCheck size={16} /> All fees included. No card details needed.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
export function Confirmation() {
  const { confirmation, confirm } = useStays();
  const stay = confirmation ? stayRepository.find(confirmation.slug) : undefined;
  if (!confirmation || !stay)
    return (
      <main id="main" className="empty page">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h1>Let’s find your somewhere.</h1>
        <p>
          Your reservation summary is available right after you confirm a stay. Start a new journey
          to create one.
        </p>
        <Link href="/stays" className="button">
          Explore stays <ArrowRight size={17} />
        </Link>
      </main>
    );
  return (
    <main id="main" className="page confirmation">
      <div className="confirmation-copy">
        <CheckCircle2 size={40} strokeWidth={1} />
        <p className="eyebrow">YOUR NEXT CHAPTER IS SET</p>
        <h1>
          Somewhere
          <br />
          <em>to look forward to.</em>
        </h1>
        <p>
          {stay.retreat} · {stay.name}
        </p>
        <div className="confirmation-ticket">
          <p>
            RESERVATION <strong>{confirmation.reference}</strong>
          </p>
          <dl>
            <div>
              <dt>Arrival</dt>
              <dd>{confirmation.trip.checkin}</dd>
            </div>
            <div>
              <dt>Departure</dt>
              <dd>{confirmation.trip.checkout}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{confirmation.trip.adults + confirmation.trip.children}</dd>
            </div>
            <div>
              <dt>Total · EUR</dt>
              <dd>{money(confirmation.total)}</dd>
            </div>
          </dl>
        </div>
        <p className="muted">Keep this page for your trip details.</p>
        <Link className="text-link" href="/stays" onClick={() => confirm(null)}>
          Keep exploring <ArrowRight size={17} />
        </Link>
      </div>
      <div className="confirmation-image">
        <StayImage
          src={stay.images[0].src}
          alt={stay.images[0].alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
    </main>
  );
}
