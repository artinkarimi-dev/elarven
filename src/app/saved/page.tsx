import { Saved } from '@/components/saved';
export const metadata = {
  title: 'Your saved stays',
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Saved />;
}
