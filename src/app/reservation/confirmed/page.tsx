import { Confirmation } from '@/components/reservation';
export const metadata = {
  title: 'Somewhere to look forward to',
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Confirmation />;
}
