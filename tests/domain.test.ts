import { describe, it, expect } from 'vitest';
import {
  nights,
  validateDates,
  validGuests,
  price,
  parseFilters,
  serialize,
  filterStays,
  clearFilters,
  related,
  parseSaved,
} from '@/lib/domain';
import { stays } from '@/lib/stays';
const trip = { checkin: '2027-03-27', checkout: '2027-03-30', adults: 2, children: 0 };
const base = () => parseFilters(new URLSearchParams(serialize(trip)));
describe('date rules', () => {
  it('counts nights across a daylight-saving boundary', () =>
    expect(nights(trip.checkin, trip.checkout)).toBe(3));
  it('rejects incomplete dates', () => expect(validateDates('', '')).toMatch(/both/));
  it('rejects impossible calendar dates', () =>
    expect(validateDates('2027-02-30', '2027-03-05')).toMatch(/both/));
  it('rejects zero or negative nights', () =>
    expect(validateDates('2027-03-30', '2027-03-30')).toMatch(/after/));
  it('rejects the past', () => expect(validateDates('2020-01-01', '2020-01-03')).toMatch(/today/));
  it('limits long stays', () => expect(validateDates('2027-03-01', '2027-04-01')).toMatch(/28/));
  it('blocks any occupied night, not the departure day', () => {
    expect(validateDates(trip.checkin, trip.checkout, ['2027-03-28'])).toMatch(/unavailable/);
    expect(validateDates(trip.checkin, trip.checkout, ['2027-03-30'])).toBeNull();
  });
});
describe('guest and price rules', () => {
  it('requires one adult and integer guest counts', () => {
    expect(validGuests({ adults: 0, children: 1 })).toBe(false);
    expect(validGuests({ adults: 1.5, children: 0 })).toBe(false);
  });
  it('counts children towards capacity', () =>
    expect(validGuests({ adults: 2, children: 3 }, 4)).toBe(false));
  it('calculates accommodation, fees and adult tax exactly', () =>
    expect(price(stays[0], trip)).toEqual({
      nights: 3,
      nightly: 285,
      accommodation: 855,
      cleaning: 55,
      service: 68.4,
      tax: 15,
      total: 993.4,
    }));
  it('updates adult tax without adding child tax', () => {
    expect(price(stays[0], { ...trip, adults: 3 })!.tax).toBe(22.5);
    expect(price(stays[0], { ...trip, children: 1 })!.tax).toBe(15);
  });
  it('adds flexible-rate nightly supplement before fees', () =>
    expect(price(stays[0], trip, 'flexible')!.total).toBe(1074.4));
  it('does not price malformed trips', () =>
    expect(price(stays[0], { ...trip, checkout: '' })).toBeNull());
});
describe('discovery state', () => {
  it('combines landscape, price, rooms and amenities', () =>
    expect(
      filterStays(stays, {
        ...base(),
        mood: 'Alpine',
        maxPrice: 300,
        bedrooms: 2,
        amenity: 'Sauna',
      }).map((s) => s.id),
    ).toEqual(['alpine-0']));
  it('clears only filters while retaining the trip', () => {
    const cleared = clearFilters({ ...base(), mood: 'Forest', maxPrice: 200, flexible: true });
    expect(cleared.checkin).toBe(trip.checkin);
    expect(filterStays(stays, cleared)).toHaveLength(12);
  });
  it('returns no matches for unknown destinations', () =>
    expect(filterStays(stays, { ...base(), destination: 'Atlantis' })).toEqual([]));
  it('sorts rates numerically', () => {
    const found = filterStays(stays, { ...base(), sort: 'price-asc' });
    expect(found[0].rate).toBe(195);
    expect(found.at(-1)!.rate).toBe(495);
  });
  it('selects related stays by shared landscape and excludes self', () => {
    expect(related(stays, stays[0])).toHaveLength(2);
    expect(related(stays, stays[0]).every((s) => s.mood === 'Alpine' && s.id !== stays[0].id)).toBe(
      true,
    );
  });
  it('round trips meaningful URL state', () => {
    const f = { ...base(), destination: 'Mallorca, Spain', mood: 'Coast', flexible: true };
    expect(parseFilters(new URLSearchParams(serialize(f)))).toEqual(f);
  });
  it('normalizes unsafe query values', () => {
    const f = parseFilters(
      new URLSearchParams('adults=-1&children=no&maxPrice=999999&view=oops&mood=bogus'),
    );
    expect(f.adults).toBe(2);
    expect(f.children).toBe(0);
    expect(f.maxPrice).toBe(600);
    expect(f.view).toBe('list');
    expect(f.mood).toBe('');
  });
  it('recovers corrupt persistence and deduplicates IDs', () => {
    expect(parseSaved('{')).toEqual([]);
    expect(parseSaved('["alpine-0",3,"alpine-0"]')).toEqual(['alpine-0']);
  });
});
