# Oak and Clay Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cosmic direction with the Oak and Clay one-page site: six chapters, day-arc background, dash-and-rest hare.

**Architecture:** One React page. A `DayArc` engine lerps `document.body` background through five color stops of scroll progress. Sections are self-contained and share five motion primitives (Settle, EnvelopeReveal, InkNote, Polaroid, StreakNumber). A desktop-only `TrailRunner` measures `[data-waypoint]` anchors, builds an SVG spine, and runs the hare between waypoints with a pure state machine.

**Tech Stack:** Vite, React 19, Tailwind 4 (@theme tokens), motion/react, Lenis (existing SmoothScroll), vitest + RTL.

**Spec:** `docs/superpowers/specs/2026-08-30-oak-and-clay-rebuild-design.md`

## Global Constraints

- Palette: paper #F2EBDD, oak #1C3527, cognac #A9713F, clay #C14E2B, clay-bright #D9683F, golden #E8C98F, bluehour #14242C, night #0E141A, ink-soft #4A4438. Clay spent once per view.
- Type: Bodoni Moda (display), Hanken Grotesk (body), IBM Plex Mono (annotations), Caveat (margin notes only, always tilted).
- Copy is verbatim from the spec. Lowercase section labels. No résumé link, no availability lines, no self-narrating copy.
- Premium bar: no glassmorphism, gradient blobs, particles, typewriter text, parallax-on-everything, default ease-in-out, or gray shadows. Shared easing language: settle `cubic-bezier(0.16,1,0.3,1.35)`, cover `cubic-bezier(0.5,0,0.15,1)`, stamp `cubic-bezier(0.2,1.4,0.4,1)`. Shadows warm-toned (oak/black at low alpha).
- Hare is dash-and-rest, ink-colored (currentColor), never scrollbar-glued.
- Reduced motion: no entrance/autonomous animation, hare hidden, all dots and content visible. The day-arc background still tracks scroll (it is a color state, not movement) - deliberate deviation, note it in the commit.
- `npm run lint` (tsc) and `npm test` green at every commit.
- Old cosmic components stay in the tree until Task 9; App just stops importing them, so their tests keep passing meanwhile.

---

### Task 1: Foundations - fonts, tokens, grain, site data

**Files:**
- Modify: `package.json` (deps), `src/index.css`, `src/main.tsx` (font imports if they live there - check first)
- Create: `src/lib/site.ts`, `src/components/Grain.tsx`
- Test: `src/lib/site.test.ts`

**Interfaces:**
- Produces: Tailwind color tokens `paper oak cognac clay claybright golden bluehour night inksoft`; font utilities `font-display font-body font-mono-a font-hand`; `.grain` overlay component `<Grain />`; `site.ts` exports `projects: {name, oneLiner, tag, href?}[]`, `vibeCards`, `streakDay: number`, `email: string`.

- [ ] **Step 1:** `npm i @fontsource-variable/bodoni-moda @fontsource-variable/hanken-grotesk @fontsource-variable/caveat @fontsource/ibm-plex-mono` (keep old font deps until Task 9).
- [ ] **Step 2: Failing test** for site data shape:

```ts
// src/lib/site.test.ts
import { describe, expect, it } from 'vitest';
import { email, projects, streakDay, vibeCards } from './site';

describe('site data', () => {
  it('lists the four projects in order with human one-liners', () => {
    expect(projects.map((p) => p.name)).toEqual(['arro', 'trace', 'throughline', 'bryce-os']);
    expect(projects[0].oneLiner).toBe('a running-streak ritual my family actually keeps');
  });
  it('keeps the streak and email', () => {
    expect(streakDay).toBe(214);
    expect(email).toBe('bryce.rambach@gmail.com');
  });
  it('has a vibe card per photo plus the note', () => {
    expect(vibeCards.filter((c) => c.kind === 'photo')).toHaveLength(4);
  });
});
```

