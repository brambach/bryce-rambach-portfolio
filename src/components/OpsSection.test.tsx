import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OpsSection } from './OpsSection';

describe('OpsSection', () => {
  it('renders heading and dashboard rows', () => {
    render(<OpsSection onOpen={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/production-grade/i);
    expect(screen.getByText(/hibob → netsuite/)).toBeInTheDocument();
  });

  it('clicking OPEN DOSSIER calls onOpen with ops-portal', async () => {
    const onOpen = vi.fn();
    render(<OpsSection onOpen={onOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /open dossier/i }));
    expect(onOpen).toHaveBeenCalledWith('ops-portal');
  });
});
