# Spatial Archive Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Apple-style React portfolio with a faithful React port of `Archive.html` — dark glass-cosmic aesthetic, Lenis smooth scroll, R3F hero icosahedron, scroll-tied motion accents, and URL-synced project dossiers.

**Architecture:** Single-page Vite + React 19 app. `<ReactLenis root>` wraps the tree to own scroll. A fixed `CosmicBackground` (radial bloom + grid + noise) sits below all content. Sections compose from a small set of primitives: `GlassCard`, `Reveal`, `TiltCard`, `SectionHead`. All project data flows from `src/lib/projects.ts`; the dossier modal opens via URL state (`?project=<slug>`). Three.js loads in its own chunk via lazy import.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind v4, `motion`, `lenis`, `three` + `@react-three/fiber` + `@react-three/drei`, `@radix-ui/react-dialog`, `@fontsource/{inter,instrument-serif,jetbrains-mono}`, Vitest + Testing Library.

**Spec:** [`docs/superpowers/specs/2026-04-27-archive-redesign-design.md`](../specs/2026-04-27-archive-redesign-design.md)

---

## Task 1: Wipe the existing Apple-style components

**Files:**
- Delete: `src/components/Hero.tsx`, `src/components/Hero.test.tsx`
- Delete: `src/components/Work.tsx`, `src/components/Work.test.tsx`
- Delete: `src/components/Projects.tsx`, `src/components/Projects.test.tsx`
- Delete: `src/components/Stack.tsx`, `src/components/Stack.test.tsx`
- Delete: `src/components/Contact.tsx`, `src/components/Contact.test.tsx`
- Delete: `src/components/Footer.tsx`, `src/components/Footer.test.tsx`
- Delete: `src/components/Nav.tsx`, `src/components/Nav.test.tsx`
- Delete: `src/components/MobileMenu.tsx`
- Delete: `src/components/AppleButton.tsx`, `src/components/AppleButton.test.tsx`
- Delete: `src/components/FadeIn.tsx`, `src/components/FadeIn.test.tsx`
- Delete: `src/components/ui/sheet.tsx`
- Delete: `src/lib/content.ts`, `src/lib/projects-progress.ts`, `src/lib/projects-progress.test.ts`
- Delete: `src/App.test.tsx`
- Modify: `src/App.tsx` (replace with empty shell)
- Modify: `src/index.css` (clear out Apple tokens; keep `@import "tailwindcss";` only)
- Keep: `src/lib/utils.ts`, `src/main.tsx`, `src/test-setup.ts`, `index.html`

- [ ] **Step 1: Delete the Apple component files**

```bash
rm src/components/Hero.tsx src/components/Hero.test.tsx
rm src/components/Work.tsx src/components/Work.test.tsx
rm src/components/Projects.tsx src/components/Projects.test.tsx
rm src/components/Stack.tsx src/components/Stack.test.tsx
rm src/components/Contact.tsx src/components/Contact.test.tsx
rm src/components/Footer.tsx src/components/Footer.test.tsx
rm src/components/Nav.tsx src/components/Nav.test.tsx
rm src/components/MobileMenu.tsx
rm src/components/AppleButton.tsx src/components/AppleButton.test.tsx
rm src/components/FadeIn.tsx src/components/FadeIn.test.tsx
rm src/components/ui/sheet.tsx
rmdir src/components/ui
rm src/lib/content.ts src/lib/projects-progress.ts src/lib/projects-progress.test.ts
rm src/App.test.tsx
```

- [ ] **Step 2: Replace `src/App.tsx` with empty shell**

```tsx
export default function App() {
  return <div>Archive redesign — under construction</div>;
}
```

- [ ] **Step 3: Reset `src/index.css` to bare Tailwind import**

```css
@import "tailwindcss";
```

- [ ] **Step 4: Run typecheck and tests to confirm clean state**

Run: `npm run lint && npm test`
Expected: typecheck passes, vitest reports `passWithNoTests: true` (no tests exist yet).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Apple-style components for Archive redesign"
```

---

## Task 2: Install dependencies and add design tokens

**Files:**
- Modify: `package.json` (deps via `npm install`)
- Modify: `src/index.css` (add full token block + font imports + base body styles)
- Create: `src/components/.gitkeep` (preserve dir if needed)

- [ ] **Step 1: Install runtime deps**

```bash
npm install lenis@^1.1.13 three@^0.171.0 @react-three/fiber@^8.17.10 @react-three/drei@^9.114.6 @fontsource/inter@^5.1.1 @fontsource/instrument-serif@^5.1.1 @fontsource/jetbrains-mono@^5.1.2
npm install --save-dev @types/three@^0.171.0
```

Expected: clean install, no peer-dep warnings beyond React 19 advisories from drei (acceptable).

- [ ] **Step 2: Replace `src/index.css` with full token block**

```css
@import "tailwindcss";

@import "@fontsource/inter/300.css";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/instrument-serif/400.css";
@import "@fontsource/instrument-serif/400-italic.css";
@import "@fontsource/jetbrains-mono/300.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";
@import "@fontsource/jetbrains-mono/600.css";

@theme {
  --color-bg: #000000;
  --color-ink: #ffffff;
  --color-ink-2: rgba(255, 255, 255, 0.72);
  --color-ink-3: rgba(255, 255, 255, 0.48);
  --color-ink-4: rgba(255, 255, 255, 0.28);
  --color-hair: rgba(255, 255, 255, 0.08);
  --color-hair-2: rgba(255, 255, 255, 0.14);
  --color-glass: rgba(255, 255, 255, 0.02);
  --color-glass-2: rgba(255, 255, 255, 0.035);

  --color-slate: 56 189 248;
  --color-good: 134 239 172;
  --color-warn: 245 158 11;
  --color-purple: 168 85 247;

  --font-serif: "Instrument Serif", Times, serif;
  --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
}

