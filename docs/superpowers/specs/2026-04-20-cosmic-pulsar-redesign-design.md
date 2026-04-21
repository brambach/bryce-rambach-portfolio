# Cosmic pulsar redesign

**Status:** Design approved, pending spec review
**Date:** 2026-04-20
**Supersedes:** Warm ember orb direction (memory note from 2026-04-18)

## Goal

Rebuild the signature of the portfolio — background, orb style, orb behavior, and the text-to-orb flow — as a cosmic pulsar in deep space. The conversational paradigm (chat UI + orb) and the site's information architecture stay the same. This is a visual/motion overhaul, not a structural one.

The design must be technically confident — something almost nobody else builds — while still reading as Bryce's portfolio on first glance.

## What's locked

### Background: cosmic signature

- Deep-space backdrop: radial gradient from `#141428` (center) to `#050410` (edges).
- Starfield of ~30–60 stars at varying sizes (0.5–1.4px), mostly white with a few warm `#ffecc4` and cool `#c8e4ff` accents.
- **Constellation monogram** — a specific subset of stars (roughly 8–12) are positioned to form the shape of "Br." when connected by thin, faint `rgba(200, 228, 255, 0.25)` lines. This is your identity anchor.
- The constellation stays fixed; other stars subtly drift (translate <1px over ~10s cycles) and twinkle (opacity breath).
- **No ghost letterform** — the constellation alone carries the monogram identity. Dropped per design review.

### Orb: hybrid pulsar

- Small, intensely bright core (~18–22% of orb container diameter): radial gradient from white `#ffffff` core to amber `#ffd89a` to terracotta `#c8704a`. This preserves the warm ember DNA you liked.
- Two icy beams projecting diagonally from the core (roughly 22° and 202°), each built as a linear gradient from `rgba(200, 228, 255, 0.9)` fading to transparent by ~70% of beam length. 2–4px wide, blurred ~2px.
- Beams extend ~160% of the orb container height — they reach beyond the orb's visual footprint, making it feel larger than its core.
- Glow aura: box-shadow on core creates warm halo (`rgba(255, 216, 154, 0.8)` inner, `rgba(200, 112, 74, 0.4)` outer).

### Behavior: Observatory personality

Quiet, deferential, listens. The orb never demands attention; it responds to you.

| State | Core | Beams | Notes |
|---|---|---|---|
| Idle | Slow breath (scale 1.0 → 1.08, 4s cycle) | Gentle pulse (opacity 0.45 → 0.95, 4s cycle, offset 180°) | Calm |
| Typing | Breath slightly brighter | Beams narrow/tighten — visually "focusing" inward | User has the floor |
| Submit | Single bright flash (one beat) | Both beams flash full brightness for 120ms | Acknowledgment |
| Thinking | Faster breath (~2.5s) | Tighter, brighter | Working |
| Response | Per keyword: beam flash + core warmth pulse | Beam pulse per keyword echo (existing `echo()` hook) | Rhythmic |
| Heat-up | Core saturates warmer over response duration | Beams tinge slightly amber at peak heat | Cumulative |
| Return to idle | Smooth 800ms ease-out | Back to gentle pulse | Cools |

Idle beam sweep is visible by default (not hidden); intensity modulates with state. No cursor-follow lean — the pulsar is fixed in its sky.

### Text flow: spiral accretion (input) + radial emission (output)

**Input (submit):**
- Each non-space letter from the input is lifted from its rendered position (current `absorb.ts` pattern stays).
- Instead of an arc, each letter follows a **tightening spiral path** around the pulsar — like matter falling into an accretion disc.
- Path curves inward over ~1.2s; letter color lerps from cool `#c8e4ff` (released) through white to warm `#ffd89a` (near core) as it heats up approaching the pulsar.
- Letter fades + scales down to 0.2 at the core. Triggers the `echo()` hook per landed letter.
- Staggered arrival: successive letters enter the spiral on a ~50ms offset.

