# Portfolio — Conversational Redesign

**Status:** Design approved, pending spec review
**Owner:** Bryce Rambach
**Date:** 2026-04-18

## Goal

Replace the current scroll-based editorial portfolio with a single-page **conversational experience** inspired by Claude.ai — warm cream paper, serif/sans typography, one terracotta accent, and a living "ember orb" avatar that reacts to every word a visitor types. Visitors ask questions in a chat; the orb absorbs their letters, thinks, and streams answers back with rich artifact cards for work, projects, and résumé.

The redesign replaces the current site (Hero → About → Skills → Work → Portfolio → Contact scroll) with one page, one chat, one ambient avatar. The chat IS the site.

## Why this, not a scroll portfolio

- Recruiters skim scroll portfolios in seconds. A conversation commands attention — the orb and the absorb animation create a single arresting moment that's hard to look away from.
- The chat doubles as genuine utility: recruiters can ask any question and get an on-topic answer (real LLM fallback for anything outside scripted topics).
- Uniqueness: very few engineering portfolios use an animated avatar + live AI chat as the primary interface. The novelty demonstrates taste, creative range, and front-end chops in one move.
- It's on-brand for someone who uses Claude Code daily and is targeting Solutions Engineer / early-stage startup roles where AI fluency is table stakes.

## Non-goals (YAGNI)

- No multi-page navigation. No dedicated `/about`, `/work`, `/projects` routes.
- No blog / writing section.
- No CMS or content management layer — content is a single TypeScript module.
- No dark mode toggle. The warm cream theme is the only theme.
- No account system, no cookies beyond a sessionStorage flag for the ignition animation.

## Success criteria

- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO
- First paint < 1.5s on 4G
- Visitor completes at least one chat exchange before leaving (analytics target)
- Reduced-motion users get a clean, quiet experience with no missed information
- Monthly AI bill stays under $10 at moderate traffic; hard kill-switch at $20

---

## 1. Experience architecture

The site is a single page. Everything lives inside one warm, cream chat surface.

**Layout (top to bottom):**

1. **Header** — persistent, never scrolls away. Left: `Bryce Rambach` wordmark (click = reset conversation). Center: five shortcut links — `Work · Projects · AI & Tools · Résumé · Contact`. Each auto-sends its prompt to the chat. Right: social icons (GitHub, LinkedIn, Email) + résumé PDF download.
2. **Conversation constellation** — a thin strip under the header. Starts empty. Each asked question appears as a tiny terracotta dot; hover shows the question preview; click scrolls to that exchange. The chat's built-in map.
3. **Main surface** — the orb sits pinned to the right side of the main content area, vertically centered to the viewport. Messages stack on the left. The orb remains visible as the page scrolls (sticky positioning).
4. **Input bar** — pinned to the bottom of the viewport, always reachable. Placeholder rotates between suggestions ("Ask about my work", "Ask about projects").

**Stacking behavior:** each new exchange pushes previous ones up the stack. Visitors scroll up to re-read. The orb stays pinned and reacts to the *most recent* message's state.

**First load:** only the greeting and input exist. Empty, confident, lots of air.

---

## 2. Visual system

### Palette

The entire site uses only these tokens; anything else is a mistake.

| Token | Hex | Purpose |
|---|---|---|
| `paper` | `#faf7f2` | Page background |
| `surface` | `#f4efe6` | Stage / message bubble background |
| `ink` | `#1f1d1a` | Primary text |
| `ink-soft` | `#6b6359` | Secondary text |
| `muted` | `#9a8d79` | Tertiary / placeholders |
| `line` | `#e8e1d3` | Hairline borders |
| `accent` | `#c8704a` | Terracotta — the ONE warm color |
| `accent-deep` | `#8a4220` | Orb shadow, hover states |
| `accent-soft` | `#e8b088` | Halo, glow accents |
| `accent-glow` | `#f4c9a3` | Flash ring, heat-up |
| `warm-hi` | `#ffe4c4` | Ember highlight, keyword glow |

### Typography