- [ ] **Step 3:** Implement `src/lib/site.ts` with the spec's copy: projects (arro/react native, trace/typescript, throughline/slack · github, bryce-os/watchers, hrefs omitted for now), `vibeCards` (clay-court "clay season", green-911 "the someday car", meadow-trail "dawn miles", snowboard-dusk "winter, occasionally", plus `{kind:'note'}` "next: building my own thing." / "sf or nyc · soon"), `streakDay = 214`, `email`.
- [ ] **Step 4:** Rewrite `src/index.css`: import the four font families; `@theme` block mapping the palette tokens and `--font-display: 'Bodoni Moda Variable', Georgia, serif` etc.; body defaults (paper bg, oak text, Hanken); link colors clay/#A03E20; selection oak/paper.
- [ ] **Step 5:** `Grain.tsx`: fixed inset-0 pointer-events-none z-50 div, SVG turbulence data-URI background (values from spec/artboards), opacity 0.5.
- [ ] **Step 6:** Run `npm test -- site` → PASS; `npm run lint` → clean. Commit `feat: oak-and-clay foundations (fonts, tokens, grain, site data)`.

### Task 2: Day-arc engine

**Files:**
- Create: `src/lib/day-arc.ts`, `src/components/DayArc.tsx`
- Test: `src/lib/day-arc.test.ts`

**Interfaces:**
- Produces: `DAY_STOPS: ReadonlyArray<readonly [number, readonly [number, number, number]]>`; `dayArcColor(t: number): string` returning `rgb(r,g,b)`; `isDarkAt(t: number): boolean` (relative luminance of `dayArcColor(t)` < 0.35); `<DayArc />` renders null, drives `document.body.style.backgroundColor` from motion `useScroll().scrollYProgress`.

- [ ] **Step 1: Failing tests:**

```ts
// src/lib/day-arc.test.ts
import { describe, expect, it } from 'vitest';
import { dayArcColor, isDarkAt } from './day-arc';

describe('dayArcColor', () => {
  it('returns paper at dawn and night at the end', () => {
    expect(dayArcColor(0)).toBe('rgb(242,235,221)');
    expect(dayArcColor(1)).toBe('rgb(14,20,26)');
  });
  it('hits each stop exactly', () => {
    expect(dayArcColor(0.26)).toBe('rgb(232,201,143)');
    expect(dayArcColor(0.5)).toBe('rgb(28,53,39)');
    expect(dayArcColor(0.72)).toBe('rgb(20,36,44)');
  });
  it('interpolates midway between stops and clamps out-of-range', () => {
    expect(dayArcColor(0.13)).toBe('rgb(237,218,182)');
    expect(dayArcColor(-1)).toBe(dayArcColor(0));
    expect(dayArcColor(2)).toBe(dayArcColor(1));
  });
});

describe('isDarkAt', () => {
  it('is light on paper, dark from oak onward', () => {
    expect(isDarkAt(0)).toBe(false);
    expect(isDarkAt(0.26)).toBe(false);
    expect(isDarkAt(0.5)).toBe(true);
    expect(isDarkAt(1)).toBe(true);
  });
});
```

- [ ] **Step 2:** Verify FAIL, then implement `day-arc.ts` (stop table from spec, linear per-channel lerp with rounding, clamp; luminance via 0.2126/0.7152/0.0722 on srgb-linearized channels).
- [ ] **Step 3:** `DayArc.tsx`: `useScroll()` + `useMotionValueEvent(scrollYProgress, 'change', t => { document.body.style.backgroundColor = dayArcColor(t) })`, set initial color in an effect, cleanup restores ''. Also toggles `document.documentElement.dataset.arc = isDarkAt(t) ? 'dark' : 'light'` so fixed chrome (nav, grain) can restyle via CSS.
- [ ] **Step 4:** Tests PASS, lint clean. Commit `feat: day-arc scroll background engine`.

### Task 3: Motion primitives

**Files:**
- Create: `src/components/Settle.tsx`, `src/components/InkNote.tsx`, `src/components/EnvelopeReveal.tsx`, `src/components/Polaroid.tsx`, `src/components/StreakNumber.tsx`
- Test: `src/components/primitives.test.tsx`

**Interfaces:**
- Produces:
  - `<Settle as?='div' delay?=number className children>` - whileInView letterpress: initial `{opacity:0, y:20, scale:1.02}` → `{opacity:1, y:0, scale:1}`, transition `{duration:0.75, ease:[0.16,1,0.3,1.35], opacity:{duration:0.45}}`, `viewport={{once:true, amount:0.25}}`.
  - `<InkNote rotate?=number delay?=number className children>` - Caveat note; clip-path inset sweep `inset(-20% 100% -20% 0)` → `inset(-20% -5% -20% 0)`, 1.1s ease, default delay 0.35s.
  - `<EnvelopeReveal src alt caption? rotate? coverClassName?>` - photo container; paper cover with torn-edge clip-path lifts `y:'-112%', rotate:-2` over 1.05s `[0.5,0,0.15,1]` on inView.
  - `<Polaroid src alt caption rotate tape?='left'|'right' className>` - #F7F3EA frame, tape strip, Caveat caption.
  - `<StreakNumber value>` - span counting 0→value over 1.3s cubic ease-out on inView, `toLocaleString`, renders value immediately under reduced motion (use `useReducedMotion()` from motion/react).

