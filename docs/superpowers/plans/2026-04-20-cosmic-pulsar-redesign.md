# Cosmic Pulsar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's signature visual layer as a cosmic pulsar in deep space: dark gradient backdrop with a constellation monogram, a hybrid pulsar orb (warm core + icy beams), spiral-accretion input flow, and dark glass artifact cards — while preserving all information architecture, state, LLM wiring, and accessibility behavior.

**Architecture:** A new `Starfield` component owns the backdrop (deep-space gradient + SVG starfield + monogram constellation with ignition draw-in). The existing `Orb` component is rewritten internally to render a core + 2 beams while preserving its `OrbHandle` interface and consuming the existing `orbState` / `heat` from the chat store. `absorb.ts` is rewritten to animate letters along a tightening spiral. Surrounding chat/header/artifact CSS flips from warm paper to dark glass with cool borders and warm terracotta punctuation. No changes to the chat state machine, LLM layer, or information architecture.

**Tech Stack:** React 19 + TypeScript, Vite 6, Tailwind v4 (`@theme` tokens in `src/index.css`), Motion (`motion/react`), Zustand (`src/lib/chat.ts`), Vitest + jsdom for `absorb.ts` tests. Pulsar rendering is pure CSS (radial + linear gradients, box-shadow, keyframes). Constellation is an inline SVG with `stroke-dasharray` ignition draw-in. No WebGL, no new deps.

**Reference spec:** [docs/superpowers/specs/2026-04-20-cosmic-pulsar-redesign-design.md](../specs/2026-04-20-cosmic-pulsar-redesign-design.md)

## File map

**Create:**
- `src/components/Starfield/Starfield.tsx` — backdrop (gradient + stars + constellation, ignition draw-in).
- `src/components/Starfield/starfield.css` — styles + ignition keyframes.
- `src/components/Orb/HeatBleed.tsx` — nebula haze layer tied to `heat`.
- `src/lib/absorb.spiral.test.ts` — unit tests for spiral trajectory math.

**Modify:**
- `src/index.css` — palette tokens (add space colors, keep paper+accent), dark body, orb keyframes replaced with pulsar keyframes, scrollbar + focus on dark.
- `src/App.tsx` — mount `Starfield`, replace `IgnitionParticles` with constellation-draw + pulsar-flash sequence.
- `src/components/Orb/Orb.tsx` — render core + 2 beams + `HeatBleed`; drop embers/rim/halo. Preserve `OrbHandle` (`fireShockwave`, `echo`, `getCenter`) and `data-orb-state` / `data-orb-echo` attrs. Remove the cursor-follow lean (`useEffect` in file).
- `src/components/Orb/orb.css` — rewrite for pulsar states + ignition flash.
- `src/lib/absorb.ts` — rewrite trajectory from arc to tightening spiral; color lerp cool→warm; keep exported `absorbLetters(opts)` signature unchanged.
- `src/components/Chat/Message.tsx` — add per-word radial emission on assistant messages as they stream in.
- `src/components/Chat/message.css` — dark treatment; assistant glass bubble; user terracotta-tinted bubble; radial-emission word keyframes.
- `src/components/Chat/input.css` — dark glass input; warm caret; cool focus border.
- `src/components/Chat/chat.css` — dark treatment for chips, greeting, scroll container.
- `src/components/Constellation/constellation.css` — cool dot default, warm hover, on-dark palette.
- `src/components/Header/header.css` — dark treatment (transparent over space, cool divider).
- `src/components/Artifacts/artifacts.css` — dark glass card base, cool border, warm interactive accents.
- `src/components/CursorHalo/cursor-halo.css` — tune opacity for dark bg (halo stays warm).

**Do not touch (confirmed out of scope):**
- `src/lib/chat.ts` (store shape unchanged).
- `src/lib/match.ts` (keyword matching unchanged).
- LLM routes/handlers.
- Routing, analytics, Header component logic.

## Conventions

- Git commit per task. Messages use `feat:` / `refactor:` / `style:` / `test:` prefixes matching the repo's history.
- TDD only where it fits (pure logic in `absorb.ts`). For CSS/visual changes, verify in the browser via `bun run dev` and record the check in the commit.
- `bun run typecheck` must pass after every task that touches TS.
- Run existing tests after any task that modifies shared modules: `bun run test --run`.

---

## Task 1: Palette + dark body tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add space palette tokens and flip the body to dark**

Replace the `@theme` block and `@layer base` body rules in `src/index.css` so the space palette is available while paper/accent remain for text-inside-glass and accents. Keep all existing orb keyframes for now — a later task replaces them.

In `@theme`, keep existing entries and add:

```css
  /* Deep space */
  --color-space-0: #050410;
  --color-space-1: #141428;
  --color-star: #ffffff;
  --color-star-warm: #ffecc4;
  --color-star-cool: #c8e4ff;
  /* Pulsar core */
  --color-core-hot: #ffffff;
  --color-core-mid: #ffd89a;
  /* Beam */
  --color-beam: #c8e4ff;
  --color-beam-deep: #6ba0d8;
```

Replace the `html` and `body` rules in `@layer base`:

```css
  html {
    scroll-behavior: smooth;
    background: var(--color-space-0);
  }

  body {
    background:
      radial-gradient(ellipse at 50% 40%, var(--color-space-1) 0%, var(--color-space-0) 90%);
    color: var(--color-paper);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  ::selection { background: rgba(200, 112, 74, 0.5); color: var(--color-paper); }

  :focus-visible {
    outline: 2px solid var(--color-beam);
    outline-offset: 2px;
    border-radius: 4px;
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: var(--color-space-0); }
  ::-webkit-scrollbar-thumb { background: rgba(200, 228, 255, 0.15); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(200, 228, 255, 0.3); }
```

