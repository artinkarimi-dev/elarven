'use client';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { parseSaved, type Trip } from '@/lib/domain';

type Confirmation = { reference: string; slug: string; trip: Trip; total: number };

const Context = createContext<{
  saved: string[];
  toggle: (id: string) => void;
  announce: (message: string) => void;
  confirmation: Confirmation | null;
  confirm: (c: Confirmation | null) => void;
}>({
  saved: [],
  toggle: () => {},
  announce: () => {},
  confirmation: null,
  confirm: () => {},
});

const SAVED_KEY = 'elarven:saved';
const CONFIRMATION_KEY = 'elarven:confirmation';
let volatileConfirmation: Confirmation | null = null;

const subscribeSaved = (notify: () => void) => {
  window.addEventListener('storage', notify);
  window.addEventListener('elarven:saved', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('elarven:saved', notify);
  };
};

const savedSnapshot = () => {
  try {
    return localStorage.getItem(SAVED_KEY) || '[]';
  } catch {
    return '[]';
  }
};

const subscribeConfirmation = (notify: () => void) => {
  window.addEventListener('elarven:confirmation', notify);
  return () => window.removeEventListener('elarven:confirmation', notify);
};

const confirmationSnapshot = () => {
  try {
    return (
      sessionStorage.getItem(CONFIRMATION_KEY) ||
      (volatileConfirmation ? JSON.stringify(volatileConfirmation) : '')
    );
  } catch {
    return volatileConfirmation ? JSON.stringify(volatileConfirmation) : '';
  }
};

function parseConfirmation(raw: string): Confirmation | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const candidate = value as Partial<Confirmation>;
    const trip = candidate.trip as Partial<Trip> | undefined;
    if (
      typeof candidate.reference !== 'string' ||
      typeof candidate.slug !== 'string' ||
      typeof candidate.total !== 'number' ||
      !Number.isFinite(candidate.total) ||
      candidate.total <= 0 ||
      !trip ||
      typeof trip.checkin !== 'string' ||
      typeof trip.checkout !== 'string' ||
      !Number.isInteger(trip.adults) ||
      !Number.isInteger(trip.children)
    ) {
      return null;
    }
    return candidate as Confirmation;
  } catch {
    return null;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const rawSaved = useSyncExternalStore(subscribeSaved, savedSnapshot, () => '[]');
  const rawConfirmation = useSyncExternalStore(
    subscribeConfirmation,
    confirmationSnapshot,
    () => '',
  );
  const saved = useMemo(() => parseSaved(rawSaved), [rawSaved]);
  const confirmation = useMemo(() => parseConfirmation(rawConfirmation), [rawConfirmation]);
  const [notice, setNotice] = useState('');
  const announce = useCallback((message: string) => setNotice(message), []);

  const toggle = useCallback(
    (id: string) => {
      const exists = saved.includes(id);
      const next = exists ? saved.filter((savedId) => savedId !== id) : [...saved, id];
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('elarven:saved'));
        announce(exists ? 'Removed from your saved stays.' : 'Added to your saved stays.');
      } catch {
        announce(
          'Your browser could not save this stay. Please allow local storage and try again.',
        );
      }
    },
    [announce, saved],
  );

  const confirm = useCallback((next: Confirmation | null) => {
    volatileConfirmation = next;
    try {
      if (next) sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(CONFIRMATION_KEY);
    } catch {
      // The in-memory fallback still keeps the current navigation functional.
    }
    window.dispatchEvent(new Event('elarven:confirmation'));
  }, []);

  const value = useMemo(
    () => ({ saved, toggle, announce, confirmation, confirm }),
    [announce, confirmation, confirm, saved, toggle],
  );

  return (
    <Context.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
    </Context.Provider>
  );
}

export const useStays = () => useContext(Context);