- [ ] **Step 1: Failing tests** (jsdom has no IntersectionObserver animation timing - assert content and static fallbacks, not tween frames):

```tsx
// src/components/primitives.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnvelopeReveal } from './EnvelopeReveal';
import { InkNote } from './InkNote';
import { Polaroid } from './Polaroid';
import { Settle } from './Settle';
import { StreakNumber } from './StreakNumber';

describe('primitives', () => {
  it('Settle renders its children', () => {
    render(<Settle>hello</Settle>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
  it('InkNote renders handwritten text', () => {
    render(<InkNote>made it.</InkNote>);
    expect(screen.getByText('made it.')).toBeInTheDocument();
  });
  it('EnvelopeReveal renders the image with alt text', () => {
    render(<EnvelopeReveal src="/images/macbook-desk.jpg" alt="the desk at 6pm" />);
    expect(screen.getByAltText('the desk at 6pm')).toBeInTheDocument();
  });
  it('Polaroid shows its caption', () => {
    render(<Polaroid src="/images/green-911.jpg" alt="a green 911" caption="the someday car" rotate={1.6} />);
    expect(screen.getByText('the someday car')).toBeInTheDocument();
  });
  it('StreakNumber lands on the target', async () => {
    render(<StreakNumber value={214} />);
    await screen.findByText('214', undefined, { timeout: 3000 });
  });
});
```

- [ ] **Step 2:** Verify FAIL (missing modules), implement the five components per the interfaces above. All tween values from Global Constraints. No new dependencies.
- [ ] **Step 3:** Tests PASS, lint clean. Commit `feat: motion primitives (settle, ink, envelope, polaroid, streak)`.

### Task 4: Hero, nav, hare mark - first visible page

**Files:**
- Create: `src/components/HareMark.tsx`, `src/components/TopNav.tsx`, `src/components/sections/HeroDawn.tsx`
- Modify: `src/App.tsx` (new composition; old sections no longer imported), `src/index.css` (dapple keyframes, `[data-arc]` nav colors), `index.html` (title `bryce.`)
- Test: `src/components/sections/HeroDawn.test.tsx`, `src/components/TopNav.test.tsx`

**Interfaces:**
- Produces: `<HareMark pose='running'|'sitting' className>` - the engraved SVG (paths verbatim from the artboards), all strokes `currentColor`, `aria-hidden`. `<TopNav />` - fixed, hare mark left, anchors `work→#work life→#off-the-clock now→#vibe-board say hi→#after-dark`, colors flip via `html[data-arc='dark']`. `<HeroDawn />` - `<section id="hero" data-waypoint="0">`. App composes `SmoothScroll > MotionConfig > Grain + DayArc + TopNav + main > HeroDawn` (more sections appended by later tasks).

- [ ] **Step 1: Failing tests:**

```tsx
// src/components/sections/HeroDawn.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroDawn } from './HeroDawn';

describe('HeroDawn', () => {
  it('sets the wordmark with the clay full stop', () => {
    render(<HeroDawn />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('bryce.');
  });
  it('carries the subline and the coordinates', () => {
    render(<HeroDawn />);
    expect(screen.getByText(/run before the sun's up/)).toBeInTheDocument();
    expect(screen.getByText('san diego, california')).toBeInTheDocument();
  });
});

// src/components/TopNav.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopNav } from './TopNav';

describe('TopNav', () => {
  it('anchors the four quiet links', () => {
    render(<TopNav />);
    expect(screen.getByRole('link', { name: 'work' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'life' })).toHaveAttribute('href', '#off-the-clock');
    expect(screen.getByRole('link', { name: 'now' })).toHaveAttribute('href', '#vibe-board');
    expect(screen.getByRole('link', { name: 'say hi' })).toHaveAttribute('href', '#after-dark');
  });
});
```

