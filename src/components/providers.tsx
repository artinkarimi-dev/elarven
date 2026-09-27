'use client';
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';
import { parseSaved, type Trip } from '@/lib/domain';
type Confirmation = { reference: string; slug: string; trip: Trip; total: number };
const Context = createContext<{
  saved: string[];
  toggle: (id: string) => void;
  notice: string;
  announce: (message: string) => void;
  confirmation: Confirmation | null;
  confirm: (c: Confirmation | null) => void;
}>({
  saved: [],
  toggle: () => {},
  notice: '',
  announce: () => {},
  confirmation: null,
  confirm: () => {},
});
const subscribe = (notify: () => void) => {
  window.addEventListener('storage', notify);
  window.addEventListener('elarven:saved', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('elarven:saved', notify);
  };
};
const snapshot = () => {
  try {
    return localStorage.getItem('elarven:saved') || '[]';
  } catch {
    return '[]';
  }
};
export function Providers({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const saved = parseSaved(raw);
  const [notice, announce] = useState('');
  const [confirmation, confirm] = useState<Confirmation | null>(null);
  function toggle(id: string) {
    const exists = saved.includes(id);
    const next = exists ? saved.filter((s) => s !== id) : [...saved, id];
    try {
      localStorage.setItem('elarven:saved', JSON.stringify(next));
      window.dispatchEvent(new Event('elarven:saved'));
      announce(exists ? 'Removed from your saved stays.' : 'Added to your saved stays.');
    } catch {
      announce('Your browser could not save this stay. Please allow local storage and try again.');
    }
  }
  return (
    <Context.Provider value={{ saved, toggle, notice, announce, confirmation, confirm }}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
    </Context.Provider>
  );
}
export const useStays = () => useContext(Context);
