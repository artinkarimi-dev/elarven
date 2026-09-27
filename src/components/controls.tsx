'use client';
import { useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays, Heart, MapPin, Minus, Plus, Users, X } from 'lucide-react';
import {
  defaultTrip,
  serialize,
  today,
  validateDates,
  type Filters,
  type Trip,
} from '@/lib/domain';
import { destinations } from '@/lib/stays';
import { useStays } from './providers';
import { trapDialogFocus } from '@/lib/dialog';

export function Modal({
  title,
  trigger,
  children,
  className = '',
}: {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className={`modal-trigger ${className}`}
        aria-label={title}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        {trigger}
      </button>
      <dialog
        ref={ref}
        className="dialog"
        aria-label={title}
        onKeyDown={trapDialogFocus}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
      >
        <div className="dialog-heading">
          <h2>{title}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label={`Close ${title}`}
            onClick={() => ref.current?.close()}
          >
            <X />
          </button>
        </div>
        {children}
        <button type="button" className="button dialog-done" onClick={() => ref.current?.close()}>
          Done
        </button>
      </dialog>
    </>
  );
}
export function GuestStepper({
  trip,
  onChange,
  capacity = 8,
}: {
  trip: Trip;
  onChange: (t: Trip) => void;
  capacity?: number;
}) {
  return (
    <div className="guest-steppers">
      {(['adults', 'children'] as const).map((k) => (
        <div className="stepper-row" key={k}>
          <div>
            <strong>{k === 'adults' ? 'Adults' : 'Children'}</strong>
            <span>{k === 'adults' ? 'Ages 18 and above' : 'Ages 0–17'}</span>
          </div>
          <div className="stepper">
            <button
              type="button"
              aria-label={`Fewer ${k}`}
              disabled={trip[k] <= (k === 'adults' ? 1 : 0)}
              onClick={() => onChange({ ...trip, [k]: trip[k] - 1 })}
            >
              <Minus size={16} />
            </button>
            <output aria-label={`${k} count`}>{trip[k]}</output>
            <button
              type="button"
              aria-label={`More ${k}`}
              disabled={
                trip.adults + trip.children >= capacity || trip[k] >= (k === 'adults' ? 8 : 6)
              }
              onClick={() => onChange({ ...trip, [k]: trip[k] + 1 })}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export function TripInputs({
  trip,
  onChange,
  capacity = 8,
}: {
  trip: Trip;
  onChange: (t: Trip) => void;
  capacity?: number;
}) {
  return (
    <>
      <div className="date-pair">
        <label>
          Check-in
          <input
            type="date"
            value={trip.checkin}
            min={today()}
            onChange={(e) => onChange({ ...trip, checkin: e.target.value })}
            required
          />
        </label>
        <label>
          Check-out
          <input
            type="date"
            value={trip.checkout}
            min={trip.checkin || today()}
            onChange={(e) => onChange({ ...trip, checkout: e.target.value })}
            required
          />
        </label>
      </div>
      <Modal
        title="Who’s coming?"
        className="guest-control"
        trigger={
          <>
            <Users size={18} />
            <span>
              {trip.adults + trip.children} guests · {trip.adults} adults
              {trip.children ? `, ${trip.children} children` : ''}
            </span>
            <Plus size={16} />
          </>
        }
      >
        <GuestStepper trip={trip} onChange={onChange} capacity={capacity} />
        <p className="muted">Up to {capacity} guests. At least one adult is required.</p>
      </Modal>
    </>
  );
}
export function SearchBar({
  initial,
  className = '',
}: {
  initial?: Partial<Filters>;
  className?: string;
}) {
  const router = useRouter();
  const [destination, setDestination] = useState(initial?.destination || '');
  const [trip, setTrip] = useState<Trip>({ ...defaultTrip(), ...initial });
  const [error, setError] = useState('');
  return (
    <form
      className={`search-bar ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const issue = validateDates(trip.checkin, trip.checkout);
        if (issue) {
          setError(issue);
          return;
        }
        router.push('/stays?' + serialize({ ...initial, ...trip, destination }));
      }}
    >
      <label className="destination-field">
        <MapPin size={19} />
        <span>
          <strong>Where to?</strong>
          <input
            aria-label="Destination"
            list="destinations"
            placeholder="Somewhere extraordinary"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </span>
        <datalist id="destinations">
          {destinations.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </label>
      <div className="search-date">
        <CalendarDays size={19} />
        <Modal
          title="Make time for a getaway"
          trigger={
            <span>
              <strong>When</strong>
              <span>
                {trip.checkin && trip.checkout
                  ? `${new Date(trip.checkin + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} — ${new Date(trip.checkout + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}`
                  : 'Choose dates'}
              </span>
            </span>
          }
        >
          <TripInputs trip={trip} onChange={setTrip} />
          {validateDates(trip.checkin, trip.checkout) && (
            <p className="form-error" role="alert">
              {validateDates(trip.checkin, trip.checkout)}
            </p>
          )}
        </Modal>
      </div>
      <div className="search-guests">
        <Users size={19} />
        <Modal
          title="Who’s coming?"
          trigger={
            <span>
              <strong>Who</strong>
              <span>{trip.adults + trip.children} guests</span>
            </span>
          }
        >
          <GuestStepper trip={trip} onChange={setTrip} />
        </Modal>
      </div>
      <button className="button search-submit" type="submit">
        Find my stay <ArrowRight size={19} />
      </button>
      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
export function SaveButton({
  id,
  name,
  full = false,
}: {
  id: string;
  name: string;
  full?: boolean;
}) {
  const { saved, toggle } = useStays();
  const active = saved.includes(id);
  return (
    <button
      className={`save-button ${full ? 'save-full' : ''} ${active ? 'is-saved' : ''}`}
      type="button"
      aria-label={`${active ? 'Unsave' : 'Save'} ${name}`}
      aria-pressed={active}
      onClick={() => toggle(id)}
    >
      <Heart size={19} fill={active ? 'currentColor' : 'none'} />
      {full && <span>{active ? 'Saved' : 'Save stay'}</span>}
    </button>
  );
}