- [ ] **Step 2:** Implement. HeroDawn: full-viewport hero-forest.jpg, gradient + vignette overlays, wordmark `clamp(6rem, 22vw, 20rem)` Bodoni 500 with clay period, subline, mono coordinates between hairlines, Caveat "welcome in" + hand arrow rotated -7deg, two dapple divs (16s/21s alternate keyframes in index.css, killed under `(prefers-reduced-motion: reduce)`), torn paper edge strip at bottom with "follow the trail" + dotted stub, bobbing `scroll ↓`.
- [ ] **Step 3:** Rewrite App per the interface. Tests PASS, lint clean (old section tests still pass untouched).
- [ ] **Step 4:** Browser check via preview: hero renders, fonts load, grain subtle, nav flips color when forced `data-arc='dark'` from devtools. Screenshot.
- [ ] **Step 5:** Commit `feat: hero dawn, top nav, hare mark; recompose App`.

### Task 5: the work + things I've made

**Files:**
- Create: `src/components/sections/WorkSection.tsx`, `src/components/sections/MadeSection.tsx`
- Modify: `src/App.tsx` (append sections)
- Test: `src/components/sections/WorkSection.test.tsx`, `src/components/sections/MadeSection.test.tsx`

**Interfaces:**
- Consumes: `Settle`, `EnvelopeReveal`, `InkNote`, `HareMark`, `projects` from `site.ts`.
- Produces: `<section id="work" data-waypoint="1">` and `<section id="made">` (no waypoint - the trail rests once per chapter cluster; waypoints are hero 0, work 1, off-the-clock 2, vibe 3, after-dark 4/flag).

- [ ] **Step 1: Failing tests:**

```tsx
// WorkSection.test.tsx
it('tells the day job straight', () => {
  render(<WorkSection />);
  expect(screen.getByRole('heading', { name: 'Systems, wired together.' })).toBeInTheDocument();
  expect(screen.getByText(/plumbing nobody notices/)).toBeInTheDocument();
  expect(screen.getByText('workato · myob · deputy · netsuite')).toBeInTheDocument();
});

// MadeSection.test.tsx
it('renders a dot-leader row per project, no cards', () => {
  render(<MadeSection />);
  for (const name of ['arro', 'trace', 'throughline', 'bryce-os']) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
  expect(screen.getByText('a second brain for my late-night coding sessions')).toBeInTheDocument();
  expect(screen.queryAllByRole('link', { name: 'take a look →' })).toHaveLength(
    projectsWithHrefCount, // computed from site.ts in the test
  );
});
```

- [ ] **Step 2:** Implement. Work: label/head/body/tags left, EnvelopeReveal(macbook-desk.jpg, rotate -1.2) right with InkNote "the desk, 6pm" and a small oak HareMark stamp. Made: label `things I've made`, rows: Bodoni 34px name, italic one-liner, flex-grow dotted leader (draws 0→100% on row settle), mono tag, clay link only when `href` exists. Row hover: leader dots nudge and the arrow slides 4px - one quiet micro-interaction, no color flood.
- [ ] **Step 3:** Tests PASS, lint clean, browser check (day-arc paper→golden across these sections). Commit `feat: the work and things I've made sections`.

### Task 6: off the clock, vibe board, after dark

**Files:**
- Create: `src/components/sections/OffTheClockSection.tsx`, `src/components/sections/VibeBoardSection.tsx`, `src/components/sections/AfterDarkSection.tsx`
- Modify: `src/App.tsx` (append; page complete)
- Test: one test file per section

**Interfaces:**
- Consumes: `Settle`, `Polaroid`, `InkNote`, `EnvelopeReveal`, `StreakNumber`, `HareMark`, `vibeCards`, `streakDay`, `email`.
- Produces: `<section id="off-the-clock" data-waypoint="2">`, `<section id="vibe-board" data-waypoint="3">`, `<section id="after-dark" data-waypoint="4">` ending with flag + "end of trail · for now". No Footer component.

- [ ] **Step 1: Failing tests** (same RTL pattern; key assertions):

```tsx
// OffTheClockSection: heading 'Run it in the family.', streak sentence contains StreakNumber,
// '911 · oak green over cognac' figure caption, Caveat 'someday. after the streak hits 1,000'
// VibeBoardSection: heading 'The vibe board.', the four Polaroid captions, note 'sf or nyc · soon'
// AfterDarkSection: heading 'Pull up a chair.', mailto link 'say hi →' with href `mailto:${email}`,
// visible email text, 'end of trail · for now'
```

