# Portfolio — Conversational Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current scroll-based portfolio with a single-page conversational experience featuring a warm ember-orb avatar, letter-absorption animation, and a hybrid scripted/LLM chat backend on Vercel.

**Architecture:** Static Vite build (React 19 + TypeScript + Tailwind v4) served by Vercel; a single Edge Function at `/api/chat.ts` proxies to Claude Haiku 4.5 with Upstash Redis rate-limiting and Cloudflare Turnstile bot protection. Client state lives in one Zustand store; the orb component subscribes to state changes and animates via CSS keyframes + the Web Animations API.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind v4, Motion (`motion/react`), Zustand, Vitest (new), `@anthropic-ai/sdk`, `@upstash/redis`, `@upstash/ratelimit`.

**Spec:** `docs/superpowers/specs/2026-04-18-portfolio-conversational-redesign-design.md`

**Visual source of truth (prototype):** `.superpowers/brainstorm/68766-1776537863/content/live-demo-v4.html`

**Spec correction:** The spec puts the edge function under `src/api/chat.ts`. Vercel's file-based routing for static sites (non-Next.js) requires `/api/chat.ts` at the **repo root**, not inside `src/`. This plan uses the repo-root location.

---

## Task 1: Tooling & deletions

Install new dependencies, add Vitest for pure-logic tests, delete all old components and cruft.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Delete: all files in `src/components/`
- Delete: `CREATIVE_OVERHAUL.md`

- [ ] **Step 1: Install new runtime dependencies**

Run:
```bash
npm install zustand @anthropic-ai/sdk @upstash/redis @upstash/ratelimit
```

Expected: packages added to `package.json` dependencies.

- [ ] **Step 2: Install Vitest and DOM testing utilities**

Run:
```bash
npm install -D vitest @vitest/ui jsdom
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 4: Add `test` script to `package.json`**

Edit `package.json` `scripts` block — add two lines:
```json
  "test": "vitest run",
  "test:watch": "vitest"
```

- [ ] **Step 5: Delete old components**

Run:
```bash
rm src/components/Navbar.tsx src/components/Hero.tsx src/components/About.tsx \
   src/components/Skills.tsx src/components/Work.tsx src/components/Portfolio.tsx \
   src/components/Contact.tsx src/components/Footer.tsx src/components/ScrollReveal.tsx \
   src/components/TextScramble.tsx src/components/CustomCursor.tsx src/components/Magnetic.tsx
```

- [ ] **Step 6: Delete superseded doc**

Run:
```bash
rm CREATIVE_OVERHAUL.md
```

- [ ] **Step 7: Verify `src/components/` is empty**

Run:
```bash
ls src/components/
```

Expected: empty directory (or "No such file or directory" — either is fine).

- [ ] **Step 8: Commit**

Run:
```bash
git add -A
git commit -m "chore: install new deps, add vitest, delete legacy components

Prepares for conversational redesign. Deletes all scroll-based
components (Hero, About, Skills, Work, Portfolio, Contact, Footer)
and their primitives (ScrollReveal, TextScramble, CustomCursor,
Magnetic, Navbar). Adds zustand, @anthropic-ai/sdk, Upstash rate
limiting, and Vitest."
```

---

## Task 2: Rewrite `index.css` — tokens, fonts, reduced-motion

Replace the dark-theme CSS with the new warm palette, kill the JetBrains Mono import, and establish the reduced-motion baseline.

**Files:**
- Modify: `src/index.css` (full rewrite)

- [ ] **Step 1: Overwrite `src/index.css`**

Replace the entire file with:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Instrument Serif", Georgia, "Times New Roman", serif;

  --color-paper: #faf7f2;
  --color-surface: #f4efe6;
  --color-ink: #1f1d1a;
  --color-ink-soft: #6b6359;
  --color-muted: #9a8d79;
  --color-line: #e8e1d3;
  --color-accent: #c8704a;
  --color-accent-deep: #8a4220;
  --color-accent-soft: #e8b088;
  --color-accent-glow: #f4c9a3;
  --color-warm-hi: #ffe4c4;
}

@layer base {
  html {
    scroll-behavior: smooth;
    background: var(--color-paper);
  }

  body {
    background: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection { background: var(--color-accent-soft); color: var(--color-ink); }

  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: var(--color-paper); }
  ::-webkit-scrollbar-thumb { background: var(--color-line); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-muted); }
}

/* =========================
   Orb keyframes (global)
   ========================= */
@keyframes aura-breathe {
  0%, 100% { transform: scale(0.95); opacity: 0.7; }
  50%      { transform: scale(1.07); opacity: 1;   }
}
@keyframes core-breath {
  0%, 100% { transform: scale(1);     }
  50%      { transform: scale(1.025); }
}
@keyframes ember-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1);       }
  33%      { transform: translate(40px, 50px) scale(1.2); }
  66%      { transform: translate(-25px, 40px) scale(0.85); }
}
@keyframes ember-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1);          }
  40%      { transform: translate(-40px, -45px) scale(1.25); }
  70%      { transform: translate(25px, -20px) scale(0.9);   }
}
@keyframes ember-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1);       }
  50%      { transform: translate(55px, -35px) scale(1.15); }
}
@keyframes ember-drift-4 {
  0%, 100% { transform: translate(0, 0) scale(1);        }
  50%      { transform: translate(-35px, 45px) scale(1.2); }
}
@keyframes flash-inward {
  0%   { transform: scale(1.15); opacity: 0; border-width: 1px; box-shadow: 0 0 0 rgba(255,228,196,0); }
  30%  { transform: scale(1);    opacity: 1; border-width: 3px; box-shadow: 0 0 50px rgba(255,228,196,.9), inset 0 0 40px rgba(255,228,196,.75); }
  100% { transform: scale(.55);  opacity: 0; border-width: 1px; box-shadow: 0 0 0 rgba(255,228,196,0); }
}
@keyframes thought-dots-rotate { to { transform: rotate(360deg); } }
@keyframes shockwave {
  0%   { transform: scale(1);   opacity: 0.9; border-width: 3px; }
  100% { transform: scale(1.9); opacity: 0;   border-width: 1px; }
}
@keyframes echo-flash {
  0%, 100% { filter: brightness(calc(1 + var(--heat, 0) * 0.22)) saturate(calc(1 + var(--heat, 0) * 0.3));         }
  40%      { filter: brightness(calc(1.35 + var(--heat, 0) * 0.22)) saturate(calc(1.4 + var(--heat, 0) * 0.3));    }
}
@keyframes caret-blink { 50% { opacity: 0; } }

/* =========================
   Reduced motion overrides
   ========================= */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 150ms !important;
  }
  /* Orb still breathes, but slower and subtler */
  [data-orb-core] {
    animation: core-breath 7s ease-in-out infinite !important;
    transform: scale(1) !important;
  }
  [data-orb-aura] {
    animation: aura-breathe 7s ease-in-out infinite !important;
  }
}
```

- [ ] **Step 2: Verify the build still runs**

Run:
```bash
npm run lint
```

Expected: no type errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add src/index.css
git commit -m "style: replace dark editorial theme with warm conversational palette

Drops JetBrains Mono, introduces warm cream/terracotta token system
with --color-* variables, defines all orb keyframes globally, and
establishes the reduced-motion override baseline."
```

---

## Task 3: Content data — `src/lib/content.ts`

Single source of truth for bio, topics, artifacts, and LLM system prompt.

**Files:**
- Create: `src/lib/content.ts`

- [ ] **Step 1: Create `src/lib/content.ts`**

```ts
export type ArtifactKind =
  | 'role'
  | 'projects'
  | 'stack'
  | 'resume'
  | 'contact';

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
};

export type Topic = {
  id: ArtifactKind;
  label: string;          // header link + chip text
  prompt: string;         // what gets sent when user clicks the shortcut
  keywords: string[];     // case-insensitive substring matches
  response: string;       // scripted prose (streams char-by-char)
  artifact: ArtifactKind; // which artifact component to render below prose
};

export const BIO = {
  name: 'Bryce Rambach',
  email: 'bryce.rambach@gmail.com',
  phone: '(831) 236-1922',
  linkedin: 'https://linkedin.com/in/bryce-rambach',
  github: 'https://github.com/brambach',
  site: 'https://brycerambach.com',
  location: 'San Diego · Relocating summer 2026',
  availability:
    'Open to Solutions Engineer / Full-Stack roles at early-stage startups. Relocating to SF or NYC summer 2026.',
};

export const PROJECTS: Project[] = [
  {
    id: 'dd-portal',
    title: 'Digital Directions Client Portal',
    subtitle: 'Solo-built production app · 2025–Present',
    body:
      'Full-stack production application (Next.js 15, TypeScript, Drizzle ORM, Claude API, Freshdesk, Slack, Resend) monitoring 10+ live enterprise integrations in real time. Replaced scattered manual workflows and became the company-wide operations dashboard. Built at 20 with zero senior oversight.',
    tags: ['Next.js', 'TypeScript', 'Drizzle', 'Claude API', 'Postgres'],
  },
  {
    id: 'bryce-digital',
    title: 'Bryce Digital',
    subtitle: 'Independent development practice · 2025–Present',
    body:
      'Full-stack web applications and AI-powered tools for businesses. End-to-end delivery from client discovery through deployment, built with Claude Code and Next.js.',
    tags: ['Next.js', 'Claude Code', 'TypeScript', 'Client work'],
  },
  {
    id: 'dd-integrations',
    title: 'Enterprise Integration Work',
    subtitle: 'Digital Directions · March 2025 – Present',
    body:
      'Sole technical owner of 6+ concurrent production integrations connecting HR, payroll, and finance systems across HiBob, NetSuite, MYOB, KeyPay, and Deputy. Built reusable integration frameworks, webhook queueing systems with retry logic handling 500+ records per sync cycle, and health monitoring dashboards.',
    tags: ['HiBob', 'NetSuite', 'Workato', 'Node.js', 'Webhooks'],
  },
  {
    id: 'portfolio',
    title: 'brycerambach.com',
    subtitle: 'This site',
    body:
      "A conversation, not a portfolio. React-based chat where an animated avatar reacts to every word. Ask about the orb if you want to know how it works.",
    tags: ['React', 'Motion', 'Claude Haiku 4.5', 'Vercel Edge'],
  },
];

export const TOPICS: Topic[] = [
  {
    id: 'role',
    label: 'Work',
    prompt: 'Tell me about your work',
    keywords: [
      'work', 'job', 'digital direction', 'digital directions', 'integration specialist',
      'hibob', 'netsuite', 'myob', 'keypay', 'deputy',
    ],
    response:
      "I'm an Integration Specialist at Digital Directions — sole technical owner of 6+ concurrent production integrations across HiBob, NetSuite, MYOB, KeyPay, and Deputy. I build the plumbing between HR, payroll, and finance systems for mid-market companies.",
    artifact: 'role',
  },
  {
    id: 'projects',
    label: 'Projects',
    prompt: 'Show me your projects',
    keywords: ['project', 'projects', 'portfolio', 'show me', 'build', 'built', 'proud'],
    response:
      "Here are four I'm proud of — the Digital Directions client portal I shipped solo, my independent practice Bryce Digital, the integration work at DD, and this site itself.",
    artifact: 'projects',
  },
  {
    id: 'stack',
    label: 'AI & Tools',
    prompt: 'How do you use AI and tools?',
    keywords: ['ai', 'claude', 'tools', 'claude code', 'workflow', 're-engineer', 'anthropic'],
    response:
      "Claude Code is daily infrastructure — I use it to re-engineer how my team builds Workato recipes, ship solo apps faster, and standardize patterns across the integration fleet. Claude API is the backbone of the DD portal's intelligence layer.",
    artifact: 'stack',
  },
  {
    id: 'resume',
    label: 'Résumé',
    prompt: 'Give me the one-minute résumé',
    keywords: ['resume', 'résumé', 'cv', 'one-minute', 'background', 'experience'],
    response:
      "Here's the condensed version — CS at SDSU graduating May 2026, Integration Specialist at Digital Directions since March 2025, building production systems solo. Full PDF is one click away.",
    artifact: 'resume',
  },
  {
    id: 'contact',
    label: 'Contact',
    prompt: 'How can I reach you?',
    keywords: ['contact', 'reach', 'email', 'linkedin', 'github', 'hire', 'phone', 'hiring'],
    response:
      "Easiest is email, but everything's open — I'm actively looking for Solutions Engineer or Full-Stack roles at early-stage startups in SF or NYC, starting summer 2026.",
    artifact: 'contact',
  },
];

