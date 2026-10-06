import { Results } from '@/components/results';
import { parseFilters } from '@/lib/domain';
import { stayRepository } from '@/lib/stays';
export const metadata = { title: 'Find your stay', alternates: { canonical: '/stays' } };
export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (typeof v === 'string') query.set(k, v);
  });
  return (
    <Results key={query.toString()} all={stayRepository.list()} filters={parseFilters(query)} />
  );
}