- [ ] **Step 2:** Implement. Off the clock: rounded-[44px] oak panel, 911 line-art SVG on a rotated paper card (paths from Chapters artboard), streak sentence "Day {StreakNumber 214} and counting." Vibe board: three staggered columns (flex, per-column padding-top), scatter-in via per-card Settle-style variants with rotation from exaggerated to resting, 0.12s stagger. After dark: EnvelopeReveal(campfire-bluehour.jpg, dark cover #14242C) with Caveat overlay "the good part of the day", city-dusk Polaroid "next stop →", paper pill mailto button, sitting HareMark + flag SVG + closing mono line, InkNote "made it."
- [ ] **Step 3:** Tests PASS, lint clean, browser scroll-through: full day-arc dawn→night reads, contrast holds at boundaries (tune mid stops here if the oak panel muddies - adjust `DAY_STOPS` values and update day-arc tests to match in the same commit). Commit `feat: off the clock, vibe board, after dark; page complete`.

### Task 7: Trail geometry lib

**Files:**
- Create: `src/lib/trail.ts`
- Test: `src/lib/trail.test.ts`

**Interfaces:**
- Produces: `buildTrailPath(points: {x: number; y: number}[]): string` - SVG `M/C` string, smooth S-meander through the points (control points at 40% of segment dy, alternating lateral sway); `waypointThresholds(ys: number[], docHeight: number, viewport: number): number[]` - scroll-progress t at which each waypoint counts as reached (y - viewport*0.6, clamped 0..1, divided by max scroll).

- [ ] **Step 1: Failing tests:**

```ts
import { describe, expect, it } from 'vitest';
import { buildTrailPath, waypointThresholds } from './trail';

describe('buildTrailPath', () => {
  it('starts at the first point and visits every point', () => {
    const d = buildTrailPath([{ x: 450, y: 600 }, { x: 90, y: 1500 }, { x: 260, y: 2400 }]);
    expect(d.startsWith('M 450 600')).toBe(true);
    expect(d).toContain('90 1500');
    expect(d).toContain('260 2400');
  });
  it('returns empty string for fewer than 2 points', () => {
    expect(buildTrailPath([{ x: 1, y: 2 }])).toBe('');
  });
});

describe('waypointThresholds', () => {
  it('maps waypoint document positions to 0..1 scroll progress', () => {
    const t = waypointThresholds([0, 2000, 4000], 5000, 1000);
    expect(t[0]).toBe(0);
    expect(t[1]).toBeCloseTo((2000 - 600) / 4000);
    expect(t[2]).toBeLessThanOrEqual(1);
  });
  it('is monotonic', () => {
    const t = waypointThresholds([100, 900, 3000, 4900], 5000, 1000);
    expect([...t].sort((a, b) => a - b)).toEqual(t);
  });
});
```

- [ ] **Step 2:** Verify FAIL, implement, PASS, lint. Commit `feat: trail path + threshold geometry`.

### Task 8: Hare state machine + TrailRunner

**Files:**
- Create: `src/lib/hare-state.ts`, `src/components/TrailRunner.tsx`
- Modify: `src/App.tsx` (mount TrailRunner inside main)
- Test: `src/lib/hare-state.test.ts`

**Interfaces:**
- Produces:
  - `type HareState = {kind:'hidden'} | {kind:'resting'; at:number} | {kind:'sprinting'; from:number; to:number; start:number}`
  - `stepHare(state: HareState, targetWp: number, now: number): HareState` - resting/hidden → sprinting when target differs; sprinting → retarget mid-flight if target changes; `SPRINT_MS = 900` exported.
  - `sprintProgress(state, now): number` 0..1 eased (easeOutCubic).
  - `<TrailRunner />`: desktop-only (`matchMedia('(min-width: 768px)')`), measures `[data-waypoint]` offsets after layout + on resize, builds path via `buildTrailPath` with the artboard's meander x-rail (alternating 90/260-ish x values scaled to container), renders dots up to `pathLength * t * 1.06` (clay, opacity step-in), waypoint stamps as the hare arrives, hare `<HareMark pose={resting ? 'sitting' : 'running'}>` positioned by `getPointAtLength`, flipped when sprinting backward, angle clamped ±24°, `color` = paper when `isDarkAt(t)` else oak. Hidden entirely under reduced motion (dots + stamps all shown, static).

- [ ] **Step 1: Failing tests:**

```ts
import { describe, expect, it } from 'vitest';
import { SPRINT_MS, sprintProgress, stepHare } from './hare-state';

describe('stepHare', () => {
  it('stays hidden before the first waypoint', () => {
    expect(stepHare({ kind: 'hidden' }, -1, 0)).toEqual({ kind: 'hidden' });
  });
  it('sprints when the target moves ahead', () => {
    expect(stepHare({ kind: 'resting', at: 0 }, 1, 1000)).toEqual({ kind: 'sprinting', from: 0, to: 1, start: 1000 });
  });
  it('retargets mid-sprint without restarting from rest', () => {
    const s = stepHare({ kind: 'sprinting', from: 0, to: 1, start: 1000 }, 2, 1200);
    expect(s).toMatchObject({ kind: 'sprinting', to: 2 });
  });
  it('settles to resting when the sprint completes', () => {
    const s = stepHare({ kind: 'sprinting', from: 0, to: 1, start: 0 }, 1, SPRINT_MS + 1);
    expect(s).toEqual({ kind: 'resting', at: 1 });
  });
  it('sprints backward on scroll up', () => {
    expect(stepHare({ kind: 'resting', at: 2 }, 1, 0)).toMatchObject({ kind: 'sprinting', from: 2, to: 1 });
  });
});

describe('sprintProgress', () => {
  it('eases out: past halfway before half time', () => {
    const p = sprintProgress({ kind: 'sprinting', from: 0, to: 1, start: 0 }, SPRINT_MS / 2);
    expect(p).toBeGreaterThan(0.5);
    expect(sprintProgress({ kind: 'sprinting', from: 0, to: 1, start: 0 }, SPRINT_MS)).toBe(1);
  });
});
```

- [ ] **Step 2:** Verify FAIL, implement lib, PASS.
- [ ] **Step 3:** Implement TrailRunner (rAF loop only while sprinting; scroll listener passive; interpolate along path between waypoint lengths, launch stretch `scaleX 1.08` easing to 1, arrival settle). Wire into App.
- [ ] **Step 4:** Browser feel-check, the premium gate: slow scroll → hare waits, then one clean sprint and sits; fling → chained sprint; scroll up → it comes back; never glued to the scrollbar. Iterate timing until it feels like a creature. Screenshot + short observation notes in the commit body.
- [ ] **Step 5:** Full suite + lint. Commit `feat: dash-and-rest hare on the trail`.

### Task 9: Retire the cosmic direction

**Files:**
- Delete: `CosmicBackground GlassCard TiltCard HeroIcosahedron HeroFlowField SubwayMap DossierDialog OpsSection SideQuestSection SystemsSection ArchiveSection CustomCursor IntegrationsRing Chrome Footer SectionHead Hero Reveal` (+ their tests), `src/lib/projects.ts`, `src/lib/use-project-from-url.ts` (+ tests)
- Modify: `package.json` - remove `three @react-three/fiber @react-three/drei @types/three react-use-measure @radix-ui/react-dialog @fontsource/instrument-serif @fontsource/inter @fontsource/jetbrains-mono` and `lucide-react` if unused; `src/test-setup.ts` if it stubs three-specific APIs.

- [ ] **Step 1:** `grep -r` each candidate for lingering imports before deleting; keep anything still referenced (Reveal only if Settle didn't absorb it).
- [ ] **Step 2:** Delete, `npm i` (prunes lockfile), `npm run lint`, `npm test`, `npm run build` - all green.
- [ ] **Step 3:** Browser smoke: full page still renders, no console errors. Commit `chore: retire cosmic components and deps`.

### Task 10: Premium polish pass

**Files:**
- Modify: whatever the pass flags (sections, index.css, DAY_STOPS)

- [ ] **Step 1:** Responsive: mobile (375px) and tablet - trail hidden below md, hero clamp, index rows wrap to two lines, polaroids single staggered column. Fix what breaks.
- [ ] **Step 2:** Reduced-motion pass (emulate via CSS media): everything readable, no stuck covers, no hare.
- [ ] **Step 3:** Craft audit against the premium bar: one clay moment per view, easing consistency, warm shadows, boundary contrast, dead-space rhythm between chapters, favicon (B·R monogram or hare) + meta description + og tags in index.html.
- [ ] **Step 4:** `npm run build && npm run preview` sanity. Full suite + lint. Commit `polish: responsive, reduced-motion, craft audit`.
- [ ] **Step 5:** Desktop + mobile screenshots for Bryce; log the milestone line to `personal-projects/LOG.md` with `$(date +%F)`.
