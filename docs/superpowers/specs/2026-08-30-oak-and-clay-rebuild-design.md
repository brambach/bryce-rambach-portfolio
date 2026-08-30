# Oak and Clay rebuild - design spec

Date: 2026-08-30
Status: approved direction, spec for the production build
Source of truth for aesthetics: the Oak and Clay design canvas (Claude artifact
`2788ed73-c8f2-49a0-918e-89c5659846e3`, Rev. 3) and the memory files
`oak-and-clay-direction`, `portfolio-voice-rules`, `pinterest-vibes-board`.

## Goal

Replace the cosmic/glass direction in this repo with the locked Oak and Clay
design as the production brycerambach.com. One page, six chapters, the scroll
is one day. Premium and a little playful, never try-hard.

## What happens to the existing code

- The cosmic WIP is checkpointed on `main` (commit `27d1128`). This build
  happens on `redesign/oak-and-clay`.
- **Carries over:** Vite + React 19 + Tailwind 4 + motion + Lenis + vitest
  tooling, `SmoothScroll` (Lenis wrapper with reduced-motion guard), `Reveal`
  (if useful for settle triggers), `src/lib/utils.ts`, the test setup and the
  test-per-component pattern.
- **Reshaped:** `src/lib/projects.ts` becomes the single data file for the
  index rows, vibe board cards, and streak number.
- **Retires at the end (not before the new site stands):** CosmicBackground,
  GlassCard, TiltCard, HeroIcosahedron, HeroFlowField, SubwayMap,
  DossierDialog, `use-project-from-url` (no dossier routes in the new site),
  OpsSection, SideQuestSection, SystemsSection, ArchiveSection, CustomCursor,
  IntegrationsRing, Chrome, Footer, SectionHead, and their tests.
- **Dependencies dropped at cleanup:** `three`, `@react-three/fiber`,
  `@react-three/drei`, `react-use-measure`, `@radix-ui/react-dialog`,
  `@fontsource/instrument-serif`, `@fontsource/inter`,
  `@fontsource/jetbrains-mono`. `lucide-react` stays only if the new build
  actually uses an icon; otherwise it goes too.

## Foundations

### Type

Via fontsource (matching the current pattern):

- **Bodoni Moda** 400-800 + italic. Display. Wordmark "bryce." lowercase, set
  huge, on photography, never on empty paper. Chapter heads are short, often
  italic. Roman for "Systems, wired together." Index project names.
- **Hanken Grotesk** 300-600. Body. 15-16px, line-height ~1.7.
- **IBM Plex Mono** 400-500. Annotations: section labels (lowercase, quiet),
  coordinates, tech tags, letterspaced 0.08-0.2em, 10-12px.
- **Caveat** 500-600. Handwritten margin notes only, never headlines. Always
  clay-family color, always tilted (-4 to +3 degrees).

### Palette (Tailwind theme tokens)

| Token | Hex | Role |
|---|---|---|
| paper | #F2EBDD | light ground |
| oak | #1C3527 | dark green, panels and text on paper |
| cognac | #A9713F | warm brown support |
| clay | #C14E2B | the accent, spent once per view |
| clay-bright | #D9683F | clay on dark grounds (labels, hare on dark) |
| golden | #E8C98F | mid-scroll day-arc stop |
| bluehour | #14242C | vibe board / after dark ground |
| night | #0E141A | final stop |
| ink-soft | #4A4438 | secondary text on paper |

Rule: photography owns the dark, paper carries the light, clay is spent once
per view. Links are clay, hover #A03E20.

### Surfaces

- **Paper grain:** fixed full-viewport SVG turbulence overlay (~0.45-0.55
  opacity, pointer-events none). Exact filter values in the Specimen artboard.
- **Torn-edge photo:** irregular polygon clip-path on photo containers.
- **Polaroid:** #F7F3EA frame, 9-11px padding, caption in Caveat below, tape
  strip (rgba(233,196,138,0.65), rotated) pinned to a corner, heavy soft
  shadow, resting rotation between -2.2 and +2.4 degrees.
- **Rounded green panel:** oak background, 44px radius, used once (off the
  clock).

### Marks

- **The hare:** engraved-line SVG rabbit (paths in the artboards). Nav mark
  top-left, small stamps beside photos, and the runner on the trail.
- **Monogram** B·R (Bodoni, clay dot) available for favicon/meta, not used on
  the page itself.

