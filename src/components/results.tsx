'use client';
import { useRef, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutGrid, Map, SlidersHorizontal, X } from 'lucide-react';
import { moods, type Stay } from '@/lib/stays';
import {
  clearFilters,
  defaultTrip,
  filterStays,
  serialize,
  validateDates,
  type Filters,
} from '@/lib/domain';
import { SearchBar } from './controls';
import { StayCard } from './stay-card';
import { trapDialogFocus } from '@/lib/dialog';
const StayMap = dynamic(() => import('./stay-map'), {
  loading: () => <p role="status">Opening the map…</p>,
});
export function Results({ all, filters }: { all: Stay[]; filters: Filters }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(filters);
  const found = filterStays(all, filters);
  const update = (next: Partial<Filters>) =>
    startTransition(() =>
      router.push('/stays?' + serialize({ ...filters, ...next }), { scroll: false }),
    );
  const count =
    Number(!!filters.mood) +
    Number(!!filters.type) +
    Number(filters.maxPrice < 600) +
    Number(filters.bedrooms > 0) +
    Number(!!filters.amenity) +
    Number(filters.flexible);
  const chips: [string, Partial<Filters>][] = [];
  if (filters.mood) chips.push([filters.mood, { mood: '' }]);
  if (filters.type) chips.push([filters.type, { type: '' }]);
  if (filters.maxPrice < 600) chips.push([`Under €${filters.maxPrice}`, { maxPrice: 600 }]);
  if (filters.bedrooms) chips.push([`${filters.bedrooms}+ bedrooms`, { bedrooms: 0 }]);
  if (filters.amenity) chips.push([filters.amenity, { amenity: '' }]);
  if (filters.flexible) chips.push(['Flexible cancellation', { flexible: false }]);
  const dateError = validateDates(filters.checkin, filters.checkout);
  return (
    <main id="main" className="page results-page">
      <div className="page-intro">
        <p className="eyebrow">FIND YOUR SOMEWHERE</p>
        <h1>{filters.destination ? filters.destination.split(',')[0] : 'A change of scenery.'}</h1>
        <p>Places with character. Space to make them your own.</p>
      </div>
      <SearchBar initial={filters} />
      <div className="results-toolbar">
        <div className="results-moods">
          {['', ...moods].map((m) => (
            <button key={m} aria-pressed={filters.mood === m} onClick={() => update({ mood: m })}>
              {m || 'All landscapes'}
            </button>
          ))}
        </div>
        <button
          className="filter-button"
          onClick={() => {
            setDraft(filters);
            dialog.current?.showModal();
          }}
        >
          <SlidersHorizontal size={17} /> Filters {count > 0 && <b>{count}</b>}
        </button>
      </div>
      {chips.length > 0 && (
        <div className="filter-chips">
          {chips.map(([label, patch]) => (
            <button key={label} onClick={() => update(patch)} aria-label={`Remove ${label} filter`}>
              {label}
              <X size={14} />
            </button>
          ))}
          <button className="clear-link" onClick={() => update(clearFilters(filters))}>
            Clear filters
          </button>
        </div>
      )}
      <div className="results-meta">
        <p role="status">
          {pending
            ? 'Finding your places…'
            : `${found.length} considered ${found.length === 1 ? 'stay' : 'stays'}`}
          <span> · EUR per night, before fees</span>
        </p>
        <div className="results-options">
          <label className="sort-label">
            <span className="sr-only">Sort stays</span>
            <select
              aria-label="Sort stays"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
            >
              <option value="recommended">Our selection</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
          <div className="view-toggle" aria-label="Results view" role="group">
            <button
              aria-label="List view"
              aria-pressed={filters.view === 'list'}
              onClick={() => update({ view: 'list' })}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="Map view"
              aria-pressed={filters.view === 'map'}
              onClick={() => update({ view: 'map' })}
            >
              <Map size={17} />
            </button>
          </div>
        </div>
      </div>
      {found.length ? (
        filters.view === 'map' ? (
          <StayMap stays={found} trip={filters} />
        ) : (
          <div className={`card-grid results-grid ${pending ? 'is-pending' : ''}`}>
            {found.map((s) => (
              <StayCard key={s.id} stay={s} trip={filters} />
            ))}
          </div>
        )
      ) : (
        <div className="empty results-empty">
          <p className="eyebrow">A DIFFERENT DIRECTION</p>
          <h2>No stays for this search.</h2>
          <p>
            {dateError ||
              'Try another destination, a smaller group or a wider price range. A little flexibility can lead somewhere wonderful.'}
          </p>
          <button
            className="button"
            onClick={() =>
              update({
                ...clearFilters(filters),
                destination: '',
                adults: 2,
                children: 0,
                ...(dateError ? defaultTrip() : {}),
              })
            }
          >
            Reset search <ArrowRight size={17} />
          </button>
        </div>
      )}
      <dialog className="dialog filters-dialog" ref={dialog} aria-labelledby="filters-title" onKeyDown={trapDialogFocus}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update(draft);
            dialog.current?.close();
          }}
        >
          <div className="dialog-heading">
            <h2 id="filters-title">Make it your kind of stay.</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Close filters"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <label>
            Landscape
            <select
              value={draft.mood}
              onChange={(e) => setDraft({ ...draft, mood: e.target.value })}
            >
              <option value="">Every landscape</option>
              {moods.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <div className="filter-row">
            <label>
              Place type
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                <option value="">Any place</option>
                {['Cabin', 'Villa', 'Suite', 'Lodge'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Bedrooms
              <select
                value={draft.bedrooms}
                onChange={(e) => setDraft({ ...draft, bedrooms: Number(e.target.value) })}
              >
                <option value={0}>Any number</option>
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} or more
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Maximum nightly rate <strong>€{draft.maxPrice}</strong>
            <input
              type="range"
              min={100}
              max={600}
              step={5}
              value={draft.maxPrice}
              onChange={(e) => setDraft({ ...draft, maxPrice: Number(e.target.value) })}
            />
          </label>
          <label>
            A little extra
            <select
              value={draft.amenity}
              onChange={(e) => setDraft({ ...draft, amenity: e.target.value })}
            >
              <option value="">All amenities</option>
              {[
                'Pool',
                'Sauna',
                'Fireplace',
                'Kitchen',
                'Breakfast',
                'Sea view',
                'Mountain view',
                'Lake view',
              ].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={draft.flexible}
              onChange={(e) => setDraft({ ...draft, flexible: e.target.checked })}
            />{' '}
            Flexible cancellation
          </label>
          <p className="muted">
            Nightly rates exclude cleaning, service and local taxes. Your full total is shown before
            reserving.
          </p>
          <div className="filter-actions">
            <button
              className="text-link"
              type="button"
              onClick={() => setDraft(clearFilters(draft))}
            >
              Reset filters
            </button>
            <button className="button" type="submit">
              Show stays <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
