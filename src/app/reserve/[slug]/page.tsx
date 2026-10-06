import { notFound } from 'next/navigation';
import { stayRepository } from '@/lib/stays';
import { parseFilters } from '@/lib/domain';
import { Reservation } from '@/components/reservation';
export const metadata = { title: 'Your reservation', robots: { index: false, follow: false } };
export default async function Reserve({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const stay = stayRepository.find((await params).slug);
  if (!stay) notFound();
  const raw = await searchParams;
  const query = new URLSearchParams();
  Object.entries(raw).forEach(([k, v]) => {
    if (typeof v === 'string') query.set(k, v);
  });
  return (
    <Reservation
      stay={stay}
      initial={parseFilters(query)}
      initialRate={raw.rate === 'flexible' ? 'flexible' : 'standard'}
    />
  );
}