**Output (response stream):**
- As the LLM response streams in, each word materializes adjacent to the core and drifts outward along an expanding radial path into its final chat-message position.
- Word emerges glowing warm, cools to the standard chat text color as it settles (~400ms).
- Fires the keyword-echo hook when semantically significant words land (existing match logic stays).

### Palette

```
--color-space-0:  #050410   /* deep space edge */
--color-space-1:  #141428   /* deep space center */
--color-star:     #ffffff
--color-star-warm:#ffecc4
--color-star-cool:#c8e4ff
--color-core-hot: #ffffff
--color-core-mid: #ffd89a
--color-accent:   #c8704a   /* preserved */
--color-accent-deep: #8a4220 /* preserved */
--color-beam:     #c8e4ff
--color-beam-deep:#6ba0d8
--color-paper:    #faf7f2   /* preserved, used for text on dark */
--color-ink:      #1f1d1a   /* preserved, used inside light surfaces */
```

Text on deep space uses paper cream at 0.88–0.95 opacity for body, pure `#faf7f2` for display.

### Typography

Unchanged: Instrument Serif (italic) for display/greeting/chips, Inter for UI and chat body. Accent terracotta remains the semantic "emphasis" color inside display type.

### Heat-bleed

During response, a soft warm haze expands outward from the pulsar into the surrounding deep space — a subtle nebula layer (`radial-gradient` of terracotta/amber at ~0.2–0.35 opacity) that:
- Is invisible at idle.
- Fades in over the first ~800ms of response.
- Intensity tied to the existing `heat` value (0 → 1).
- Fades out ~1.5s after the response completes.

This makes the orb's energy feel real — space literally warms around it.

### Ignition sequence (first visit)

Replaces the current 2.2s particle-convergence ignition.

1. **0.0s–0.6s** — Deep-space gradient fades in from black. No stars yet.
2. **0.6s–1.4s** — Stars fade in with slight stagger (random per-star delay); looks like the sky "appearing" the way it does when your eyes adjust.
3. **1.4s–2.2s** — Constellation lines draw themselves between the monogram stars, stroke-dash animated as if hand-drawn. Order: shape of the "B" first, then the terracotta period's single star pulses alone.
4. **2.2s–2.6s** — Pulsar ignites: single bright white flash at the core, then beams snap on at full brightness.
5. **2.6s–3.0s** — Settle: core and beams ease into idle pulse. Chat greeting and input fade in.

Skippable with any pointerdown/keydown (matches current behavior). Respects `prefers-reduced-motion` — reduced path: everything appears instantly, pulsar idle-pulses only.

Stored in `sessionStorage` like today — ignition plays once per session.

### Artifact cards (resume, project carousel, contact, role, stack strip)

These were designed for warm paper and need a dark-space material.

- Background: `rgba(250, 247, 242, 0.04)` with a subtle backdrop blur (`backdrop-filter: blur(8px)`) — thin glass panels.
- Border: `1px solid rgba(200, 228, 255, 0.15)` (cool, rhymes with beams).
- Interactive accents (buttons, active states, hovers): terracotta `#c8704a` — the warm punctuation inside cool panels, same metaphor as the orb.
- Text inside cards: paper cream at 0.88 for body, pure for headings.
- Existing layout, spacing, and information design preserved.

### Preserved (unchanged)

- Information architecture: chat-left, orb-right, sticky orb column, mobile collapse to stacked.
- Topic chips (what do you build / your stack / recent work / contact).
- Hybrid LLM source (scripted rich answers + Claude Haiku free-text).
- Absorb-on-submit pipeline (letters lift from input, get attracted to orb target, fire per-letter echo). The animation *shape* changes; the hooks and timing architecture stay.
- Keyword-echo system via `match.ts` + orb `echo()` handle.
- Heat accumulation and return-to-idle state machine (existing `chat.ts` store).
- Constellation message-history sidebar (dots per user message). Visual treatment updates to match the new palette — cool dot with warm hover — but behavior unchanged.
- Cursor halo: **stays warm** (terracotta). The user is the warm body in this universe; the pulsar is the cool signal-from-space. This contrast is intentional.
- Reduced-motion handling throughout.
- Session-storage-based ignition skip.

