import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders the AI & Tools heading', () => {
    render(<Stack />);
    expect(screen.getByRole('heading', { name: /AI & Tools/i })).toBeInTheDocument();
  });

  it('renders all three AI_STACK entries', () => {
    render(<Stack />);
    expect(screen.getByText('Claude API')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Workato')).toBeInTheDocument();
  });

  it('renders each tool use description', () => {
    render(<Stack />);
    expect(screen.getByText(/Intelligence layer/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily pair/i)).toBeInTheDocument();
    expect(screen.getByText(/Orchestration layer/i)).toBeInTheDocument();
  });
});