export const AI_STACK = [
  {
    name: 'Claude API',
    use: "Intelligence layer in the DD client portal — summarization, error diagnosis, triage.",
  },
  {
    name: 'Claude Code',
    use: "Daily pair. Accelerates shipping and re-engineers my team's approach to integration work.",
  },
  {
    name: 'Workato',
    use: 'Orchestration layer for the enterprise integration fleet — with backend-driven recipes I wrote from scratch.',
  },
];

export const GREETING = {
  line: 'Hi, I’m <em>Bryce</em>.',
  subtitleLines: [
    'Full-stack engineer.',
    'Ships production solo.',
    'Uses Claude Code daily.',
  ],
  chips: ['Tell me about your work', 'Show me your projects', 'How do you use AI?'],
};

export const KEYWORDS_TO_HIGHLIGHT = [
  'NYC', 'New York', 'Manhattan', 'SF', 'San Francisco',
  'HiBob', 'NetSuite', 'MYOB', 'KeyPay', 'Deputy',
  'Workato', 'Digital Directions', 'Claude Code', 'Claude API',
  'Solutions Engineer', 'Integration Specialist',
  'integration', 'integrations', 'fintech', 'payroll', 'HRIS',
  'Bryce',
];

export const SYSTEM_PROMPT = `You are Bryce Rambach answering questions on his personal portfolio.

Write in first person, warm and direct. Maximum 60 words per answer. Do not use emojis.

If the visitor asks something off-topic from career, projects, tech, or background, redirect gently ("Not really me — try asking about my work, projects, AI tools, or résumé").

Never break character. Never mention that you are an AI.

BIO AND BACKGROUND:

Name: Bryce Rambach
Contact: bryce.rambach@gmail.com · (831) 236-1922 · linkedin.com/in/bryce-rambach · github.com/brambach
Location: San Diego · relocating SF or NYC summer 2026
Education: B.S. Computer Science, San Diego State University (August 2022 – May 2026)

SUMMARY:
Full-stack engineer who ships production applications solo, from architecture through deployment. Built an AI-powered client portal from scratch (Next.js, TypeScript, Claude API) now used company-wide. Sole technical owner of 6+ concurrent enterprise integrations across different APIs, data formats, and authentication patterns. Uses Claude Code daily to accelerate development and re-engineer team workflows.

CURRENT ROLE — Integration Specialist, Digital Directions (March 2025 – Present, Remote):
- Sole technical owner across 6+ concurrent production integrations connecting enterprise HR, payroll, and finance systems.
- Built integrations end-to-end in TypeScript/Node.js across HiBob, NetSuite, MYOB, KeyPay, and Deputy.
- Used Claude Code to re-engineer the team's approach to Workato recipe development, building backend-driven workflows that replaced manual configuration.
- Created reusable integration frameworks from scratch, reverse-engineering undocumented partner APIs.
- Engineered webhook queueing systems with retry logic handling 500+ records per sync cycle.
- Built integration health monitoring dashboards tracking sync status, error rates, and data quality across 10+ live integrations.

PROJECTS:
1. Digital Directions Client Portal (2025 – Present): Solo-built full-stack production app in Next.js 15, TypeScript, Drizzle ORM (PostgreSQL), integrating Claude API, Freshdesk, Slack, Resend. Real-time monitoring of 10+ integrations. Adopted company-wide as primary operations dashboard.
2. Bryce Digital (2025 – Present): Independent software development practice. Full-stack web apps and AI-powered tools using Claude Code + Next.js.
3. brycerambach.com (this site): React + Motion chat experience with a live Claude Haiku 4.5 fallback.

SKILLS:
Languages — TypeScript, JavaScript (Node.js), SQL (PostgreSQL, SuiteQL), Python
Frontend — React, Next.js, Drizzle ORM, Clerk, Three.js, Tailwind CSS
Integration — REST APIs, OAuth 2.0, Webhooks, Workato, Postman
AI & Tools — Anthropic Claude API, Claude Code
Platforms — NetSuite, HiBob, MYOB, KeyPay, Deputy, Freshdesk, Slack, Resend, Vercel

LOOKING FOR:
Solutions Engineer or Full-Stack roles at early-stage startups where the work has maximum impact. Relocating to SF or NYC summer 2026.`;
```

- [ ] **Step 2: Verify compilation**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add src/lib/content.ts
git commit -m "feat: add content module with bio, projects, topics, and system prompt

Single source of truth for all chat content. Topics define keyword
triggers, scripted responses, and artifact kinds. SYSTEM_PROMPT is
the full bio + resume used by the LLM fallback."
```

---

## Task 4: Topic matcher — `src/lib/match.ts` (TDD)

Pure function: given a user message, return the matching Topic or null. Plus a keyword segmenter used by the message renderer.

**Files:**
- Create: `src/lib/match.ts`
- Create: `src/lib/match.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/match.test.ts`:
```ts
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
    expect(segs.map((s) => s.text)).toEqual(['', 'NYC', ' and ', 'SF', ' both']);
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
```

- [ ] **Step 2: Run the tests — expect them to fail**

Run:
```bash
npm test -- src/lib/match.test.ts
```

Expected: fails with "Cannot find module './match'".

- [ ] **Step 3: Implement `src/lib/match.ts`**

```ts
import { TOPICS, type Topic } from './content';

export function matchTopic(text: string): Topic | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const topic of TOPICS) {
    for (const kw of topic.keywords) {
      if (lower.includes(kw.toLowerCase())) return topic;
    }
  }
  return null;
}

export type Segment = { text: string; isKeyword: boolean };

export function segmentByKeywords(text: string, keywords: string[]): Segment[] {
  if (!text) return [];
  if (keywords.length === 0) return [{ text, isKeyword: false }];

  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestIdx = -1;
    let earliestLen = 0;

    for (const kw of keywords) {
      const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
      if (idx < 0) continue;
      // Prefer earliest; if tied, prefer longest (so "New York" beats "York")
      if (earliestIdx === -1 || idx < earliestIdx ||
          (idx === earliestIdx && kw.length > earliestLen)) {
        earliestIdx = idx;
        earliestLen = kw.length;
      }
    }

    if (earliestIdx === -1) {
      segments.push({ text: remaining, isKeyword: false });
      break;
    }

    if (earliestIdx > 0) {
      segments.push({ text: remaining.slice(0, earliestIdx), isKeyword: false });
    }
    segments.push({
      text: remaining.slice(earliestIdx, earliestIdx + earliestLen),
      isKeyword: true,
    });
    remaining = remaining.slice(earliestIdx + earliestLen);
  }

  return segments;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run:
```bash
npm test -- src/lib/match.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/match.ts src/lib/match.test.ts
git commit -m "feat: add topic matcher and keyword segmenter

matchTopic returns the first topic whose keywords appear in the text.
segmentByKeywords splits a string into keyword and non-keyword segments
for the message renderer to apply italic styling."
```

---

## Task 5: Streaming helpers — `src/lib/stream.ts` (TDD)

Character-by-character emission + a helper for consuming SSE streams. The same `streamChars` function is used by both scripted answers and LLM fallback answers.

**Files:**
- Create: `src/lib/stream.ts`
- Create: `src/lib/stream.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/stream.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { streamChars, parseSSELine } from './stream';

describe('streamChars', () => {
  it('emits each character in order', async () => {
    const onChar = vi.fn();
    await streamChars('abc', onChar, { minDelay: 0, maxDelay: 0 });
    expect(onChar.mock.calls.map((c) => c[0])).toEqual(['a', 'b', 'c']);
  });

  it('passes progress 0..1 to the callback', async () => {
    const progresses: number[] = [];
    await streamChars('ab', (_c, p) => progresses.push(p), {
      minDelay: 0, maxDelay: 0,
    });
    expect(progresses[0]).toBeCloseTo(0.5, 5);
    expect(progresses[1]).toBeCloseTo(1, 5);
  });

  it('aborts mid-stream when abort signal fires', async () => {
    const controller = new AbortController();
    const onChar = vi.fn((_c: string) => {
      if (onChar.mock.calls.length === 2) controller.abort();
    });
    await streamChars('abcde', onChar, {
      minDelay: 0, maxDelay: 0, signal: controller.signal,
    });
    // Exactly 2 chars emitted before abort takes effect
    expect(onChar.mock.calls.length).toBe(2);
  });

  it('resolves immediately on empty string', async () => {
    const onChar = vi.fn();
    await streamChars('', onChar, { minDelay: 0, maxDelay: 0 });
    expect(onChar).not.toHaveBeenCalled();
  });
});

