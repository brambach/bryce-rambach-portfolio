# Minecraft-Themed Portfolio Redesign

Complete redesign of brycerambach.com as a Minecraft-themed personal portfolio. The site preserves all existing content (bio, work experience, 7 projects, skills, contact info) but reimagines the presentation as a journey through a Minecraft world — from title screen to The End.

## Design Principles

1. **Professional core, themed wrapper** — actual content (project writeups, bio, experience details) is presented cleanly and readably. The Minecraft theme lives in the UI chrome, navigation, containers, transitions, and visual language. The theme enhances without obscuring.
2. **Biome journey** — the site is a linear scroll that descends through Minecraft world layers. Each section maps to a biome with its own atmosphere, ambient effects, and color temperature.
3. **Authentic Minecraft UI** — uses real MC UI patterns (inventory slots, beveled borders, achievement toasts, tooltips, hotbar) and pixel font. Not just Minecraft colors on generic cards.
4. **Animation-rich but purposeful** — every animation maps to a Minecraft mechanic. Block-by-block builds, redstone pulses, enchantment glints, chest opens. No generic fades or slides.

## Tech Stack

Preserve existing stack:
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Motion (Framer Motion) for animations
- Vercel deployment

No new framework dependencies. Additional assets:
- **Font**: Silkscreen (Google Fonts) for pixel UI text. Render at integer multiples of 8px baseline (16px, 24px, 32px) with `-webkit-font-smoothing: none` and `font-smooth: never` to preserve pixel edges.
- **Icons**: Custom inline SVG pixel-art sprites for inventory slot icons (not emoji — emoji render inconsistently across platforms and clash with pixel aesthetic). Small set: ~20 icons for skills + section nav.
- Custom CSS for MC UI patterns (inventory slots, beveled borders, tooltips)
- Single shared `<canvas>` element per biome for particle effects (block break, XP orbs, ender particles)

## Color System

Dark stone/obsidian base with Minecraft ore accent colors:

**Backgrounds:**
- Base: `#0f0f12` (deep obsidian)
- Surface: `#1a1a1e` (stone)
- Elevated: `#2a2a30` (polished stone)

**Accents:**
- Grass Green: `#4ade80` — active states, success, forest biome
- Diamond Blue: `#38bdf8` — links, highlights, interactive elements
- Redstone Red: `#ef4444` — redstone biome, integration diagrams, alerts
- Gold: `#fbbf24` — achievement labels, splash text, featured items
- Enchant Purple: `#c084fc` — tooltips, stronghold biome, enchantment effects
- XP Green: `#80ff20` — XP bars, level indicators

**Biome-specific palettes:**
Each biome section has its own ambient color temperature layered on top of the base:
- Sky: blue sky gradient (`#87ceeb` → lighter)
- Forest: warm green tint, leaf particles
- Cave: warm brown-amber (`#8B7355`), torch light
- Mine Shaft: neutral gray, lantern pools
- Redstone: red glow, circuit highlights
- Stronghold: purple tint, enchantment shimmer
- The End: dark void, purple-black, ender particle pink

## Typography

Two-tier system following "professional core, themed wrapper":

**Pixel font (Silkscreen, Google Fonts):** Used for all Minecraft UI chrome. Must render at integer multiples of 8px (16px, 24px, 32px) to stay crisp. Apply `-webkit-font-smoothing: none` and `font-smooth: never`.
- Navigation labels: 16px
- Section headers / biome names: 24px
- Achievement titles: 16px
- Tooltip headers: 16px
- Button text: 16px
- Inventory slot labels: 8px (small, below icon)
- Loading screen text: 24px
- Splash text: 24px
- XP bar levels: 16px

**Clean font (Inter):** Used for all readable content:
- Bio / about text
- Project descriptions (problem/solution/impact)
- Work experience descriptions
- Case study writeups
- Any body copy that needs to be read comfortably

**Monospace (JetBrains Mono):** Kept for:
- Tech stack tags
- Code-adjacent metadata
- Dates and technical details

## Entry Sequence

### State Management