- **Display:** Instrument Serif. Used for greeting, response text, artifact headings.
- **Body / UI:** Inter. Used for chat input, chips, header links, body in artifacts.
- **Accent rule:** italic Instrument Serif in terracotta on *key nouns* within greetings and streaming answers ("Hi, I'm *Bryce*", "...living in *Manhattan*").

JetBrains Mono is dropped — it doesn't fit this aesthetic.

### Motion principles

- **Easings:** `cubic-bezier(.2, .8, .2, 1)` for entrances, `cubic-bezier(.55, .05, .3, 1)` for letter absorption arcs.
- **Pacing:** long calm idles (4–6s loops), short punchy reactions (300–500ms). Nothing in between.
- **Budget:** all continuous animations run on `transform` and `opacity` only. Filter changes (brightness/saturate) only apply to the orb core, not to text.
- **Discipline:** the terracotta appears on orb, italic keywords, send button, focus ring, constellation dots, résumé download icon — and nowhere else.

### Layout primitives

- Whitespace is the primary design element.
- Hairline 1px borders only. No drop shadows except on the orb and artifact cards.
- Rounded corners: `999px` for chat/chip/input; `12–18px` for cards; `0` for dividers.
- Max content width: ~640px (reader-scale for a conversation).

---

## 3. The orb

### Anatomy (layers, back to front)

1. **Aura** — soft radial gradient extending 60px beyond the core. Breathes on a 5.5s cycle (scale 0.95 ↔ 1.07, opacity 0.7 ↔ 1).
2. **Core** — 220px circle. Background is a compound radial gradient: warm highlight at top-left (32%, 26%), deep shadow at bottom-right, `accent` mid-tones blending into `accent-deep`. Inset shadows create dimension. `overflow: hidden` contains the ember hotspots.
3. **Ember hotspots** — 4 blurred soft light pools (`blur(14px)`, radial-gradient fills with warm highlights) drifting inside the core on independent 11/13/14/17s translate loops. No conic gradient (no seam, no pointer feel).
4. **Rim highlight** — small radial gradient at top-left for glass-like sheen.
5. **Flash ring** — inward-contracting 2px border ring, fires on each absorbed letter. Animation: scale 1.15 → 1 → 0.55, opacity 0 → 1 → 0, with a bright box-shadow at peak.
6. **Thought dots** — 3 terracotta dots orbiting the core at 125px radius, visible only during `thinking` state. 3s rotation.
7. **Shockwave** — outward-expanding ring (scale 1 → 1.9), fires once when the last letter of a submitted question is absorbed.

### State machine

| State | Triggered by | Behavior |
|---|---|---|
| `idle` | Default | Slow breathe; subtle cursor-lean (±6px translate based on cursor position); aura pulses gently |
| `absorbing` | User submits | Each letter flies from input → orb with staggered 35ms start delays; on landing, triggers flash-ring animation; cursor-lean disabled |
| `thinking` | Last letter absorbed | Shockwave fires once; three dots orbit; aura dims; lasts until first response token streams |
| `responding` | First stream token | Aura breathes faster (3s); core heat ramps up following `sin(progress × π × 0.85)`; keyword echoes fire brightness pulses as each keyword streams in |
| `cooling` | Stream ends | Heat eases back to 0 over 800ms; orb returns to `idle` |

### Implementation

- Single React component: `<Orb state="idle|absorbing|thinking|responding" heat={0..1} />`.
- State driven by the chat store (Zustand or React context), not by prop-drilling.
- All animations are CSS keyframes or Web Animations API. No JS `requestAnimationFrame` loops for idle motion.
- Heat is a CSS custom property (`--heat`) set via inline style; drives `filter: brightness(calc(1 + var(--heat) * .22)) saturate(calc(1 + var(--heat) * .3))`.
- The orb is mounted once at the page root and never unmounts.

### Responsive positioning

- **Desktop (≥1024px):** pinned right-center of main content area, 220px.
- **Tablet (640–1023px):** top-right of the message stack, 140px.
- **Mobile (<640px):** in the top bar, top-right, 72px. Still fully reactive.

### Reference prototype