describe('parseSSELine', () => {
  it('returns null for empty lines', () => {
    expect(parseSSELine('')).toBeNull();
  });

  it('returns null for comment lines', () => {
    expect(parseSSELine(': heartbeat')).toBeNull();
  });

  it('extracts data payload', () => {
    expect(parseSSELine('data: {"type":"delta","text":"hi"}'))
      .toEqual({ type: 'delta', text: 'hi' });
  });

  it('handles spaces around data value', () => {
    expect(parseSSELine('data:  {"type":"done"}'))
      .toEqual({ type: 'done' });
  });

  it('returns null for malformed JSON', () => {
    expect(parseSSELine('data: {not-json}')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run:
```bash
npm test -- src/lib/stream.test.ts
```

Expected: fails with "Cannot find module './stream'".

- [ ] **Step 3: Implement `src/lib/stream.ts`**

```ts
export type StreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export interface StreamCharsOptions {
  minDelay?: number;    // ms
  maxDelay?: number;    // ms
  signal?: AbortSignal;
}

/**
 * Emit `text` one character at a time with randomized pacing.
 * Used for both scripted responses and LLM streaming (per-chunk).
 */
export function streamChars(
  text: string,
  onChar: (char: string, progress: number) => void,
  opts: StreamCharsOptions = {}
): Promise<void> {
  const { minDelay = 22, maxDelay = 40, signal } = opts;
  if (!text) return Promise.resolve();

  return new Promise<void>((resolve) => {
    let i = 0;
    const total = text.length;

    const tick = () => {
      if (signal?.aborted) { resolve(); return; }
      if (i >= total) { resolve(); return; }
      onChar(text[i], (i + 1) / total);
      i++;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      setTimeout(tick, delay);
    };
    tick();
  });
}

/**
 * Parse a single line from an SSE stream ("data: {...}" format).
 * Returns null for empty, comment, or malformed lines.
 */
export function parseSSELine(line: string): StreamEvent | null {
  if (!line || line.startsWith(':')) return null;
  if (!line.startsWith('data:')) return null;
  const payload = line.slice(5).trim();
  if (!payload) return null;
  try {
    return JSON.parse(payload) as StreamEvent;
  } catch {
    return null;
  }
}

/**
 * Consume a Response body stream of SSE events and invoke onEvent.
 * Client-side consumer for the /api/chat endpoint.
 */
export async function consumeSSE(
  response: Response,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!response.body) throw new Error('Response has no body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    if (signal?.aborted) { reader.cancel().catch(() => {}); return; }
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const event = parseSSELine(line.trim());
      if (event) onEvent(event);
    }
  }
  // Flush remaining buffer
  const last = parseSSELine(buffer.trim());
  if (last) onEvent(last);
}
```

- [ ] **Step 4: Run tests — expect pass**

Run:
```bash
npm test -- src/lib/stream.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/stream.ts src/lib/stream.test.ts
git commit -m "feat: add streaming helpers — streamChars, parseSSELine, consumeSSE

streamChars drives the char-by-char animation. parseSSELine + consumeSSE
handle the client-side consumption of the /api/chat SSE response."
```

---

## Task 6: Chat store — `src/lib/chat.ts` (Zustand)

The single source of UI truth. Orb state, message list, streaming progress, and greeting status.

**Files:**
- Create: `src/lib/chat.ts`
- Create: `src/lib/chat.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/chat.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './chat';

describe('chat store', () => {
  beforeEach(() => {
    useChatStore.getState().reset();
  });

  it('initializes with empty messages, idle orb, heat 0', () => {
    const s = useChatStore.getState();
    expect(s.messages).toEqual([]);
    expect(s.orbState).toBe('idle');
    expect(s.heat).toBe(0);
    expect(s.greeted).toBe(false);
  });

  it('addUserMessage returns a new id and appends a user message', () => {
    const id = useChatStore.getState().addUserMessage('Hello');
    const msgs = useChatStore.getState().messages;
    expect(msgs.length).toBe(1);
    expect(msgs[0]).toMatchObject({ id, role: 'user', text: 'Hello', streaming: false });
  });

  it('addBryceMessage appends a streaming bryce message', () => {
    const id = useChatStore.getState().addBryceMessage();
    const msg = useChatStore.getState().messages[0];
    expect(msg.id).toBe(id);
    expect(msg.role).toBe('bryce');
    expect(msg.streaming).toBe(true);
    expect(msg.text).toBe('');
  });

  it('appendToMessage appends chunks to matching id only', () => {
    const s = useChatStore.getState();
    const a = s.addBryceMessage();
    const b = s.addBryceMessage();
    s.appendToMessage(a, 'foo');
    s.appendToMessage(b, 'bar');
    s.appendToMessage(a, 'baz');
    const msgs = useChatStore.getState().messages;
    expect(msgs.find((m) => m.id === a)!.text).toBe('foobaz');
    expect(msgs.find((m) => m.id === b)!.text).toBe('bar');
  });

  it('completeMessage flips streaming to false', () => {
    const s = useChatStore.getState();
    const id = s.addBryceMessage();
    s.completeMessage(id);
    expect(useChatStore.getState().messages[0].streaming).toBe(false);
  });

  it('setOrbState and setHeat update independently', () => {
    useChatStore.getState().setOrbState('thinking');
    useChatStore.getState().setHeat(0.5);
    expect(useChatStore.getState().orbState).toBe('thinking');
    expect(useChatStore.getState().heat).toBe(0.5);
  });

  it('markGreeted flips greeted to true', () => {
    useChatStore.getState().markGreeted();
    expect(useChatStore.getState().greeted).toBe(true);
  });

  it('reset clears messages and restores defaults but preserves greeted', () => {
    const s = useChatStore.getState();
    s.addUserMessage('x');
    s.setOrbState('responding');
    s.setHeat(0.8);
    s.markGreeted();
    s.reset();
    const r = useChatStore.getState();
    expect(r.messages).toEqual([]);
    expect(r.orbState).toBe('idle');
    expect(r.heat).toBe(0);
    expect(r.greeted).toBe(true); // preserved across reset
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run:
```bash
npm test -- src/lib/chat.test.ts
```

Expected: fails with "Cannot find module './chat'".

- [ ] **Step 3: Implement `src/lib/chat.ts`**

```ts
import { create } from 'zustand';
import type { ArtifactKind } from './content';

export type OrbState = 'idle' | 'absorbing' | 'thinking' | 'responding';
export type Role = 'user' | 'bryce';

export type Message = {
  id: string;
  role: Role;
  text: string;
  artifact?: ArtifactKind;
  streaming: boolean;
};

export type ChatStore = {
  messages: Message[];
  orbState: OrbState;
  heat: number;           // 0..1
  greeted: boolean;

  addUserMessage: (text: string) => string;
  addBryceMessage: (opts?: { artifact?: ArtifactKind }) => string;
  appendToMessage: (id: string, chunk: string) => void;
  completeMessage: (id: string) => void;

  setOrbState: (state: OrbState) => void;
  setHeat: (heat: number) => void;

  markGreeted: () => void;
  reset: () => void;
};

let idCounter = 0;
const nextId = () => `m_${Date.now()}_${idCounter++}`;

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  orbState: 'idle',
  heat: 0,
  greeted: false,

  addUserMessage: (text) => {
    const id = nextId();
    set((s) => ({
      messages: [...s.messages, { id, role: 'user', text, streaming: false }],
    }));
    return id;
  },

  addBryceMessage: (opts) => {
    const id = nextId();
    set((s) => ({
      messages: [
        ...s.messages,
        { id, role: 'bryce', text: '', streaming: true, artifact: opts?.artifact },
      ],
    }));
    return id;
  },

  appendToMessage: (id, chunk) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, text: m.text + chunk } : m
      ),
    })),

  completeMessage: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, streaming: false } : m
      ),
    })),

  setOrbState: (orbState) => set({ orbState }),
  setHeat: (heat) => set({ heat }),
  markGreeted: () => set({ greeted: true }),

  reset: () =>
    set((s) => ({
      messages: [],
      orbState: 'idle',
      heat: 0,
      greeted: s.greeted, // preserve greeting flag across session
    })),
}));
```

- [ ] **Step 4: Run — expect pass**

Run:
```bash
npm test -- src/lib/chat.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/chat.ts src/lib/chat.test.ts
git commit -m "feat: add Zustand chat store

Holds messages, orb state, heat, and greeting flag. reset() preserves
the greeted flag so returning to the home state within a session
doesn't replay the ignition animation."
```

---

## Task 7: Orb component — `src/components/Orb/Orb.tsx`

The full orb component — aura, core, embers, rim, flash ring, thought dots, shockwave. Driven entirely by store state.

**Files:**
- Create: `src/components/Orb/Orb.tsx`
- Create: `src/components/Orb/orb.css`

- [ ] **Step 1: Create `src/components/Orb/orb.css`**

```css
/* Orb component styles. Global keyframes live in index.css. */

.orb-wrap {
  --orb-size: 220px;
  width: var(--orb-size);
  height: var(--orb-size);
  position: relative;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (max-width: 1023px) { .orb-wrap { --orb-size: 140px; } }
@media (max-width: 639px)  { .orb-wrap { --orb-size: 72px; } }

.orb-aura {
  position: absolute;
  inset: -28%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(244, 201, 163, 0.32),
    rgba(244, 201, 163, 0) 65%
  );
  animation: aura-breathe 5.5s ease-in-out infinite;
  pointer-events: none;
  transition: animation-duration 0.4s ease;
}

.orb-wrap[data-orb-state='responding'] .orb-aura {
  animation-duration: 3s;
}
.orb-wrap[data-orb-state='thinking'] .orb-aura {
  opacity: 0.6;
}

.orb-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 26%, var(--color-warm-hi), transparent 45%),
    radial-gradient(circle at 50% 50%, #e8a06e 0%, var(--color-accent) 55%, var(--color-accent-deep) 100%);
  box-shadow:
    0 30px 90px -20px rgba(200, 112, 74, 0.55),
    inset -14px -18px 45px rgba(120, 54, 20, 0.45),
    inset 14px 14px 35px rgba(255, 230, 198, 0.22);
  overflow: hidden;
  animation: core-breath 5s ease-in-out infinite;
  filter: brightness(calc(1 + var(--heat, 0) * 0.22))
          saturate(calc(1 + var(--heat, 0) * 0.3));
  transition: filter 0.4s ease;
  will-change: transform, filter;
}

.orb-wrap[data-orb-echo='1'] .orb-core {
  animation: core-breath 5s ease-in-out infinite,
             echo-flash 0.35s ease-out;
}

.orb-ember {
  position: absolute;
  border-radius: 50%;
  filter: blur(14px);
  pointer-events: none;
  will-change: transform;
}
.orb-ember-1 {
  width: 41%; height: 41%; top: 14%; left: 18%; opacity: 0.75;
  background: radial-gradient(circle, rgba(255, 240, 210, 0.95), rgba(255, 230, 190, 0) 70%);
  animation: ember-drift-1 11s ease-in-out infinite;
}
.orb-ember-2 {
  width: 36%; height: 36%; top: 52%; left: 56%; opacity: 0.55;
  background: radial-gradient(circle, rgba(255, 215, 160, 0.8), rgba(255, 215, 160, 0) 70%);
  animation: ember-drift-2 14s ease-in-out infinite;
}
.orb-ember-3 {
  width: 27%; height: 27%; top: 62%; left: 12%; opacity: 0.5;
  background: radial-gradient(circle, rgba(255, 195, 135, 0.7), rgba(255, 195, 135, 0) 70%);
  animation: ember-drift-3 17s ease-in-out infinite;
}
.orb-ember-4 {
  width: 22%; height: 22%; top: 10%; left: 62%; opacity: 0.45;
  background: radial-gradient(circle, rgba(255, 220, 170, 0.85), rgba(255, 220, 170, 0) 70%);
  animation: ember-drift-4 13s ease-in-out infinite;
}

.orb-rim {
  position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, rgba(255, 230, 198, 0.45), transparent 34%);
  pointer-events: none;
}

.orb-flash {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--color-warm-hi);
  pointer-events: none; opacity: 0;
}
.orb-flash.fire { animation: flash-inward 500ms cubic-bezier(0.1, 0.7, 0.4, 1); }

.orb-shockwave {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--color-accent-soft);
  pointer-events: none; opacity: 0;
}
.orb-shockwave.fire { animation: shockwave 900ms ease-out; }

.orb-thought-dots {
  position: absolute; inset: -5%; border-radius: 50%;
  opacity: 0; transition: opacity 0.4s ease;
  animation: thought-dots-rotate 3s linear infinite;
  pointer-events: none;
}
.orb-wrap[data-orb-state='thinking'] .orb-thought-dots { opacity: 1; }

.orb-thought-dots .td {
  position: absolute;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px var(--color-accent-soft);
  top: 50%; left: 50%;
}
.orb-thought-dots .td:nth-child(1) { transform: translate(-50%, -50%) rotate(0deg) translateY(-62%); }
.orb-thought-dots .td:nth-child(2) { transform: translate(-50%, -50%) rotate(120deg) translateY(-62%); opacity: 0.6; }
.orb-thought-dots .td:nth-child(3) { transform: translate(-50%, -50%) rotate(240deg) translateY(-62%); opacity: 0.3; }
```

- [ ] **Step 2: Create `src/components/Orb/Orb.tsx`**

```tsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useChatStore } from '@/src/lib/chat';
import './orb.css';

export type OrbHandle = {
  /** Trigger a single inward flash (called when a letter lands on the orb). */
  flashAbsorb: () => void;
  /** Trigger the outward shockwave once (fires after last letter lands). */
  fireShockwave: () => void;
  /** Trigger a keyword echo brightness pulse. */
  echo: () => void;
  /** Get the current center position in client coordinates. */
  getCenter: () => { x: number; y: number };
};

type Props = {
  className?: string;
};

