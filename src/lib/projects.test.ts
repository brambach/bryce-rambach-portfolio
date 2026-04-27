import { describe, it, expect } from 'vitest';
import { PROJECTS } from './projects';

describe('PROJECTS', () => {
  it('defines six projects', () => {
    expect(PROJECTS).toHaveLength(6);
  });

  it('every project has unique slug', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every project has all required fields', () => {
    for (const p of PROJECTS) {
      expect(p.slug).toBeTruthy();
      expect(p.index).toMatch(/^[AS]\.\d{2}$/);
      expect(p.title).toBeTruthy();
      expect(p.cardBody).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.dossier.overview).toBeTruthy();
      expect(p.dossier.decisions.length).toBeGreaterThanOrEqual(3);
      expect(p.dossier.stack.length).toBeGreaterThan(0);
      expect(p.dossier.outcomes.length).toBeGreaterThan(0);
    }
  });

  it('includes the dd-portal flagship', () => {
    const p = PROJECTS.find((x) => x.slug === 'dd-portal');
    expect(p).toBeDefined();
    expect(p?.kind).toBe('FLAGSHIP');
  });
});
