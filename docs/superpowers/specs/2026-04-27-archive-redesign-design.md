# Spatial Archive Redesign — Design Spec

**Date:** 2026-04-27
**Owner:** Bryce Rambach
**Status:** Approved for implementation planning

## Goal

Replace the existing Apple-style React portfolio with a faithful React port of `Archive.html` — same content, same dark glass-cosmic personality — wrapped in Lenis smooth scroll, with the hero icosahedron promoted to real 3D and scroll-driven motion accents on a few hand-picked moments. URL-synced project dossiers, no toggle gimmicks, no shadcn.

## Constraints & Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Fidelity | Faithful structure, refined execution (latitude where needed) | Preserve content/personality; allow React-friendly upgrades (motion, R3F) and polish |
| Existing `src/` | Nuke and rebuild | Apple components are stylistically incompatible — clean break beats salvage |
| Lenis depth | Smooth scroll + scroll-tied progress on 3 moments | Heavy/smooth feel, but motion reacts to scroll on a few earned moments |
| 3D library | `motion` + R3F for hero icosahedron only | Pay Three.js cost once on the highest-impact element |
| Project dossiers | Modal with real (placeholder) content | Cards become real entry points; copy iterable independently of component |
| Voice/density toggles | Drop entirely | Designer scaffolding; doesn't earn UI cost |
| Project URLs | URL-synced modal (`?project=<slug>`) | Shareable, refresh-safe, back-button works; no router dep |
| shadcn MCP | Skip | Bespoke design language; existing Radix Dialog covers needs |

## Architecture

### Tech stack

**Add:**
- `lenis` — smooth scroll engine
- `three`, `@react-three/fiber`, `@react-three/drei` — hero icosahedron only
- `@fontsource/inter`, `@fontsource/instrument-serif`, `@fontsource/jetbrains-mono` — self-hosted fonts (no Google FOUT)

**Already present, will use:**
- `motion` — reveals, tilt, scroll-progress
- `@radix-ui/react-dialog` — dossier modal shell
- `tailwindcss v4`, `clsx`, `tailwind-merge`

**Remove from `src/` in one wipe commit:**
`Hero.tsx`, `Work.tsx`, `Projects.tsx`, `Stack.tsx`, `Contact.tsx`, `Footer.tsx`, `Nav.tsx`, `MobileMenu.tsx`, `AppleButton.tsx`, `FadeIn.tsx`, plus all matching `.test.tsx`.

### Top-level layout

```
<App>
  <ReactLenis root options={{lerp: 0.08, duration: 1.4}}>
    <CosmicBackground />            // fixed, z-0 (bloom + grid + noise)
    <Chrome>                        // fixed, z-50 (mark + nav links + status)
    <main>
      <Hero />                      // R3F icosahedron + flow-field canvas
      <ArchiveSection />            // bento with 4 project cards
      <SystemsSection />            // architecture grid (6 cards)
      <SideQuestSection />          // concept feature panel
      <OpsSection />                // dashboard mock
      <ContactSection />
    </main>
    <Footer />
    <DossierDialog />               // URL-synced via ?project=
  </ReactLenis>
</App>
```

### Component inventory (all under `src/components/`)

**Layout/chrome:** `CosmicBackground`, `Chrome`, `Footer`
**Sections:** `Hero`, `ArchiveSection`, `SystemsSection`, `SideQuestSection`, `OpsSection`, `ContactSection`
**Primitives:** `GlassCard`, `Reveal`, `TiltCard`, `SectionHead`
**Dossier:** `DossierDialog`
**Hero pieces:** `HeroIcosahedron` (R3F), `HeroFlowField` (vanilla canvas)
**Project art:** `IntegrationFleetDiagram` (SVG), `OpsDashboardMock` (HTML+SVG), `SideQuestField` (CSS depth field), `PortalStackArt`

**Hooks/lib:**
- `src/lib/projects.ts` — `PROJECTS` data + `Project` type
- `src/lib/use-project-from-url.ts` — `?project=` ↔ open-state sync, popstate aware
- `src/lib/cn.ts` — existing className helper (kept)

## Design tokens (`src/index.css`, Tailwind v4 `@theme`)

```css
--color-bg: #000;
--color-ink: #fff;
--color-ink-2: rgba(255,255,255,0.72);
--color-ink-3: rgba(255,255,255,0.48);
--color-ink-4: rgba(255,255,255,0.28);
--color-hair: rgba(255,255,255,0.08);
--color-hair-2: rgba(255,255,255,0.14);
--color-glass: rgba(255,255,255,0.02);
--color-glass-2: rgba(255,255,255,0.035);
--color-slate: 56 189 248;        /* rgb channels for opacity math */
--color-good:  134 239 172;
--color-warn:  245 158 11;
--font-serif: "Instrument Serif", Times, serif;
--font-mono:  "JetBrains Mono", ui-monospace, Menlo, monospace;
--font-sans:  "Inter", system-ui, sans-serif;
```