Interactive HTML prototype of the orb and full chat interaction flow lives at:
`.superpowers/brainstorm/68766-1776537863/content/live-demo-v4.html`

This prototype is the visual source of truth for orb behavior. Implementation should match its feel; specific CSS values can be ported as starting points.

---

## 4. Content model

Everything the chat can say lives in one TypeScript module: `src/lib/content.ts`.

### Topic shortcuts

Header and chip suggestions use this exact list, in this order:

`Work · Projects · AI & Tools · Résumé · Contact`

### Scripted rich answers

The chat first tries to match the visitor's message against topic keywords. If matched, it renders a scripted rich response with an artifact card. If no match, it falls through to the LLM.

| Topic | Trigger keywords | Artifact |
|---|---|---|
| Work | `work`, `job`, `digital direction`, `integration specialist`, `HiBob`, `NetSuite`, `MYOB`, `KeyPay`, `Deputy` | **Role card** — Digital Directions, March 2025 – Present, 4 highlights from résumé (sole technical ownership, reusable frameworks, webhook queueing, health monitoring) |
| Projects | `project`, `portfolio`, `show me`, `build`, `proud` | **Project carousel** — 4 cards: DD Client Portal, Bryce Digital, Enterprise Integration Work, brycerambach.com |
| AI & Tools | `AI`, `Claude`, `tools`, `Claude Code`, `workflow`, `re-engineer` | **Stack strip** — Claude API, Claude Code, Workato, with a sentence each on how they're used |
| Résumé | `resume`, `résumé`, `CV`, `one-minute`, `background`, `experience` | **Résumé artifact** — condensed inline version (education, current role, top 3 project lines) + prominent "Download PDF" button linking to `/Bryce_Rambach_Resume.pdf` |
| Contact | `contact`, `reach`, `email`, `linkedin`, `github`, `hire`, `phone` | **Contact card** — email, phone, LinkedIn, GitHub, availability line ("Open to Solutions Engineer / Full-Stack roles at early-stage startups — SF or NYC, summer 2026 onward") |

### Project card content

**Digital Directions Client Portal** — Solo-built production application (Next.js 15, TypeScript, Drizzle ORM, Claude API, Freshdesk, Slack, Resend) that monitors 10+ live enterprise integrations in real time. Replaced scattered manual workflows and became the company-wide operations dashboard. Built at 20 with zero senior oversight.

**Bryce Digital** — Independent development practice. Full-stack web applications and AI-powered tools for businesses, end-to-end from discovery through deployment, built with Claude Code and Next.js.

**Enterprise Integration Work (Digital Directions)** — Sole technical owner of 6+ concurrent production integrations connecting HR, payroll, and finance systems across HiBob, NetSuite, MYOB, KeyPay, and Deputy. Built reusable integration frameworks, webhook queueing systems with retry logic handling 500+ records per sync cycle, and health monitoring dashboards.

**brycerambach.com** — *A conversation, not a portfolio.* This site itself: a React-based chat where an animated avatar reacts to every word. Ask about the orb if you want to know how it works.

### Artifact components

Each artifact is a React component that **assembles from orbital pieces** on reveal — constituent elements fly in from the orb's position, settle into the card layout. Piece stagger: 150ms + index × 180ms. See `live-demo-v4.html` for reference.

Components: `<RoleCard />`, `<ProjectCarousel />`, `<StackStrip />`, `<ResumeArtifact />`, `<ContactCard />`.

### LLM fallback

If no topic keyword matches, the message goes to the Claude Haiku 4.5 endpoint. The system prompt contains the full bio + résumé as cached context (~2k tokens, prompt-cached). The model is instructed to answer *as Bryce, in first person, warm and direct, max 60 words*, and to suggest a topic shortcut if the visitor seems lost.

### Greeting sequence (first load only)

Stored in `sessionStorage` under key `bryce-greeted`:

1. **t=0s** — empty page, warm cream.
2. **t=0 → 1.2s** — 14 warm particles drift in from viewport edges on curved paths, converge into the orb position, compress into the core. Core fades from transparent to full.
3. **t=1.0s** — header fades to 100%. Greeting begins typing: "Hi, I'm *Bryce*." (italic terracotta on "Bryce").
4. **t=1.8s** — subtitle fades in line-by-line: "Full-stack engineer. Ships production solo. Uses Claude Code daily." (200ms stagger per line).
5. **t=2.4s** — input + three chips fade in. Input gets `autoFocus`. Cursor halo activates.
6. **t=2.6s** — orb settles into `idle`. Done.

**Return visits:** skip the ignition. Orb fades in already-formed, greeting appears instantly.

**Reduced motion:** entire sequence replaced with a single 400ms fade. No particle flight, no typewriter. Everything appears together.

**Escape hatch:** any click or keypress during ignition skips to the end state.

---

## 5. AI backend

### Stack

- **Model:** `claude-haiku-4-5-20251001` via `@anthropic-ai/sdk`
- **Proxy:** Vercel Edge Function at `/api/chat.ts`
- **Rate limiting:** Upstash Redis via `@upstash/ratelimit` (native Vercel integration)
- **Bot protection:** Cloudflare Turnstile (invisible challenge unless suspicious; free, provider-agnostic)
- **Secrets:** `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `TURNSTILE_SECRET_KEY` — all set in Vercel dashboard (production + preview + development)

### Request flow

1. Client sends `POST /api/chat` with body: `{ message: string, history: Array<{role, content}> }` (last 4 turns only)
2. Edge function verifies the Turnstile token from the `X-Turnstile-Token` header
3. Rate-limit check: per-IP daily count against Upstash Redis (key: `ratelimit:chat:${ip}:${YYYY-MM-DD}`, TTL 24h)
4. If over limit, return 429 with a JSON error
5. Otherwise, forward to Anthropic API with the system prompt (prompt-cached)
6. Stream the response back via Server-Sent Events

### System prompt

```
You are Bryce Rambach answering questions on his personal portfolio.

Write in first person, warm and direct. Maximum 60 words per answer.

