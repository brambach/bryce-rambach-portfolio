import { describe, it, expect } from 'vitest';
import { matchTopic, segmentByKeywords } from './match';
import { TOPICS } from './content';

describe('matchTopic', () => {
  it('returns null for unrelated text', () => {
    expect(matchTopic('what is the weather')).toBeNull();
  });

  it('matches the role topic on "your work"', () => {
    expect(matchTopic('tell me about your work')?.id).toBe('role');
  });

  it('matches the projects topic on "show me your projects"', () => {
    expect(matchTopic('show me your projects')?.id).toBe('projects');
  });

  it('is case-insensitive', () => {
    expect(matchTopic('DIGITAL DIRECTIONS is great')?.id).toBe('role');
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

  // The bugs the greedy matcher had — should all route to LLM now.

  it('does NOT match "worked" when looking for "work"', () => {
    expect(
      matchTopic('so what actually is the portal project you worked on')
    ).toBeNull();
  });

  it('does NOT match "project" inside "portal project"', () => {
    // "portal project" doesn't match "your project" as a phrase.
    expect(matchTopic('tell me about the portal project')).toBeNull();
  });

  it('does NOT match "your work" inside "your workflow"', () => {
    // "your workflow" is a stack topic keyword, but "your work" must
    // be a whole phrase — not a prefix of a longer word.
    expect(matchTopic('tell me about your workflow')?.id).not.toBe('role');
  });

  it('does NOT match on plain "project" alone', () => {
    expect(matchTopic('i have a project at school')).toBeNull();
  });

  it('does NOT match generic "ai" — requires "your ai" or similar', () => {
    expect(matchTopic('i love ai in general')).toBeNull();
  });

  it('matches "how do you use ai" phrase', () => {
    expect(matchTopic('how do you use ai in your work')?.id).toBeTruthy();
  });

  it('matches "Claude Code" as a brand-specific trigger for stack', () => {
    expect(matchTopic('do you like Claude Code?')?.id).toBe('stack');
  });

  it('matches the topic prompt itself', () => {
    expect(matchTopic('Tell me about your work')?.id).toBe('role');
    expect(matchTopic('Show me your projects')?.id).toBe('projects');
    expect(matchTopic('How do you use AI and tools?')?.id).toBe('stack');
    expect(matchTopic('Give me the one-minute résumé')?.id).toBe('resume');
    expect(matchTopic('How can I reach you?')?.id).toBe('contact');
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
