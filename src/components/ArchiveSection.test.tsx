import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ArchiveSection } from './ArchiveSection';

describe('ArchiveSection', () => {
  it('renders the section heading', () => {
    render(<ArchiveSection onOpen={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Selected artifacts/i);
  });

  it('renders one card per archive project', () => {
    render(<ArchiveSection onOpen={() => {}} />);
    expect(screen.getByText(/Digital Directions Client Portal/i)).toBeInTheDocument();
    expect(screen.getByText('Bryce Digital')).toBeInTheDocument();
    expect(screen.getByText(/Three payroll destinations/i)).toBeInTheDocument();
    expect(screen.getByText('brycerambach.com')).toBeInTheDocument();
  });

  it('clicking OPEN DOSSIER triggers onOpen with that slug', async () => {
    const onOpen = vi.fn();
    render(<ArchiveSection onOpen={onOpen} />);
    const buttons = screen.getAllByRole('button', { name: /open dossier/i });
    await userEvent.click(buttons[0]);
    expect(onOpen).toHaveBeenCalledWith(expect.any(String));
  });
});
