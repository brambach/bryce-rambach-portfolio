import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DossierDialog } from './DossierDialog';

describe('DossierDialog', () => {
  it('renders nothing when no slug is open', () => {
    render(<DossierDialog openSlug={null} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders project details when a known slug is open', () => {
    render(<DossierDialog openSlug="dd-portal" onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Digital Directions Client Portal/)).toBeInTheDocument();
  });

  it('renders nothing for an unknown slug', () => {
    render(<DossierDialog openSlug="not-a-project" onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DossierDialog openSlug="dd-portal" onClose={onClose} />);
    const close = screen.getByRole('button', { name: /close/i });
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });
});
