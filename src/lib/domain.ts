import { moods, type Stay, type Mood } from './stays';
export type Trip = { checkin: string; checkout: string; adults: number; children: number };
export type Filters = Trip & {
  destination: string;
  mood: string;
  type: string;
  maxPrice: number;
  bedrooms: number;
  amenity: string;
  flexible: boolean;
  sort: string;
  view: string;
};
export const money = (n: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(n);
export const today = () => new Date().toISOString().slice(0, 10);
export function addDays(date: string, n: number) {
  return new Date(Date.parse(date + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10);
}
export function defaultTrip(): Trip {
  const start = addDays(today(), 14);
  return { checkin: start, checkout: addDays(start, 3), adults: 2, children: 0 };
}
export function dateNumber(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return NaN;
  const d = Date.parse(s + 'T00:00:00Z');
  return Number.isFinite(d) && new Date(d).toISOString().slice(0, 10) === s ? d : NaN;
}
export function nights(a: string, b: string) {
  return (dateNumber(b) - dateNumber(a)) / 86400000;
}
export function validateDates(
  a: string,
  b: string,
  blocked: string[] = [],
  now = today(),
): string | null {
  const n = nights(a, b);
  if (!Number.isFinite(n)) return 'Choose both your arrival and departure dates.';
  if (a < now) return 'Choose an arrival date today or later.';
  if (n <= 0) return 'Departure must be after arrival.';
  if (n > 28) return 'Choose a stay of 28 nights or fewer.';
  if (blocked.some((d) => d >= a && d < b))
    return 'These dates are unavailable. Try another date range.';
  return null;
}
export function validGuests(t: Pick<Trip, 'adults' | 'children'>, capacity = 8) {
  return (
    Number.isInteger(t.adults) &&
    Number.isInteger(t.children) &&
    t.adults >= 1 &&
    t.adults <= 8 &&
    t.children >= 0 &&
    t.children <= 6 &&
    t.adults + t.children <= capacity
  );
}
export function price(stay: Stay, t: Trip, rate: 'standard' | 'flexible' = 'standard') {
  const count = nights(t.checkin, t.checkout);
  if (!Number.isFinite(count) || count <= 0 || count > 28 || !validGuests(t, stay.capacity))
    return null;
  const nightly = stay.rate + (rate === 'flexible' ? 25 : 0),
    accommodation = nightly * count;
  const service = Math.round(accommodation * stay.servicePercent * 100) / 100;
  const tax = Math.round(t.adults * count * stay.taxPerAdult * 100) / 100;
  return {
    nights: count,
    nightly,
    accommodation,
    cleaning: stay.cleaning,
    service,
    tax,
    total: Math.round((accommodation + stay.cleaning + service + tax) * 100) / 100,
  };
}
const integer = (v: string | null, fallback: number, min: number, max: number) =>
  v !== null && /^\d+$/.test(v) ? Math.min(max, Math.max(min, Number(v))) : fallback;
export function parseFilters(p: URLSearchParams): Filters {
  const d = defaultTrip();
  return {
    destination: (p.get('destination') || '').slice(0, 100),
    checkin: p.has('checkin') ? p.get('checkin')! : d.checkin,
    checkout: p.has('checkout') ? p.get('checkout')! : d.checkout,
    adults: integer(p.get('adults'), 2, 1, 8),
    children: integer(p.get('children'), 0, 0, 6),
    mood: moods.includes(p.get('mood') as Mood) ? p.get('mood')! : '',
    type: ['Cabin', 'Villa', 'Suite', 'Lodge'].includes(p.get('type') || '') ? p.get('type')! : '',
    maxPrice: integer(p.get('maxPrice'), 600, 100, 600),
    bedrooms: integer(p.get('bedrooms'), 0, 0, 3),
    amenity: p.get('amenity') || '',
    flexible: p.get('flexible') === 'true',
    sort: ['price-asc', 'price-desc', 'rating'].includes(p.get('sort') || '')
      ? p.get('sort')!
      : 'recommended',
    view: p.get('view') === 'map' ? 'map' : 'list',
  };
}
export function serialize(f: Partial<Filters>): string {
  const p = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v !== '' && v !== false && v !== undefined) p.set(k, String(v));
  });
  return p.toString();
}
export function filterStays(all: Stay[], f: Filters) {
  if (validateDates(f.checkin, f.checkout) || !validGuests(f)) return [];
  const found = all.filter(
    (s) =>
      (!f.destination ||
        `${s.region}, ${s.country}`.toLowerCase().includes(f.destination.toLowerCase())) &&
      (!f.mood || s.mood === f.mood) &&
      (!f.type || s.type === f.type) &&
      s.rate <= f.maxPrice &&
      s.bedrooms >= f.bedrooms &&
      (!f.amenity || s.amenities.includes(f.amenity)) &&
      (!f.flexible || s.flexible) &&
      validGuests(f, s.capacity) &&
      !validateDates(f.checkin, f.checkout, s.blocked),
  );
  return found.sort((a, b) =>
    f.sort === 'price-asc'
      ? a.rate - b.rate
      : f.sort === 'price-desc'
        ? b.rate - a.rate
        : f.sort === 'rating'
          ? b.rating - a.rating
          : Number(b.featured) - Number(a.featured),
  );
}
export function clearFilters(f: Filters): Filters {
  return { ...f, mood: '', type: '', maxPrice: 600, bedrooms: 0, amenity: '', flexible: false };
}
export function related(all: Stay[], stay: Stay) {
  return all.filter((s) => s.id !== stay.id && s.mood === stay.mood).slice(0, 3);
}
export function parseSaved(value: string | null): string[] {
  try {
    const v: unknown = JSON.parse(value || '[]');
    return Array.isArray(v)
      ? [...new Set(v.filter((s): s is string => typeof s === 'string'))]
      : [];
  } catch {
    return [];
  }
}
