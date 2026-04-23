# Portfolio — Apple-style redesign

**Date:** 2026-04-22
**Author:** Bryce Rambach (with Claude)
**Status:** Design locked, implementation plan pending

## 1. Intent

Replace the current conversational-AI portfolio (chat UI, orb, constellation, cursor halo, artifacts) with a scrollable single-page site modeled on Apple's product pages. The site's job is to communicate, fast, that the user is a competent full-stack engineer looking for Solutions Engineer or Full-Stack roles at early-stage startups starting summer 2026.

Design reference: `DESIGN.md` at repo root (Apple design system spec).

## 2. Architecture

### Teardown

Delete:
- `src/components/Chat/`, `src/components/Orb/`, `src/components/Constellation/`, `src/components/CursorHalo/`, `src/components/Artifacts/`, `src/components/Header/`
- `src/lib/store.ts` (Zustand store for chat state) and any chat/streaming/topic-matching logic
- `api/chat.ts` (server route)
- `@anthropic-ai/sdk`, `@upstash/ratelimit`, `@upstash/redis`, `zustand` from `package.json`
- Any Turnstile integration
- All but `BIO`, `PROJECTS`, `AI_STACK` in `src/lib/content.ts`

Keep:
- `public/Bryce_Rambach_Resume.pdf`, `public/favicon.ico`
- `src/main.tsx`, `src/index.css` (gut styles, keep Tailwind entry)
- `motion` (still used for the pinned-scroll choreography and fade-ins)
- `lucide-react` (icons in nav)
- Tailwind v4, Vite, Vitest, TypeScript

### New file structure

```
src/
├── App.tsx                # Stacks Nav + 5 sections + Footer
├── main.tsx               # unchanged
├── index.css              # Tailwind entry + Apple design tokens (CSS custom properties)
├── components/
│   ├── Nav.tsx            # Sticky translucent-glass nav (desktop + mobile Sheet trigger)
│   ├── MobileMenu.tsx     # shadcn Sheet wrapper with Apple-styled overlay content
│   ├── AppleButton.tsx    # Hand-coded pill CTA (button / anchor polymorphic)
│   ├── Hero.tsx           # Black section, eyebrow + name + subtitle + CTAs
│   ├── Work.tsx           # Light section, "6+" stat-forward
│   ├── Projects.tsx       # Black section, pinned-scroll choreography
│   ├── Stack.tsx          # Light section, 3 stacked rows
│   ├── Contact.tsx        # Black section, split pitch + spec table
│   ├── Footer.tsx         # Light gray, copyright + colophon
│   └── ui/                # shadcn primitives (only Sheet; see §4)
└── lib/
    └── content.ts         # Trimmed to BIO, PROJECTS, AI_STACK
```

### Section order and background rhythm

1. Hero — `#000000`
2. Work — `#f5f5f7`
3. Projects — `#000000`
4. AI & Tools — `#f5f5f7`
5. Contact — `#000000`
6. Footer — `#f5f5f7`

The nav floats over all of it with its dark translucent glass.

## 3. Design tokens (CSS custom properties, defined in `index.css`)

```css
:root {
  /* Colors */
  --bg-dark:      #000000;
  --bg-light:     #f5f5f7;
  --text-dark:    #1d1d1f;
  --text-light:   #ffffff;
  --text-body-on-light: rgba(0, 0, 0, 0.8);
  --text-muted-on-light: rgba(0, 0, 0, 0.56);
  --text-body-on-dark:  rgba(255, 255, 255, 0.88);
  --text-muted-on-dark: rgba(255, 255, 255, 0.5);
  --accent-blue:  #0071e3;
  --link-light:   #0066cc;  /* link on light bg */
  --link-dark:    #2997ff;  /* link on dark bg */
  --hairline-light: rgba(0, 0, 0, 0.1);
  --hairline-dark:  rgba(255, 255, 255, 0.12);
  --status-green: #30d158;

  /* Type (from DESIGN.md) */
  --ff-display: 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --ff-text:    'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* Radii */
  --r-card:   12px;
  --r-button: 8px;
  --r-pill:   980px;

  /* Shadow (rare) */
  --shadow-card: 3px 5px 30px rgba(0, 0, 0, 0.22);

  /* Motion */
  --ease-apple: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fade:   500ms;
  --dur-swap:   400ms;
}
```

Per DESIGN.md §3 type hierarchy — no overrides. SF Pro Display at `≥20px`, SF Pro Text below. Negative tracking at every size.

