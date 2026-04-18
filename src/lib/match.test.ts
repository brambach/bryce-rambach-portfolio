import { describe, it, expect } from 'vitest';
import { matchTopic, segmentByKeywords } from './match';
import { TOPICS } from './content';

describe('matchTopic', () => {
  it('returns null for unrelated text', () => {
    expect(matchTopic('what is the weather')).toBeNull();
  });

  it('matches "work" to the role topic', () => {
    expect(matchTopic('tell me about your work')?.id).toBe('role');
  });

  it('matches "show me your projects" to projects topic', () => {
    expect(matchTopic('show me your projects')?.id).toBe('projects');
  });

  it('is case-insensitive', () => {
    expect(matchTopic('HIBOB integration question')?.id).toBe('role');
  });

  it('matches résumé with accent', () => {
    expect(matchTopic('can i see your résumé')?.id).toBe('resume');
  });

  it('matches contact via "how can i reach you"', () => {
    expect(matchTopic('how can i reach you')?.id).toBe('contact');
  });

  it('returns null for empty string', () => {
    expect(matchTopic('')).toBeNull();
  });
});

describe('segmentByKeywords', () => {
  it('returns single non-keyword segment for plain text', () => {
    expect(segmentByKeywords('plain text', ['missing'])).toEqual([
      { text: 'plain text', isKeyword: false },
    ]);
  });

  it('splits around a single keyword', () => {
    expect(segmentByKeywords('I love NYC deeply', ['NYC'])).toEqual([
      { text: 'I love ', isKeyword: false },
      { text: 'NYC', isKeyword: true },
      { text: ' deeply', isKeyword: false },
    ]);
  });

  it('preserves the original casing of the matched keyword', () => {
    const segs = segmentByKeywords('nyc is lovely', ['NYC']);
    expect(segs.find((s) => s.isKeyword)?.text).toBe('nyc');
  });

  it('handles multiple keywords in order', () => {
    const segs = segmentByKeywords('NYC and SF both', ['NYC', 'SF']);
    expect(segs.map((s) => s.text)).toEqual(['NYC', ' and ', 'SF', ' both']);
  });

  it('prefers the earliest keyword when two overlap', () => {
    const segs = segmentByKeywords('New York is great', ['NYC', 'New York']);
    expect(segs.find((s) => s.isKeyword)?.text).toBe('New York');
  });

  it('returns non-keyword for empty input', () => {
    expect(segmentByKeywords('', ['NYC'])).toEqual([]);
  });
});

describe('TOPICS data', () => {
  it('has one entry per ArtifactKind and in the header-required order', () => {
    expect(TOPICS.map((t) => t.id)).toEqual([
      'role', 'projects', 'stack', 'resume', 'contact',
    ]);
  });
});