## New components

- `App` composes: `SmoothScroll` > `DayArc` (body background lerp) + `Grain`
  (fixed overlay) + `TrailRunner` (path, dots, hare, waypoints, flag) +
  `TopNav` (hare mark + four anchor links) + the six sections.
- Sections: `HeroDawn`, `WorkSection`, `MadeSection` (index),
  `OffTheClockSection`, `VibeBoardSection`, `AfterDarkSection`.
- Primitives shared across sections: `EnvelopeReveal` (photo + lifting
  cover), `Polaroid` (frame, tape, caption), `InkNote` (Caveat clip-path
  write-on), `Settle` (letterpress entrance, may absorb today's `Reveal`),
  `HareMark` (the SVG at any size/stroke), `StreakNumber` (split-flap
  count-up).
- Each unit answers: what it does is above; how you use it is props (src,
  caption, rotation, children); what it depends on is motion/react + the
  scroll progress context `DayArc` provides. No section imports another
  section.

## Page structure and copy

One page. Nav top-right: `work` / `life` / `now` / `say hi`, anchor-scrolled
(work → the work, life → off the clock, now → the vibe board, say hi → after
dark). Hare mark top-left. Copy below is final unless Bryce edits it; it has
already passed the voice rules.

### 1. Hero - forest dawn

Full-viewport `hero-forest.jpg`, dark gradient + vignette. Centered wordmark
"bryce." (clay full stop), Bodoni Moda 500, ~clamp(96px, 22vw, 320px).
Subline: "I build software, run before the sun's up, and spend the rest
chasing good light." Mono coordinate line "san diego, california" between
rules. Caveat note "welcome in" with hand-drawn arrow, rotated -7deg, near the
wordmark. Torn paper edge at the bottom with "follow the trail" + dotted
stub. Dappled canopy light drifts across the image (two radial-gradient blobs
on slow alternate keyframes). Scroll hint bobs.

### 2. the work

Label `the work`. Head "Systems, wired together." (Bodoni roman). Body: "By
day I wire payroll, HR and finance platforms together at Digital Directions.
The kind of plumbing nobody notices, which is the point." Mono tag line
"workato · myob · deputy · netsuite". Right: `macbook-desk.jpg` rotated
-1.2deg with envelope reveal, Caveat caption "the desk, 6pm", small hare stamp.

### 3. things I've made

Label `things I've made`. Dot-leader index rows, no cards. Row anatomy: Bodoni
name (34px) · Bodoni italic one-liner · dotted leader · mono tech tag ·
"take a look →" link (clay).

| name | one-liner | tag |
|---|---|---|
| arro | a running-streak ritual my family actually keeps | react native |
| trace | a second brain for my late-night coding sessions | typescript |
| throughline | watches my work and writes the story of it | slack · github |
| bryce-os | an operating system for exactly one person | watchers |

Links point at real repos/pages where they exist; a row with nowhere to link
yet drops the link, keeps the row.

### 4. off the clock

Rounded oak panel (44px radius) per the locked direction. Label
`off the clock` (clay-bright). Head "Run it in the family." (Bodoni italic).
Body: "The streak started as a bet with myself and became a family ritual.
Day 214 and counting. arro exists so the flame stays lit." The 214 counts up
inside the sentence (split-flap feel, see Motion). Mono footer "dawn miles ·
clay courts when I can get them". Right: paper card rotated 1.6deg with the
911 engraving sketch ("fig. 07 · the dream garage", "911 · oak green over
cognac"), Caveat note below: "someday. after the streak hits 1,000". Streak
number lives in `projects.ts` as a constant for now.

### 5. the vibe board

Head "The vibe board." Body: "Things I love, things I'm after. It's the same
list." Three staggered columns of polaroids and paper notes:
`clay-court.jpg` "clay season", `green-911.jpg` "the someday car",
`meadow-trail.jpg` "dawn miles", `snowboard-dusk.jpg` "winter, occasionally",
a paper note "next: building my own thing." / "sf or nyc · soon", and a small
hare card "always running".

### 6. after dark

Label `after dark` (clay-bright). Head "Pull up a chair." (Bodoni italic).
Body: "Beach fires, backyard movies, spikeball until nobody can see the ball.
If you made it all the way down here, we'd probably get along." Paper pill
button "say hi →" (mailto) + visible `bryce.rambach@gmail.com`.
`campfire-bluehour.jpg` with envelope reveal, Caveat overlay "the good part of
the day". Small polaroid `city-dusk.jpg`, "next stop →" / "sf or nyc · soon".
Caveat "made it." inks itself near the end. Sitting hare + flag +
"end of trail · for now" closes the page. No separate footer component.

### What is NOT on the page

No résumé link (the PDF stays in `public/` for direct URLs, nothing points at
it). No availability lines, no scorecards, no self-narrating design copy, no
"waypoint" labels visible to the reader.

## Motion

Reference implementation: the Motion Study artboard (parameters below are
lifted from it). All of it collapses to static-everything-visible under
`prefers-reduced-motion`, via the existing MotionConfig + Lenis guard.

1. **The scroll is one day.** Body background lerps through stops
   `[0 paper, 0.26 golden, 0.5 oak, 0.72 bluehour, 1 night]` of overall
   scroll progress, rAF-throttled. Text colors flip per section (oak on
   paper → paper on dark). The exact mid stops get tuned in build so the oak
   panel in section 4 still reads against the ground; the artboard values are
   the starting point.
2. **The trail and the hare.** A single SVG path runs the page spine. Dots
   (r 2.4, clay, every 15px of path length) appear up to
   `pathLength * scrollT * 1.06`; the hare rides `getPointAtLength`, steering
   angle clamped to ±24deg, hidden before 4% and dimmed at the flag.
   Waypoint circles stamp in (scale 0 → 1, back-out cubic-bezier(0.2, 1.4,
   0.4, 1)) at fixed progress marks. Desktop only; below `md` the trail and
   hare are hidden and the day-arc carries the narrative.
3. **Letterpress settle.** The one entrance move, used everywhere: opacity 0,
   translateY(20px) scale(1.02) → settled, transform 0.75s
   cubic-bezier(0.16, 1, 0.3, 1.35), opacity 0.45s ease. Trigger at 25%
   intersection.
4. **Envelope reveal.** Photos hide behind a paper cover with a torn bottom
   edge; on trigger it lifts translateY(-112%) rotate(-2deg) over 1.05s
   cubic-bezier(0.5, 0, 0.15, 1).
5. **Ink-in.** Caveat notes write themselves via clip-path inset sweep, 1.1s
   ease, 0.35s delay.
6. **Dot leaders** draw width 0 → 100% (1s ease, 0.25s delay) when their row
   settles.
7. **Split-flap streak.** 214 counts up over 1.3s, cubic ease-out, with a
   subtle scaleY tick while running.
8. **Polaroid scatter.** Vibe cards enter translateY(46px) at an exaggerated
   rotation, settle to resting rotation, 0.12s stagger, back-out easing.
9. **Dappled light** drifts on the hero (16s/21s alternate loops).

## Assets

The nine art-directed JPEGs from the canvas session are committed to
`public/images/` (25-197KB each): hero-forest, macbook-desk, clay-court,
green-911, meadow-trail, snowboard-dusk, campfire-bluehour, city-dusk,
desk-goldenhour (spare). They're codex `image_gen` stand-ins, art-directed
from the Pinterest Vibes board, and individually swappable later. Any
replacement must read as candid 35mm film, per the voice rules.

## Responsive

The artboards are desktop (1440px). Mobile approach:

- Hero wordmark scales with clamp; nav collapses to the four words at smaller
  size (no hamburger).
- Trail + hare are desktop-only (hidden below `md`); everything else stacks
  single column, polaroids in one staggered column with their rotations kept.
- Day-arc background, settle, reveals, and the streak counter all still run
  on mobile.
- Index rows wrap: name + one-liner on one line, leader + tag + link on the
  next at narrow widths.

## Testing

- Per-section test files as in the current build: RTL queries against the
  real copy above (headlines, labels, index rows, the email).
- Unit tests for the pure helpers: day-arc lerp (stop interpolation at 0,
  boundaries, 1), trail dot-count math, streak easing target.
- Reduced-motion: assert the static fallbacks render content (no hidden-
  forever covers).
- `npm run lint` (tsc) and `npm test` green at every phase.

## Out of scope

- Real photography replacing the stand-ins.
- Project detail pages/dossiers, CMS, analytics, deployment changes.
- The three rival directions (Gallery, Blueprint, Field Journal) stay dead.