## 4. shadcn usage

Minimal. The Apple system is opinionated enough that most "primitives" (nav, cards, spec tables, CTAs) are hand-coded with Tailwind. Only use shadcn for:

- **Sheet** — the mobile nav overlay (hamburger → slide-in menu). Built on Radix UI's Dialog primitive, it ships focus trap, `aria-modal`, Escape-to-close, click-outside-to-close, and body-scroll-lock — all of which the spec requires and which are tedious to hand-roll correctly. Wrap in a small `MobileMenu` component that supplies the Apple-styled content (dark bg, large link list, Résumé block CTA).

CTAs (`View projects`, `Résumé`, `Email me`) are hand-coded as a small `AppleButton` component (`<button>` / `<a>` polymorphic, ~15 lines) rather than wrapping shadcn's `Button` — the Apple pill style overrides nearly every default, so the Radix Slot machinery doesn't earn its pixels.

Do not install `NavigationMenu`, `Card`, `Button`, etc. — they add complexity beyond what's needed.

## 5. Components

### 5.1 `Nav.tsx` (already approved; here for completeness)

- Sticky, top: 0, z-index 50, height 48px (44px on mobile).
- Background: `rgba(0, 0, 0, 0.8)` with `backdrop-filter: saturate(180%) blur(20px)`.
- Desktop layout: CSS grid with three columns — logo left, links centered, Résumé pill right.
- Logo: text "Bryce Rambach" in SF Pro Text 14px weight 600, white, `letter-spacing: -0.22px`. Clickable, scrolls to `#hero`.
- Links: 4 anchors — Work, Projects, AI & Tools, Contact. SF Pro Text 12px weight 400, white at 80%, white at 100% on hover and when the active section is in view. Scroll-spy via `IntersectionObserver` on section roots.
- Résumé pill: SF Pro Text 12px, white text, white/20% border, 980px radius, 8px 14px padding. Opens `/Bryce_Rambach_Resume.pdf` in a new tab.
- Mobile: hamburger icon right (from `lucide-react`), opens a shadcn `Sheet` that slides in from the right covering the full viewport. Sheet content: the 4 nav links stacked at 20px SF Pro Display 400, plus Résumé as a block-level pill CTA at the bottom. Sheet background: `#000000` (matches nav glass when fully opaque); text white. Closing the sheet on link click is handled manually (each link calls the sheet's `onOpenChange(false)` before navigating).

### 5.2 `Hero.tsx`

- Section with black background, min-height 100vh, centered flex column content.
- Max content width 720px.
- Eyebrow: `<span>` with a green dot + text. Text: `Available summer 2026 · SF / NYC`. SF Pro Text 13px weight 400, `rgba(255,255,255,0.72)`. Dot is a 6px circle, `#30d158`, with a `box-shadow: 0 0 8px rgba(48,209,88,0.6)`. Dot pulses infinitely (2s ease-in-out).
- Headline: `Bryce Rambach.` SF Pro Display 56px weight 600, line-height 1.07, letter-spacing -0.28px, white. Responsive: 40px on mobile, 48px on tablet.
- Subtitle: `Full-stack engineer. Ships production solo.` SF Pro Text 17px weight 400, line-height 1.47, letter-spacing -0.374px, `rgba(255,255,255,0.88)`.
- CTAs row, gap 14px:
  - Primary (`AppleButton variant="primary"`): `View projects` → anchors to `#projects`. Bg `#0071e3`, white text, 980px radius, 11px 22px padding, SF Pro Text 14px weight 500.
  - Ghost (`AppleButton variant="ghost"`): `Résumé` → opens PDF in a new tab. Transparent bg, `#2997ff` text, `rgba(41,151,255,0.6)` border, 980px radius, same padding.
- Mobile: CTAs stack, full-width.

### 5.3 `Work.tsx`

- Light bg, centered column, max-width 720px.
- Eyebrow: `Current role · Digital Directions` in 13px weight 600, `#0066cc`.
- Hero stat:
  - Number `6+` at 88px weight 600, line-height 0.95, letter-spacing -2.5px, `#1d1d1f`. Mobile 64px, tablet 80px.
  - Label under it: `live enterprise integrations, owned solo` at 14px weight 600, `rgba(0,0,0,0.8)`.
- Body paragraph (16-17px, `rgba(0,0,0,0.8)`, max 52ch): `Connecting HR, payroll, and finance systems across HiBob, NetSuite, MYOB, KeyPay, and Deputy. Built reusable integration frameworks and webhook queueing that handles 500+ records per sync cycle.`
- Logo strip: single horizontal row of names — HiBob, NetSuite, MYOB, KeyPay, Deputy, Workato. 13px weight 600, `rgba(0,0,0,0.48)`, separated by 22px gap. Top-bordered with 1px hairline. Wraps to two rows on mobile.

### 5.4 `Projects.tsx` (the signature piece)

**Layout — single pinned stage (repeats 4 times with swapping content):**

- Section heading (static, pinned): label `Projects`, H2 `Projects.` at 30px weight 600 line-height 1.10. Subtitle `Four I'm proud of.` at 15px. One hairline rule.
- Stage content (swaps):
  - Ghosted numeral: current project index, 80px weight 600, line-height 0.95, letter-spacing -2.2px, `rgba(255,255,255,0.18)`.
  - Project name: 36px weight 600, line-height 1.07, white. E.g., `Digital Directions Client Portal.`
  - Subtitle: PROJECTS[i].subtitle, 14px weight 400, `rgba(255,255,255,0.6)`.
  - Body: PROJECTS[i].body, 15px weight 400, line-height 1.47, max 58ch, `rgba(255,255,255,0.88)`.
  - Tags: PROJECTS[i].tags as pill chips — 12px, white at 72%, 1px border at white 20%, 980px radius, 4px 10px padding.
- Progress ticks (static shell, dynamic fill): 4 ticks × 24×2px, white at 20% background. Active ticks fill to solid white.
- Counter text: `01 / 04` at 12px weight 600 in tabular-nums, `rgba(255,255,255,0.48)`.

**Choreography — pinned scroll:**

- Section pins at the top of the viewport when it reaches `top: 0` and releases after 400vh of internal scroll.
- 100vh of scroll per project. Total: 4 × 100vh = 400vh pin duration.
- Implementation uses the `motion` library's `useScroll({ target, offset })` to get a progress value 0–1 across the pin, then derives four per-project opacities and a ticks-fill value.
- Per-swap transition (e.g., project 1 → 2, centered on the boundary):
  - Outgoing: `y: 0 → -24px, opacity: 1 → 0`
  - Incoming: `y: +24px → 0, opacity: 0 → 1`
  - Duration: 400ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
  - Ghosted numeral: crossfades with the same timing.
- Ticks: fill left-to-right as each boundary is crossed; each tick's fill transitions 400ms with the same easing.
- Section heading, subtitle, rule, ticks shell, counter *frame* — all stay fully static.
- Phase map (% of internal scroll):
  - 0% — pin engages, project 01 content fades in from `y+24`.
  - 25% — swap 1→2.
  - 50% — swap 2→3.
  - 75% — swap 3→4.
  - 95% — project 04 at full opacity.
  - 100% — pin releases; next section (AI & Tools, light) scrolls up under the last stage.
- **Reduced-motion / mobile fallback** (see §7): pin is disabled; the 4 projects stack vertically, each at ~100vh, with the normal fade-in-on-scroll treatment.

**Project order** (from `content.ts`):
1. `dd-portal` — Digital Directions Client Portal
2. `bryce-digital` — Bryce Digital
3. `dd-integrations` — Enterprise Integration Work
4. `portfolio` — brycerambach.com (copy needs a small rewrite — the current blurb references the orb; replace with something like `"The site you're on. Built as an Apple-style scrollable one-pager after an earlier conversational prototype didn't ship the message."`)

### 5.5 `Stack.tsx`

- Light bg, centered heading block, max-width 720px.
- Eyebrow: `How I work` (12px weight 600, #0066cc, uppercase, letter-spacing 0.2px).
- H2: `AI & Tools.` (30px weight 600, centered).
- Subtitle: `Daily infrastructure for shipping.` (15px, `rgba(0,0,0,0.6)`, centered, margin-bottom 36px).
- 3 stacked rows, each with a top hairline; last row has a bottom hairline. Row layout: CSS grid `34% 1fr` with gap 24px, 22px vertical padding per row, baseline-aligned.
  - Left col: name at 24px weight 600, letter-spacing -0.2px, `#1d1d1f`.
  - Right col: `use` copy at 15px weight 400, line-height 1.47, `rgba(0,0,0,0.72)`, letter-spacing -0.3px.
- Mobile: grid collapses to single column; name on top, description below, still hairline-separated rows.
- Content: iterate `AI_STACK` from `content.ts`.

### 5.6 `Contact.tsx`

- Black bg, `<section id="contact">`.
- Desktop grid: `1fr 240px` (left pitch, right spec table), gap 32px.
- Left column:
  - Eyebrow: `Contact` (12px weight 600 uppercase, `#2997ff`).
  - H2: `Let's talk.` (44px weight 600 line-height 1.07 letter-spacing -0.28px, white). Mobile 32px, tablet 40px.
  - Availability paragraph: `Open to Solutions Engineer or Full-Stack roles at early-stage startups. Relocating to SF or NYC summer 2026.` (15px weight 400, line-height 1.47, `rgba(255,255,255,0.78)`, max 44ch).
  - CTA row: `Email me` (primary, `mailto:bryce.rambach@gmail.com`) + `Résumé` (ghost).
- Right column (spec table):
  - No container chrome. Top border hairline; each row has bottom border hairline.
  - Each row: flex between, 12px padding-y, 13px font size, gap 12px.
  - Label (left): 11px weight 600 uppercase, `rgba(255,255,255,0.5)`, letter-spacing 0.3px.
  - Value (right): 13px weight 400, white, right-aligned, `word-break: break-word`.
  - Rows:
    - Email → `bryce.rambach@gmail.com` (mailto link)
    - Phone → `(831) 236-1922` (tel link)
    - LinkedIn → `/in/bryce-rambach` (anchor)
    - GitHub → `@brambach` (anchor)
    - Based → `San Diego → SF / NYC` (plain text, `rgba(255,255,255,0.72)`)
- Mobile: grid collapses to a single column; spec table appears below the pitch.

### 5.7 `Footer.tsx`

- Light gray (#f5f5f7) bar, 18px vertical padding, 36px horizontal.
- Flex row, space-between, wraps on small screens, gap 12px.
- Left: `© 2026 Bryce Rambach.`
- Right: `Built with React · SF Pro`
- Both at 11px SF Pro Text, `rgba(0,0,0,0.56)`, letter-spacing -0.08px.
- No nav repeats, no legal/privacy links.

## 6. Responsive collapse

Breakpoints (per DESIGN.md §8): mobile <640, tablet 640–1024, desktop ≥1024.

| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Nav | 44px, logo + hamburger overlay, Résumé hidden until overlay | 48px, full horizontal layout | Same as tablet |
| Hero | Name 40px; eyebrow allowed to wrap; CTAs stack full-width | Name 48px; CTAs side by side | Name 56px |
| Work | "6+" at 64px; logo strip wraps 3-per-row | "6+" at 80px; logos single row | "6+" at 88px |
| Projects | **Pin disabled.** 4 cards stack vertically, each ~100vh, normal fade-in. Ghosted numeral still appears per card. | Pin enabled, 100vh per stage | Pin enabled |
| AI & Tools | Rows collapse to single-column (name above description) | Grid `34% 1fr` | Same |
| Contact | Split collapses to stacked (pitch above, spec table below) | Split `1fr 240px` | Same |
| Footer | Copyright and colophon stack | Side-by-side | Side-by-side |

Section alternating backgrounds persist at every breakpoint — the cinematic rhythm never breaks.

## 7. Motion

- **Fade-in on scroll (every section, every top-level block):** `IntersectionObserver` at 15% threshold, triggers once. Animation: `opacity 0 → 1, translateY 16px → 0`, duration 500ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. No re-trigger when scrolling back up.
- **Pinned Projects choreography:** scroll-linked transforms via `motion`'s `useScroll`/`useTransform`. Specs in §5.4.
- **Availability dot pulse:** `@keyframes` infinite 2s ease-in-out on the dot's `box-shadow` blur/opacity. Only motion in the hero.
- **Nothing else.** No hover lifts, no parallax, no mouse-tracking, no spring physics.

### Reduced motion (`prefers-reduced-motion: reduce`)

- Fade-ins become instant (opacity 1, translateY 0, no transition).
- Pinned Projects choreography is disabled on every viewport width. Section renders as the vertical-stack fallback (4 project cards, each approximately 100vh tall, with ghosted numeral visible per card, standard fade-in-on-scroll on entry).
- Availability dot pulse is disabled (dot stays at rest opacity/shadow).

## 8. Accessibility

- Semantic HTML. One `<h1>` in the hero; one `<h2>` per section; `<h3>` per project card.
- Nav is `<nav aria-label="Primary">`. Links are real `<a>` anchors with hash targets (`#work`, `#projects`, `#stack`, `#contact`).
- Skip-to-main link (`Skip to content`) visible on focus, targets `#hero`.
- Every section: `<section id="..." aria-labelledby="...-heading">`.
- Focus ring: `2px solid #0071e3` outline with 2px offset on any interactive element (overrides default browser rings).
- Pinned Projects section uses a polite `aria-live` region that announces `Project 2 of 4: Bryce Digital` on each boundary crossing.
- Résumé link: `target="_blank" rel="noopener"`.
- Color contrast: all text/background combinations pass WCAG AA.
  - White on `#000000` — 21:1
  - `#1d1d1f` on `#f5f5f7` — 17.3:1
  - `#2997ff` on `#000000` — 5.9:1 (AA large, AA normal)
  - `#0066cc` on `#f5f5f7` — 6.3:1 (AA)
  - `rgba(255,255,255,0.88)` on black — passes AA normal
  - `rgba(0,0,0,0.8)` on `#f5f5f7` — passes AA normal
- Keyboard: all interactive elements reachable in DOM order; nav scroll-to-section via anchor links works with keyboard.

## 9. Content

`src/lib/content.ts` after the trim contains only:

- `BIO` — name, email, phone, linkedin, github, site, location, availability
- `PROJECTS` — 4 entries (DD Portal, Bryce Digital, DD Integrations, brycerambach.com)
- `AI_STACK` — 3 entries (Claude API, Claude Code, Workato)

Delete: `TOPICS`, `GREETING`, `FOLLOW_UPS`, `KEYWORDS_TO_HIGHLIGHT`, `ArtifactKind`, `Topic` types.

Rewrite `PROJECTS[3].body` (the portfolio self-reference) to drop the orb mention. Proposed:

> `The site you're on. Built as an Apple-style scrollable one-pager after an earlier conversational prototype didn't ship the message.`

Keep the other three `PROJECTS` bodies unchanged.

## 10. Dependencies

**Remove** from `package.json`:
- `@anthropic-ai/sdk`
- `@upstash/ratelimit`
- `@upstash/redis`
- `zustand`

**Keep**:
- `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite`, `autoprefixer`
- `motion` (used for pinned choreography + fade-ins)
- `lucide-react` (nav hamburger icon only)
- `shadcn` (devDep), `typescript`, `vitest`, `tsx`

**Add** (via `npx shadcn add sheet`):
- `@radix-ui/react-dialog` (transitive, powers shadcn Sheet)
- `class-variance-authority`, `clsx`, `tailwind-merge` (transitive, standard shadcn utilities)

No other runtime deps needed. All other effects are achievable with `motion` + Tailwind + CSS custom properties.

## 11. Out of scope / explicit non-goals

- No contact form. Email is a `mailto:` link.
- No analytics / cookie banner.
- No blog, case-study detail pages, or project deep-dives.
- No CMS. Content is static TypeScript.
- No images or product-shot photography — the site is typographic. (Apple's "product-as-hero" metaphor is replaced by "typography-as-hero.")
- No dark/light mode toggle — the alternating sections are the point.
- No SEO JSON-LD beyond what Vite's default `index.html` provides; a single `<title>` and `<meta name="description">` update is enough.

## 12. Acceptance criteria

- `npm run build` succeeds; no TypeScript errors (`npm run lint` passes).
- The five sections render in order with the correct alternating backgrounds at every breakpoint.
- Scrolling through Projects on desktop pins the section for ~400vh and crossfades through 4 projects with ghosted-numeral swap + tick fill + 24px drift.
- With `prefers-reduced-motion: reduce` set, the Projects section becomes a vertical stack of 4 cards with no pin and no crossfade; the hero eyebrow dot stops pulsing; all fade-ins become instant.
- Keyboard tab order: skip-link → nav links → Résumé → section content in order. Focus rings visible.
- Nav scroll-spy highlights the current section link on desktop.
- Résumé link opens `/Bryce_Rambach_Resume.pdf` in a new tab.
- `mailto:` link on the Contact primary CTA opens the user's mail client.
- Lighthouse accessibility score ≥ 95 on desktop.

## 13. Open questions (none)

All design decisions are locked as of this document. Any subsequent changes should be made to this spec and re-reviewed before implementation.
