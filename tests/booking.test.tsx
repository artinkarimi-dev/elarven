import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingPanel } from '@/components/booking';
import { Reservation } from '@/components/reservation';
import { stays } from '@/lib/stays';
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/components/stay-image', () => ({ StayImage: () => null }));
const trip = { checkin: '2027-03-12', checkout: '2027-03-15', adults: 2, children: 0 };
describe('booking interactions', () => {
  it('updates totals when a departure date changes', () => {
    render(<BookingPanel stay={stays[0]} initial={trip} />);
    expect(screen.getAllByText('€993.40')).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Check-out'), { target: { value: '2027-03-16' } });
    expect(screen.getByText('€1,306.20')).toBeInTheDocument();
  });
  it('disables reservation when dates intersect a blocked night', () => {
    render(
      <BookingPanel
        stay={stays[0]}
        initial={{ ...trip, checkin: '2026-12-24', checkout: '2026-12-27' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Choose available dates' })).toBeDisabled();
  });
  it('validates contact fields and moves focus to the first error', async () => {
    render(<Reservation stay={stays[0]} initial={trip} />);
    await userEvent.click(screen.getByRole('button', { name: 'Review reservation' }));
    expect(screen.getByLabelText('First name')).toHaveAttribute('aria-invalid', 'true');
    await waitFor(() => expect(screen.getByLabelText('First name')).toHaveFocus());
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });
  it('updates total when the rate changes and preserves input for review', async () => {
    render(<Reservation stay={stays[0]} initial={trip} />);
    await userEvent.selectOptions(screen.getByLabelText('Your rate'), 'flexible');
    expect(screen.getByText('€1,074.40')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('First name'), 'Alex');
    await userEvent.type(screen.getByLabelText('Last name'), 'River');
    await userEvent.type(screen.getByLabelText('Email address'), 'alex@example.com');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Review reservation' }));
    expect(screen.getByRole('heading', { name: 'One last look.' })).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Edit your details' }));
    expect(screen.getByLabelText('First name')).toHaveValue('Alex');
  });
});
