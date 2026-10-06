import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestStepper, SaveButton } from '@/components/controls';
import { Providers } from '@/components/providers';
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
describe('trip and saved controls', () => {
  it('keeps adult minimum and total capacity boundaries accessible', () => {
    render(
      <GuestStepper
        trip={{ checkin: '2027-01-02', checkout: '2027-01-04', adults: 1, children: 1 }}
        capacity={2}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Fewer adults' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More children' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More adults' })).toBeDisabled();
  });
  it('passes an updated party to the parent', async () => {
    const change = vi.fn();
    render(
      <GuestStepper
        trip={{ checkin: '2027-01-02', checkout: '2027-01-04', adults: 2, children: 0 }}
        onChange={change}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'More children' }));
    expect(change).toHaveBeenCalledWith(expect.objectContaining({ children: 1 }));
  });
  it('saves, announces and removes a stay', async () => {
    localStorage.clear();
    render(
      <Providers>
        <SaveButton id="alpine-0" name="Ridge Cabin" />
      </Providers>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save Ridge Cabin' }));
    expect(screen.getByRole('button', { name: 'Unsave Ridge Cabin' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Added');
    await userEvent.click(screen.getByRole('button', { name: 'Unsave Ridge Cabin' }));
    expect(JSON.parse(localStorage.getItem('elarven:saved')!)).toEqual([]);
  });
});
