import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

describe('Projects', () => {
  it('renders the Projects section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { level: 2, name: /Projects\./i })).toBeInTheDocument();
  });

  it('renders all four project titles', () => {
    render(<Projects />);
    expect(screen.getByText(/Digital Directions Client Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Bryce Digital/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Integration Work/i)).toBeInTheDocument();
    expect(screen.getByText(/brycerambach\.com/i)).toBeInTheDocument();
  });

  it('renders the "Four I\'m proud of." subtitle', () => {
    render(<Projects />);
    expect(screen.getByText(/Four I'm proud of/i)).toBeInTheDocument();
  });

  it('renders four ghosted index numerals (01, 02, 03, 04)', () => {
    render(<Projects />);
    expect(screen.getAllByText(/^01$/)).not.toHaveLength(0);
    expect(screen.getAllByText(/^02$/)).not.toHaveLength(0);
    expect(screen.getAllByText(/^03$/)).not.toHaveLength(0);
    expect(screen.getAllByText(/^04$/)).not.toHaveLength(0);
  });
});