The entry sequence is managed via React state (`useState` with a phase enum: `'title' | 'loading' | 'spawning' | 'world'`).

- **First visit**: full sequence (title → loading → spawn → world)
- **Repeat visits**: `sessionStorage` flag `mc-portfolio-entered` skips title + loading screens, goes straight to spawn animation (brief) then world
- **Deep links** (e.g., `#skills`): skip title + loading, spawn briefly, then auto-scroll to target section
- **Browser back from world**: returns to title screen (phase resets). This is intentional — the title screen is the landing page.
- **prefers-reduced-motion**: skip all entry animations, render world state immediately

### 1. Title Screen
The landing page mimics Minecraft's main menu:
- Background: CSS gradient landscape (sky blue top half → grass green strip → dirt brown bottom). No image assets — pure CSS.
- Center: player name "BRYCE RAMBACH" in Minecraft logo style (large, blocky, 3D text shadow)
- Below name: yellow splash text "I make systems talk to each other!" with the classic bounce/pulse animation, rotated ~15 degrees
- Menu buttons (MC beveled style):
  - "Singleplayer" → scrolls to portfolio content
  - "Multiplayer" → scrolls to contact section
  - Optional: "Options" (greyed out or links to resume/LinkedIn)
- Bottom: "Minecraft 1.21.5" style version text, could say "Portfolio v2.0" or similar

### 2. Loading Screen
Triggered by clicking "Singleplayer":
- Dirt texture background (CSS repeating pattern, no images needed)
- "Loading Bryce's World..." in white pixel font with text shadow
- Green XP-style progress bar that fills over ~2 seconds
- Optional: Minecraft loading tips ("Tip: Bryce ships integrations before deadlines")
- Transitions out with a fade or wipe

### 3. Spawn Animation
Loading screen fades, hero section reveals:
- Background transitions from dirt to sky gradient
- Name and tagline build in block-by-block (each character or word places like a block, ~2 seconds total)
- Hotbar slides up from bottom of screen
- Ambient particles begin (clouds drifting, light motes)
- Audio is out of scope for this version (browser autoplay policies make it complex). Can be added as a future enhancement.

## Section Design

### Hero (Sky Biome)
- Sky gradient background with drifting cloud elements
- Name in large pixel font, built block-by-block on spawn
- Tagline: "I make systems talk to each other" in clean font
- Status line: "open to work · NYC · summer 2026" with MC-style status indicators
- Ambient: slow cloud drift, light particles, gentle parallax

### About (Forest Biome)
- Background transitions to forest feel: darker green-tinted, leaf particles falling
- Content presented as "oak sign" styled blocks — MC panel containers with beveled borders
- Three narrative blocks (same content as current site):
  1. What you do (integration problem-solver)
  2. Day-to-day + education + career target
  3. Location (San Diego → NYC)
- Each block reveals with block-placement animation on scroll
- Body text in Inter for readability, section labels in pixel font

### Skills (Cave Biome)
- Background shifts to warm cave ambience: darker, amber torch-light glow
- **Inventory grid**: MC panel container with inventory slot grid
  - Each skill is a slot with an SVG pixel-art icon and count badge
  - Hover reveals purple-bordered MC tooltip with:
    - Skill name (aqua colored)
    - Category in italic purple (lore text)
    - Description in gray
    - Proficiency in green
- **XP bars**: below inventory, key skills get XP bar treatment with levels
- **Stats row**: "15+ Technologies · 6 Platforms · 3+ Years" as animated counters
- Ambient: torch flicker effect on container edges, occasional ore sparkle particles
- Item pickup animation: slots fill in with spin-float as section scrolls into view

### Work / Experience (Mine Shaft Biome)
- Background: darker, neutral gray stone, lantern light pools
- **Achievement toasts**: each work entry appears as a Minecraft achievement banner
  - Icon slot on left (SVG pixel icon representing the role)
  - "Advancement Made!" label in gold
  - Role title below
  - Click/tap to expand → chest-open animation reveals full description
- **Timeline**: styled as minecart rails running vertically
  - Active roles get a pulsing redstone dot
  - Inactive roles get a stone dot