Also update the mobile `.orb-col` gradient at the bottom of the file (still in this file) from paper cream to space:

```css
    background: linear-gradient(
      to bottom,
      var(--color-space-1) 0%,
      var(--color-space-1) 70%,
      rgba(20, 20, 40, 0) 100%
    );
```

- [ ] **Step 2: Verify typecheck and dev server boots**

Run: `bun run typecheck`
Expected: no errors.

Run: `bun run dev` and load the page. The site text will currently be illegible against the dark background — this is expected; later tasks re-skin the chat/header. Confirm the background is deep space and there are no runtime errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: introduce space palette tokens and dark body"
```

---

## Task 2: Starfield component (static)

**Files:**
- Create: `src/components/Starfield/Starfield.tsx`
- Create: `src/components/Starfield/starfield.css`

- [ ] **Step 1: Write `Starfield.tsx` with a static starfield and constellation (no animation yet)**

```tsx
import { useMemo } from 'react';
import './starfield.css';

type Star = { x: number; y: number; r: number; tone: 'w' | 'warm' | 'cool'; delay: number };

// Deterministic pseudo-random so the starfield is stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Monogram "Br." as star positions on a 100x56.25 viewBox (16:9).
// 8 stars forming the B shape + 1 terracotta period.
const MONOGRAM: { x: number; y: number; tone: 'w' | 'warm' }[] = [
  { x: 8,  y: 20, tone: 'w' },
  { x: 18, y: 32, tone: 'w' },
  { x: 26, y: 40, tone: 'w' },
  { x: 14, y: 46, tone: 'w' },
  { x: 34, y: 14, tone: 'w' },
  { x: 42, y: 24, tone: 'w' },
  { x: 46, y: 36, tone: 'w' },
  { x: 36, y: 48, tone: 'w' },
  { x: 56, y: 48, tone: 'warm' }, // period
];

const MONOGRAM_LINES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3],
  [4, 5], [5, 6], [6, 7],
];

