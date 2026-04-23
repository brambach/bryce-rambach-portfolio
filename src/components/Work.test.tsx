import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Work } from './Work';

describe('Work', () => {
  it('renders the "6+" stat', () => {
    render(<Work />);
    expect(screen.getByText('6+')).toBeInTheDocument();
  });

  it('renders the integration-systems logo strip', () => {
    render(<Work />);
    expect(screen.getByText('HiBob')).toBeInTheDocument();
    expect(screen.getByText('NetSuite')).toBeInTheDocument();
    expect(screen.getByText('MYOB')).toBeInTheDocument();
    expect(screen.getByText('KeyPay')).toBeInTheDocument();
    expect(screen.getByText('Deputy')).toBeInTheDocument();
    expect(screen.getByText('Workato')).toBeInTheDocument();
  });

  it('has an accessible section heading linked via aria-labelledby', () => {
    render(<Work />);
    const section = screen.getByRole('region', { name: /live enterprise integrations/i });
    expect(section).toBeInTheDocument();
  });
});
