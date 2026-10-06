import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DestinationInput } from '@/components/destination-input';
function Picker() {
  const [value, setValue] = useState('');
  return <DestinationInput value={value} onChange={setValue} />;
}
describe('destination autocomplete', () => {
  it('filters and selects a region using the keyboard', async () => {
    render(<Picker />);
    const input = screen.getByRole('combobox', { name: /Destination/ });
    await userEvent.type(input, 'Dolo');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('Dolomites, Italy');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
  it('closes on Escape without discarding the typed destination', async () => {
    render(<Picker />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Mall');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('Mall');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