All values match Archive's `:root` exactly. Fonts loaded via `@fontsource/*` so first paint isn't blocked on Google.

## Section composition (1:1 from Archive)

| Section | Key parts |
|---|---|
| `Hero` | H1 ("Bryce *Rambach*. Engineering high-fidelity bridges…"), lede, meta-row (SD→SF/NYC · FULL-STACK · INDEX 0/6), email + résumé magnet links, R3F icosahedron, flow-field canvas, fixed cosmic bg, "↓ SCROLL TO ENTER ARCHIVE" footer |
| `ArchiveSection` (`#archive`) | `SectionHead` "01 / Archive", bento with 4 cards: DD Portal (featured/large), Bryce Digital (tall), Integration Fleet (wide w/ live SVG), brycerambach.com (side). All cards `GlassCard` + `TiltCard`. "OPEN DOSSIER" sets `?project=<slug>` |
| `SystemsSection` (`#systems`) | `SectionHead` "02 / Systems", 6-card arch grid (Workato, NetSuite, Claude API, Next.js 15, Drizzle+PG, Claude Code) with role/scale spec lists and proficiency bars. Bars animate width 0 → `--bar` on viewport enter |
| `SideQuestSection` (`#sidequest`) | `SectionHead` "03 / Concept", single large quest panel: depth-field bg, copy block, decorative ring/spinner shape. CSS-only depth field; promote to R3F if/when it gets its own page |
| `OpsSection` (`#ops`) | `SectionHead` "04 / Production", full-width ops shell: copy column + dashboard mock (browser chrome, sidebar, fleet rows with sparklines and OK/RETRY badges). Sparklines = inline SVG `<polyline>`; "● live" pulses |
| `ContactSection` (`#contact`) | "END OF ARCHIVE · INDEX 05" label, "Let's build something *load-bearing*" headline, sub copy, four contact links (mail, tel, LinkedIn, GitHub), pulsing status badge. No form |
| `Footer` | © · stack · version row |

## Animation system — three coordinated layers

### Layer 1 — Reveals (every section)
Single `<Reveal delay={0..6}>` component using `motion`'s `useInView({ amount: 0.2, once: true })`. Animates `opacity 0→1`, `filter blur(10px)→0`, `translateY(14px)→0` over 1.2s, easing `cubic-bezier(0.2, 0.7, 0.2, 1)`. Delays step at 80ms each (matches Archive's `data-delay`). Replaces Archive's IntersectionObserver script.

### Layer 2 — Pointer tilt (cards)
`<TiltCard maxTilt={6}>` wrapper reads `pointermove`, computes normalized x/y, applies `rotateX/rotateY`, and updates two CSS vars (`--mx`, `--my`) that drive the glass card's hover-spotlight `::after` radial gradient. Resets smoothly on `pointerleave`. Disabled on touch devices and `prefers-reduced-motion: reduce`.

### Layer 3 — Scroll-tied moments (Lenis-driven)

1. **Hero icosahedron rotation.** Y-axis rotation = base auto-spin + `scrollY * 0.0008`. Scroll faster, icosahedron spins faster.
2. **Cosmic bg parallax.** `bg-bloom` translates `Y * -0.15`, `bg-grid` translates `Y * -0.05` against scroll. Subtle depth.
3. **Section number counter slide.** The `01 / Archive` numerals in each `SectionHead` get `translateX(-12px → 0)` tied to that section's `useScroll` progress 0→0.3.

Scroll values come from `useLenis()` (raw scrollY) for #1/#2 and `motion`'s `useScroll({ target, offset })` for #3. Both stay in sync because Lenis owns scroll position.

### Reduced motion
`prefers-reduced-motion: reduce` flips all three layers to instant/disabled and short-circuits Lenis (`smoothWheel: false`).

## Hero R3F scene

- Single `<Canvas>` with `OrthographicCamera` for crisp wireframe edges
- `<Icosahedron args={[1.6, 0]}>` with two materials: solid black inside + `MeshBasicMaterial wireframe` in slate-blue at 0.4 opacity
- Auto-rotate via `useFrame` + scroll-tied multiplier
- `dpr={[1, 2]}` (clamped to `[1, 1.5]` on `<640px`)
- Suspense fallback: empty div — icosahedron just doesn't render until ready, no spinner
- Lazy-imported in `Hero.tsx` so Three.js sits in its own chunk

## Project + dossier data shape