If the visitor asks something off-topic from career, projects, tech, or
background, redirect gently ("Not really me — try asking about my work,
projects, AI tools, or résumé").

Never break character. Never mention that you are an AI.

Bio and résumé:
<full bio + resume in structured markdown — ~2k tokens — marked as
cache_control: {type: "ephemeral"}>
```

### Rate limits

- **Per-IP:** 10 messages / 24h
- **Per-message output:** 400 tokens max
- **Hard budget cap:** Anthropic console alert at $20/mo (kill switch)

### Client streaming

- The frontend consumes the SSE stream character-by-character
- Characters pipe into the `streamText` animation flow (same one used for scripted responses) so the orb's keyword echo and heat-up animations are driven by real token arrival, not a simulation
- On 429: orb responds with canned "I've chatted with a lot of folks today — come back tomorrow, or email me at bryce.rambach@gmail.com"

### Fallback

If the edge function errors entirely (500, network failure, timeout), the client detects and enters "scripted-only mode": free-text input shows a canned redirect ("Ask me about Work, Projects, AI & Tools, Résumé, or Contact"), and all topic shortcuts continue working. The portfolio never breaks.

---

## 6. Accessibility

### Keyboard

All interactive elements are keyboard-reachable. `Tab` order: header links → socials → chips → input → send → constellation dots.

### Screen readers

- Chat input: `aria-label="Ask Bryce a question"`
- Messages: container uses `aria-live="polite"`. Messages announce **when streaming completes**, not char-by-char (char-by-char would be chaos for screen readers).
- Orb: `aria-hidden="true"`. It's vibe, not content.
- Keywords use `<em>` in addition to color so screen readers announce emphasis.
- Artifact cards use semantic headings (`<h3>`) and `<article>` wrappers.

### Visual

- Focus rings: 3px terracotta outline, visible against cream.
- Color contrast: `ink` on `paper` ≈ 14:1 (AAA). `accent` text on `paper` ≈ 4.8:1 (AA).

### Reduced motion (`prefers-reduced-motion: reduce`)

- Orb still breathes, slower and subtler (7s cycle, scale 0.98 ↔ 1.01). It's a steady presence, not a flashing light.
- Letter absorption: instant fade-out on input + single gentle pulse on orb. No flight arc.
- Keyword echo: keywords get accent color but no orb flash.
- Heat-up: disabled.
- Shockwave, ignition particles, cursor halo: all disabled.
- General transition durations shortened to 150ms.

---

## 7. Tech stack changes

### Keep (from current package)

- React 19, TypeScript, Vite 6, Tailwind v4
- Motion (`motion/react`)
- Instrument Serif, Inter
- `lucide-react`
- `useReducedMotion` handling

### Add

- `@anthropic-ai/sdk` — edge function
- `@upstash/redis` + `@upstash/ratelimit` — rate limiting
- `zustand` (or use React context) — chat state store

### Delete

**Components no longer used:**
- `Navbar.tsx` (replaced by new `Header`)
- `Hero.tsx`, `About.tsx`, `Skills.tsx`, `Work.tsx`, `Portfolio.tsx`, `Contact.tsx`, `Footer.tsx`
- `ScrollReveal.tsx`, `TextScramble.tsx`
- `CustomCursor.tsx` (replaced by simpler cursor halo)
- `Magnetic.tsx`

**App-level cruft:**
- `DotGrid`, `SectionDivider`, noise SVG overlay in `App.tsx`
- Konami code easter egg (doesn't fit the tone — the console-log signature stays)

**Files:**
- `CREATIVE_OVERHAUL.md` — superseded by this spec

### New directory layout

```
src/
├── App.tsx                      # Page shell
├── main.tsx
├── index.css                    # Tokens, keyframes, reduced-motion
├── components/
│   ├── Orb/
│   │   ├── Orb.tsx
│   │   ├── Orb.module.css       # Or keep in index.css — decide during plan
│   │   └── useOrbState.ts
│   ├── Chat/
│   │   ├── Chat.tsx
│   │   ├── MessageStack.tsx
│   │   ├── Message.tsx
│   │   ├── Input.tsx
│   │   └── Chips.tsx
│   ├── Artifacts/
│   │   ├── RoleCard.tsx
│   │   ├── ProjectCarousel.tsx
│   │   ├── StackStrip.tsx
│   │   ├── ResumeArtifact.tsx
│   │   └── ContactCard.tsx
│   ├── Header/
│   │   └── Header.tsx
│   └── Constellation/
│       └── Constellation.tsx
├── lib/
│   ├── chat.ts                  # Store: messages, addMessage, orb state
│   ├── content.ts               # Topic defs, scripted responses, bio
│   ├── stream.ts                # SSE consumer + char-by-char emitter
│   └── match.ts                 # Keyword-to-topic matcher
└── api/
    └── chat.ts                  # Vercel Edge Function
public/
└── Bryce_Rambach_Resume.pdf     # Generated from docx
```

---

## 8. Success criteria & open questions

### Success criteria

- Lighthouse ≥ 95 on all four categories
- First paint < 1.5s on 4G
- Reduced-motion experience is fully equivalent in information (nothing only conveyed through motion)
- AI bill < $10/mo at moderate traffic; hard cap $20/mo
- `npm run lint` (tsc --noEmit) clean after migration

### Out of scope for this spec

- Analytics / event tracking (add later if needed; Plausible or Vercel Analytics are both fine)
- Blog, writing section, or long-form content
- Dark mode
- Sharing / unfurl preview polish (will get handled in the landing build)
- SEO beyond basic meta tags

### Open questions to resolve during implementation

- **Chat state:** Zustand vs. React context — defer to implementation plan. Both work; Zustand is nicer for the orb-state consumer pattern.
- **Artifact assembly DX:** how to cleanly express "these pieces fly in from the orb." Options: per-element `initial/animate` variants in Motion, or a shared helper. Pick during implementation.
- **Resume docx → PDF conversion:** do it once by hand (LibreOffice / Pages export) and commit the PDF, vs. script it. One-shot hand conversion is simpler; pick that unless the résumé changes often.