:root {
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { background: #000; }

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

::selection {
  background: rgba(56, 189, 248, 0.35);
  color: #fff;
}

a { color: inherit; text-decoration: none; }
h1, h2, h3, h4, h5, h6 { margin: 0; font-weight: 400; letter-spacing: -0.01em; }
p { margin: 0; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

:focus-visible {
  outline: 2px solid rgb(56 189 248);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 3: Confirm dev server boots**

Run: `npm run dev`
Expected: server starts on :3000, `http://localhost:3000` renders the placeholder text on a black background with Inter font visible. Stop the server.

- [ ] **Step 4: Run lint and tests**

Run: `npm run lint && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/index.css
git commit -m "feat: add lenis, three, R3F, fontsource deps and design tokens"
```

---

## Task 3: Create the `cn` re-export and verify utils

**Files:**
- Modify: `src/lib/utils.ts` (verify exports)

- [ ] **Step 1: Read existing `src/lib/utils.ts`**

Verify it exports `cn(...)` (clsx + tailwind-merge). If not, replace with:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 3: No commit if no change needed.** If the file was already correct, skip commit. Otherwise:

```bash
git add src/lib/utils.ts
git commit -m "chore: ensure cn helper exports"
```

---

## Task 4: Build the `Reveal` primitive (TDD)

**Files:**
- Create: `src/components/Reveal.tsx`
- Create: `src/components/Reveal.test.tsx`

`<Reveal>` wraps any children, animates them from `opacity:0 / blur(10px) / translateY(14px)` to visible when their bounds enter the viewport, then locks. `delay` prop is `0..6` mapping to 80ms steps (matching Archive's `data-delay`).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Reveal.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('renders children inside an animated wrapper', () => {
    render(<Reveal><span>hello world</span></Reveal>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('accepts a delay prop without crashing', () => {
    render(<Reveal delay={3}><span>delayed content</span></Reveal>);
    expect(screen.getByText('delayed content')).toBeInTheDocument();
  });

  it('renders with a wrapper element when no `as` prop is given', () => {
    const { container } = render(<Reveal><p>x</p></Reveal>);
    // Wrapper div should exist
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Reveal`
Expected: FAIL ("Cannot find module './Reveal'").

- [ ] **Step 3: Implement `Reveal`**

```tsx
// src/components/Reveal.tsx
import { motion, useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

const EASE = [0.2, 0.7, 0.2, 1] as const;

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : undefined}
      transition={{ duration: 1.2, ease: EASE, delay: delay * 0.08 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Reveal`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Reveal.tsx src/components/Reveal.test.tsx
git commit -m "feat: add Reveal primitive for blur-up viewport animations"
```

---

## Task 5: Build the `GlassCard` primitive (TDD)

**Files:**
- Create: `src/components/GlassCard.tsx`
- Create: `src/components/GlassCard.test.tsx`

The "one true card." Renders a glass-style container with backdrop blur, hairline border, and a hover spotlight that follows the cursor via CSS variables `--mx`/`--my`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/GlassCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard><p>card body</p></GlassCard>);
    expect(screen.getByText('card body')).toBeInTheDocument();
  });

  it('applies className overrides', () => {
    const { container } = render(<GlassCard className="custom-x"><p>x</p></GlassCard>);
    expect(container.firstChild).toHaveClass('custom-x');
  });

  it('passes through `as` element type', () => {
    render(<GlassCard as="article"><p>art</p></GlassCard>);
    expect(screen.getByText('art').closest('article')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- GlassCard`
Expected: FAIL ("Cannot find module './GlassCard'").

- [ ] **Step 3: Implement `GlassCard`**

```tsx
// src/components/GlassCard.tsx
import { type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/utils';

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function GlassCard({ children, as: Tag = 'div', className, ...rest }: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'glass-card relative overflow-hidden rounded-[20px] border transition-all duration-300',
        className,
      )}
      style={{
        background: 'var(--color-glass)',
        backdropFilter: 'blur(30px) saturate(160%)',
        WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        borderColor: 'var(--color-hair-2)',
        boxShadow: '0 0 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

Add the supporting `::before` and `::after` styles to `src/index.css` (append at the end of the file):

```css
.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 30%);
  pointer-events: none;
}

.glass-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(56, 189, 248, 0.12), transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.glass-card:hover { border-color: rgba(255, 255, 255, 0.20); }
.glass-card:hover::after { opacity: 1; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- GlassCard`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/GlassCard.tsx src/components/GlassCard.test.tsx src/index.css
git commit -m "feat: add GlassCard primitive with hover spotlight"
```

---

## Task 6: Build the `TiltCard` primitive

**Files:**
- Create: `src/components/TiltCard.tsx`
- Create: `src/components/TiltCard.test.tsx`

Wraps any child with pointer-driven 3D tilt and updates `--mx`/`--my` CSS vars for the GlassCard spotlight. Disabled on touch and `prefers-reduced-motion`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/TiltCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TiltCard } from './TiltCard';

describe('TiltCard', () => {
  it('renders children', () => {
    render(<TiltCard><span>tilt me</span></TiltCard>);
    expect(screen.getByText('tilt me')).toBeInTheDocument();
  });

  it('updates --mx and --my on pointer move', () => {
    const { container } = render(<TiltCard><span>x</span></TiltCard>);
    const wrapper = container.firstChild as HTMLElement;
    // Mock getBoundingClientRect for predictability
    wrapper.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    fireEvent.pointerMove(wrapper, { clientX: 50, clientY: 50, pointerType: 'mouse' });
    expect(wrapper.style.getPropertyValue('--mx')).toBe('50%');
    expect(wrapper.style.getPropertyValue('--my')).toBe('50%');
  });

  it('resets transform on pointer leave', () => {
    const { container } = render(<TiltCard><span>x</span></TiltCard>);
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.pointerLeave(wrapper);
    expect(wrapper.style.transform).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- TiltCard`
Expected: FAIL.

- [ ] **Step 3: Implement `TiltCard`**

```tsx
// src/components/TiltCard.tsx
import { useRef, type ReactNode, type PointerEvent } from 'react';
import { cn } from '../lib/utils';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);

    const rx = (0.5 - y) * maxTilt;
    const ry = (x - 0.5) * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }

  return (
    <div
      ref={ref}
      className={cn('tilt-card', className)}
      style={{ transition: 'transform 0.35s ease', transformStyle: 'preserve-3d' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- TiltCard`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TiltCard.tsx src/components/TiltCard.test.tsx
git commit -m "feat: add TiltCard primitive with pointer 3D tilt"
```

---

## Task 7: Build the `SectionHead` primitive

**Files:**
- Create: `src/components/SectionHead.tsx`
- Create: `src/components/SectionHead.test.tsx`

Renders the numbered section heading pattern from Archive: `01 / Archive` micro-label on the left, big serif H2 + description on the right.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/SectionHead.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHead } from './SectionHead';

describe('SectionHead', () => {
  it('renders the section number, title, and description', () => {
    render(
      <SectionHead
        num="01 / Archive"
        title={<>Selected artifacts<br />from the workbench.</>}
        description="// Four production systems."
        headingId="arch-h"
      />,
    );
    expect(screen.getByText('01 / Archive')).toBeInTheDocument();
    expect(screen.getByText('// Four production systems.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 }).id).toBe('arch-h');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SectionHead`
Expected: FAIL.

- [ ] **Step 3: Implement `SectionHead`**

```tsx
// src/components/SectionHead.tsx
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadProps = {
  num: string;
  title: ReactNode;
  description: string;
  headingId: string;
};

export function SectionHead({ num, title, description, headingId }: SectionHeadProps) {
  return (
    <Reveal>
      <div className="section-head grid gap-7 mb-8 md:grid-cols-[80px_1fr] md:gap-7 md:items-baseline">
        <div
          className="section-num font-mono text-[10.5px] font-medium uppercase"
          style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}
        >
          {num}
        </div>
        <div>
          <h2
            id={headingId}
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4vw, 56px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
            }}
          >
            {title}
          </h2>
          <p
            className="mt-3 font-mono text-[12px]"
            style={{ color: 'var(--color-ink-3)', letterSpacing: '0.04em' }}
          >
            {description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- SectionHead`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionHead.tsx src/components/SectionHead.test.tsx
git commit -m "feat: add SectionHead primitive"
```

---

## Task 8: Build `CosmicBackground`

**Files:**
- Create: `src/components/CosmicBackground.tsx`
- Create: `src/components/CosmicBackground.test.tsx`

Fixed-position background: pure-black base + radial bloom + faint grid + noise overlay. `aria-hidden="true"`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/CosmicBackground.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CosmicBackground } from './CosmicBackground';

describe('CosmicBackground', () => {
  it('renders a fixed, aria-hidden background stage', () => {
    const { container } = render(<CosmicBackground />);
    const stage = container.firstChild as HTMLElement;
    expect(stage).toHaveAttribute('aria-hidden', 'true');
    expect(stage.className).toContain('cosmic-bg');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- CosmicBackground`
Expected: FAIL.

- [ ] **Step 3: Implement `CosmicBackground`**

```tsx
// src/components/CosmicBackground.tsx
export function CosmicBackground() {
  return (
    <div className="cosmic-bg fixed inset-0 -z-0 pointer-events-none" aria-hidden="true">
      <div className="cosmic-bloom absolute inset-0" />
      <div className="cosmic-grid absolute inset-0" />
      <div className="cosmic-noise absolute inset-0" />
    </div>
  );
}
```

Append CSS to `src/index.css`:

```css
.cosmic-bg { background: #000; }

.cosmic-bloom {
  background:
    radial-gradient(1100px 700px at 50% -10%, rgba(56, 189, 248, 0.16), transparent 70%),
    radial-gradient(800px 600px at 85% 30%, rgba(168, 85, 247, 0.06), transparent 60%),
    radial-gradient(700px 500px at 10% 70%, rgba(56, 189, 248, 0.05), transparent 60%);
}

.cosmic-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(900px 700px at 50% 30%, #000 30%, transparent 80%);
  mask-image: radial-gradient(900px 700px at 50% 30%, #000 30%, transparent 80%);
}

.cosmic-noise {
  opacity: 0.4;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- CosmicBackground`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CosmicBackground.tsx src/components/CosmicBackground.test.tsx src/index.css
git commit -m "feat: add fixed cosmic background (bloom + grid + noise)"
```

---

## Task 9: Build `Chrome` (top floating navigation)

**Files:**
- Create: `src/components/Chrome.tsx`
- Create: `src/components/Chrome.test.tsx`

Fixed top bar with the `BR` mark on the left and pill-style nav links on the right. Links scroll-to in-page anchors. Hidden on mobile (≤720px).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Chrome.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chrome } from './Chrome';

describe('Chrome', () => {
  it('renders the brand mark and the four section links', () => {
    render(<Chrome />);
    expect(screen.getByText(/BR/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /archive/i })).toHaveAttribute('href', '#archive');
    expect(screen.getByRole('link', { name: /systems/i })).toHaveAttribute('href', '#systems');
    expect(screen.getByRole('link', { name: /concept/i })).toHaveAttribute('href', '#sidequest');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Chrome`
Expected: FAIL.

- [ ] **Step 3: Implement `Chrome`**

```tsx
// src/components/Chrome.tsx
export function Chrome() {
  return (
    <div className="chrome fixed top-4 inset-x-0 z-50 flex items-center justify-between px-6 pointer-events-none">
      <a
        href="#top"
        className="chrome-mark pointer-events-auto inline-flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono text-[11px] font-medium"
        style={{
          letterSpacing: '0.04em',
          color: 'var(--color-ink-2)',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid var(--color-hair-2)',
        }}
      >
        <span
          className="chrome-glyph grid place-items-center w-[18px] h-[18px] rounded-md font-serif italic text-[13px] leading-none text-white"
          style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.5), rgba(255,255,255,0.05))' }}
        >
          BR
        </span>
        BRYCE&nbsp;RAMBACH
      </a>

      <nav
        className="chrome-links pointer-events-auto hidden md:inline-flex gap-1 p-1.5 rounded-[14px] font-mono text-[11px] font-medium"
        style={{
          letterSpacing: '0.04em',
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid var(--color-hair-2)',
        }}
      >
        {[
          ['ARCHIVE', '#archive'],
          ['SYSTEMS', '#systems'],
          ['CONCEPT', '#sidequest'],
          ['CONTACT', '#contact'],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="chrome-link px-2.5 py-1.5 rounded-[9px] transition-colors"
            style={{ color: 'var(--color-ink-2)' }}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
```

Append to `src/index.css`:

```css
.chrome-link:hover { color: var(--color-ink); background: rgba(255, 255, 255, 0.04); }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Chrome`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Chrome.tsx src/components/Chrome.test.tsx src/index.css
git commit -m "feat: add fixed Chrome top nav"
```

---

## Task 10: Build `Footer`

**Files:**
- Create: `src/components/Footer.tsx`
- Create: `src/components/Footer.test.tsx`

Three pieces of micro-text in a row.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the three footer items', () => {
    render(<Footer />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByText(/BUILT SOLO/i)).toBeInTheDocument();
    expect(screen.getByText(/v\.4\.0/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Footer`
Expected: FAIL.

- [ ] **Step 3: Implement `Footer`**

```tsx
// src/components/Footer.tsx
export function Footer() {
  return (
    <footer
      className="relative z-10 max-w-[1280px] mx-auto px-6 py-10 flex flex-wrap gap-x-6 gap-y-2 justify-between font-mono text-[10.5px]"
      style={{ color: 'var(--color-ink-4)', letterSpacing: '0.12em' }}
    >
      <span>© 2026 BRYCE&nbsp;RAMBACH</span>
      <span>BUILT&nbsp;SOLO · NEXT.JS · CLAUDE</span>
      <span>v.4.0 / spatial</span>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Footer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "feat: add Footer"
```

---

## Task 11: Define the `Project` type and `PROJECTS` data

**Files:**
- Create: `src/lib/projects.ts`
- Create: `src/lib/projects.test.ts`

Single source of truth for every project on the page. Each entry includes bento card copy AND placeholder dossier copy. Art components are imported as type references; we'll fill them in as `null` placeholders for now and wire real components in later tasks.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/projects.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- projects`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/projects.ts`**

```ts
// src/lib/projects.ts
import type { ComponentType } from 'react';

export type ProjectStatus = 'in-production' | 'shipping' | 'concept' | 'recursive';

export type ProjectKind =
  | 'FLAGSHIP'
  | 'PRACTICE'
  | 'FLEET'
  | 'META'
  | 'CONCEPT'
  | 'PRODUCTION';

export type BentoSlot = 'feat' | 'tall' | 'wide' | 'side' | 'full';

export type Project = {
  slug: string;
  index: string;
  kind: ProjectKind;
  status: ProjectStatus;
  kicker: string;
  title: string;
  cardBody: string;
  tags: string[];
  bentoSlot: BentoSlot;
  /** Optional inline art component for the bento card. Wired in later tasks. */
  art?: ComponentType;
  dossier: {
    overview: string;
    decisions: { title: string; body: string }[];
    stack: { label: string; values: string[] }[];
    role: string;
    timeline: string;
    outcomes: string[];
    links?: { label: string; href: string }[];
  };
};

// TODO: real copy from Bryce — placeholder dossiers below.
export const PROJECTS: Project[] = [
  {
    slug: 'dd-portal',
    index: 'A.01',
    kind: 'FLAGSHIP',
    status: 'in-production',
    kicker: 'Solo-built · 2025–Present',
    title: 'Digital Directions Client Portal',
    cardBody:
      'Full-stack production application monitoring 10+ live enterprise integrations in real time. Replaced scattered manual workflows and became the company-wide operations dashboard. Built solo at twenty.',
    tags: ['Next.js 15', 'TypeScript', 'Drizzle ORM', 'Postgres', 'Claude API', 'Resend'],
    bentoSlot: 'feat',
    dossier: {
      overview:
        'The Client Portal is the operational nerve center for Digital Directions — a single Next.js 15 app that surfaces real-time integration health, incident triage, and AI-summarized run logs across every customer environment. Before the portal, the team coordinated through scattered spreadsheets, Slack pings, and direct database queries; the portal collapsed all of that into one operator-grade surface and became the company-wide source of truth within its first quarter in production.\n\nIt was designed and built solo, end-to-end: schema, server, client, design system, and operations. It is the artifact this archive most centers on.',
      decisions: [
        { title: 'Postgres-as-truth, not the integration platform', body: 'All sync events, retries, and incident records live in our own Postgres rather than being inferred from the upstream platforms. This makes our health views deterministic and our incident timelines reconstructable.' },
        { title: 'Drizzle over an ORM', body: 'Drizzle gives us type-safe SQL without prescribing a query API. We keep the SQL we write readable and join it with the runtime code that owns it.' },
        { title: 'Claude as a triage surface, not a chatbot', body: 'AI is wired into specific operator surfaces — error summaries, change explanations, runbook generation — rather than offered as an open conversation. Every AI surface has an obvious operator action attached.' },
        { title: 'Server-component-first', body: 'Most data lives in server components; client islands handle pointer-driven UI only. This keeps the bundle small and the latency to first paint low even on the heaviest dashboard pages.' },
      ],
      stack: [
        { label: 'Runtime', values: ['Next.js 15 App Router', 'TypeScript', 'React 19'] },
        { label: 'Data', values: ['Postgres', 'Drizzle ORM', 'Webhook queue tables w/ retry'] },
        { label: 'AI', values: ['Claude API', 'Custom prompt scaffolding'] },
        { label: 'Infra', values: ['Vercel', 'Resend (mail)', 'Sentry'] },
      ],
      role: 'Sole engineer · designer · operator',
      timeline: 'Q1 2025 → Present',
      outcomes: [
        'Adopted as the company-wide ops surface within 8 weeks of launch',
        '10+ enterprise integrations monitored continuously',
        '99.9% uptime over 9-month horizon',
        'Cut incident-triage time from hours to minutes',
      ],
    },
  },

  {
    slug: 'bryce-digital',
    index: 'A.02',
    kind: 'PRACTICE',
    status: 'shipping',
    kicker: 'Independent · 2025–Present',
    title: 'Bryce Digital',
    cardBody:
      'Full-stack web applications and AI-powered tools for businesses. End-to-end delivery — discovery through deployment.',
    tags: ['Next.js', 'TypeScript', 'Claude Code', 'Postgres'],
    bentoSlot: 'tall',
    dossier: {
      overview:
        'Bryce Digital is the practice through which I take small businesses from a fuzzy operational pain to a shipped, owned web application. Every engagement runs the same loop: discovery → spec & architecture → build with Claude Code → ship & operate. The lane is intentionally narrow — full-stack apps and AI-powered internal tools, not marketing sites.\n\nIt exists as a sustainable side practice that keeps me close to first-principles delivery: contracts, scope, deployment, ongoing operation.',
      decisions: [
        { title: 'Spec before code, always', body: 'Every engagement starts with a written spec the client signs off on. The spec is the contract, the brief, and the test plan all at once.' },
        { title: 'Claude Code as the implementation engine', body: 'Claude Code accelerates the build phase by an order of magnitude when paired with a tight spec. It does not replace judgment; it removes typing.' },
        { title: 'I operate what I ship', body: 'Every project includes a 3-month operate window. Knowing I will be on-call shapes what I build.' },
      ],
      stack: [
        { label: 'Common', values: ['Next.js', 'TypeScript', 'Tailwind', 'Postgres'] },
        { label: 'Tooling', values: ['Claude Code', 'Vercel', 'Resend'] },
      ],
      role: 'Solo principal',
      timeline: 'Ongoing',
      outcomes: ['Repeat clients across multiple verticals', 'Predictable delivery cadence per engagement'],
    },
  },

  {
    slug: 'dd-integrations',
    index: 'A.03',
    kind: 'FLEET',
    status: 'in-production',
    kicker: 'Digital Directions · Mar 2025 – Present',
    title: 'Three payroll destinations, one source.',
    cardBody:
      'HiBob as system of record, syncing live to NetSuite, KeyPay, and MYOB. Reusable framework. Webhook queueing with retry. Health dashboards.',
    tags: ['Workato', 'NetSuite', 'KeyPay', 'MYOB', 'HiBob'],
    bentoSlot: 'wide',
    dossier: {
      overview:
        'A bidirectional integration fleet with HiBob (HRIS) as the system of record and three payroll destinations (NetSuite for the US, KeyPay and MYOB for AU/NZ) as syncing endpoints. Built as a reusable framework rather than three one-off connectors — webhook queueing with idempotent retry, a shared reconciliation pass, and a health dashboard surface that the Client Portal renders.\n\nSpeed and idempotence were the dominant constraints. Every record gets an event ID; every retry is safe; every reconciliation is auditable.',
      decisions: [
        { title: 'Reusable connector chassis', body: 'A single recipe template handles auth, retry, dead-letter, and observability across all three destinations. New integrations are configuration, not code.' },
        { title: 'HiBob is the only writer', body: 'Destinations are read-mostly. Conflicting writes are impossible because of where authority lives.' },
        { title: 'Queue tables in our own Postgres', body: 'We do not trust the integration platform for durability. Inbound webhooks land in our queue; the integration platform consumes from there.' },
      ],
      stack: [
        { label: 'Orchestration', values: ['Workato (custom recipes, not no-code)'] },
        { label: 'Endpoints', values: ['HiBob', 'NetSuite (SuiteScript + REST)', 'KeyPay', 'MYOB'] },
        { label: 'Resilience', values: ['Postgres queue + retry tables', 'Idempotency keys', 'Reconciliation pass'] },
      ],
      role: 'Solo integrator',
      timeline: 'Mar 2025 → Present',
      outcomes: ['500+ records per sync cycle', 'Three live payroll destinations from a single source', 'Reusable framework powering future connector work'],
    },
  },

  {
    slug: 'portfolio',
    index: 'A.04',
    kind: 'META',
    status: 'recursive',
    kicker: 'This artifact',
    title: 'brycerambach.com',
    cardBody:
      'The site you are on — rebuilt as a spatial archive after the prior conversational prototype did not carry the message.',
    tags: ['Vite', 'React 19', 'Lenis', 'R3F', 'Motion'],
    bentoSlot: 'side',
    dossier: {
      overview:
        'This site is itself a project — a spatial archive built to make the rest of the archive legible. It is the fourth iteration of brycerambach.com; earlier versions tried to lead with a conversational interface and a more conventional case-study layout, and neither carried the message.\n\nThis version commits to a single posture: dark, dense, and operator-grade. Every interaction was chosen for what it signals about how I build, not for novelty.',
      decisions: [
        { title: 'Lenis for the scroll feel', body: 'A heavy, weighted scroll changes the read of the entire page. The signal is calm, intentional, slow on purpose.' },
        { title: 'R3F only where it pays', body: 'The hero icosahedron is the only Three.js surface. Everything else is HTML, SVG, or CSS — cost paid where it is earned.' },
        { title: 'URL-synced dossiers', body: 'Opening a project pushes a query param. Dossiers are linkable, refresh-safe, and back-button works without a router.' },
      ],
      stack: [
        { label: 'Runtime', values: ['Vite', 'React 19', 'TypeScript'] },
        { label: 'Motion', values: ['Lenis', 'motion (Framer)', '@react-three/fiber'] },
      ],
      role: 'Sole engineer · designer',
      timeline: 'v.4.0 — current',
      outcomes: ['Archive-first navigation; cards become entry points, not dead-ends'],
    },
  },

  {
    slug: 'sidequest',
    index: 'S.01',
    kind: 'CONCEPT',
    status: 'concept',
    kicker: 'Concept · 2025',
    title: 'SideQuest — the quest engine.',
    cardBody:
      'A spatial AI concept exploring how intent becomes an itinerary. Conversational input, spatial output, agentic execution.',
    tags: ['Spatial UI', 'Agentic AI', 'Conversational Intent', 'Graph Modeling', 'R3F'],
    bentoSlot: 'full',
    dossier: {
      overview:
        'SideQuest is a concept project that treats a journey — a trip, a learning track, a creative expedition — as a graph of nested objectives, with a player-class layer over the top. The interface is a depth-cued spatial canvas; nodes resolve from blur as you focus on them, links pulse along their flow direction, and background agents negotiate reservations or context lookups asynchronously.\n\nThe argument the concept is making: intent is best expressed conversationally and best operated on spatially. Most AI-native interfaces collapse both into a chat thread, and lose the structure of the work in the process.',
      decisions: [
        { title: 'Spatial canvas, not chat thread', body: 'Once intent is captured conversationally, it is rendered as a graph and edited spatially. The chat is the input modality, not the workspace.' },
        { title: 'Player-class as a personalization layer', body: 'A traveler, a learner, and a maker all want different shapes of help from the same engine. The player class biases the graph generator.' },
        { title: 'Agents as background workers', body: 'No agent ever owns the foreground. Agents act on the graph; the user inspects and accepts.' },
      ],
      stack: [
        { label: 'Frontend', values: ['React', 'R3F', 'Custom shader passes'] },
        { label: 'Backend', values: ['Postgres', 'Agent runtime', 'Claude API'] },
      ],
      role: 'Concept author',
      timeline: 'Lab — exploratory',
      outcomes: ['Working interaction sketch', 'Active investor and operator interest'],
    },
  },

  {
    slug: 'ops-portal',
    index: 'A.05',
    kind: 'PRODUCTION',
    status: 'in-production',
    kicker: 'Digital Directions · Internal',
    title: 'A production-grade operational frontend.',
    cardBody:
      'Realtime fleet health for 10+ enterprise integrations: webhook queues, sync latencies, retry storms, and Claude-summarized incidents in a single pane.',
    tags: ['Next.js', 'TypeScript', 'Drizzle', 'Postgres', 'Claude'],
    bentoSlot: 'full',
    dossier: {
      overview:
        'The Ops Portal is the internal operator surface inside the larger Client Portal — the pane operators live in when something is on fire. It surfaces realtime fleet health, queue depth, retry storms, and Claude-generated incident summaries in one view, optimized for the first ten seconds of an incident.\n\nIt is built for one operator and scaled for the team that grew around it.',
      decisions: [
        { title: 'Optimize for the first ten seconds', body: 'The most important data goes above the fold without filters. Filters and drilldowns are one click deeper.' },
        { title: 'Sparklines over numbers', body: 'A 60-pixel sparkline tells an operator more than a single latency number. The number is still there, but the shape is what reads first.' },
        { title: 'Claude as triage acceleration', body: 'Incident records get summarized with a Claude pass that proposes likely causes drawn from prior incident notes. Operators accept, reject, or edit.' },
      ],
      stack: [
        { label: 'Runtime', values: ['Next.js 15', 'TypeScript'] },
        { label: 'Data', values: ['Postgres (Drizzle)', 'Realtime subscriptions'] },
        { label: 'AI', values: ['Claude API for incident summaries'] },
      ],
      role: 'Sole engineer · designer · operator',
      timeline: 'In production',
      outcomes: ['10+ integrations monitored continuously', '99.9% uptime over 9 months', 'Adopted by leadership as the daily ops view'],
    },
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- projects`
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/lib/projects.test.ts
git commit -m "feat: add PROJECTS data with placeholder dossier copy"
```

---

## Task 12: Build the `useProjectFromUrl` hook

**Files:**
- Create: `src/lib/use-project-from-url.ts`
- Create: `src/lib/use-project-from-url.test.ts`

Reads `?project=<slug>` from the URL. `openProject` and `closeProject` push history. Listens to `popstate` so back-button closes the modal.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/use-project-from-url.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectFromUrl } from './use-project-from-url';

describe('useProjectFromUrl', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('returns null when no ?project= present', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    expect(result.current.openSlug).toBeNull();
  });

  it('reads the initial slug from the URL', () => {
    window.history.replaceState({}, '', '/?project=dd-portal');
    const { result } = renderHook(() => useProjectFromUrl());
    expect(result.current.openSlug).toBe('dd-portal');
  });

  it('openProject pushes ?project= and updates state', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => result.current.openProject('sidequest'));
    expect(window.location.search).toBe('?project=sidequest');
    expect(result.current.openSlug).toBe('sidequest');
  });

  it('closeProject removes ?project= and updates state', () => {
    window.history.replaceState({}, '', '/?project=ops-portal');
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => result.current.closeProject());
    expect(window.location.search).toBe('');
    expect(result.current.openSlug).toBeNull();
  });

  it('responds to popstate events', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => {
      window.history.pushState({}, '', '/?project=portfolio');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.openSlug).toBe('portfolio');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- use-project-from-url`
Expected: FAIL.

- [ ] **Step 3: Implement the hook**

```ts
// src/lib/use-project-from-url.ts
import { useCallback, useEffect, useState } from 'react';

const PARAM = 'project';

function readSlug(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(PARAM);
}

export function useProjectFromUrl() {
  const [openSlug, setOpenSlug] = useState<string | null>(() => readSlug());

  useEffect(() => {
    function onPop() {
      setOpenSlug(readSlug());
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openProject = useCallback((slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(PARAM, slug);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setOpenSlug(slug);
  }, []);

  const closeProject = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    const search = url.search ? url.search : '';
    window.history.pushState({}, '', `${url.pathname}${search}`);
    setOpenSlug(null);
  }, []);

  return { openSlug, openProject, closeProject };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- use-project-from-url`
Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/use-project-from-url.ts src/lib/use-project-from-url.test.ts
git commit -m "feat: add useProjectFromUrl hook for URL-synced dossiers"
```

---

## Task 13: Build the `DossierDialog` component

**Files:**
- Create: `src/components/DossierDialog.tsx`
- Create: `src/components/DossierDialog.test.tsx`

Radix Dialog wrapper that, given the `openSlug`, looks the project up in `PROJECTS` and renders a glass dossier panel with overview, decisions, stack, sidebar.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/DossierDialog.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DossierDialog } from './DossierDialog';

describe('DossierDialog', () => {
  it('renders nothing when no slug is open', () => {
    render(<DossierDialog openSlug={null} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders project details when a known slug is open', () => {
    render(<DossierDialog openSlug="dd-portal" onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Digital Directions Client Portal/)).toBeInTheDocument();
  });

  it('renders nothing for an unknown slug', () => {
    render(<DossierDialog openSlug="not-a-project" onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DossierDialog openSlug="dd-portal" onClose={onClose} />);
    const close = screen.getByRole('button', { name: /close/i });
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- DossierDialog`
Expected: FAIL.

- [ ] **Step 3: Implement `DossierDialog`**

```tsx
// src/components/DossierDialog.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { PROJECTS } from '../lib/projects';

type DossierDialogProps = {
  openSlug: string | null;
  onClose: () => void;
};

export function DossierDialog({ openSlug, onClose }: DossierDialogProps) {
  const project = openSlug ? PROJECTS.find((p) => p.slug === openSlug) : null;
  const open = Boolean(project);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[80]"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        />
        <Dialog.Content
          className="fixed inset-x-4 top-1/2 z-[90] mx-auto max-w-[920px] -translate-y-1/2 overflow-hidden rounded-[20px] border p-8 max-h-[85vh] overflow-y-auto"
          style={{
            background: 'rgba(8,10,14,0.92)',
            backdropFilter: 'blur(30px) saturate(160%)',
            borderColor: 'var(--color-hair-2)',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {project && (
            <>
              <div className="flex items-start justify-between gap-6">
                <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>
                  {project.index} — {project.kind}
                </div>
                <Dialog.Close
                  aria-label="Close dossier"
                  className="rounded-md p-1.5 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Dialog.Close>
              </div>

              <Dialog.Title className="font-serif mt-4" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, color: 'var(--color-ink)' }}>
                {project.title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 font-mono text-[11px]" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.06em' }}>
                {project.kicker}
              </Dialog.Description>

              <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px]">
                <div className="space-y-6">
                  <section>
                    <h4 className="font-mono text-[10.5px] uppercase mb-2" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Overview</h4>
                    <p className="text-[14px] whitespace-pre-line" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
                      {project.dossier.overview}
                    </p>
                  </section>

                  <section>
                    <h4 className="font-mono text-[10.5px] uppercase mb-3" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Key decisions</h4>
                    <ul className="space-y-3">
                      {project.dossier.decisions.map((d) => (
                        <li key={d.title}>
                          <div className="font-serif text-[18px]" style={{ color: 'var(--color-ink)' }}>{d.title}</div>
                          <p className="text-[13.5px] mt-1" style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}>{d.body}</p>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="font-mono text-[10.5px] uppercase mb-3" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Stack</h4>
                    <dl className="grid gap-3">
                      {project.dossier.stack.map((s) => (
                        <div key={s.label} className="grid grid-cols-[100px_1fr] gap-3">
                          <dt className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.14em', color: 'var(--color-ink-3)' }}>{s.label}</dt>
                          <dd className="text-[13.5px]" style={{ color: 'var(--color-ink-2)' }}>{s.values.join(' · ')}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                </div>

                <aside className="space-y-4 text-[12.5px]" style={{ color: 'var(--color-ink-2)' }}>
                  <div>
                    <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Role</div>
                    <div className="mt-1">{project.dossier.role}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Timeline</div>
                    <div className="mt-1">{project.dossier.timeline}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10.5px] uppercase mb-1" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Outcomes</div>
                    <ul className="space-y-1.5">
                      {project.dossier.outcomes.map((o) => (
                        <li key={o} className="flex gap-2">
                          <span style={{ color: 'rgb(134,239,172)' }}>↳</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {project.dossier.links && (
                    <div>
                      <div className="font-mono text-[10.5px] uppercase mb-1" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>Links</div>
                      <ul className="space-y-1">
                        {project.dossier.links.map((l) => (
                          <li key={l.href}>
                            <a href={l.href} target="_blank" rel="noopener" className="underline">{l.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- DossierDialog`
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/DossierDialog.tsx src/components/DossierDialog.test.tsx
git commit -m "feat: add DossierDialog with overview, decisions, stack, sidebar"
```

---

## Task 14: Wire `App.tsx` shell with chrome, background, and dossier

Set up the `App` skeleton so subsequent section work renders against the real chrome. Sections themselves stub to placeholder divs for now and get replaced in later tasks.

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { MotionConfig } from 'motion/react';
import { CosmicBackground } from './components/CosmicBackground';
import { Chrome } from './components/Chrome';
import { Footer } from './components/Footer';
import { DossierDialog } from './components/DossierDialog';
import { useProjectFromUrl } from './lib/use-project-from-url';

export default function App() {
  const { openSlug, closeProject } = useProjectFromUrl();

  return (
    <MotionConfig reducedMotion="user">
      <CosmicBackground />
      <Chrome />
      <main className="relative z-10">
        <section id="top" className="min-h-screen p-12 flex items-center justify-center">
          <p className="font-mono text-[12px]" style={{ color: 'var(--color-ink-3)' }}>
            HERO — placeholder
          </p>
        </section>
        <section id="archive" className="min-h-screen p-12">ARCHIVE — placeholder</section>
        <section id="systems" className="min-h-screen p-12">SYSTEMS — placeholder</section>
        <section id="sidequest" className="min-h-screen p-12">CONCEPT — placeholder</section>
        <section id="ops" className="min-h-screen p-12">OPS — placeholder</section>
        <section id="contact" className="min-h-screen p-12">CONTACT — placeholder</section>
      </main>
      <Footer />
      <DossierDialog openSlug={openSlug} onClose={closeProject} />
    </MotionConfig>
  );
}
```

- [ ] **Step 2: Run dev server, manual smoke test**

Run: `npm run dev`
Expected: black page, chrome bar with `BR` mark + 4 nav links, six placeholder sections you can scroll through, footer at bottom. Visit `http://localhost:3000/?project=dd-portal` — the dossier modal should open. Hit ESC or back-button to close. Stop the server.

- [ ] **Step 3: Run lint and tests**

Run: `npm run lint && npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire App shell with chrome, background, dossier"
```

---

## Task 15: Build the `Hero` section (without R3F yet)

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/Hero.test.tsx`
- Modify: `src/App.tsx` (replace placeholder hero section)

Hero gets the headline, lede, meta-row, contact magnets, and the "↓ SCROLL TO ENTER ARCHIVE" footer. R3F icosahedron + flow field come in Tasks 16 and 17.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Hero.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the headline, lede, and contact links', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/digital archive/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /bryce.rambach@gmail.com/i })).toHaveAttribute('href', 'mailto:bryce.rambach@gmail.com');
    expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/Bryce_Rambach_Resume.pdf');
  });

  it('renders the scroll-to-archive footer', () => {
    render(<Hero />);
    expect(screen.getByText(/SCROLL TO ENTER ARCHIVE/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL.

- [ ] **Step 3: Implement `Hero` (without canvases — placeholder slots)**

```tsx
// src/components/Hero.tsx
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-h"
      className="hero relative max-w-[1280px] mx-auto px-6 pt-[120px] pb-16 min-h-screen"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_320px] items-end">
        <div>
          <Reveal delay={1}>
            <h1
              id="hero-h"
              className="font-serif"
              style={{
                fontSize: 'clamp(40px, 6vw, 92px)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
              }}
            >
              Bryce <em className="not-italic font-serif italic">Rambach</em>.<br />
              Engineering high-fidelity bridges between<br />
              <span style={{ color: 'rgb(56,189,248)' }}>human intent &amp; scalable systems.</span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p
              className="mt-7 max-w-[60ch] text-[15px]"
              style={{ color: 'var(--color-ink-2)', lineHeight: 1.55 }}
            >
              A digital archive of solo-built production systems, enterprise integration architectures,
              and spatial AI experiments. No clients page. No pricing table. Just the work.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px]"
              style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}
            >
              <span>SAN&nbsp;DIEGO &nbsp;→&nbsp; SF&nbsp;/&nbsp;NYC</span>
              <span>·</span>
              <span>FULL-STACK</span>
              <span>·</span>
              <span>INDEX&nbsp;0&nbsp;OF&nbsp;6</span>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:bryce.rambach@gmail.com"
                className="hero-magnet inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-mono text-[12px] transition"
                style={{
                  border: '1px solid var(--color-hair-2)',
                  background: 'rgba(255,255,255,0.025)',
                  color: 'var(--color-ink)',
                  letterSpacing: '0.02em',
                }}
              >
                bryce.rambach@gmail.com
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 9 L9 3 M5 3 H9 V7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="/Bryce_Rambach_Resume.pdf"
                target="_blank"
                rel="noopener"
                className="hero-magnet inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-mono text-[12px] transition"
                style={{
                  border: '1px solid var(--color-hair-2)',
                  background: 'rgba(255,255,255,0.025)',
                  color: 'var(--color-ink)',
                  letterSpacing: '0.02em',
                }}
              >
                résumé.pdf
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M6 2 V8 M3 6 L6 9 L9 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="hero-figure-slot relative h-[280px] md:h-[420px]" aria-hidden="true">
          {/* HeroIcosahedron mounts here in Task 16 */}
        </div>
      </div>

      <Reveal delay={5}>
        <div
          className="mt-9 flex flex-wrap justify-between gap-2 font-mono text-[11px]"
          style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}
        >
          <span>↓&nbsp;&nbsp;SCROLL TO ENTER ARCHIVE</span>
          <span>LAT&nbsp;32.7157 &nbsp;·&nbsp; LON&nbsp;−117.1611</span>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `App.tsx`**

In `src/App.tsx`, import `Hero` and replace the `#top` placeholder section:

```tsx
import { Hero } from './components/Hero';
// …
<Hero />
```

- [ ] **Step 5: Run tests + manual smoke**

Run: `npm test -- Hero` (PASS), then `npm run dev` and verify hero renders correctly. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx src/App.tsx
git commit -m "feat: add Hero section content (sans 3D)"
```

---

## Task 16: Build `HeroIcosahedron` (R3F) and lazy-mount in Hero

**Files:**
- Create: `src/components/HeroIcosahedron.tsx`
- Modify: `src/components/Hero.tsx` (lazy-import + mount)

Lazy-loaded R3F scene with a single wireframe icosahedron auto-rotating. Suspense fallback is empty.

- [ ] **Step 1: Implement `HeroIcosahedron`**

```tsx
// src/components/HeroIcosahedron.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

function SpinningIcos() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.05;
  });
  return (
    <Icosahedron ref={ref} args={[1.4, 0]}>
      <meshBasicMaterial color="rgb(56, 189, 248)" wireframe transparent opacity={0.65} />
    </Icosahedron>
  );
}

export default function HeroIcosahedron() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 120 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <SpinningIcos />
    </Canvas>
  );
}
```

- [ ] **Step 2: Lazy-mount in `Hero.tsx`**

At the top of `src/components/Hero.tsx`, add:

```tsx
import { lazy, Suspense } from 'react';
const HeroIcosahedron = lazy(() => import('./HeroIcosahedron'));
```

Replace the `hero-figure-slot` div with:

```tsx
<div className="hero-figure-slot relative h-[280px] md:h-[420px]" aria-hidden="true">
  <Suspense fallback={null}>
    <HeroIcosahedron />
  </Suspense>
</div>
```

- [ ] **Step 3: Manual verify in browser**

Run: `npm run dev`
Expected: hero renders with a slowly rotating slate-blue wireframe icosahedron in the right-hand slot. Stop server.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS (R3F is mocked-out via lazy import; Hero test does not need to render the canvas).

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroIcosahedron.tsx src/components/Hero.tsx
git commit -m "feat: add R3F wireframe icosahedron to hero"
```

---

## Task 17: Build `HeroFlowField` (vanilla canvas, optional but earns its weight)

**Files:**
- Create: `src/components/HeroFlowField.tsx`
- Modify: `src/components/Hero.tsx` (mount as fixed full-screen canvas behind hero only)

Lightweight flow-field of dim moving particles, fixed-position behind the hero. Pauses when scrolled past the hero.

- [ ] **Step 1: Implement `HeroFlowField`**

```tsx
// src/components/HeroFlowField.tsx
import { useEffect, useRef } from 'react';

export function HeroFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; vx: number; vy: number };
    const COUNT = 60;
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
    }));

    function tick() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(56,189,248,0.35)';
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-[1]"
      style={{ opacity: 0.55, mixBlendMode: 'screen' }}
    />
  );
}
```

- [ ] **Step 2: Mount in `Hero.tsx`**

At the top of the `Hero` return, before the `<section>`, render:

```tsx
import { HeroFlowField } from './HeroFlowField';
// inside Hero return, fragment if needed:
return (
  <>
    <HeroFlowField />
    <section id="top" /* …existing… */>
      {/* … */}
    </section>
  </>
);
```

- [ ] **Step 3: Manual verify**

Run: `npm run dev`. Expected: faint blue particles drift behind the hero. Confirm CPU stays reasonable. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroFlowField.tsx src/components/Hero.tsx
git commit -m "feat: add ambient flow-field canvas behind hero"
```

---

## Task 18: Build `ArchiveSection` (project bento)

**Files:**
- Create: `src/components/ArchiveSection.tsx`
- Create: `src/components/ArchiveSection.test.tsx`
- Modify: `src/App.tsx`

Bento grid that pulls the four archive-kind projects (`dd-portal`, `bryce-digital`, `dd-integrations`, `portfolio`) and renders each in a `GlassCard` + `TiltCard`. "OPEN DOSSIER" buttons call `openProject(slug)`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ArchiveSection.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ArchiveSection } from './ArchiveSection';

describe('ArchiveSection', () => {
  it('renders the section heading', () => {
    render(<ArchiveSection onOpen={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Selected artifacts/i);
  });

  it('renders one card per archive project', () => {
    render(<ArchiveSection onOpen={() => {}} />);
    expect(screen.getByText(/Digital Directions/i)).toBeInTheDocument();
    expect(screen.getByText('Bryce Digital')).toBeInTheDocument();
    expect(screen.getByText(/Three payroll destinations/i)).toBeInTheDocument();
    expect(screen.getByText('brycerambach.com')).toBeInTheDocument();
  });

  it('clicking OPEN DOSSIER triggers onOpen with that slug', async () => {
    const onOpen = vi.fn();
    render(<ArchiveSection onOpen={onOpen} />);
    const buttons = screen.getAllByRole('button', { name: /open dossier/i });
    await userEvent.click(buttons[0]);
    expect(onOpen).toHaveBeenCalledWith(expect.any(String));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ArchiveSection`
Expected: FAIL.

- [ ] **Step 3: Implement `ArchiveSection`**

```tsx
// src/components/ArchiveSection.tsx
import { PROJECTS, type Project } from '../lib/projects';
import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';

const SLOT_CLASS: Record<Project['bentoSlot'], string> = {
  feat: 'md:col-span-8 md:row-span-2',
  tall: 'md:col-span-4 md:row-span-2',
  wide: 'md:col-span-8',
  side: 'md:col-span-4',
  full: 'md:col-span-12',
};

const STATUS_LABEL: Record<Project['status'], string> = {
  'in-production': 'IN PRODUCTION',
  shipping: 'SHIPPING',
  concept: 'LAB',
  recursive: 'RECURSIVE',
};

export function ArchiveSection({ onOpen }: { onOpen: (slug: string) => void }) {
  const archive = PROJECTS.filter((p) => ['FLAGSHIP', 'PRACTICE', 'FLEET', 'META'].includes(p.kind));

  return (
    <section id="archive" aria-labelledby="arch-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="01 / Archive"
        title={<>Selected artifacts<br />from the workbench.</>}
        description="// Four production systems — assembled, scaled, and operated by one engineer. Click any artifact to expand its dossier."
        headingId="arch-h"
      />

      <div className="grid gap-5 md:grid-cols-12 md:auto-rows-[280px]">
        {archive.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4}>
            <TiltCard className={SLOT_CLASS[p.bentoSlot]}>
              <GlassCard className="h-full p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>
                  <span>{p.index} — {p.kind}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === 'in-production' ? 'rgb(134,239,172)' : p.status === 'shipping' ? 'rgb(56,189,248)' : 'rgb(245,158,11)' }} />
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>

                <div>
                  <div className="font-mono text-[10.5px]" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.06em' }}>
                    {p.kicker}
                  </div>
                  <h3 className="font-serif mt-1.5" style={{ fontSize: 'clamp(22px, 2.6vw, 36px)', lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--color-ink)' }}>
                    {p.title}
                  </h3>
                </div>

                <p className="text-[13.5px] flex-1" style={{ color: 'var(--color-ink-2)', lineHeight: 1.55, maxWidth: '46ch' }}>
                  {p.cardBody}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-1 rounded-md" style={{ color: 'var(--color-ink-2)', background: 'rgba(255,255,255,0.04)', letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onOpen(p.slug)}
                  className="self-start inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 rounded-md transition"
                  style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: 'rgb(186,230,253)', letterSpacing: '0.08em' }}
                >
                  OPEN&nbsp;DOSSIER
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 9 L9 3 M5 3 H9 V7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              </GlassCard>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `App.tsx`**

```tsx
import { ArchiveSection } from './components/ArchiveSection';
// …
const { openSlug, openProject, closeProject } = useProjectFromUrl();
// …
<ArchiveSection onOpen={openProject} />
```

Replace the `#archive` placeholder.

- [ ] **Step 5: Run tests + manual verify**

Run: `npm test -- ArchiveSection` (PASS), `npm run dev`, scroll to archive section, click OPEN DOSSIER, confirm modal opens with the right project. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/ArchiveSection.tsx src/components/ArchiveSection.test.tsx src/App.tsx
git commit -m "feat: add ArchiveSection bento with dossier triggers"
```

---

## Task 19: Build `SystemsSection` (architecture grid)

**Files:**
- Create: `src/components/SystemsSection.tsx`
- Create: `src/components/SystemsSection.test.tsx`
- Modify: `src/App.tsx`

Six architecture cards with role/scale specs and an animated proficiency bar. Bar widths are static data inside this component (separate from `PROJECTS` since they are skills, not projects).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/SystemsSection.test.tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SystemsSection`
Expected: FAIL.

- [ ] **Step 3: Implement `SystemsSection`**

```tsx
// src/components/SystemsSection.tsx
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';

type Arch = {
  name: string;
  meta: string;
  body: string;
  role: string;
  scale: string;
  bar: number;
};

const ARCH: Arch[] = [
  { name: 'Workato', meta: 'ORCHESTRATION', body: 'Orchestration layer for the integration fleet — backend-driven recipes written from scratch, not no-code drag-and-drop.', role: 'Connector author', scale: '6 production recipes', bar: 92 },
  { name: 'NetSuite', meta: 'FINANCE ERP', body: 'SuiteScript & REST integrations — bi-directional sync to HR / payroll. Reconciliation hardened against partial failures.', role: 'Solo integrator', scale: '500 rec/cycle', bar: 86 },
  { name: 'Claude API', meta: 'INTELLIGENCE', body: 'Intelligence layer in the DD portal — summarization, error diagnosis, and triage. Not a chatbot bolt-on; a load-bearing surface.', role: 'Architect', scale: '3 internal tools', bar: 88 },
  { name: 'Next.js 15', meta: 'RUNTIME', body: 'App Router, server components, edge handlers — the chassis under every artifact in the archive.', role: 'Daily driver', scale: '4+ prod apps', bar: 95 },
  { name: 'Drizzle + PG', meta: 'DATA PLANE', body: 'Type-safe schema, migrations, and queue tables for retryable webhooks. Postgres as the source of truth.', role: 'Schema owner', scale: '500/cycle', bar: 78 },
  { name: 'Claude Code', meta: 'PAIR', body: 'Daily pair programming. Accelerates shipping and re-engineers my team’s approach to integration delivery.', role: 'Operator', scale: 'Daily', bar: 90 },
];

function ArchCard({ a, delay }: { a: Arch; delay: 0 | 1 | 2 }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <Reveal delay={delay}>
      <TiltCard>
        <GlassCard className="h-full p-5">
          <div className="flex items-start justify-between">
            <div className="font-serif text-[22px]" style={{ color: 'var(--color-ink)' }}>{a.name}</div>
            <div className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.16em' }}>{a.meta}</div>
          </div>
          <p className="mt-3 text-[13px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.55 }}>{a.body}</p>
          <dl className="mt-4 grid grid-cols-[60px_1fr] gap-y-1.5 text-[11px] font-mono" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}>
            <dt>ROLE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.role}</dd>
            <dt>SCALE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.scale}</dd>
          </dl>
          <div ref={ref} className="mt-5 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${a.bar}%` } : undefined}
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.8), rgba(168,85,247,0.6))' }}
            />
          </div>
        </GlassCard>
      </TiltCard>
    </Reveal>
  );
}