export function Starfield({ ignited }: { ignited: boolean }) {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(42);
    const count = 45;
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      const tone: Star['tone'] = rand() > 0.88 ? 'warm' : rand() > 0.78 ? 'cool' : 'w';
      arr.push({
        x: rand() * 100,
        y: rand() * 56.25,
        r: 0.2 + rand() * 0.5,
        tone,
        delay: rand() * 0.8,
      });
    }
    return arr;
  }, []);

  const toneColor = (t: Star['tone']) =>
    t === 'warm' ? 'var(--color-star-warm)' : t === 'cool' ? 'var(--color-star-cool)' : 'var(--color-star)';

  return (
    <div className="starfield" data-ignited={ignited ? '1' : '0'} aria-hidden="true">
      <svg
        className="starfield-svg"
        viewBox="0 0 100 56.25"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="starfield-stars">
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={toneColor(s.tone)}
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>

        <g className="starfield-constellation">
          <g className="starfield-lines" stroke="rgba(200, 228, 255, 0.25)" strokeWidth="0.12" fill="none">
            {MONOGRAM_LINES.map(([a, b], i) => (
              <line
                key={i}
                x1={MONOGRAM[a].x}
                y1={MONOGRAM[a].y}
                x2={MONOGRAM[b].x}
                y2={MONOGRAM[b].y}
              />
            ))}
          </g>
          <g className="starfield-monogram-stars">
            {MONOGRAM.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.tone === 'warm' ? 0.55 : 0.4}
                fill={s.tone === 'warm' ? 'var(--color-accent)' : 'var(--color-star)'}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Write `starfield.css` (layout + idle twinkle only, ignition hooks in next task)**

```css
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.starfield-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.starfield-stars circle {
  opacity: 0.85;
  animation: star-twinkle 4.5s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 1;   }
}

.starfield-monogram-stars circle {
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.6));
}
```

- [ ] **Step 3: Mount `Starfield` behind the app content**

Modify `src/App.tsx`: import `Starfield` at the top and render it as the first child of the root div, before `CursorHalo`. Pass `ignited` as a prop — it already exists in state.

```tsx
import { Starfield } from '@/src/components/Starfield/Starfield';
// ...
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Starfield ignited={ignited} />
      <CursorHalo />
      {/* rest unchanged */}
```

Also set the root div to allow the starfield's fixed positioning to sit behind content — add an explicit `zIndex: 1` on the existing `<main>` or on the direct children if needed. Actually simplest: give the existing root `<div>` `isolation: 'isolate'` is not needed; the Starfield uses `z-index: 0` and everything else defaults above it. Verify by inspecting in the dev server.

- [ ] **Step 4: Verify in dev server**

Run: `bun run dev`. You should see a dark starfield with a faint constellation visible and the chat UI rendered on top. Text may still be hard to read against dark — that's fine.

- [ ] **Step 5: Commit**

```bash
git add src/components/Starfield src/App.tsx
git commit -m "feat: add Starfield backdrop with monogram constellation"
```

---

## Task 3: Starfield ignition draw-in

**Files:**
- Modify: `src/components/Starfield/starfield.css`

- [ ] **Step 1: Add ignition keyframes**

Append to `src/components/Starfield/starfield.css`:

```css
/* Ignition sequence:
   0.0–0.6s: gradient fades in (handled by body, starfield waits).
   0.6–1.4s: stars fade in (per-star staggered via `animation-delay`).
   1.4–2.2s: constellation lines draw themselves.
   2.2s+:    all idle. */

.starfield[data-ignited='0'] .starfield-stars circle {
  opacity: 0;
  animation: none;
}
.starfield[data-ignited='0'] .starfield-monogram-stars circle { opacity: 0; }
.starfield[data-ignited='0'] .starfield-lines line {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
}

.starfield[data-ignited='1'] .starfield-stars circle {
  animation:
    star-fade-in 0.8s ease-out both,
    star-twinkle 4.5s ease-in-out 1s infinite;
}
.starfield[data-ignited='1'] .starfield-monogram-stars circle {
  animation: star-fade-in 0.4s ease-out 1.2s both;
}
.starfield[data-ignited='1'] .starfield-lines line {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: line-draw 0.6s ease-out 1.4s forwards;
}

@keyframes star-fade-in {
  from { opacity: 0; }
  to   { opacity: 0.85; }
}
@keyframes line-draw {
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .starfield .starfield-stars circle,
  .starfield .starfield-monogram-stars circle { animation: none !important; opacity: 0.85 !important; }
  .starfield .starfield-lines line { stroke-dashoffset: 0 !important; animation: none !important; }
}
```

- [ ] **Step 2: Verify in dev server**

Open `bun run dev`, clear `sessionStorage` in devtools, reload. Stars should fade in over ~0.8s, then constellation lines should draw in over ~0.6s. Toggle `prefers-reduced-motion` in devtools to confirm the instant-appear fallback works.

- [ ] **Step 3: Commit**

```bash
git add src/components/Starfield/starfield.css
git commit -m "feat: animate starfield + constellation draw-in on ignition"
```

---

## Task 4: Replace IgnitionParticles with pulsar-flash sequence

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Delete the `IgnitionParticles` component**

In `src/App.tsx`, remove:
- The bottom `function IgnitionParticles()` block (lines ~94–162).
- The `<IgnitionParticles />` render.
- The unused `motion` import if no longer referenced (the `useReducedMotion` import stays).

- [ ] **Step 2: Extend ignition duration to 2.6s to match the spec sequence**

The existing `duration = reduced ? 400 : 2200;` becomes `reduced ? 400 : 2600;` so `setIgnited(true)` fires after the starfield draw-in has completed and is the signal for the pulsar ignition flash (wired in Task 6).

- [ ] **Step 3: Verify**

Run: `bun run dev` with a fresh session (clear sessionStorage). Load the page — you should see the starfield + constellation ignite cleanly, and the chat UI fades in around the 2.6s mark (the greeting fade-in is already wired in `Chat.tsx`; if the greeting timing feels off, leave it — later re-tune once the pulsar flash lands).

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: remove particle ignition, extend timing for starfield sequence"
```

---

## Task 5: Rewrite Orb to pulsar (core + beams)

**Files:**
- Modify: `src/components/Orb/Orb.tsx`

- [ ] **Step 1: Replace the Orb render tree with the pulsar structure**

Replace the file with:

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useChatStore } from '@/src/lib/chat';
import { HeatBleed } from './HeatBleed';
import './orb.css';

export type OrbHandle = {
  fireShockwave: () => void;
  echo: () => void;
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

  useImperativeHandle(ref, () => ({
    fireShockwave: () => {
      const el = flashRef.current;
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
      }, 520);
    },
    getCenter: () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
  }));

  return (
    <div
      ref={wrapRef}
      className={`orb-wrap ${className ?? ''}`}
      data-orb-state={orbState}
      style={{ '--heat': heat } as CSSProperties}
      aria-hidden="true"
    >
      <HeatBleed />
      <div className="pulsar">
        <div className="pulsar-beam pulsar-beam-1" />
        <div className="pulsar-beam pulsar-beam-2" />
        <div className="pulsar-core" data-orb-core />
      </div>
      <div ref={flashRef} className="pulsar-flash" />
    </div>
  );
});
```

Notes:
- Cursor-follow lean removed per spec.
- `fireShockwave` retargets the new `.pulsar-flash` element — the handle name stays so callers don't change.
- `HeatBleed` is imported from a sibling file (next task).

- [ ] **Step 2: Stub `HeatBleed` so the import resolves (real impl in Task 7)**

Create `src/components/Orb/HeatBleed.tsx`:

```tsx
export function HeatBleed() {
  return <div className="heat-bleed" aria-hidden="true" />;
}
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck`
Expected: pass. (Styles will be broken until Task 6.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Orb/Orb.tsx src/components/Orb/HeatBleed.tsx
git commit -m "refactor: restructure Orb as pulsar (core + beams)"
```

---

## Task 6: Pulsar styles + state transitions + ignition flash

**Files:**
- Modify: `src/components/Orb/orb.css`
- Modify: `src/index.css`

- [ ] **Step 1: Replace `orb.css` with pulsar styles**

Overwrite `src/components/Orb/orb.css`:

```css
.orb-wrap {
  --orb-size: 220px;
  width: var(--orb-size);
  height: var(--orb-size);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1023px) { .orb-wrap { --orb-size: 120px; } }
@media (max-width: 639px)  { .orb-wrap { --orb-size: 90px;  } }

.pulsar {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulsar-core {
  position: relative;
  width: 22%;
  height: 22%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--color-core-hot) 10%,
    var(--color-core-mid) 40%,
    var(--color-accent) 100%
  );
  box-shadow:
    0 0 24px 6px rgba(255, 216, 154, 0.8),
    0 0 60px 18px rgba(200, 112, 74, 0.4);
  z-index: 3;
  animation:
    core-breath 4s ease-in-out infinite,
    core-glow 4s ease-in-out infinite;
  filter: brightness(calc(1 + var(--heat, 0) * 0.25))
    saturate(calc(1 + var(--heat, 0) * 0.35));
  transition: filter 0.4s ease;
  will-change: transform, filter;
}

.pulsar-beam {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3px;
  height: 160%;
  transform-origin: top center;
  background: linear-gradient(
    to bottom,
    rgba(200, 228, 255, 0.9),
    rgba(107, 160, 216, 0) 70%
  );
  filter: blur(2px);
  opacity: 0.55;
  animation: beam-sweep 6s ease-in-out infinite;
  z-index: 2;
  pointer-events: none;
}
.pulsar-beam-1 { transform: translate(-50%, 0) rotate(22deg); }
.pulsar-beam-2 { transform: translate(-50%, 0) rotate(202deg); animation-delay: -3s; }

/* ============ State: typing — beams narrow ============ */
.orb-wrap[data-orb-state='absorbing'] .pulsar-beam { width: 2px; opacity: 0.8; }

/* ============ State: thinking — faster breath, tighter brighter beams ============ */
.orb-wrap[data-orb-state='thinking'] .pulsar-core { animation-duration: 2.5s; }
.orb-wrap[data-orb-state='thinking'] .pulsar-beam { opacity: 0.95; width: 2.5px; }

/* ============ State: responding — warmer core saturation via filter ============ */
.orb-wrap[data-orb-state='responding'] .pulsar-core {
  /* filter driven by --heat already; no structural change */
}

/* ============ Echo (keyword landed): beam flash + core pulse ============ */
.orb-wrap[data-orb-echo='1'] .pulsar-core {
  animation:
    core-breath 4s ease-in-out infinite,
    core-glow 4s ease-in-out infinite,
    echo-pulse 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.orb-wrap[data-orb-echo='1'] .pulsar-beam {
  animation:
    beam-sweep 6s ease-in-out infinite,
    beam-flash 0.35s ease-out;
}

/* ============ Pulsar ignition flash (fireShockwave target) ============ */
.pulsar-flash {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 216, 154, 0) 50%);
}
.pulsar-flash.fire {
  animation: pulsar-flash 700ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .pulsar-core { animation: core-breath 7s ease-in-out infinite !important; }
  .pulsar-beam { animation: none !important; opacity: 0.6 !important; }
  .pulsar-flash.fire { animation: none !important; }
}
```

- [ ] **Step 2: Replace orb keyframes in `src/index.css`**

In `src/index.css`, delete the entire "Orb keyframes (global)" block (from the `@keyframes aura-breathe` through `@keyframes caret-blink`) and replace with:

```css
/* =========================
   Pulsar keyframes (global)
   ========================= */