```ts
type ProjectStatus = "in-production" | "shipping" | "concept" | "recursive";

type Project = {
  slug: string;                 // url-safe, e.g. "dd-portal"
  index: string;                // "A.01", "A.02", … (display only)
  kind: "FLAGSHIP" | "PRACTICE" | "FLEET" | "META" | "CONCEPT" | "PRODUCTION";
  status: ProjectStatus;
  kicker: string;               // "Solo-built · 2025–Present"
  title: string;                // "Digital Directions Client Portal"
  cardBody: string;             // short copy on bento card
  tags: string[];               // ["Next.js 15", "TypeScript", …]
  bentoSlot: "feat" | "tall" | "wide" | "side" | "full";
  art: ComponentType;           // per-card visual
  dossier: {
    overview: string;           // 2–3 paragraph narrative (placeholder)
    decisions: { title: string; body: string }[];   // 3–5 key decisions
    stack: { label: string; values: string[] }[];   // grouped: runtime/data/ai/infra
    role: string;
    timeline: string;
    outcomes: string[];
    links?: { label: string; href: string }[];
  };
};

export const PROJECTS: Project[] = [ /* 6 entries */ ];
```

Six projects: `dd-portal`, `bryce-digital`, `dd-integrations`, `portfolio`, `sidequest`, `ops-portal`. Placeholder dossier copy drafted from Archive's existing card + section copy; each entry carries a `// TODO: real copy from Bryce` comment for trivial swap-in.

## Dossier modal

- Built on `@radix-ui/react-dialog` — focus trap, ESC, scroll lock, ARIA for free
- Glass-styled to match (backdrop blur 30px, `--hair-2` border, slate-glow inset)
- Layout: header (kind/index + status), title block, overview, decisions list, stack grid, sidebar with role/timeline/outcomes/links
- Open/close: 220ms fade + 6px translate-down

## URL sync (`use-project-from-url`)

- Reads `?project=<slug>` from `window.location.search` on mount
- Listens to `popstate` so back-button closes the dossier
- `openProject(slug)` → `history.pushState({}, '', '?project=<slug>')`
- `closeProject()` → `history.pushState({}, '', window.location.pathname)`
- ~30 LOC, no router dep

## Responsive behavior

- **Desktop (≥1024px):** two-column hero, full bento grid (12-col), arch grid 3-col
- **Tablet (640–1023px):** hero stacks, bento collapses to 2-col with featured card spanning, arch grid 2-col
- **Mobile (<640px):** single column everywhere, chrome `navlinks` hide (per Archive), tilt disabled, R3F dpr clamped to `[1, 1.5]`

## Accessibility

- All `<h2>` carry stable `id`s for in-page anchors (matches Archive's `aria-labelledby` pattern)
- Cards: `role="button"`, `tabindex="0"`, keyboard `Enter`/`Space` opens dossier
- Dialog: labeled close button, focus trap, focus return on close
- `prefers-reduced-motion`: kills Lenis smoothing, kills tilt, replaces blur reveals with instant fade
- All decorative canvases get `aria-hidden="true"`

## Testing strategy

Vitest + Testing Library (already configured). Behavior, not animation:

- `Hero.test.tsx` — renders headline, lede, contact links; canvas/R3F mocked
- `ArchiveSection.test.tsx` — one card per `PROJECTS` entry; "OPEN DOSSIER" sets URL
- `DossierDialog.test.tsx` — opens for slug, displays overview/decisions/stack, closes on ESC + close button
- `use-project-from-url.test.ts` — slug round-trips; popstate closes
- `Reveal.test.tsx` — adds visible state when `useInView` mock returns true
- `projects.test.ts` — every project has all required fields, slugs are unique

**Skip:** R3F render tests, Lenis scroll-tied effect tests, tilt rotation tests — visual + brittle in jsdom; verified manually in browser.

## Build & deploy

- Existing Vite + Vercel config unchanged
- R3F lazy-imported in `Hero.tsx`; Three.js gets its own chunk
- `vite-bundle-visualizer` run once to confirm chunking
- Static assets (résumé PDF) stay in `public/`

## Out of scope

- Voice / density / accent toggles from Archive
- Per-project routes (`/projects/<slug>`) — `?project=` only; promote later when each project gets its own Claude-designed page
- Blog / writing section
- Light mode
- Analytics, contact form, captcha
- shadcn/ui component imports
- Migration of any `Apple*` component code

## Build sequence (becomes the implementation plan)

1. Wipe Apple components + tests; commit
2. Add deps (`lenis`, `three`, R3F, `drei`, `@fontsource/*`); add tokens to `index.css`; commit
3. Build primitives: `GlassCard`, `Reveal`, `TiltCard`, `SectionHead`, `CosmicBackground`, `Chrome`, `Footer`; commit
4. Build `lib/projects.ts` with placeholder dossier content; commit
5. Build sections in order: `Hero` (with R3F + flow field) → `ArchiveSection` → `SystemsSection` → `SideQuestSection` → `OpsSection` → `ContactSection`; one commit per section
6. Build `DossierDialog` + `useProjectFromUrl`; wire bento cards; commit
7. Wire Lenis, scroll-tied moments, reduced-motion guards; commit
8. Pass on responsive, accessibility, manual browser verification; final commit