export const Orb = forwardRef<OrbHandle, Props>(function Orb({ className }, ref) {
  const orbState = useChatStore((s) => s.orbState);
  const heat = useChatStore((s) => s.heat);

  const wrapRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const shockRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    flashAbsorb: () => {
      const el = flashRef.current;
      if (!el) return;
      el.classList.remove('fire');
      // force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('fire');
    },
    fireShockwave: () => {
      const el = shockRef.current;
      if (!el) return;
      el.classList.remove('fire');
      void el.offsetWidth;
      el.classList.add('fire');
    },
    echo: () => {
      const el = wrapRef.current;
      if (!el) return;
      el.dataset.orbEcho = '1';
      setTimeout(() => {
        if (el.dataset.orbEcho === '1') delete el.dataset.orbEcho;
      }, 360);
    },
    getCenter: () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
  }));

  // Subtle cursor lean when idle
  useEffect(() => {
    if (orbState !== 'idle') {
      if (wrapRef.current) wrapRef.current.style.transform = '';
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = ((e.clientX - cx) / window.innerWidth) * 12;
      const dy = ((e.clientY - cy) / window.innerHeight) * 12;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [orbState]);

  return (
    <div
      ref={wrapRef}
      className={`orb-wrap ${className ?? ''}`}
      data-orb-state={orbState}
      style={{ '--heat': heat } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="orb-aura" data-orb-aura />
      <div className="orb-core" data-orb-core>
        <div className="orb-ember orb-ember-1" />
        <div className="orb-ember orb-ember-2" />
        <div className="orb-ember orb-ember-3" />
        <div className="orb-ember orb-ember-4" />
        <div className="orb-rim" />
      </div>
      <div ref={flashRef} className="orb-flash" />
      <div ref={shockRef} className="orb-shockwave" />
      <div className="orb-thought-dots">
        <div className="td" /><div className="td" /><div className="td" />
      </div>
    </div>
  );
});
```

- [ ] **Step 3: Verify it compiles**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Orb/
git commit -m "feat: add Orb component — aura, core, embers, flash/shockwave

All animations are CSS-driven via state attributes (data-orb-state,
data-orb-echo) and the --heat CSS variable. Exposes flashAbsorb,
fireShockwave, echo, and getCenter via imperative ref for the
absorption + message stream systems to call."
```

---

## Task 8: Letter absorption — `src/lib/absorb.ts`

DOM-driven animation: given an input element and an orb center, fly each character as an absolutely-positioned span that arcs into the orb and triggers the flash ring per landing.

**Files:**
- Create: `src/lib/absorb.ts`

- [ ] **Step 1: Implement `src/lib/absorb.ts`**

```ts
export type AbsorbOptions = {
  /** HTML input whose text content is flying. */
  source: HTMLInputElement;
  /** The current value to animate (caller should read before clearing). */
  text: string;
  /** Client-space center of the orb. */
  target: { x: number; y: number };
  /** Called each time a character lands on the orb. */
  onLand?: (charIndex: number, total: number) => void;
  /** Called once after the final character has landed. */
  onComplete?: () => void;
  /** Respects reduced motion: skips the flight, fades letters in place. */
  reducedMotion?: boolean;
};

/**
 * Lift each non-space character from the input's rendered position
 * and arc it into the orb center. Triggers onLand per character.
 */
export function absorbLetters(opts: AbsorbOptions): void {
  const { source, text, target, onLand, onComplete, reducedMotion } = opts;

  if (!text) { onComplete?.(); return; }

  if (reducedMotion) {
    // One quick pulse and we're done.
    setTimeout(() => {
      onLand?.(0, 1);
      onComplete?.();
    }, 150);
    return;
  }

  const inputRect = source.getBoundingClientRect();
  const cs = getComputedStyle(source);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { onComplete?.(); return; }
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

  const paddingLeft = parseFloat(cs.paddingLeft) || 0;
  const fontSizePx = parseFloat(cs.fontSize) || 14;
  let xCursor = inputRect.left + paddingLeft;
  const y = inputRect.top + inputRect.height / 2 - fontSizePx / 2;

  type Letter = { ch: string; x: number; y: number };
  const letters: Letter[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = ctx.measureText(ch).width;
    if (ch.trim().length > 0) letters.push({ ch, x: xCursor, y });
    xCursor += w;
  }

  if (letters.length === 0) { onComplete?.(); return; }

  let landed = 0;
  const total = letters.length;

  letters.forEach((L, i) => {
    const el = document.createElement('span');
    el.textContent = L.ch;
    el.style.cssText = [
      'position:fixed',
      `left:${L.x}px`,
      `top:${L.y}px`,
      'pointer-events:none',
      'z-index:100',
      `font-family:${cs.fontFamily}`,
      `font-size:${cs.fontSize}`,
      `color:${cs.color}`,
      'line-height:1',
      'will-change:transform,opacity',
    ].join(';');
    document.body.appendChild(el);

    const dx = target.x - L.x;
    const dy = target.y - L.y;
    const midX = L.x + dx * 0.45 + (Math.random() - 0.5) * 30;
    const midY = L.y + dy * 0.3 - 60 - Math.random() * 40;
    const rotation = (Math.random() - 0.5) * 40;
    const duration = 700 + Math.random() * 200;
    const delay = i * 35;

    const anim = el.animate(
      [
        { left: `${L.x}px`, top: `${L.y}px`, opacity: 1, transform: 'scale(1) rotate(0deg)', color: 'var(--color-ink)' },
        { left: `${midX}px`, top: `${midY}px`, opacity: 0.95, transform: `scale(1.1) rotate(${rotation}deg)`, color: 'var(--color-accent)', offset: 0.55 },
        { left: `${target.x}px`, top: `${target.y}px`, opacity: 0, transform: 'scale(0.2) rotate(0deg)', color: 'var(--color-accent)' },
      ],
      { duration, delay, easing: 'cubic-bezier(0.55, 0.05, 0.3, 1)', fill: 'forwards' }
    );

    anim.onfinish = () => {
      el.remove();
      onLand?.(i, total);
      landed++;
      if (landed === total) onComplete?.();
    };
  });
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/absorb.ts
git commit -m "feat: add letter absorption animation helper

absorbLetters measures each character's position in the input field,
spawns a fixed-positioned span per letter, and animates it via WAAPI
on an arc to the orb center. Fires onLand per letter so the orb can
pulse. Degrades to a single pulse under reduced motion."
```

---

## Task 9: Chat input — `src/components/Chat/Input.tsx`

The pinned bottom input bar with rotating placeholder and send button.

**Files:**
- Create: `src/components/Chat/Input.tsx`
- Create: `src/components/Chat/input.css`

- [ ] **Step 1: Create `src/components/Chat/input.css`**

```css
.chat-input-bar {
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top,
    var(--color-paper) 0%,
    var(--color-paper) 60%,
    rgba(250, 247, 242, 0) 100%);
  padding: 24px 0 32px;
  z-index: 20;
}

.chat-input {
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  padding: 10px 10px 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 560px;
  margin: 0 auto;
  transition: all 0.25s ease;
}
.chat-input.focused {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(200, 112, 74, 0.12);
}

.chat-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-ink);
  padding: 8px 0;
}
.chat-input input::placeholder {
  color: var(--color-muted);
}

.chat-input button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-input button:hover:not(:disabled) {
  transform: scale(1.08);
  background: var(--color-accent-deep);
}
.chat-input button:disabled {
  background: var(--color-muted);
  cursor: not-allowed;
}
```

- [ ] **Step 2: Create `src/components/Chat/Input.tsx`**

```tsx
import { forwardRef, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './input.css';

const PLACEHOLDERS = [
  'Ask about my work',
  'Ask about my projects',
  'Ask about AI & tools',
  'Ask for my résumé',
];

type Props = {
  disabled?: boolean;
  onSubmit: (text: string, inputEl: HTMLInputElement) => void;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { disabled, onSubmit },
  ref
) {
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [focused, setFocused] = useState(false);

  // Rotate placeholder every 5s while idle and empty.
  useEffect(() => {
    if (value || focused) return;
    let i = 0;
    const handle = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 5000);
    return () => clearInterval(handle);
  }, [value, focused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const inputEl = e.currentTarget.querySelector('input') as HTMLInputElement;
    onSubmit(trimmed, inputEl);
    setValue('');
  };

  return (
    <form
      className={`chat-input ${focused ? 'focused' : ''}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={ref}
        type="text"
        aria-label="Ask Bryce a question"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        autoComplete="off"
      />
      <button type="submit" aria-label="Send" disabled={disabled || !value.trim()}>
        <ArrowUp size={16} />
      </button>
    </form>
  );
});
```

- [ ] **Step 3: Verify**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Chat/
git commit -m "feat: add chat input component

Pinned-bottom input with rotating placeholder, focus ring, and a
terracotta send button. Accepts a ref for external focus control and
reports submissions with both text and the raw input element so the
absorption animation can measure character positions."
```

---

## Task 10: Message component — `src/components/Chat/Message.tsx`

Renders a single message with streaming char-by-char reveal for `bryce` messages, with keyword highlighting. Calls back to the orb on keyword emission.

**Files:**
- Create: `src/components/Chat/Message.tsx`
- Create: `src/components/Chat/message.css`

- [ ] **Step 1: Create `src/components/Chat/message.css`**

```css
.message {
  margin: 0 auto 28px;
  max-width: 560px;
  padding: 0 24px;
}

.message-user {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-ink-soft);
  text-align: right;
}

.message-user-bubble {
  display: inline-block;
  background: var(--color-surface);
  padding: 10px 18px;
  border-radius: 999px;
  max-width: 80%;
  text-align: left;
}

.message-bryce {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.45;
  color: var(--color-ink);
  letter-spacing: -0.005em;
}

@media (max-width: 639px) {
  .message-bryce { font-size: 19px; }
}

.message-bryce .kw {
  color: var(--color-accent);
  font-style: italic;
  background: linear-gradient(180deg, transparent 62%, rgba(244, 201, 163, 0.55) 62%);
  padding: 0 2px;
  margin: 0 -2px;
  border-radius: 2px;
  transition: background 0.8s ease 0.3s;
}
.message-bryce .kw.settled {
  background: transparent;
}

.message-bryce .caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--color-accent);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: caret-blink 1s steps(2) infinite;
}
```

- [ ] **Step 2: Create `src/components/Chat/Message.tsx`**

```tsx
import { memo, useMemo } from 'react';
import { segmentByKeywords } from '@/src/lib/match';
import { KEYWORDS_TO_HIGHLIGHT } from '@/src/lib/content';
import type { Message as MessageType } from '@/src/lib/chat';
import './message.css';

type Props = {
  message: MessageType;
};

export const Message = memo(function Message({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="message message-user">
        <span className="message-user-bubble">{message.text}</span>
      </div>
    );
  }

  const segments = useMemo(
    () => segmentByKeywords(message.text, KEYWORDS_TO_HIGHLIGHT),
    [message.text]
  );

  return (
    <div
      className="message message-bryce"
      aria-live="polite"
      aria-busy={message.streaming}
    >
      {segments.map((seg, i) =>
        seg.isKeyword ? (
          <em key={i} className={`kw ${message.streaming ? '' : 'settled'}`}>
            {seg.text}
          </em>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {message.streaming && <span className="caret" aria-hidden="true" />}
    </div>
  );
});
```

- [ ] **Step 3: Verify**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Chat/Message.tsx src/components/Chat/message.css
git commit -m "feat: add Message component with keyword highlighting

User messages render as a warm surface bubble, right-aligned.
Bryce messages render in Instrument Serif with keyword segments
wrapped in <em class='kw'> for italic terracotta + highlight.
Keywords settle (lose highlight background) when streaming ends."
```

---

## Task 11: Chips + MessageStack

The suggestion chips below the greeting, and the scrollable message container.

**Files:**
- Create: `src/components/Chat/Chips.tsx`
- Create: `src/components/Chat/MessageStack.tsx`
- Create: `src/components/Chat/chat.css`

- [ ] **Step 1: Create `src/components/Chat/chat.css`**

```css
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 16px auto 0;
  max-width: 560px;
  padding: 0 24px;
}

.chip {
  font-family: var(--font-sans);
  font-size: 13px;
  padding: 7px 14px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  color: var(--color-ink-soft);
  background: #fff;
  cursor: pointer;
  transition: all 0.18s ease;
}
.chip:hover {
  border-color: var(--color-accent);
  color: var(--color-ink);
  background: #fffaf4;
}

.message-stack {
  padding-top: 48px;
  padding-bottom: 24px;
  min-height: calc(100vh - 180px);
}

.greeting {
  margin: 0 auto 32px;
  max-width: 560px;
  padding: 80px 24px 0;
  text-align: left;
}
.greeting h1 {
  font-family: var(--font-display);
  font-size: 56px;
  line-height: 1.02;
  letter-spacing: -0.025em;
  font-weight: 400;
  margin: 0 0 14px;
  color: var(--color-ink);
}
.greeting h1 em {
  font-style: italic;
  color: var(--color-accent);
}
.greeting .sub {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-ink-soft);
  line-height: 1.6;
  margin: 0;
}
.greeting .sub-line { display: block; }