- Descriptions in Inter, dates in JetBrains Mono, labels in pixel font
- Each achievement slides in from left/right alternating

### Portfolio — Production Systems (Redstone Layer)
- Background: deep red ambient glow, redstone dust particles
- **Featured project (HRIS Platform)**: large card with animated redstone circuit diagram
  - Architecture diagram drawn as redstone circuit: HiBob → Workato orchestration → 4 destinations
  - Signal pulse animation: redstone lights up and propagates through the circuit on scroll
  - Repeater-delay animations for each destination connection
  - Problem/Solution/Impact in clean readable format below
  - Technical challenges as expandable blocks (chest-open style)
- **Client Implementation Portal**: second card, similar treatment but with different circuit layout
- Tech tags styled as inventory item badges

### Portfolio — Independent Builds (Stronghold)
- Background: deep purple-black, End-dimension atmosphere, ender particles drifting
- **Project cards**: displayed as enchanted items in inventory slots or as standalone cards
  - Enchantment glint animation sweeps across each card
  - Hover: card lifts, item-pickup spin, block-break particles scatter
  - Click: chest-open animation reveals full project details
- Projects: Thread, Crypto Dashboard, SideQuest, Port, Bryce Digital
- Each project gets its accent color (preserved from current site) as the enchantment glow color
- Grid layout: 2-3 columns, responsive to single column on mobile

### Contact (The End)
- Background: The End dimension — dark void, floating island silhouettes, ender particle effects
- "The End" double meaning: end of the page + the Minecraft dimension
- **Chat log interface**: styled as Minecraft's in-game chat
  - System message: "[Server] Welcome to Bryce's world!"
  - Conversation exchange leading to contact links
  - Links (email, LinkedIn, GitHub) as green chat messages
  - Input field at bottom with blinking cursor ("Say something..."). Typing a message and pressing Enter opens `mailto:bryce.rambach@gmail.com` with the typed text as the email subject. This makes the chat input functional, not just decorative.
- Optional: End poem text style for a final message

## Navigation (Hotbar)

Fixed to bottom of viewport (appears after spawn animation):
- Styled as Minecraft hotbar: dark background strip with inventory slots
- 7 slots: Home, About, Skills, Work, Production, Builds, Contact
  - "Production" targets Redstone Layer (production portfolio)
  - "Builds" targets Stronghold (independent projects)
- Each slot has an SVG pixel icon
- Active section slot gets the white selection border (like MC hotbar selection)
- Smooth scroll on click
- On mobile: slightly larger touch targets, same hotbar aesthetic
- Number keys 1-7 navigate to sections (matching MC hotbar shortcuts)

## Animations

### Scroll-Triggered
- **Block-by-block build**: elements construct themselves as they enter viewport. Characters or sections "place" one at a time with slight bounce, like placing blocks. ~50-80ms stagger between blocks.
- **Redstone pulse**: SVG/CSS circuit lines that light up red and propagate signal from source to destination. Used in portfolio architecture diagrams. Repeater delays create cascading effect.
- **Enchantment glint**: diagonal highlight sweep across cards/elements. Purple-white gradient that moves corner-to-corner. CSS animation on scroll trigger.
- **Biome transitions**: as you scroll between sections, background color/particles crossfade over a ~150px overlap zone where both biome backgrounds blend via opacity. Particle systems from adjacent biomes can briefly coexist in the overlap zone, then the exiting biome's particles fade out.

### Interaction-Triggered
- **Block break particles**: on click anywhere interactive, small pixel squares scatter outward from click point in the accent color of the current biome. Physics: gravity pull, random velocity, fade out.
- **Item pickup float**: when skill slots enter view or on hover, items do the MC pickup animation — spin on Y axis while floating toward their slot position.
- **Chest open**: expandable content sections animate like a chest lid opening. Top half rotates up on hinge, content reveals from behind. Used for project details, work descriptions.