## Non-goals (YAGNI)

- No sound/audio on interaction.
- No scroll-based parallax or 3D camera moves.
- No WebGL/Three.js. All of this is achievable with CSS + Motion + a small amount of SVG. Hold the line on performance and maintainability.
- No new chat features, LLM prompt changes, or content rewrites. This is presentation only.
- No dark/light mode toggle. Site is dark-mode native.
- No changes to the Header, routing, or analytics.
- No new artifact types.

## Architecture notes

### Files likely to change

- `src/index.css` — replace root palette + keyframes; introduce space background layer.
- `src/App.tsx` — replace `IgnitionParticles` with new ignition sequence (constellation draw + pulsar flash).
- `src/components/Orb/Orb.tsx` + `orb.css` — replace ember layers with pulsar (core + 2 beams). Preserve `OrbHandle` interface (`fireShockwave`, `echo`, `getCenter`).
- `src/components/Constellation/` — repurpose. Currently a message-history sidebar; stays functionally but gets a new name/role internally if it makes sense (the *backdrop* constellation is a new component).
- New component: `src/components/Starfield/` — the backdrop starfield + monogram constellation with ignition draw-in.
- `src/components/Chat/Input.tsx` + CSS — dark treatment, subtle cool border, warm cursor.
- `src/components/Chat/Message.tsx` + CSS — dark bubbles (user = cool tint, assistant = glass).
- `src/components/Artifacts/*.css` — dark glass restyle.
- `src/components/Header/header.css` — dark treatment.
- `src/components/CursorHalo/cursor-halo.css` — verify warm halo still reads on dark; tune opacity if needed.
- `src/lib/absorb.ts` — rewrite trajectory from arc to tightening spiral; lerp letter color along path.

### New components

- `Starfield/Starfield.tsx` — renders the deep space gradient, starfield, and monogram constellation. Handles ignition draw-in and the idle twinkle/drift. Exposes an `ignite()` method or accepts an `ignited` prop from App.
- (Optional) `HeatBleed/HeatBleed.tsx` — the nebula haze layer that expands during response. Can also live inside Orb.tsx if simpler.

### State / hooks

No changes to `chat.ts` store shape. The `heat` value drives the heat-bleed layer. The `orbState` drives all pulsar animations. Everything already exists — we're rewiring visuals to existing state.

### Boundaries

- `Starfield` owns the backdrop. Self-contained.
- `Orb` owns the pulsar (core + beams + ignition flash + heat-bleed).
- `absorb.ts` owns the spiral-accretion trajectory of input letters.
- `Chat` owns the radial-emission of response words (new animation added to `Message` render).
- Nothing reaches across boundaries. Communication via the existing `OrbHandle` ref + `chat.ts` store.

## Open questions for implementation phase

- Performance of many animated gradients on deep space. May need to rasterize the starfield once and animate twinkle via `opacity` only.
- Exact stroke-dash path for drawing the constellation. Needs an artist pass — rough shape in the spec, final positioning during implementation.
- Should the `Constellation` message-history sidebar be renamed (since "constellation" now means the backdrop monogram)? Probably rename to `MessageTrail` or similar internally.
- Mobile: the orb column becomes a horizontal sticky band on small screens. Pulsar beams will look different — may need to reduce beam length on mobile to avoid overflow.

## Open questions for user before implementation

- Is the color of user message bubbles okay as cool (`rgba(107, 160, 216, 0.18)`)? Alternative: warm tint, to match the cursor halo "you are warm" metaphor.
- Should the first-visit ignition only play once per *session* (current) or once per *visit ever* (localStorage)? Current behavior is per-session; per-visit-ever means returning users never see it again, which might be better.