@keyframes core-breath {
  0%, 100% { transform: scale(1);    }
  50%      { transform: scale(1.08); }
}
@keyframes core-glow {
  0%, 100% {
    box-shadow:
      0 0 20px 4px rgba(255, 216, 154, 0.55),
      0 0 50px 14px rgba(200, 112, 74, 0.25);
  }
  50% {
    box-shadow:
      0 0 28px 8px rgba(255, 216, 154, 0.8),
      0 0 70px 20px rgba(200, 112, 74, 0.4);
  }
}
@keyframes beam-sweep {
  0%, 100% { opacity: 0.4; width: 2px; }
  50%      { opacity: 0.9; width: 4px; }
}
@keyframes beam-flash {
  0%   { opacity: 1; filter: blur(1px) brightness(1.6); }
  100% { opacity: 0.6; filter: blur(2px) brightness(1); }
}
@keyframes echo-pulse {
  0%   { transform: scale(1);     }
  45%  { transform: scale(1.035); }
  100% { transform: scale(1);     }
}
@keyframes pulsar-flash {
  0%   { opacity: 0; transform: scale(0.5); }
  20%  { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(2);   }
}
@keyframes caret-blink { 50% { opacity: 0; } }
```

Also update the reduced-motion section in `src/index.css` to remove the now-orphan `[data-orb-aura]` selector:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 150ms !important;
  }
  [data-orb-core] {
    animation: core-breath 7s ease-in-out infinite !important;
  }
}
```

- [ ] **Step 3: Wire the ignition flash to fire after constellation draw**

Modify `src/App.tsx` — in the `setTimeout` that fires `setIgnited(true)`, also call the orb's `fireShockwave` immediately after a 200ms delay so the flash lands between constellation draw and pulsar idle:

Locate:

```ts
    const timer = setTimeout(() => {
      setIgnited(true);
      markGreeted();
      sessionStorage.setItem(GREETED_KEY, '1');
    }, duration);
```

Replace with:

```ts
    const timer = setTimeout(() => {
      setIgnited(true);
      markGreeted();
      sessionStorage.setItem(GREETED_KEY, '1');
      setTimeout(() => orbRef.current?.fireShockwave(), 0);
    }, duration);
```

- [ ] **Step 4: Typecheck + dev**

Run: `bun run typecheck` → pass.
Run: `bun run dev`. Clear sessionStorage. Reload. You should see: dark space → stars fade in → constellation draws → pulsar flash → pulsar enters idle (slow breath + gentle beam sweep). Submit a test message: orb should go `absorbing` → `thinking` → `responding`, with beam intensity changing per state and the core echo-pulsing per keyword.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/Orb/orb.css src/App.tsx
git commit -m "feat: pulsar orb with state-driven beams + ignition flash"
```

---

## Task 7: HeatBleed nebula layer

**Files:**
- Modify: `src/components/Orb/HeatBleed.tsx`
- Modify: `src/components/Orb/orb.css`

- [ ] **Step 1: Flesh out the HeatBleed component**

Replace `src/components/Orb/HeatBleed.tsx` with:

```tsx
export function HeatBleed() {
  return <div className="heat-bleed" aria-hidden="true" />;
}
```

(Already done — kept for clarity. The real work is in CSS.)

- [ ] **Step 2: Add heat-bleed styles**

Append to `src/components/Orb/orb.css`:

```css
.heat-bleed {
  position: absolute;
  inset: -120%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 216, 154, 0.35) 0%,
    rgba(200, 112, 74, 0.2) 30%,
    rgba(200, 112, 74, 0) 60%
  );
  opacity: 0;
  transition: opacity 800ms ease-out;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  filter: blur(30px);
}