### Ambient
- **Torch flicker**: CSS box-shadow animation on containers in the cave biome. Warm amber glow that pulses irregularly (not a regular sine wave — randomized timing).
- **Floating XP orbs**: small green circles that drift upward slowly in the background. Subtle, ~5-8 at a time. Cave/mine biome only.
- **Ender particles**: pink-purple dots that float and teleport (disappear/reappear) in the stronghold and end biomes.
- **Cloud drift**: slow horizontal movement of cloud elements in the sky biome.
- **Leaf fall**: small green squares drifting down in the forest biome.

### Easter Eggs
- **Creeper explosion**: hidden creeper face somewhere on the site. Hovering triggers a "ssssss..." and a playful screen shake + block explosion particle burst. Doesn't break anything.
- **Damage numbers**: if you click non-interactive whitespace, small red damage numbers float up ("Miss!" or "-0 HP"). Throttled to max once every 3 seconds to avoid annoyance. Desktop only.
- **Hotbar number keys**: pressing 1-6 navigates to sections (matching Minecraft's hotbar shortcuts).
- **Konami code**: already exists in current site — preserve or adapt with an MC twist.

## Accessibility

- **prefers-reduced-motion**: all animations disabled. Site falls back to static themed UI. Still looks Minecraft, just no movement.
- **Keyboard navigation**: full tab order through all interactive elements. Hotbar navigable via arrow keys.
- **Screen readers**: semantic HTML. Decorative MC elements have aria-hidden. Content sections have proper heading hierarchy.
- **Color contrast**: all text meets WCAG AA. Pixel font gets larger sizing to compensate for reduced legibility.
- **Mobile**: touch-friendly targets (48px minimum). Hotbar slots enlarged. Block-break particles work with tap. No hover-dependent functionality — tooltips accessible via tap.

## Responsive Behavior

- **Desktop (1024px+)**: full experience. Hotbar at bottom, inventory grids at full width, side-by-side layouts where applicable.
- **Tablet (768-1023px)**: hotbar remains, inventory grid wraps to fewer columns, project cards stack.
- **Mobile (<768px)**: hotbar slots show icons only (no labels). Inventory grid becomes 4-5 columns. Achievement toasts full-width. Chat log full-width. Title screen buttons stack. All particle counts reduced for performance.

## Content Preservation

All text content from the current site is preserved exactly. No copy changes. The content sources:
- Hero: name, tagline, role, status
- About: 3 narrative blocks
- Skills: 3 marquee rows of tech (Workato, HiBob, NetSuite, Deputy, API Design, Webhooks, React, TypeScript, Node.js, Tailwind CSS, Next.js, Systems Architecture, Solutions Engineering, Client Communication, Process Automation, REST APIs, GraphQL, CI/CD, Vercel, PostgreSQL, Git, Agile) + stats (15+ Technologies, 6 Platforms, 3+ Years)
- Work: 3 experience entries (Integration Specialist @ Digital Directions, Founder @ Bryce Digital, CS B.S. @ SDSU)
- Portfolio: 7 projects (HRIS Platform, Client Portal, Thread, Crypto Dashboard, SideQuest, Port, Bryce Digital)
- Contact: heading, body text, email, LinkedIn, GitHub

## Performance Considerations

- Particle systems use requestAnimationFrame on a single shared `<canvas>` per biome (not individual DOM elements)
- Particle budget: Desktop max 30 particles/biome, Mobile max 10. Target 60fps on M1 MacBook, 30fps acceptable on 2-year-old Android.
- Intersection Observer for scroll-triggered animations (only animate what's in view). Off-screen biome canvases pause their animation loops.
- Minimal image assets — visuals are CSS, inline SVG, and canvas. Only custom assets are ~20 small SVG pixel icons for inventory slots.
- Lazy-load below-fold biome backgrounds
- Target: Lighthouse performance score 90+

## SEO & Meta

- Content is in the DOM on initial render (title screen is a visual overlay, not a route gate). Search engines see all content.
- Preserve OG tags and meta description from current site, updated for new design.
- `<title>`: "Bryce Rambach — Integration Specialist & Developer"
- OG image: static screenshot of the title screen (pre-rendered, not dynamic)
