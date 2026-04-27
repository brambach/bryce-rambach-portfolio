import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemsSection } from './SystemsSection';

describe('SystemsSection', () => {
  it('renders the section heading and 6 architecture cards', () => {
    render(<SystemsSection />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/System architectures/i);
    expect(screen.getByText('Workato')).toBeInTheDocument();
    expect(screen.getByText('NetSuite')).toBeInTheDocument();
    expect(screen.getByText('Claude API')).toBeInTheDocument();
    expect(screen.getByText('Next.js 15')).toBeInTheDocument();
    expect(screen.getByText('Drizzle + PG')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
  });
});