.orb-wrap[data-orb-state='responding'] .heat-bleed,
.orb-wrap[data-orb-state='thinking']   .heat-bleed {
  opacity: calc(0.35 + var(--heat, 0) * 0.65);
  transition: opacity 800ms ease-in;
}

@media (prefers-reduced-motion: reduce) {
  .heat-bleed { transition: opacity 200ms linear !important; }
}
```

- [ ] **Step 3: Verify in dev**

Submit a longer prompt in the chat; the pulsar response should bleed a warm haze outward over ~800ms, then fade ~1.5s after the response completes (driven by `heat` returning to 0 in the existing state machine).

- [ ] **Step 4: Commit**

```bash
git add src/components/Orb/HeatBleed.tsx src/components/Orb/orb.css
git commit -m "feat: heat-bleed nebula layer driven by response heat"
```

---

## Task 8: Spiral accretion — test harness

**Files:**
- Create: `src/lib/absorb.spiral.test.ts`

- [ ] **Step 1: Write the failing test for spiral math**

The trajectory rewrite is in `absorb.ts`. We extract the pure path calculation into a testable helper. First write the test so the helper's shape is pinned.

Create `src/lib/absorb.spiral.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { spiralPath } from './absorb';

describe('spiralPath', () => {
  it('starts at the source point', () => {
    const pts = spiralPath({ sx: 100, sy: 200, tx: 500, ty: 200, steps: 10 });
    expect(pts[0].x).toBeCloseTo(100, 0);
    expect(pts[0].y).toBeCloseTo(200, 0);
  });

  it('ends at the target point', () => {
    const pts = spiralPath({ sx: 100, sy: 200, tx: 500, ty: 200, steps: 10 });
    const last = pts[pts.length - 1];
    expect(last.x).toBeCloseTo(500, 0);
    expect(last.y).toBeCloseTo(200, 0);
  });

  it('returns the requested number of points', () => {
    const pts = spiralPath({ sx: 0, sy: 0, tx: 100, ty: 100, steps: 24 });
    expect(pts).toHaveLength(24);
  });

  it('curves away from a straight line (spiral, not arc)', () => {
    // For a source and target on the same horizontal line,
    // at least one intermediate point should sit meaningfully off the line.
    const pts = spiralPath({ sx: 0, sy: 0, tx: 400, ty: 0, steps: 20 });
    const maxDeviation = Math.max(...pts.slice(1, -1).map((p) => Math.abs(p.y)));
    expect(maxDeviation).toBeGreaterThan(20);
  });

  it('radius monotonically decreases toward target (accretion)', () => {
    const pts = spiralPath({ sx: 0, sy: 0, tx: 400, ty: 0, steps: 20 });
    const tx = 400, ty = 0;
    const radii = pts.map((p) => Math.hypot(p.x - tx, p.y - ty));
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeLessThanOrEqual(radii[i - 1] + 0.001);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test --run src/lib/absorb.spiral.test.ts`
Expected: FAIL — `spiralPath` is not exported from `./absorb`.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/lib/absorb.spiral.test.ts
git commit -m "test: add spiralPath trajectory tests (failing)"
```

---

## Task 9: Spiral accretion — implementation

**Files:**
- Modify: `src/lib/absorb.ts`

- [ ] **Step 1: Replace `absorb.ts` with the spiral implementation**

Overwrite `src/lib/absorb.ts`:

```ts
export type AbsorbOptions = {
  source: HTMLInputElement;
  text: string;
  target: { x: number; y: number };
  onLand?: (charIndex: number, total: number) => void;
  onComplete?: () => void;
  reducedMotion?: boolean;
};

export type SpiralParams = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  steps: number;
  turns?: number; // how many revolutions (default ~1.25)
};

export type Point = { x: number; y: number };

/**
 * Tightening spiral from (sx,sy) to (tx,ty).
 * Radius shrinks linearly; angle sweeps `turns` revolutions.
 * First point is exactly (sx,sy); last point is exactly (tx,ty).
 */
export function spiralPath(params: SpiralParams): Point[] {
  const { sx, sy, tx, ty, steps } = params;
  const turns = params.turns ?? 1.25;

  const dx = sx - tx;
  const dy = sy - ty;
  const r0 = Math.hypot(dx, dy);
  const theta0 = Math.atan2(dy, dx);

  const out: Point[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = r0 * (1 - t);
    const theta = theta0 + turns * Math.PI * 2 * t;
    out.push({
      x: tx + r * Math.cos(theta),
      y: ty + r * Math.sin(theta),
    });
  }
  return out;
}

/**
 * Lift each non-space character from the input's rendered position and
 * animate it along a tightening spiral into the orb center. Color lerps from
 * cool → white → warm as the letter approaches the core. Triggers onLand per
 * landed character.
 */
export function absorbLetters(opts: AbsorbOptions): void {
  const { source, text, target, onLand, onComplete, reducedMotion } = opts;

  if (!text) {
    onComplete?.();
    return;
  }

  if (reducedMotion) {
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
  if (!ctx) {
    onComplete?.();
    return;
  }
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

  if (letters.length === 0) {
    onComplete?.();
    return;
  }

  let landed = 0;
  const total = letters.length;
  const STEPS = 24;

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
      'color:#c8e4ff',
      'line-height:1',
      'will-change:transform,opacity,color',
    ].join(';');
    document.body.appendChild(el);

    const pts = spiralPath({
      sx: L.x,
      sy: L.y,
      tx: target.x,
      ty: target.y,
      steps: STEPS,
      turns: 1.25,
    });

    const keyframes = pts.map((p, k) => {
      const t = k / (STEPS - 1);
      // color lerp: cool #c8e4ff → white #ffffff → warm #ffd89a
      const color =
        t < 0.5
          ? lerpColor([200, 228, 255], [255, 255, 255], t / 0.5)
          : lerpColor([255, 255, 255], [255, 216, 154], (t - 0.5) / 0.5);
      const scale = 1 - t * 0.8; // scales to 0.2 at core
      const opacity = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
      return {
        left: `${p.x}px`,
        top: `${p.y}px`,
        color,
        opacity,
        transform: `scale(${scale})`,
        offset: t,
      } as Keyframe;
    });

    const duration = 1200;
    const delay = i * 50;

    const anim = el.animate(keyframes, {
      duration,
      delay,
      easing: 'cubic-bezier(0.55, 0.05, 0.3, 1)',
      fill: 'forwards',
    });

    anim.onfinish = () => {
      el.remove();
      onLand?.(i, total);
      landed++;
      if (landed === total) onComplete?.();
    };
    anim.oncancel = () => {
      el.remove();
    };
  });
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}
```

- [ ] **Step 2: Run tests**

Run: `bun run test --run src/lib/absorb.spiral.test.ts`
Expected: all 5 tests PASS.

Run: `bun run test --run` (full suite)
Expected: pass. (`absorb.ts` is also called by other chat tests — none existed historically, but verify.)

- [ ] **Step 3: Verify in dev**

Run: `bun run dev`. Type a message in the chat and submit. Each non-space letter should lift from the input and spiral into the pulsar core over ~1.2s, color-shifting cool → warm → fade. Each landed letter should fire an echo (existing hook). Staggered ~50ms.

- [ ] **Step 4: Commit**

```bash
git add src/lib/absorb.ts
git commit -m "feat: rewrite letter absorb as tightening spiral with color lerp"
```

---

## Task 10: Radial emission for assistant words

**Files:**
- Modify: `src/components/Chat/Message.tsx`
- Modify: `src/components/Chat/message.css`

- [ ] **Step 1: Read the current Message component**

Open `src/components/Chat/Message.tsx` and locate the render path for assistant messages (where `segmentByKeywords` output is mapped to `<span class="kw">` and plain text spans). Newly-streamed words should receive a short emission animation on first render.

- [ ] **Step 2: Add an emission wrapper**

The simplest path that avoids tracking streaming state is to add a CSS class `emit` to each assistant-message text node's root span. On mount, the span animates from `(scale: 0.6, opacity: 0, color: warm)` to `(scale: 1, opacity: 1, color: paper)`.

In `Message.tsx`, find the `<p>` or container that renders the assistant body content. Wrap each top-level span/kw child with `className="emit"` or add the class to existing containers. If the content is rendered as a single block (not per-word), wrap each space-delimited word. Pseudo-diff:

```tsx
// Before: <p>{children}</p>
// After:
<p className="assistant-body">
  {renderWithEmission(text, matches)}
</p>
```

Where `renderWithEmission` splits into word spans and keyword spans, applying `className="emit"` to each. If the existing `segmentByKeywords` already returns word-level segments, add `emit` to the mapped spans.

Concretely: in the existing `.map(...)` over segmented tokens, add `className={seg.isKeyword ? 'kw emit' : 'emit'}` to the span.

- [ ] **Step 3: Add emission keyframes and styles**

Append to `src/components/Chat/message.css`:

```css
.assistant-body .emit {
  display: inline-block;
  animation: word-emit 400ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes word-emit {
  0% {
    opacity: 0;
    transform: scale(0.7);
    color: var(--color-core-mid);
    text-shadow: 0 0 8px rgba(255, 216, 154, 0.8);
  }
  60% {
    opacity: 1;
    color: var(--color-core-mid);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    color: inherit;
    text-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .assistant-body .emit { animation: none !important; }
}
```

- [ ] **Step 4: Verify in dev**

Submit a prompt; as the assistant response streams, each word should briefly glow warm then settle to paper cream. Keyword words (already highlighted via `.kw`) should still show the terracotta emphasis in their settled state.

- [ ] **Step 5: Commit**

```bash
git add src/components/Chat/Message.tsx src/components/Chat/message.css
git commit -m "feat: radial word emission for streaming assistant messages"
```

---

## Task 11: Dark restyle — Chat input + messages

**Files:**
- Modify: `src/components/Chat/input.css`
- Modify: `src/components/Chat/message.css`

- [ ] **Step 1: Read current files to preserve structure**

Open both CSS files. Identify the selectors: `.chat-input`, `.chat-input.focused`, the submit button, `.message-user-bubble` (or equivalent user class), `.message-bryce`, `.kw`. Note: class names exactly as they exist — do not rename.

- [ ] **Step 2: Rewrite `input.css` for dark glass**

Replace the color-bearing rules with:

```css
.chat-input {
  background: rgba(250, 247, 242, 0.04);
  border: 1px solid rgba(200, 228, 255, 0.15);
  color: var(--color-paper);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.chat-input::placeholder {
  color: rgba(250, 247, 242, 0.45);
}

.chat-input.focused,
.chat-input:focus-within {
  border-color: rgba(200, 228, 255, 0.45);
  background: rgba(250, 247, 242, 0.06);
}

/* Caret stays warm — the user is the warm body */
.chat-input input {
  caret-color: var(--color-accent);
}

/* Submit button */
.chat-submit {
  background: var(--color-accent);
  color: var(--color-paper);
}
.chat-submit:hover { background: var(--color-accent-deep); }
.chat-submit:disabled { opacity: 0.4; }
```

(Preserve layout/sizing/padding rules — only update color-related declarations. If the selectors differ, adapt to the actual names.)

- [ ] **Step 3: Rewrite `message.css` bubble colors**

Update the user bubble and assistant bubble rules (keep spacing/typography rules untouched):

```css
.message-user-bubble {
  background: rgba(200, 112, 74, 0.15);
  border: 1px solid rgba(200, 112, 74, 0.3);
  color: var(--color-paper);
}

.message-bryce,
.message-assistant {
  background: rgba(250, 247, 242, 0.04);
  border: 1px solid rgba(200, 228, 255, 0.15);
  color: rgba(250, 247, 242, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.kw {
  color: var(--color-accent);
  font-weight: 500;
}
```

(The existing user class might be `.message-user-bubble` or similar — read the file first and match exactly.)

- [ ] **Step 4: Verify in dev**

Input should read as a subtle dark glass panel with cool border, warm caret. User messages should be terracotta-tinted glass. Assistant messages should be neutral cool glass. Keywords should still pop in terracotta.

- [ ] **Step 5: Commit**

```bash
git add src/components/Chat/input.css src/components/Chat/message.css
git commit -m "style: dark glass treatment for chat input + messages"
```

---

## Task 12: Dark restyle — Chat chrome, chips, greeting, Constellation sidebar

**Files:**
- Modify: `src/components/Chat/chat.css`
- Modify: `src/components/Constellation/constellation.css`

- [ ] **Step 1: Update `chat.css`**

Open the file. Topic chips, the greeting, and scroll/container styles all likely reference paper/ink. Update color-bearing rules:

- Greeting display (`.chat-greeting` or similar): `color: var(--color-paper);` opacity `0.92`. Italic display font unchanged.
- Topic chips (`.topic-chip` or similar):

```css
.topic-chip {
  background: rgba(250, 247, 242, 0.04);
  border: 1px solid rgba(200, 228, 255, 0.2);
  color: rgba(250, 247, 242, 0.85);
  backdrop-filter: blur(6px);
}
.topic-chip:hover {
  border-color: var(--color-accent);
  color: var(--color-paper);
  background: rgba(200, 112, 74, 0.1);
}
```

- Scroll container / chat-col: transparent background; preserve existing layout.

Read the file first to get exact class names; adapt the above to what exists.

- [ ] **Step 2: Update `constellation.css`**

The message-history sidebar (`Constellation` component) shows a dot per user message. Flip:

```css
.constellation-dot {
  background: rgba(200, 228, 255, 0.5);
  border: 1px solid rgba(200, 228, 255, 0.25);
}
.constellation-dot:hover,
.constellation-dot.active {
  background: var(--color-accent);
  border-color: var(--color-accent-deep);
}
.constellation-line {
  background: rgba(200, 228, 255, 0.15);
}
```

Adapt to exact selectors.

- [ ] **Step 3: Verify in dev**

Greeting, chips, and sidebar should all read cleanly on the dark space background. Chips should get a warm outline/tint on hover. Sidebar dots cool at rest, warm on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/Chat/chat.css src/components/Constellation/constellation.css
git commit -m "style: dark treatment for chat chrome and message constellation"
```

---

## Task 13: Dark restyle — Header + CursorHalo

**Files:**
- Modify: `src/components/Header/header.css`
- Modify: `src/components/CursorHalo/cursor-halo.css`

- [ ] **Step 1: Update `header.css`**

Read first. Update color rules:

```css
.site-header {
  background: linear-gradient(to bottom, rgba(5, 4, 16, 0.7), rgba(5, 4, 16, 0));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-paper);
  border-bottom: 1px solid rgba(200, 228, 255, 0.1);
}

.site-header a,
.site-header button {
  color: rgba(250, 247, 242, 0.85);
}
.site-header a:hover,
.site-header button:hover {
  color: var(--color-accent);
}

.site-header .wordmark {
  color: var(--color-paper);
}
```

Adapt to actual selectors.

- [ ] **Step 2: Update `cursor-halo.css`**

Halo stays warm per spec. Just confirm opacity reads on dark — typical adjustment:

```css
.cursor-halo {
  background: radial-gradient(
    circle,
    rgba(244, 201, 163, 0.22) 0%,
    rgba(200, 112, 74, 0.12) 35%,
    rgba(200, 112, 74, 0) 70%
  );
  mix-blend-mode: screen;
}
```

(Read the file first and update only the gradient / blend mode if needed.)

- [ ] **Step 3: Verify in dev**

Header should feel like a soft dark pane floating above space, with cool-shaded links that warm on hover. Cursor halo should glow warm on the dark backdrop without looking muddy.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/header.css src/components/CursorHalo/cursor-halo.css
git commit -m "style: dark header and tuned cursor halo for deep-space backdrop"
```

---

## Task 14: Dark restyle — Artifact cards

**Files:**
- Modify: `src/components/Artifacts/artifacts.css`

- [ ] **Step 1: Identify card base class**

Read `src/components/Artifacts/artifacts.css`. Artifact cards (resume, project carousel, contact, role, stack strip) likely share a base class like `.artifact-card` or per-type classes. Keep layout, flip chrome:

```css
.artifact-card,
.artifact {
  background: rgba(250, 247, 242, 0.04);
  border: 1px solid rgba(200, 228, 255, 0.15);
  color: var(--color-paper);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.artifact-card h1,
.artifact-card h2,
.artifact-card h3,
.artifact-card .heading {
  color: var(--color-paper);
}

.artifact-card p,
.artifact-card li,
.artifact-card .body {
  color: rgba(250, 247, 242, 0.88);
}

/* Interactive accents — terracotta */
.artifact-card a,
.artifact-card button.primary {
  color: var(--color-accent);
}
.artifact-card a:hover,
.artifact-card button.primary:hover {
  color: var(--color-accent-soft);
}
.artifact-card button.active,
.artifact-card .chip.active {
  background: rgba(200, 112, 74, 0.15);
  border-color: var(--color-accent);
  color: var(--color-paper);
}

/* Dividers / lines */
.artifact-card hr,
.artifact-card .divider {
  border-color: rgba(200, 228, 255, 0.12);
}
```

Adapt to actual class names found in the file — the above is a template. Preserve spacing/radius/typography.

- [ ] **Step 2: Verify in dev**

Trigger each topic chip (what do you build / your stack / recent work / contact) and inspect each artifact: all should render as thin cool-bordered glass panels with terracotta interactive elements and readable cream body text.

- [ ] **Step 3: Commit**

```bash
git add src/components/Artifacts/artifacts.css
git commit -m "style: dark glass treatment for artifact cards"
```

---

## Task 15: Constellation sidebar rename (optional, disambiguation)

**Files:**
- Modify: `src/components/Constellation/` directory (optional rename)

- [ ] **Step 1: Decide whether to rename**

Per the spec's open question: "constellation" now means the backdrop monogram. The sidebar component is also called `Constellation`. Evaluate: is the name collision confusing in the codebase? If yes, rename to `MessageTrail`; if the component is small and rarely touched, keep.

If keeping: skip to Task 16 — no work needed.

If renaming:

- [ ] **Step 2: Rename files and class prefix**

- Rename directory `src/components/Constellation/` → `src/components/MessageTrail/`.
- Rename `Constellation.tsx` → `MessageTrail.tsx`, `constellation.css` → `message-trail.css`.
- Inside, rename the exported component and class prefix (`constellation-dot` → `message-trail-dot`, etc.).
- Update the import in `src/App.tsx`.

- [ ] **Step 3: Typecheck + dev + commit**

```bash
bun run typecheck
bun run dev
git add -A
git commit -m "refactor: rename Constellation sidebar to MessageTrail"
```

---

## Task 16: Cleanup + final pass

**Files:**
- Varies — audit only.

- [ ] **Step 1: Search for orphan references**

Run these searches to find anything still pointing at the old warm-paper visual layer:

```bash
rg --no-heading 'orb-aura|orb-halo|orb-ember|orb-rim|IgnitionParticles|flash-inward' src
```

Expected: no matches in `src/`. (Any remaining reference is dead code — delete it.)

Also search for stray hex colors that should be tokens:

```bash
rg --no-heading '#faf7f2|#1f1d1a|#c8704a' src --glob '!*.md'
```

Expected: most hits are inside CSS token fallbacks or the pulsar color stops — review each and replace with the corresponding var where sensible.

- [ ] **Step 2: Run the full test suite + typecheck + build**

```bash
bun run test --run
bun run typecheck
bun run build
```

All three must pass.

- [ ] **Step 3: Manual QA pass in `bun run dev`**

Walk through:
1. Fresh session: ignition (starfield fade → constellation draw → pulsar flash → idle). ✓
2. Returning session (reload without clearing storage): instant idle, no ignition. ✓
3. Type a message: pulsar enters `absorbing`, letters spiral into core, per-letter echo visible. ✓
4. Wait for response: pulsar enters `thinking` (faster breath, tighter beams), then `responding`. ✓
5. Response streams: words emit warm → cool; heat-bleed haze visible; keyword echo pulses core. ✓
6. Click each topic chip: artifact cards render as dark glass. ✓
7. Resize to mobile: orb column collapses to top band; pulsar scales down; beams don't overflow. ✓
8. Toggle `prefers-reduced-motion` in devtools: ignition is instant; orb idle-pulses only; spiral skipped (instant land). ✓
9. Tab focus through inputs: focus ring is cool, clearly visible on dark. ✓

- [ ] **Step 4: Commit any cleanup**

```bash
git add -A
git commit -m "chore: remove orphan warm-ember references"
```

- [ ] **Step 5: Final push (only if user has explicitly approved)**

`git push` — confirm with user first.

---

## Self-review notes

**Spec coverage check:**
- Background (space gradient + starfield + constellation monogram): Tasks 2, 3. ✓
- Orb hybrid pulsar (core + 2 beams + aura): Tasks 5, 6. ✓
- Observatory behavior state table: Task 6 state selectors. ✓
- Spiral accretion input: Tasks 8, 9. ✓
- Radial emission output: Task 10. ✓
- Palette tokens: Task 1. ✓
- Heat-bleed nebula: Task 7. ✓
- Ignition sequence: Tasks 3, 4, 6. ✓
- Artifact cards dark glass: Task 14. ✓
- User bubble terracotta-tint decision: Task 11. ✓
- Warm cursor halo preserved: Task 13. ✓
- Reduced motion throughout: Tasks 3, 6, 7, 9, 10. ✓
- `sessionStorage` ignition: Task 4 preserves existing behavior. ✓
- `OrbHandle` interface preservation: Task 5. ✓
- `chat.ts` store untouched: explicit in conventions. ✓
- Constellation sidebar rename: Task 15 (optional). ✓

**Non-placeholder check:** Every code step includes the code to write. CSS restyle tasks (11–14) say "adapt to actual class names" because I haven't read those files yet — the engineer must read them first. This is a deliberate instruction, not a placeholder.

**Type/method consistency:** `OrbHandle` (`fireShockwave`, `echo`, `getCenter`) same across Tasks 5, 6. `spiralPath` / `absorbLetters` signatures identical between Tasks 8 and 9. `HeatBleed` component created in Task 5, styled in Task 7.