export function SystemsSection() {
  return (
    <section id="systems" aria-labelledby="sys-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="02 / Systems"
        title={<>System architectures<br />I operate fluently.</>}
        description="// Integration specialist — Workato, NetSuite, and enterprise API automation as first-class engineering surfaces, not glue work."
        headingId="sys-h"
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ARCH.map((a, i) => (
          <ArchCard key={a.name} a={a} delay={(i % 3) as 0 | 1 | 2} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `App.tsx`**

Replace `#systems` placeholder with `<SystemsSection />` (import added at top).

- [ ] **Step 5: Run tests + manual verify**

Run: `npm test -- SystemsSection` (PASS), then `npm run dev` and confirm cards render and bars animate on scroll. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/SystemsSection.tsx src/components/SystemsSection.test.tsx src/App.tsx
git commit -m "feat: add SystemsSection architecture grid"
```

---

## Task 20: Build `SideQuestSection`

**Files:**
- Create: `src/components/SideQuestSection.tsx`
- Create: `src/components/SideQuestSection.test.tsx`
- Modify: `src/App.tsx`

Single large concept panel with depth-field bg, copy block, decorative ring/spinner. Pulls dossier copy from `PROJECTS['sidequest']`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/SideQuestSection.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SideQuestSection } from './SideQuestSection';

describe('SideQuestSection', () => {
  it('renders the section heading and concept copy', () => {
    render(<SideQuestSection onOpen={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/SideQuest/i);
    expect(screen.getByText(/quest engine/i)).toBeInTheDocument();
  });

  it('clicking OPEN CONCEPT DOSSIER calls onOpen with sidequest slug', async () => {
    const onOpen = vi.fn();
    render(<SideQuestSection onOpen={onOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /open concept dossier/i }));
    expect(onOpen).toHaveBeenCalledWith('sidequest');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SideQuestSection`
Expected: FAIL.

- [ ] **Step 3: Implement `SideQuestSection`**

```tsx
// src/components/SideQuestSection.tsx
import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';
import { PROJECTS } from '../lib/projects';

export function SideQuestSection({ onOpen }: { onOpen: (slug: string) => void }) {
  const sq = PROJECTS.find((p) => p.slug === 'sidequest')!;

  return (
    <section id="sidequest" aria-labelledby="sq-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="03 / Concept"
        title={<>SideQuest —<br />the quest engine.</>}
        description="// A spatial AI concept exploring how intent becomes an itinerary. Conversational input, spatial output, agentic execution."
        headingId="sq-h"
      />
      <Reveal>
        <TiltCard>
          <GlassCard className="relative p-8 md:p-12 min-h-[420px] overflow-hidden">
            <div className="absolute inset-0 sq-depth-field" aria-hidden="true" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_220px] items-center">
              <div>
                <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em' }}>
                  <span style={{ color: 'rgb(56,189,248)' }}>SPATIAL · AI · CONCEPT</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: 'rgb(245,158,11)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(245,158,11)' }} /> LAB
                  </span>
                </div>
                <h3 className="font-serif mt-3" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, color: 'var(--color-ink)' }}>
                  A quest engine for<br />real-world&nbsp;intent.
                </h3>
                <p className="mt-4 text-[14px] max-w-[60ch]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
                  {sq.dossier.overview.split('\n\n')[0]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {sq.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-ink-2)' }}>{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => onOpen('sidequest')}
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 rounded-md"
                  style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: 'rgb(186,230,253)', letterSpacing: '0.08em' }}
                >
                  OPEN&nbsp;CONCEPT&nbsp;DOSSIER
                </button>
              </div>

              <div className="sq-shape relative h-[200px]" aria-hidden="true">
                <div className="ring r1" />
                <div className="ring r2" />
                <div className="ring r3" />
                <div className="core" />
              </div>
            </div>
          </GlassCard>
        </TiltCard>
      </Reveal>
    </section>
  );
}
```

Append to `src/index.css`:

```css
.sq-depth-field {
  background:
    radial-gradient(400px circle at 30% 50%, rgba(56,189,248,0.18), transparent 70%),
    radial-gradient(300px circle at 80% 70%, rgba(168,85,247,0.10), transparent 70%);
  filter: blur(2px);
  opacity: 0.9;
}

.sq-shape .ring {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  border: 1px solid rgba(56,189,248,0.3);
  border-radius: 50%;
}
.sq-shape .ring.r1 { width: 80px;  height: 80px; }
.sq-shape .ring.r2 { width: 130px; height: 130px; border-color: rgba(56,189,248,0.18); }
.sq-shape .ring.r3 { width: 180px; height: 180px; border-color: rgba(56,189,248,0.10); }
.sq-shape .core {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 12px; height: 12px; border-radius: 50%;
  background: rgb(56,189,248);
  box-shadow: 0 0 16px 4px rgba(56,189,248,0.45);
}
```

- [ ] **Step 4: Wire into `App.tsx`**

Replace `#sidequest` placeholder with `<SideQuestSection onOpen={openProject} />`.

- [ ] **Step 5: Run tests + manual verify**

Run: `npm test -- SideQuestSection` (PASS), `npm run dev`, confirm SideQuest renders, click button, confirm dossier opens. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/SideQuestSection.tsx src/components/SideQuestSection.test.tsx src/App.tsx src/index.css
git commit -m "feat: add SideQuestSection concept panel"
```

---

## Task 21: Build `OpsSection`

**Files:**
- Create: `src/components/OpsSection.tsx`
- Create: `src/components/OpsSection.test.tsx`
- Modify: `src/App.tsx`

Full-width ops shell: copy column on the left, dashboard mock on the right (browser chrome, sidebar, fleet rows with sparklines). Pulls dossier copy from `PROJECTS['ops-portal']`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/OpsSection.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OpsSection } from './OpsSection';

describe('OpsSection', () => {
  it('renders heading and dashboard rows', () => {
    render(<OpsSection onOpen={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/production-grade/i);
    expect(screen.getByText(/hibob → netsuite/)).toBeInTheDocument();
  });

  it('clicking OPEN DOSSIER calls onOpen with ops-portal', async () => {
    const onOpen = vi.fn();
    render(<OpsSection onOpen={onOpen} />);
    await userEvent.click(screen.getByRole('button', { name: /open dossier/i }));
    expect(onOpen).toHaveBeenCalledWith('ops-portal');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- OpsSection`
Expected: FAIL.

- [ ] **Step 3: Implement `OpsSection`**

```tsx
// src/components/OpsSection.tsx
import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { Reveal } from './Reveal';

const ROWS: { name: string; ms: string; status: 'ok' | 'warn'; sparkline: string }[] = [
  { name: 'hibob → netsuite', ms: '42 ms',  status: 'ok',   sparkline: '0,16 8,12 16,15 24,8 32,11 40,6 48,9 60,4' },
  { name: 'hibob → keypay',   ms: '128 ms', status: 'ok',   sparkline: '0,12 8,14 16,11 24,13 32,10 40,12 48,9 60,11' },
  { name: 'hibob ↔ deputy',   ms: '301 ms', status: 'warn', sparkline: '0,18 8,16 16,8 24,18 32,12 40,4 48,18 60,14' },
  { name: 'workato webhook q',ms: '14 ms',  status: 'ok',   sparkline: '0,14 8,12 16,13 24,11 32,12 40,10 48,11 60,9' },
  { name: 'claude triage',    ms: '86 ms',  status: 'ok',   sparkline: '0,15 8,9 16,13 24,7 32,11 40,5 48,9 60,3' },
];

export function OpsSection({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section id="ops" aria-labelledby="op-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="04 / Production"
        title={<>A production-grade<br />operational frontend.</>}
        description="// The internal Ops Portal — where realtime integration health, incident triage, and AI summaries converge into one operator surface."
        headingId="op-h"
      />

      <Reveal>
        <GlassCard className="p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[320px_1fr] items-start">
            <div>
              <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>RT-OPS · INTERNAL</div>
              <h3 className="font-serif mt-2" style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.1, color: 'var(--color-ink)' }}>
                Operators see what<br />matters — fast.
              </h3>
              <p className="mt-3 text-[13.5px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}>
                Realtime fleet health for 10+ enterprise integrations: webhook queues,
                sync latencies, retry storms, and Claude-summarized incidents in a single pane.
              </p>
              <ul className="mt-4 space-y-1.5 text-[12px] font-mono" style={{ color: 'var(--color-ink-2)', letterSpacing: '0.04em' }}>
                <li><b style={{ color: 'var(--color-ink-3)' }}>STACK</b> &nbsp; Next.js · TS · Drizzle · Postgres · Claude</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>UPTIME</b>&nbsp; 99.9% over 9mo</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>ROLE</b> &nbsp;&nbsp; Sole engineer · designer · operator</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>USERS</b>&nbsp;&nbsp; Internal ops, leadership</li>
              </ul>
              <button
                onClick={() => onOpen('ops-portal')}
                className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 rounded-md"
                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: 'rgb(186,230,253)', letterSpacing: '0.08em' }}
              >
                OPEN&nbsp;DOSSIER
              </button>
            </div>

            <div className="ops-mock rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--color-hair-2)', background: 'rgba(8,10,14,0.7)' }}>
              <div className="flex items-center gap-2 px-3 py-2 font-mono text-[11px]" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-hair-2)', color: 'var(--color-ink-3)' }}>
                <span className="flex gap-1">
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                </span>
                <span className="ml-1">ops.digitaldirections.io / fleet</span>
                <span className="ml-auto inline-flex items-center gap-1.5" style={{ color: 'rgb(134,239,172)' }}>● live</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <div className="p-2 text-[11px] font-mono space-y-0.5" style={{ background: 'rgba(255,255,255,0.015)', borderRight: '1px solid var(--color-hair-2)', color: 'var(--color-ink-3)' }}>
                  {['Overview', 'Fleet', 'Queues', 'Incidents', 'Recipes', 'Settings'].map((s) => (
                    <div key={s} className={`px-2 py-1 rounded ${s === 'Fleet' ? 'bg-white/5 text-white' : ''}`}>{s}</div>
                  ))}
                </div>
                <div className="p-2 space-y-1.5">
                  {ROWS.map((r) => (
                    <div key={r.name} className="grid grid-cols-[1fr_70px_70px_60px] items-center gap-3 px-2 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <span className="font-mono text-[11px]" style={{ color: 'var(--color-ink-2)' }}>{r.name}</span>
                      <span className="font-mono text-[10.5px] text-right" style={{ color: 'var(--color-ink-3)' }}>{r.ms}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-center" style={{
                        background: r.status === 'ok' ? 'rgba(134,239,172,0.10)' : 'rgba(245,158,11,0.10)',
                        color: r.status === 'ok' ? 'rgb(134,239,172)' : 'rgb(245,158,11)',
                        letterSpacing: '0.06em',
                      }}>{r.status === 'ok' ? 'OK' : 'RETRY'}</span>
                      <svg viewBox="0 0 60 22" width="60" height="22" aria-hidden="true">
                        <polyline points={r.sparkline} fill="none" stroke={r.status === 'ok' ? 'rgba(134,239,172,0.9)' : 'rgba(245,158,11,0.95)'} strokeWidth="1.4" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `App.tsx`**

Replace `#ops` placeholder with `<OpsSection onOpen={openProject} />`.

- [ ] **Step 5: Run tests + manual verify**

Run: `npm test -- OpsSection` (PASS), `npm run dev`, confirm dashboard mock renders cleanly. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/OpsSection.tsx src/components/OpsSection.test.tsx src/App.tsx
git commit -m "feat: add OpsSection with dashboard mock"
```

---

## Task 22: Build `ContactSection`

**Files:**
- Create: `src/components/ContactSection.tsx`
- Create: `src/components/ContactSection.test.tsx`
- Modify: `src/App.tsx`

Single contact panel — label, big serif headline, sub copy, four direct links, status badge.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ContactSection.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  it('renders headline and four direct contact links', () => {
    render(<ContactSection />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/load-bearing/i);
    expect(screen.getByRole('link', { name: /bryce.rambach@gmail.com/i })).toHaveAttribute('href', 'mailto:bryce.rambach@gmail.com');
    expect(screen.getByRole('link', { name: /\(831\) 236-1922/ })).toHaveAttribute('href', 'tel:+18312361922');
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ContactSection`
Expected: FAIL.

- [ ] **Step 3: Implement `ContactSection`**

```tsx
// src/components/ContactSection.tsx
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';

const LINKS = [
  { label: 'bryce.rambach@gmail.com', href: 'mailto:bryce.rambach@gmail.com' },
  { label: '(831) 236-1922', href: 'tel:+18312361922' },
  { label: 'linkedin/bryce-rambach', href: 'https://linkedin.com/in/bryce-rambach' },
  { label: 'github/brambach', href: 'https://github.com/brambach' },
];

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="ct-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <Reveal>
        <TiltCard>
          <GlassCard className="p-8 md:p-12">
            <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>
              END&nbsp;OF&nbsp;ARCHIVE · INDEX&nbsp;05
            </div>
            <h3 id="ct-h" className="font-serif mt-3" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, color: 'var(--color-ink)' }}>
              Let's build<br />something <em className="font-serif italic">load-bearing.</em>
            </h3>
            <p className="mt-4 max-w-[60ch] text-[14px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
              Open to full-stack roles at early-stage startups. Relocating to SF or NYC,
              summer 2026. Direct lines below — no contact form, no funnel.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener' : undefined}
                    className="inline-flex items-center gap-2 font-mono text-[12.5px]"
                    style={{ color: 'var(--color-ink)', letterSpacing: '0.02em' }}
                  >
                    <span style={{ color: 'rgb(56,189,248)' }}>↳</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.22)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(134,239,172)' }} />
              <span className="font-mono text-[10.5px] uppercase" style={{ color: 'var(--color-ink-2)', letterSpacing: '0.16em' }}>
                Currently shipping at Digital Directions · Open to convo
              </span>
            </div>
          </GlassCard>
        </TiltCard>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `App.tsx`**

Replace `#contact` placeholder with `<ContactSection />`.

- [ ] **Step 5: Run tests + manual verify**

Run: `npm test -- ContactSection` (PASS), `npm run dev`, confirm contact section renders. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactSection.tsx src/components/ContactSection.test.tsx src/App.tsx
git commit -m "feat: add ContactSection"
```

---

## Task 23: Wire Lenis + reduced-motion guard

**Files:**
- Create: `src/components/SmoothScroll.tsx`
- Modify: `src/App.tsx`

Wraps the app with `<ReactLenis root>`, configured with `lerp: 0.08`, `duration: 1.4`, `smoothWheel: true`, and disabled when `prefers-reduced-motion: reduce`. Exposes nothing else — Lenis has its own Context for descendants that need it.

- [ ] **Step 1: Implement `SmoothScroll`**

```tsx
// src/components/SmoothScroll.tsx
import { ReactLenis } from 'lenis/react';
import { useEffect, useState, type ReactNode } from 'react';

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.4, smoothWheel: !reduced }}>
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 2: Wrap `App` with `SmoothScroll`**

In `src/App.tsx`, import and wrap:

```tsx
import { SmoothScroll } from './components/SmoothScroll';

export default function App() {
  // …
  return (
    <SmoothScroll>
      <MotionConfig reducedMotion="user">
        {/* existing tree */}
      </MotionConfig>
    </SmoothScroll>
  );
}
```

- [ ] **Step 3: Manual verify**

Run: `npm run dev`. Scroll the page and confirm the heavy/smooth feel — momentum, easing into stops. Toggle macOS Reduce Motion and confirm scroll snaps to instant. Stop server.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SmoothScroll.tsx src/App.tsx
git commit -m "feat: wrap app with Lenis smooth scroll + reduced-motion guard"
```

---

## Task 24: Add the three scroll-tied moments

**Files:**
- Modify: `src/components/HeroIcosahedron.tsx` (scroll-tied rotation)
- Modify: `src/components/CosmicBackground.tsx` (parallax)
- Modify: `src/components/SectionHead.tsx` (number slide on section progress)

These are visual; verify in browser, no unit tests.

- [ ] **Step 1: Scroll-tied icosahedron rotation**

In `src/components/HeroIcosahedron.tsx`, replace the `useFrame` body with one that reads scroll. Since R3F runs outside React's render loop and we need the scroll value, use a ref updated by a window scroll listener (Lenis updates window.scrollY synchronously on its tick):

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { Mesh } from 'three';

function SpinningIcos() {
  const ref = useRef<Mesh>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18 + scrollRef.current * 0.000004;
    ref.current.rotation.x += delta * 0.05;
  });

  return (
    <Icosahedron ref={ref} args={[1.4, 0]}>
      <meshBasicMaterial color="rgb(56, 189, 248)" wireframe transparent opacity={0.65} />
    </Icosahedron>
  );
}
// …rest unchanged
```

- [ ] **Step 2: Cosmic background parallax**

In `src/components/CosmicBackground.tsx`, add scroll-driven transforms to bloom and grid:

```tsx
import { useEffect, useRef } from 'react';

export function CosmicBackground() {
  const bloomRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (bloomRef.current) bloomRef.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
      if (gridRef.current)  gridRef.current.style.transform  = `translate3d(0, ${y * -0.05}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="cosmic-bg fixed inset-0 -z-0 pointer-events-none" aria-hidden="true">
      <div ref={bloomRef} className="cosmic-bloom absolute inset-0" />
      <div ref={gridRef} className="cosmic-grid absolute inset-0" />
      <div className="cosmic-noise absolute inset-0" />
    </div>
  );
}
```

- [ ] **Step 3: Section number slide**

In `src/components/SectionHead.tsx`, attach `useScroll` tied to the section header element, drive an `x` transform on the number block:

```tsx
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadProps = { num: string; title: ReactNode; description: string; headingId: string };

export function SectionHead({ num, title, description, headingId }: SectionHeadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] });
  const x = useTransform(scrollYProgress, [0, 1], [-12, 0]);

  return (
    <Reveal>
      <div ref={ref} className="section-head grid gap-7 mb-8 md:grid-cols-[80px_1fr] md:gap-7 md:items-baseline">
        <motion.div
          style={{ x, color: 'var(--color-ink-3)', letterSpacing: '0.16em' }}
          className="section-num font-mono text-[10.5px] font-medium uppercase"
        >
          {num}
        </motion.div>
        <div>
          <h2 id={headingId} className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--color-ink)' }}>
            {title}
          </h2>
          <p className="mt-3 font-mono text-[12px]" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.04em' }}>
            {description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 4: Manual verify**

Run: `npm run dev`. Confirm:
- Hero icosahedron spins faster as you scroll
- Cosmic bloom/grid drift slightly slower than content
- Section number slides in subtly when its section enters

Toggle Reduce Motion and confirm parallax disables. Stop server.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroIcosahedron.tsx src/components/CosmicBackground.tsx src/components/SectionHead.tsx
git commit -m "feat: add three scroll-tied motion moments (icos, bg parallax, section num)"
```

---

## Task 25: Responsive + accessibility pass

**Files:**
- Modify: any component that needs touch-up

Manual sweep across breakpoints, tab traversal, and screen reader labels. No new code unless a defect is found.

- [ ] **Step 1: Resize sweep at 360, 480, 768, 1024, 1280, 1600**

Run: `npm run dev` and resize the browser window (or use devtools device emulation).
Check: hero stacks below 768; bento collapses; chrome links hide below 768; arch grid 2-col then 1-col; ops dashboard wraps cleanly; no horizontal overflow at any width.

Fix any layout breaks inline. If any inline fix is non-trivial, capture it in this step's notes.

- [ ] **Step 2: Keyboard traversal**

Tab through the page top-to-bottom. Confirm every interactive element gets a visible focus ring (slate outline). Confirm "OPEN DOSSIER" buttons are reachable and Enter/Space opens the modal. Confirm dialog ESC closes and focus returns to the trigger.

Fix any missing focus styles by adding `:focus-visible` rules in `src/index.css`.

- [ ] **Step 3: Screen reader spot check (VoiceOver)**

Cmd+F5. Navigate by headings (VO+Cmd+H). Confirm 6 H2s announce in order: Selected artifacts, System architectures, SideQuest, A production-grade, (and Hero H1, Contact H3). Confirm decorative canvases announce as nothing.

- [ ] **Step 4: Run final lint + tests**

Run: `npm run lint && npm test`
Expected: PASS.

- [ ] **Step 5: Commit (only if files changed in steps 1–3)**

```bash
git add -A
git commit -m "polish: responsive + accessibility pass"
```

---

## Task 26: Final build verification

**Files:** none

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: Vite emits `dist/`, no errors. Three.js should appear as its own chunk in the build summary.

- [ ] **Step 2: Preview the production build**

Run: `npm run preview`
Open the preview URL. Smoke-test: hero, bento (open + close one dossier), systems, sidequest, ops, contact. URL `?project=dd-portal` opens that dossier on cold load.

- [ ] **Step 3: Stop preview, confirm everything is committed**

Run: `git status`
Expected: clean working tree.

The redesign is complete.

---

## Notes for the implementing agent

- **Order matters.** Tasks 1–13 are setup and primitives; 14 wires the shell; 15–22 build sections in dependency order; 23–26 layer Lenis + scroll motion + verification. Do not skip ahead.
- **Run `npm test` between every commit.** It catches regressions cheaply.
- **Manual browser checks are non-optional.** Tasks involving R3F, Lenis, or scroll-tied motion explicitly require running `npm run dev` and verifying visually. The unit tests cannot prove these work.
- **Fonts:** if you see Times New Roman in the headline, `@fontsource/instrument-serif` did not load. Confirm imports in `src/index.css` and the dep is installed.
- **R3F/React 19 peer warnings** during `npm install` are expected (drei has not bumped its peer range yet); they do not block runtime.
- **If a step's code drifts from the spec**, prefer the spec at `docs/superpowers/specs/2026-04-27-archive-redesign-design.md` and ask before deviating.
- **Deferred polish (intentional):** the spec lists per-card art components (`IntegrationFleetDiagram` for the wide DD Integrations card, `PortalStackArt` for the DD Portal flagship card). These are typed as optional (`art?: ComponentType` on `Project`) and are *not* implemented in this plan — bento cards render copy + tags + dossier button only. After the initial pass ships and the user has seen the result, treat these as a small follow-up: add the SVG/HTML art components and pass them via `art` on the relevant `PROJECTS` entries.