@media (max-width: 639px) {
  .greeting { padding-top: 40px; }
  .greeting h1 { font-size: 36px; }
}
```

- [ ] **Step 2: Create `src/components/Chat/Chips.tsx`**

```tsx
import './chat.css';

type Props = {
  chips: string[];
  onPick: (text: string) => void;
  disabled?: boolean;
};

export function Chips({ chips, onPick, disabled }: Props) {
  return (
    <div className="chips">
      {chips.map((c) => (
        <button
          key={c}
          type="button"
          className="chip"
          onClick={() => onPick(c)}
          disabled={disabled}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/Chat/MessageStack.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/src/lib/chat';
import { Message } from './Message';
import { ArtifactRenderer } from '@/src/components/Artifacts/ArtifactRenderer';
import './chat.css';

export function MessageStack() {
  const messages = useChatStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="message-stack">
      {messages.map((m) => (
        <div key={m.id}>
          <Message message={m} />
          {m.role === 'bryce' && m.artifact && !m.streaming && (
            <ArtifactRenderer kind={m.artifact} />
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

Note: `ArtifactRenderer` doesn't exist yet — we'll add it in Task 13. TypeScript will error until then; that's fine (the next task resolves it).

- [ ] **Step 4: Commit**

```bash
git add src/components/Chat/
git commit -m "feat: add Chips and MessageStack

Chips renders the suggestion pills under the greeting. MessageStack
subscribes to the store, renders messages, and injects the artifact
after a completed bryce message."
```

---

## Task 12: Artifact assembly helper — `src/components/Artifacts/ArtifactPiece.tsx`

A wrapper component that animates its child in from a random offset with stagger, simulating "flying in from the orb."

**Files:**
- Create: `src/components/Artifacts/ArtifactPiece.tsx`
- Create: `src/components/Artifacts/artifacts.css`

- [ ] **Step 1: Create `src/components/Artifacts/artifacts.css`**

```css
.artifact {
  margin: 0 auto 32px;
  max-width: 560px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: 14px;
  box-shadow: 0 10px 30px -20px rgba(31, 29, 26, 0.15);
}

.artifact-eyebrow {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 6px;
}

.artifact-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 24px;
  letter-spacing: -0.015em;
  margin: 0 0 10px;
  color: var(--color-ink);
}
.artifact-title em { font-style: italic; color: var(--color-accent); }

.artifact-body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-ink-soft);
  margin: 0 0 12px;
}

.artifact-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.artifact-tag {
  font-family: var(--font-sans);
  font-size: 11px;
  padding: 4px 11px;
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-ink-soft);
}

.artifact-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease;
  margin-top: 6px;
}
.artifact-button:hover { background: var(--color-accent-deep); }

.artifact-divider {
  height: 1px;
  background: var(--color-line);
  margin: 14px 0;
}
```

- [ ] **Step 2: Create `src/components/Artifacts/ArtifactPiece.tsx`**

```tsx
import { motion, useReducedMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  index: number;
  /** Offset direction hint — roughly where the piece flies in from. */
  from?: 'right' | 'top-right' | 'bottom-right';
}>;

export function ArtifactPiece({ index, from = 'right', children }: Props) {
  const reduced = useReducedMotion();

  const offsets = {
    right: { x: 80, y: 0 },
    'top-right': { x: 60, y: -30 },
    'bottom-right': { x: 60, y: 30 },
  }[from];

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.08 * index }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: offsets.x, y: offsets.y, scale: 0.7 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.15 + index * 0.18,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Artifacts/
git commit -m "feat: add artifact piece wrapper + artifact styles

ArtifactPiece animates its child in with a stagger and a slight
offset simulating flight in from the orb's direction. Degrades
to fade-only under reduced motion."
```

---

## Task 13: Artifact components — the five cards

Five concrete artifact components, each wrapping pieces in `ArtifactPiece`. Plus an `ArtifactRenderer` dispatch.

**Files:**
- Create: `src/components/Artifacts/RoleCard.tsx`
- Create: `src/components/Artifacts/ProjectCarousel.tsx`
- Create: `src/components/Artifacts/StackStrip.tsx`
- Create: `src/components/Artifacts/ResumeArtifact.tsx`
- Create: `src/components/Artifacts/ContactCard.tsx`
- Create: `src/components/Artifacts/ArtifactRenderer.tsx`

- [ ] **Step 1: Create `src/components/Artifacts/RoleCard.tsx`**

```tsx
import { ArtifactPiece } from './ArtifactPiece';
import './artifacts.css';

const HIGHLIGHTS = [
  'Sole technical owner across 6+ concurrent production integrations.',
  'Built reusable integration frameworks and webhook queueing with retry logic.',
  'Used Claude Code to re-engineer the team’s Workato recipe development.',
  'Owns uptime, incident response, and technical documentation.',
];

export function RoleCard() {
  return (
    <article className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Current role</div>
      </ArtifactPiece>
      <ArtifactPiece index={1}>
        <h3 className="artifact-title">
          Integration Specialist · <em>Digital Directions</em>
        </h3>
        <p className="artifact-body">March 2025 – Present · Remote</p>
      </ArtifactPiece>
      <ArtifactPiece index={2} from="bottom-right">
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
          }}
        >
          {HIGHLIGHTS.map((h) => (
            <li key={h} style={{ marginBottom: 4 }}>
              {h}
            </li>
          ))}
        </ul>
      </ArtifactPiece>
    </article>
  );
}
```

- [ ] **Step 2: Create `src/components/Artifacts/ProjectCarousel.tsx`**

```tsx
import { ArtifactPiece } from './ArtifactPiece';
import { PROJECTS } from '@/src/lib/content';
import './artifacts.css';

export function ProjectCarousel() {
  return (
    <div className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Selected projects</div>
      </ArtifactPiece>
      {PROJECTS.map((p, i) => (
        <ArtifactPiece key={p.id} index={i + 1} from={i % 2 ? 'bottom-right' : 'right'}>
          <article style={{ marginBottom: i < PROJECTS.length - 1 ? 14 : 0 }}>
            <h3 className="artifact-title" style={{ fontSize: 20, marginBottom: 4 }}>
              {p.title}
            </h3>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: 'var(--color-muted)',
                marginBottom: 6,
              }}
            >
              {p.subtitle}
            </div>
            <p className="artifact-body" style={{ marginBottom: 8 }}>
              {p.body}
            </p>
            <div className="artifact-tags">
              {p.tags.map((t) => (
                <span key={t} className="artifact-tag">
                  {t}
                </span>
              ))}
            </div>
            {i < PROJECTS.length - 1 && <div className="artifact-divider" />}
          </article>
        </ArtifactPiece>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/Artifacts/StackStrip.tsx`**

```tsx
import { ArtifactPiece } from './ArtifactPiece';
import { AI_STACK } from '@/src/lib/content';
import './artifacts.css';

export function StackStrip() {
  return (
    <div className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">AI & tools</div>
      </ArtifactPiece>
      {AI_STACK.map((s, i) => (
        <ArtifactPiece key={s.name} index={i + 1}>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: i < AI_STACK.length - 1 ? 10 : 0,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                color: 'var(--color-accent)',
                minWidth: 130,
                lineHeight: 1.2,
              }}
            >
              {s.name}
            </div>
            <div className="artifact-body" style={{ flex: 1, margin: 0 }}>
              {s.use}
            </div>
          </div>
        </ArtifactPiece>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/Artifacts/ResumeArtifact.tsx`**

```tsx
import { Download } from 'lucide-react';
import { ArtifactPiece } from './ArtifactPiece';
import { BIO } from '@/src/lib/content';
import './artifacts.css';

export function ResumeArtifact() {
  return (
    <article className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Résumé · one-minute version</div>
      </ArtifactPiece>
      <ArtifactPiece index={1}>
        <h3 className="artifact-title">{BIO.name}</h3>
      </ArtifactPiece>
      <ArtifactPiece index={2}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>Education</strong>
          <br />
          B.S. Computer Science, San Diego State University · May 2026
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={3}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>Current role</strong>
          <br />
          Integration Specialist · Digital Directions · March 2025 – Present
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={4}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>Highlights</strong>
          <br />
          Solo-built DD Client Portal · 6+ concurrent enterprise integrations · Uses Claude Code daily.
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={5} from="bottom-right">
        <a
          className="artifact-button"
          href="/Bryce_Rambach_Resume.pdf"
          download
        >
          <Download size={14} /> Download PDF
        </a>
      </ArtifactPiece>
    </article>
  );
}
```

- [ ] **Step 5: Create `src/components/Artifacts/ContactCard.tsx`**

```tsx
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { ArtifactPiece } from './ArtifactPiece';
import { BIO } from '@/src/lib/content';
import './artifacts.css';

const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--color-ink)',
  marginBottom: 8,
};

export function ContactCard() {
  return (
    <article className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Contact</div>
      </ArtifactPiece>
      <ArtifactPiece index={1}>
        <a href={`mailto:${BIO.email}`} style={ROW_STYLE}>
          <Mail size={16} color="var(--color-accent)" /> {BIO.email}
        </a>
      </ArtifactPiece>
      <ArtifactPiece index={2}>
        <a href={`tel:${BIO.phone.replace(/\D/g, '')}`} style={ROW_STYLE}>
          <Phone size={16} color="var(--color-accent)" /> {BIO.phone}
        </a>
      </ArtifactPiece>
      <ArtifactPiece index={3}>
        <a href={BIO.linkedin} target="_blank" rel="noreferrer" style={ROW_STYLE}>
          <Linkedin size={16} color="var(--color-accent)" /> linkedin.com/in/bryce-rambach
        </a>
      </ArtifactPiece>
      <ArtifactPiece index={4}>
        <a href={BIO.github} target="_blank" rel="noreferrer" style={ROW_STYLE}>
          <Github size={16} color="var(--color-accent)" /> github.com/brambach
        </a>
      </ArtifactPiece>
      <ArtifactPiece index={5} from="bottom-right">
        <p className="artifact-body" style={{ marginTop: 10, marginBottom: 0 }}>
          {BIO.availability}
        </p>
      </ArtifactPiece>
    </article>
  );
}
```

- [ ] **Step 6: Create `src/components/Artifacts/ArtifactRenderer.tsx`**

```tsx
import type { ArtifactKind } from '@/src/lib/content';
import { RoleCard } from './RoleCard';
import { ProjectCarousel } from './ProjectCarousel';
import { StackStrip } from './StackStrip';
import { ResumeArtifact } from './ResumeArtifact';
import { ContactCard } from './ContactCard';

type Props = { kind: ArtifactKind };

export function ArtifactRenderer({ kind }: Props) {
  switch (kind) {
    case 'role':     return <RoleCard />;
    case 'projects': return <ProjectCarousel />;
    case 'stack':    return <StackStrip />;
    case 'resume':   return <ResumeArtifact />;
    case 'contact':  return <ContactCard />;
  }
}
```

- [ ] **Step 7: Verify build**

Run:
```bash
npm run lint
```

Expected: no errors (MessageStack now resolves).

- [ ] **Step 8: Commit**

```bash
git add src/components/Artifacts/
git commit -m "feat: add five artifact components + renderer

RoleCard, ProjectCarousel, StackStrip, ResumeArtifact, ContactCard.
All compose ArtifactPiece children for staggered assembly. Renderer
dispatches by ArtifactKind from the content module."
```

---

## Task 14: Header — `src/components/Header/Header.tsx`

Top bar: wordmark on left, topic shortcuts in center, socials + résumé download on right.

**Files:**
- Create: `src/components/Header/Header.tsx`
- Create: `src/components/Header/header.css`

- [ ] **Step 1: Create `src/components/Header/header.css`**

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--color-paper) 92%, transparent);
  backdrop-filter: saturate(1.1) blur(10px);
  -webkit-backdrop-filter: saturate(1.1) blur(10px);
  border-bottom: 1px solid var(--color-line);
}

.site-header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 14px 32px;
  max-width: 1100px;
  margin: 0 auto;
}

.wordmark {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  color: var(--color-ink);
  letter-spacing: -0.005em;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-self: start;
}
.wordmark em { font-style: italic; color: var(--color-accent); }

.topic-links {
  display: flex;
  gap: 24px;
  justify-content: center;
}
.topic-link {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-ink-soft);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 2px;
  transition: color 0.2s ease;
}
.topic-link:hover { color: var(--color-accent); }

.header-right {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-self: end;
}
.header-right a {
  color: var(--color-ink-soft);
  transition: color 0.18s ease;
  display: inline-flex;
  align-items: center;
}
.header-right a:hover { color: var(--color-accent); }

.resume-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  padding: 6px 12px;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  color: var(--color-accent);
  text-decoration: none;
  transition: all 0.2s ease;
}
.resume-download:hover {
  border-color: var(--color-accent);
  background: #fffaf4;
}

@media (max-width: 767px) {
  .site-header-inner { padding: 12px 18px; gap: 10px; grid-template-columns: auto 1fr auto; }
  .topic-links { display: none; }
  .resume-download span { display: none; }
}
```

- [ ] **Step 2: Create `src/components/Header/Header.tsx`**

```tsx
import { Mail, Linkedin, Github, Download } from 'lucide-react';
import { TOPICS, BIO } from '@/src/lib/content';
import { useChatStore } from '@/src/lib/chat';
import './header.css';

type Props = {
  onTopic: (prompt: string) => void;
};

export function Header({ onTopic }: Props) {
  const reset = useChatStore((s) => s.reset);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="wordmark" onClick={reset}>
          Bryce <em>Rambach</em>
        </button>

        <nav className="topic-links" aria-label="Topic shortcuts">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              className="topic-link"
              onClick={() => onTopic(t.prompt)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="header-right">
          <a href={`mailto:${BIO.email}`} aria-label="Email">
            <Mail size={16} />
          </a>
          <a href={BIO.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a href={BIO.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={16} />
          </a>
          <a className="resume-download" href="/Bryce_Rambach_Resume.pdf" download>
            <Download size={12} /> <span>Résumé</span>
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/
git commit -m "feat: add site header — wordmark, topic shortcuts, socials, résumé

Topic clicks auto-send their prompt via the onTopic callback. Wordmark
click resets the conversation. Résumé download link points to
/Bryce_Rambach_Resume.pdf (added in a later task)."
```

---

## Task 15: Constellation — `src/components/Constellation/Constellation.tsx`

Thin strip under the header showing one dot per user message.

**Files:**
- Create: `src/components/Constellation/Constellation.tsx`
- Create: `src/components/Constellation/constellation.css`

- [ ] **Step 1: Create `src/components/Constellation/constellation.css`**

```css
.constellation {
  display: flex;
  gap: 10px;
  padding: 8px 24px;
  justify-content: center;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 22px;
  overflow-x: auto;
}

.constellation-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
  position: relative;
}
.constellation-dot:hover {
  opacity: 1;
  transform: scale(1.3);
}
.constellation-dot:hover::after {
  content: attr(data-preview);
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-sans);
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  z-index: 40;
}
```

- [ ] **Step 2: Create `src/components/Constellation/Constellation.tsx`**

```tsx
import { useChatStore } from '@/src/lib/chat';
import './constellation.css';

export function Constellation() {
  const messages = useChatStore((s) => s.messages);
  const userMessages = messages.filter((m) => m.role === 'user');

  if (userMessages.length === 0) {
    return <div className="constellation" aria-hidden="true" />;
  }

  return (
    <div className="constellation" aria-label="Conversation history">
      {userMessages.map((m) => (
        <button
          key={m.id}
          className="constellation-dot"
          data-preview={m.text.length > 40 ? m.text.slice(0, 40) + '…' : m.text}
          aria-label={`Jump to: ${m.text}`}
          onClick={() => {
            const target = document.getElementById(`msg-${m.id}`);
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update `Message.tsx` to add the scroll anchor id**

Edit `src/components/Chat/Message.tsx` — wrap the returned element with an `id`. Replace the existing return block (in both branches) so each wrapper gets `id={\`msg-${message.id}\`}`:

```tsx
// For user branch:
return (
  <div id={`msg-${message.id}`} className="message message-user">
    <span className="message-user-bubble">{message.text}</span>
  </div>
);

// For bryce branch:
return (
  <div
    id={`msg-${message.id}`}
    className="message message-bryce"
    aria-live="polite"
    aria-busy={message.streaming}
  >
    {/* ...unchanged children... */}
  </div>
);
```

- [ ] **Step 4: Verify**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Constellation/ src/components/Chat/Message.tsx
git commit -m "feat: add conversation constellation

Thin strip under the header shows one terracotta dot per user message.
Hovering reveals a preview; clicking scrolls to that exchange via an
anchor id on the message element."
```

---

## Task 16: Cursor halo — `src/components/CursorHalo/CursorHalo.tsx`

Warm gradient that follows the cursor. Disabled on touch and reduced-motion.

**Files:**
- Create: `src/components/CursorHalo/CursorHalo.tsx`
- Create: `src/components/CursorHalo/cursor-halo.css`

- [ ] **Step 1: Create `src/components/CursorHalo/cursor-halo.css`**

```css
.cursor-halo {
  position: fixed;
  pointer-events: none;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(244, 201, 163, 0.2),
    rgba(244, 201, 163, 0) 60%);
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.6s ease;
  will-change: left, top, opacity;
}

@media (pointer: coarse) { .cursor-halo { display: none; } }
@media (prefers-reduced-motion: reduce) { .cursor-halo { display: none; } }
```

- [ ] **Step 2: Create `src/components/CursorHalo/CursorHalo.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import './cursor-halo.css';

export function CursorHalo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <div ref={ref} className="cursor-halo" aria-hidden="true" />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CursorHalo/
git commit -m "feat: add cursor halo

Soft warm gradient follows the cursor on pointer-capable devices
and when reduced-motion is not set."
```

---

## Task 17: Chat orchestrator — `src/components/Chat/Chat.tsx`

Ties it all together: consumes submissions, runs absorption → thinking → streaming, dispatches scripted vs. LLM paths, and drives orb state.

**Files:**
- Create: `src/components/Chat/Chat.tsx`

- [ ] **Step 1: Create `src/components/Chat/Chat.tsx`**

```tsx
import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useChatStore } from '@/src/lib/chat';
import { matchTopic } from '@/src/lib/match';
import { KEYWORDS_TO_HIGHLIGHT, GREETING } from '@/src/lib/content';
import { streamChars, consumeSSE, type StreamEvent } from '@/src/lib/stream';
import { absorbLetters } from '@/src/lib/absorb';
import type { OrbHandle } from '@/src/components/Orb/Orb';
import { Input } from './Input';
import { Chips } from './Chips';
import { MessageStack } from './MessageStack';
import './chat.css';

type Props = {
  orbRef: React.RefObject<OrbHandle | null>;
  registerSubmit?: (fn: (prompt: string) => void) => void;
};

export function Chat({ orbRef, registerSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion() ?? false;
  const busyRef = useRef(false);

  const {
    messages,
    addUserMessage,
    addBryceMessage,
    appendToMessage,
    completeMessage,
    setOrbState,
    setHeat,
  } = useChatStore();

  const runAnswer = useCallback(
    async (prompt: string, inputEl: HTMLInputElement | null) => {
      if (busyRef.current) return;
      busyRef.current = true;

      addUserMessage(prompt);

      // 1. Absorption phase
      setOrbState('absorbing');
      const targetCenter = orbRef.current?.getCenter() ?? { x: 0, y: 0 };
      await new Promise<void>((resolve) => {
        if (!inputEl) { resolve(); return; }
        absorbLetters({
          source: inputEl,
          text: prompt,
          target: targetCenter,
          reducedMotion: reduced,
          onLand: () => orbRef.current?.flashAbsorb(),
          onComplete: () => {
            orbRef.current?.fireShockwave();
            resolve();
          },
        });
      });

      // 2. Thinking phase (short beat)
      setOrbState('thinking');
      await wait(900);

      // 3. Prepare Bryce message
      setOrbState('responding');
      const topic = matchTopic(prompt);
      const bryceId = addBryceMessage({ artifact: topic?.artifact });

      try {
        if (topic) {
          // Scripted path
          await streamScripted(topic.response, bryceId, {
            appendToMessage,
            setHeat,
            onKeyword: () => orbRef.current?.echo(),
          });
        } else {
          // LLM path
          await streamLLM(prompt, bryceId, {
            history: messages.slice(-4),
            appendToMessage,
            setHeat,
            onKeyword: () => orbRef.current?.echo(),
          });
        }
      } catch (e) {
        appendToMessage(bryceId, fallbackText());
      }

      completeMessage(bryceId);
      setHeat(0);
      setOrbState('idle');
      busyRef.current = false;
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced]
  );

  // Register the submit function so Header topic clicks can trigger it
  useEffect(() => {
    registerSubmit?.((prompt) => {
      const el = inputRef.current;
      if (!el) return;
      el.value = prompt; // allow absorption to measure the characters
      runAnswer(prompt, el);
      el.value = '';
    });
  }, [registerSubmit, runAnswer]);

  const showGreeting = messages.length === 0;

  return (
    <>
      {showGreeting && (
        <div className="greeting">
          <h1 dangerouslySetInnerHTML={{ __html: GREETING.line }} />
          <p className="sub">
            {GREETING.subtitleLines.map((l) => (
              <span key={l} className="sub-line">{l}</span>
            ))}
          </p>
        </div>
      )}
      <MessageStack />
      {showGreeting && (
        <Chips chips={GREETING.chips} onPick={(t) => {
          const el = inputRef.current;
          if (!el) return;
          el.value = t;
          runAnswer(t, el);
          el.value = '';
        }} disabled={busyRef.current} />
      )}
      <div className="chat-input-bar">
        <Input ref={inputRef} onSubmit={(t, el) => runAnswer(t, el)} />
      </div>
    </>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function fallbackText() {
  return "Not really me — try asking about my work, projects, AI & tools, or résumé.";
}

type StreamHelpers = {
  appendToMessage: (id: string, chunk: string) => void;
  setHeat: (h: number) => void;
  onKeyword: () => void;
};

async function streamScripted(
  text: string,
  id: string,
  { appendToMessage, setHeat, onKeyword }: StreamHelpers
) {
  const total = text.length;
  let charIdx = 0;
  const kwStarts = findKeywordStartIndices(text);

  await streamChars(text, (ch) => {
    appendToMessage(id, ch);
    const progress = (charIdx + 1) / total;
    setHeat(Math.sin(progress * Math.PI * 0.85));
    if (kwStarts.has(charIdx)) onKeyword();
    charIdx++;
  });
}

async function streamLLM(
  prompt: string,
  id: string,
  opts: StreamHelpers & {
    history: { role: 'user' | 'bryce'; text: string }[];
  }
) {
  const { appendToMessage, setHeat, onKeyword, history } = opts;

  // Map internal history -> API history
  const apiHistory = history.map((m) => ({
    role: m.role === 'bryce' ? 'assistant' : 'user',
    content: m.text,
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt, history: apiHistory }),
  });
  if (!res.ok) {
    if (res.status === 429) {
      appendToMessage(
        id,
        "I've chatted with a lot of folks today — come back tomorrow, or email me at bryce.rambach@gmail.com."
      );
      return;
    }
    throw new Error(`HTTP ${res.status}`);
  }

  // Accumulate the full text so we can compute keyword-start indices
  // against the stream as it arrives.
  let buffer = '';
  let rendered = 0;
  let animationQueue: Promise<void> = Promise.resolve();
  const total = { value: 1 };

  const handle = (event: StreamEvent) => {
    if (event.type === 'delta') {
      buffer += event.text;
      total.value = buffer.length || 1;
      animationQueue = animationQueue.then(() =>
        streamChars(
          buffer.slice(rendered),
          (ch) => {
            appendToMessage(id, ch);
            rendered++;
            const progress = rendered / total.value;
            setHeat(Math.sin(progress * Math.PI * 0.85));
            if (isKeywordStart(buffer, rendered - 1)) onKeyword();
          },
          { minDelay: 12, maxDelay: 28 }
        )
      );
    }
  };

  await consumeSSE(res, handle);
  await animationQueue;
}

function findKeywordStartIndices(text: string): Set<number> {
  const set = new Set<number>();
  const lower = text.toLowerCase();
  for (const kw of KEYWORDS_TO_HIGHLIGHT) {
    const k = kw.toLowerCase();
    let from = 0;
    while (true) {
      const idx = lower.indexOf(k, from);
      if (idx === -1) break;
      set.add(idx);
      from = idx + k.length;
    }
  }
  return set;
}

function isKeywordStart(text: string, position: number): boolean {
  const lower = text.toLowerCase();
  for (const kw of KEYWORDS_TO_HIGHLIGHT) {
    const k = kw.toLowerCase();
    if (position + k.length > lower.length) continue;
    if (lower.slice(position, position + k.length) === k) {
      // Ensure it's actually the start (not mid-word continuation)
      // Simple heuristic: previous char is non-letter
      const prev = position === 0 ? '' : lower[position - 1];
      if (prev === '' || /[^a-z]/.test(prev)) return true;
    }
  }
  return false;
}

```

- [ ] **Step 2: Verify build**

Run:
```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Chat/Chat.tsx
git commit -m "feat: wire up chat orchestrator

Handles the full submit lifecycle — absorption, thinking, scripted
or LLM streaming, keyword echo callbacks, heat ramp, and error
fallback. Exposes registerSubmit so the Header can auto-send
topic shortcuts."
```

---

## Task 18: App shell — new `src/App.tsx`

The page composition + ignition sequence + store subscription glue.

**Files:**
- Modify: `src/App.tsx` (full rewrite)
- Modify: `index.html`

- [ ] **Step 1: Overwrite `src/App.tsx`**

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Header } from '@/src/components/Header/Header';
import { Constellation } from '@/src/components/Constellation/Constellation';
import { CursorHalo } from '@/src/components/CursorHalo/CursorHalo';
import { Chat } from '@/src/components/Chat/Chat';
import { Orb, type OrbHandle } from '@/src/components/Orb/Orb';
import { useChatStore } from '@/src/lib/chat';

const GREETED_KEY = 'bryce-greeted';

export default function App() {
  const orbRef = useRef<OrbHandle>(null);
  const submitRef = useRef<((prompt: string) => void) | null>(null);

  const greeted = useChatStore((s) => s.greeted);
  const markGreeted = useChatStore((s) => s.markGreeted);
  const reduced = useReducedMotion() ?? false;

  // Seed greeted from sessionStorage (returning session = no ignition)
  const [ignited, setIgnited] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem(GREETED_KEY) === '1';
    if (seen) {
      markGreeted();
      setIgnited(true);
    } else {
      // Stagger the ignition — CSS handles visuals via data-ignited.
      const duration = reduced ? 400 : 2600;
      const t = setTimeout(() => {
        setIgnited(true);
        markGreeted();
        sessionStorage.setItem(GREETED_KEY, '1');
      }, duration);

      // Escape hatch: any click or keypress skips ignition
      const skip = () => {
        clearTimeout(t);
        setIgnited(true);
        markGreeted();
        sessionStorage.setItem(GREETED_KEY, '1');
      };
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      return () => {
        clearTimeout(t);
        window.removeEventListener('pointerdown', skip);
        window.removeEventListener('keydown', skip);
      };
    }
  }, [markGreeted, reduced]);

  // Console signature — for devs who inspect
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      '%c BR. %c Bryce Rambach — bryce.rambach@gmail.com\n' +
      '%c Built with React, Tailwind v4, Motion, and Claude Haiku 4.5.\n' +
      ' If you\'re reading this, we should probably talk.',
      'background: #c8704a; color: #faf7f2; font-size: 18px; font-weight: bold; padding: 8px 12px; border-radius: 4px;',
      'color: #1f1d1a; font-size: 13px; padding: 8px 0;',
      'color: #6b6359; font-size: 11px;'
    );
  }, []);

  const handleTopic = useCallback((prompt: string) => {
    submitRef.current?.(prompt);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: ignited ? 1 : 0.4 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
      data-ignited={ignited ? '1' : '0'}
    >
      <CursorHalo />
      <Header onTopic={handleTopic} />
      <Constellation />

      <main style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', maxWidth: 1100, margin: '0 auto', padding: '0 16px', position: 'relative' }}>
          <div style={{ minWidth: 0 }}>
            <Chat
              orbRef={orbRef}
              registerSubmit={(fn) => { submitRef.current = fn; }}
            />
          </div>
          <div className="orb-anchor">
            <div className="orb-sticky">
              <Orb ref={orbRef} />
            </div>
          </div>
        </div>
      </main>

      {!ignited && !greeted && !reduced && <IgnitionParticles />}
    </motion.div>
  );
}

function IgnitionParticles() {
  const particles = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {particles.map((i) => {
        const angle = (i / particles.length) * Math.PI * 2 + Math.random() * 0.5;
        const startDist = window.innerWidth * 0.6;
        const startX = Math.cos(angle) * startDist;
        const startY = Math.sin(angle) * startDist;
        return (
          <motion.div
            key={i}
            initial={{
              left: `calc(50% + ${startX}px)`,
              top: `calc(50% + ${startY}px)`,
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              left: 'calc(75% + 110px)',  // approx orb center
              top: '50%',
              opacity: [0, 1, 0],
              scale: [0.4, 1, 0.2],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.04,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{
              position: 'fixed',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-accent)',
              boxShadow: '0 0 12px var(--color-accent-soft)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Add the orb sticky rule to `src/index.css`**

Append to the bottom of `src/index.css`:
```css
.orb-anchor {
  width: 300px;
  position: relative;
}
.orb-sticky {
  position: sticky;
  top: 50vh;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
}

@media (max-width: 1023px) {
  .orb-anchor { display: none; }
}
```

For tablet/mobile, the orb should live in the header instead. Add this CSS too (it renders a mobile orb via a duplicate-free route in Task 19 polish):
```css
.mobile-orb-slot { display: none; }
@media (max-width: 1023px) {
  .mobile-orb-slot { display: block; margin-right: 12px; }
}
```

- [ ] **Step 3: Update `index.html` with richer meta**

Replace with:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Bryce Rambach — full-stack engineer. Ask me anything." />
    <meta name="theme-color" content="#faf7f2" />
    <meta property="og:title" content="Bryce Rambach" />
    <meta property="og:description" content="Full-stack engineer. Ships production solo. Uses Claude Code daily." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://brycerambach.com" />
    <link rel="icon" href="/favicon.ico" />
    <title>Bryce Rambach</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Build & verify visually**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` and confirm:
- Warm cream background
- Header with wordmark, topic links, socials
- Greeting renders
- Orb visible on right (desktop)
- Chips clickable — clicking one triggers absorption → thinking → response
- Typing in input + Enter triggers the same flow
- Constellation dots appear after messages
- No console errors

- [ ] **Step 5: Stop dev server and commit**

```bash
git add src/App.tsx src/index.css index.html
git commit -m "feat: new App shell with ignition sequence and orb mount

Page is a grid: chat column on left, orb column (sticky, vertically
centered) on right. Ignition particles converge into the orb on first
visit (sessionStorage gates replays). Any user input skips ignition.
Desktop renders orb in its column; mobile hides it (will land in
header in the mobile polish task)."
```

---

## Task 19: Mobile orb placement + responsive polish

Move orb to the header on small screens so it stays visible and reactive.

**Files:**
- Modify: `src/components/Header/Header.tsx` and `src/App.tsx`

- [ ] **Step 1: Create a shared orb ref pattern in `App.tsx`**

Since the orb must be a single instance, we can't duplicate it. Strategy: on small screens, render the orb inside the header slot instead of the right column. Use a CSS-only swap — keep the orb mounted in both positions via a portal-free approach: render a single `<Orb>` inside a container whose position changes with viewport.

Simplest approach: use CSS `position: fixed` for the orb on mobile and let it float in the top-right. Replace the Task 18 markup.

Edit `src/App.tsx` — replace the `.orb-anchor` / `.orb-sticky` block with:
```tsx
<div className="orb-host">
  <Orb ref={orbRef} />
</div>
```

And replace the sticky/anchor CSS in `index.css` with:
```css
.orb-host {
  position: fixed;
  right: 48px;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
}
.orb-host > * { pointer-events: auto; }

@media (max-width: 1023px) {
  .orb-host {
    top: 14px;
    right: 18px;
    transform: none;
  }
}
@media (max-width: 639px) {
  .orb-host {
    right: 12px;
    top: 10px;
  }
}
```

Also remove the unnecessary grid from the `<main>` section — simplify `App.tsx` to:
```tsx
<main>
  <Chat
    orbRef={orbRef}
    registerSubmit={(fn) => { submitRef.current = fn; }}
  />
</main>
<div className="orb-host">
  <Orb ref={orbRef} />
</div>
```

- [ ] **Step 2: Update `index.html` viewport and add safe-area support**

Replace `<meta name="viewport">` with:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

Add to the `body` rule in `index.css`:
```css
body {
  padding-bottom: env(safe-area-inset-bottom);
}
```

- [ ] **Step 3: Verify in browser dev-tools responsive mode**

Run:
```bash
npm run dev
```

Test at 1440px, 768px, 375px. Confirm orb visible, non-overlapping with content, and still reactive.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/index.css index.html
git commit -m "fix: single-instance orb host with responsive placement

Orb lives in a fixed-position host. Desktop pins it mid-right;
tablet/mobile float it to the top-right. Safe-area padding added
to the body for iOS input bar clearance."
```

---

## Task 20: Vercel Edge Function — `api/chat.ts`

The server-side proxy: verifies Turnstile, rate-limits, streams from Anthropic as SSE.

**Files:**
- Create: `api/chat.ts` (at **repo root**, not `src/api/`)
- Create: `api/chat.test.ts`

- [ ] **Step 1: Create `api/chat.ts`**

```ts
import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT_TEXT = `You are Bryce Rambach answering questions on his personal portfolio.

Write in first person, warm and direct. Maximum 60 words per answer. Do not use emojis.

If the visitor asks something off-topic from career, projects, tech, or background, redirect gently ("Not really me — try asking about my work, projects, AI tools, or résumé").

Never break character. Never mention that you are an AI.

BIO AND BACKGROUND:

Name: Bryce Rambach
Contact: bryce.rambach@gmail.com · (831) 236-1922 · linkedin.com/in/bryce-rambach · github.com/brambach
Location: San Diego · relocating SF or NYC summer 2026
Education: B.S. Computer Science, San Diego State University (August 2022 – May 2026)

SUMMARY:
Full-stack engineer who ships production applications solo, from architecture through deployment. Built an AI-powered client portal from scratch (Next.js, TypeScript, Claude API) now used company-wide. Sole technical owner of 6+ concurrent enterprise integrations across different APIs, data formats, and authentication patterns. Uses Claude Code daily to accelerate development and re-engineer team workflows.

CURRENT ROLE — Integration Specialist, Digital Directions (March 2025 – Present, Remote):
- Sole technical owner across 6+ concurrent production integrations connecting enterprise HR, payroll, and finance systems.
- Built integrations end-to-end in TypeScript/Node.js across HiBob, NetSuite, MYOB, KeyPay, and Deputy.
- Used Claude Code to re-engineer the team's approach to Workato recipe development.
- Created reusable integration frameworks, reverse-engineering undocumented partner APIs.
- Engineered webhook queueing systems handling 500+ records per sync cycle.
- Built integration health monitoring dashboards.

PROJECTS:
1. Digital Directions Client Portal (2025 – Present): Solo-built full-stack production app in Next.js 15, TypeScript, Drizzle ORM (PostgreSQL), integrating Claude API, Freshdesk, Slack, Resend. Real-time monitoring of 10+ integrations.
2. Bryce Digital (2025 – Present): Independent development practice. Full-stack web apps and AI-powered tools using Claude Code + Next.js.
3. brycerambach.com (this site): React + Motion chat experience with a live Claude Haiku 4.5 fallback.

SKILLS:
Languages — TypeScript, JavaScript (Node.js), SQL (PostgreSQL, SuiteQL), Python
Frontend — React, Next.js, Drizzle ORM, Clerk, Three.js, Tailwind CSS
Integration — REST APIs, OAuth 2.0, Webhooks, Workato, Postman
AI & Tools — Anthropic Claude API, Claude Code
Platforms — NetSuite, HiBob, MYOB, KeyPay, Deputy, Freshdesk, Slack, Resend, Vercel

LOOKING FOR:
Solutions Engineer or Full-Stack roles at early-stage startups where the work has maximum impact. Relocating to SF or NYC summer 2026.`;

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '1 d'), // 10 messages / 24h
  prefix: 'ratelimit:chat',
});

async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile disabled in dev
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = await res.json() as { success: boolean };
  return !!data.success;
}

type ChatRequest = {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const turnstileToken = req.headers.get('x-turnstile-token');

  // Turnstile (skips in dev if secret not set)
  const verified = await verifyTurnstile(turnstileToken, ip);
  if (!verified) {
    return json({ error: 'turnstile_failed' }, 403);
  }

  // Rate limit
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return json({ error: 'rate_limited' }, 429);
  }

  // Parse
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  const message = body.message?.slice(0, 500);
  if (!message) return json({ error: 'empty_message' }, 400);
  const history = (body.history ?? []).slice(-4).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
    content: m.content.slice(0, 500),
  }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'server_misconfigured' }, 500);

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT_TEXT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [
            ...history,
            { role: 'user', content: message },
          ],
          stream: true,
        });

        for await (const ev of response) {
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
            const payload = JSON.stringify({ type: 'delta', text: ev.delta.text });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      } catch (e: unknown) {
        const payload = JSON.stringify({
          type: 'error',
          message: e instanceof Error ? e.message : 'unknown',
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 2: Verify type-check**

Run:
```bash
npm run lint
```

Expected: no errors. (Edge runtime types should resolve from `@anthropic-ai/sdk`; if `process.env` errors, it's because Vercel injects Node-ish typings; add `@types/node` if needed via `npm i -D @types/node` — but it's already installed in devDependencies.)

- [ ] **Step 3: Commit**

```bash
git add api/chat.ts
git commit -m "feat: add Vercel Edge Function for chat

Proxies messages to Claude Haiku 4.5 with prompt caching on the system
prompt. Verifies Cloudflare Turnstile (if configured), rate-limits per
IP via Upstash Redis (10 msg/24h), and streams back SSE. Clamps user
message and history to 500 chars per turn."
```

---

## Task 21: Vercel config + env scaffolding

Add `vercel.json` for edge runtime hints and an `.env.local.example` for local dev.

**Files:**
- Create: `vercel.json`
- Create: `.env.local.example`
- Modify: `.gitignore` (add `.env.local` and `.superpowers/`)

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "functions": {
    "api/chat.ts": { "runtime": "edge" }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create `.env.local.example`**

```
# Anthropic — set in Vercel dashboard for preview/production
ANTHROPIC_API_KEY=sk-ant-...

# Upstash Redis — create from Vercel marketplace and it auto-injects
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cloudflare Turnstile — optional; skipped in dev if unset
TURNSTILE_SECRET_KEY=
# Public site key is safe to ship in client code
VITE_TURNSTILE_SITE_KEY=
```

- [ ] **Step 3: Update `.gitignore`**

Check current contents:
```bash
cat .gitignore
```

Ensure these lines exist (add any missing):
```
.env
.env.local
.env.*.local
.superpowers/
.vercel/
```

- [ ] **Step 4: Commit**

```bash
git add vercel.json .env.local.example .gitignore
git commit -m "chore: add Vercel config, env example, update gitignore

Pins /api/chat.ts to the edge runtime, sets baseline security headers,
and documents required environment variables."
```

---

## Task 22: Résumé PDF asset + favicon placeholder

Drop the résumé PDF into `/public/` and create a minimal favicon so the site doesn't 404.

**Files:**
- Create: `public/Bryce_Rambach_Resume.pdf`
- Create: `public/favicon.ico`

- [ ] **Step 1: Generate the résumé PDF from the docx**

Run:
```bash
python /Users/bryce/.claude/plugins/cache/claude-plugins-official/anthropic-skills/*/skills/docx/scripts/office/soffice.py --headless --convert-to pdf /Users/bryce/Downloads/Bryce_Rambach_Resume.docx --outdir public/
```

Then rename the generated file to match the link:
```bash
mv "public/Bryce_Rambach_Resume.pdf" "public/Bryce_Rambach_Resume.pdf"
```

(If the soffice path doesn't resolve, fall back to running `soffice` directly from your system install: `soffice --headless --convert-to pdf /Users/bryce/Downloads/Bryce_Rambach_Resume.docx --outdir public/`.)

- [ ] **Step 2: Verify**

Run:
```bash
ls -la public/Bryce_Rambach_Resume.pdf
```

Expected: file exists.

- [ ] **Step 3: Create a minimal 32x32 transparent favicon**

```bash
# Empty 1x1 transparent PNG converted to ICO — the site just needs something here
# If you don't have ImageMagick, drop any square PNG into public/ named favicon.ico
printf '\x00\x00\x01\x00\x01\x00\x01\x01\x00\x00\x01\x00\x20\x00\x30\x00\x00\x00\x16\x00\x00\x00\x28\x00\x00\x00\x01\x00\x00\x00\x02\x00\x00\x00\x01\x00\x20\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xc8\x70\x4a\xff\x00\x00\x00\x00' > public/favicon.ico
```

(Acceptable alternative: save any 32x32 image as `public/favicon.ico` by hand.)

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "chore: add résumé PDF and favicon to public

PDF is generated once from Bryce_Rambach_Resume.docx; regenerate when
the source changes. Favicon is a minimal warm-accent placeholder."
```

---

## Task 23: README refresh + final verification

Update the README to describe the new site and run the full verification suite.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Overwrite `README.md`**

```markdown
<div align="center">

# brycerambach.com

Personal portfolio as a conversation — warm cream paper, a living ember-orb avatar, and a hybrid scripted / Claude Haiku chat backend.

[Live Site](https://brycerambach.com) &nbsp;&middot;&nbsp; [LinkedIn](https://www.linkedin.com/in/bryce-rambach/) &nbsp;&middot;&nbsp; [Email](mailto:bryce.rambach@gmail.com)

</div>

---

## About

I'm Bryce Rambach — CS at SDSU (graduating May 2026), Integration Specialist at Digital Directions. I'm targeting Solutions Engineer / full-stack roles at early-stage startups in SF or NYC, summer 2026.

This site isn't a scroll — it's a chat. Ask it anything.

## Tech Stack

| Layer            | Tech                                      |
|------------------|-------------------------------------------|
| Framework        | React 19                                  |
| Language         | TypeScript                                |
| Build            | Vite 6                                    |
| Styling          | Tailwind CSS v4                           |
| Motion           | Motion (`motion/react`) + CSS keyframes   |
| State            | Zustand                                   |
| Typography       | Instrument Serif, Inter                   |
| Icons            | Lucide React                              |
| AI Backend       | Claude Haiku 4.5 via Vercel Edge Function |
| Rate limiting    | Upstash Redis                             |
| Bot protection   | Cloudflare Turnstile                      |

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in keys (Anthropic, Upstash)
npm run dev                         # http://localhost:3000
npm run build
npm run preview
npm run lint                        # tsc --noEmit
npm test                            # vitest
```

## Project Structure

```
src/
├── App.tsx                      # Page shell + ignition
├── main.tsx
├── index.css                    # Tokens, keyframes, reduced-motion
├── components/
│   ├── Orb/                     # Avatar
│   ├── Chat/                    # Input, Message, MessageStack, Chips, Chat
│   ├── Artifacts/               # RoleCard, ProjectCarousel, StackStrip, Resume, Contact
│   ├── Header/                  # Top bar
│   ├── Constellation/           # Conversation dot-map
│   └── CursorHalo/              # Warm cursor follower
└── lib/
    ├── chat.ts                  # Zustand store
    ├── content.ts               # Bio, projects, topics, system prompt
    ├── match.ts                 # Topic keyword matcher + segmenter
    ├── stream.ts                # char streaming + SSE consumer
    └── absorb.ts                # Letter absorption animation

api/
└── chat.ts                      # Vercel Edge Function
```

## Design spec & implementation plan

- Spec: `docs/superpowers/specs/2026-04-18-portfolio-conversational-redesign-design.md`
- Plan: `docs/superpowers/plans/2026-04-18-portfolio-conversational-redesign.md`
- Prototype (reference): `.superpowers/brainstorm/68766-1776537863/content/live-demo-v4.html`

## License

MIT
```

- [ ] **Step 2: Run the full verification suite**

Run:
```bash
npm run lint
npm test
npm run build
```

Expected: all three succeed. `npm run build` produces a `dist/` folder with no errors.

- [ ] **Step 3: Manual smoke test**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` and verify:
1. Ignition plays on first load; particles converge into orb; greeting types in.
2. Reload → no ignition (sessionStorage).
3. Click "Tell me about your work" chip → letters fly to orb → thinking → scripted response streams → role card assembles.
4. Click "Projects" in header → letter-fly answers same way, renders project carousel.
5. Click "Résumé" → response + résumé artifact with working PDF download link.
6. Type a free-text message ("what's your favorite color?") → LLM path. In dev with no `ANTHROPIC_API_KEY`, it'll 500 and show the scripted fallback line — that's correct.
7. Open Chrome DevTools → Application → Session Storage → clear `bryce-greeted` → reload to re-see ignition.
8. Open DevTools → Elements → add `prefers-reduced-motion: reduce` via DevTools rendering tab. Reload. Verify no particle flight, no flash ring on absorb, orb still breathes subtly.
9. Resize to 375px (mobile). Orb appears top-right of header, input reachable at bottom.
10. Tab through the page. Focus rings visible in terracotta on all interactive elements.

- [ ] **Step 4: Commit README + any final tweaks**

```bash
git add README.md
git commit -m "docs: rewrite README for conversational portfolio

Replaces the editorial-portfolio README with an overview of the
chat architecture, tech stack, project structure, and commands."
```

- [ ] **Step 5: Final push (user runs when ready)**

The site is now ready to deploy to Vercel. User is responsible for:
1. Running `git push` to their remote.
2. Configuring `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and (optionally) `TURNSTILE_SECRET_KEY` in Vercel → Settings → Environment Variables.
3. Setting a $20/mo budget alert in the Anthropic console as a kill switch.
4. Connecting the Upstash Redis integration via the Vercel marketplace (one-click).

---

## Self-review notes

This plan writes ~23 tasks. A few non-obvious decisions made during drafting, flagged for the implementer:

1. **Path alias** — existing `tsconfig.json` uses `@/*` → `./*`. Import paths use `@/src/...` accordingly. Do not change the alias config.
2. **Edge function location** — the spec had `src/api/chat.ts`. Corrected to `api/chat.ts` (repo root) per Vercel's convention for static Vite apps.
3. **Reduced motion orb breath** — spec says 7s cycle. Implemented via `!important` override in `index.css` so the React component doesn't need to know about reduced motion for breathing alone.
4. **Turnstile dev fallback** — if `TURNSTILE_SECRET_KEY` is unset, verification passes through. Avoids blocking local dev.
5. **LLM history cap** — client sends last 4 turns; server clamps both message and per-turn content to 500 chars.
6. **Prompt caching** — `cache_control: { type: 'ephemeral' }` on the system prompt block per Anthropic docs. First hit full-price; subsequent hits within 5min get ~90% discount.
7. **Keyword echo during LLM streaming** — we detect keyword starts against the accumulated buffer, not against the full response (which isn't known yet). The `isKeywordStart` heuristic guards against mid-word false positives with a non-letter-before check.
8. **Resume PDF generation** — done once by hand (Task 22 uses soffice). If it fails due to LibreOffice pathing, fall back to Pages/Word manual export.
