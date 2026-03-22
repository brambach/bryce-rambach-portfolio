# Minecraft Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign brycerambach.com as a Minecraft-themed portfolio with biome journey, authentic MC UI patterns, and a rich animation system — while preserving all existing content.

**Architecture:** Replace all current components with Minecraft-themed equivalents. The app shell manages entry sequence phases (title → loading → spawn → world). Each content section is a biome with its own background, ambient particles, and MC UI components. Shared utilities handle particle systems, MC UI primitives, and animation hooks.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (Framer Motion), Canvas API for particles

**Spec:** `docs/superpowers/specs/2026-03-21-minecraft-portfolio-redesign.md`

---

## File Structure

```
src/
├── main.tsx                          # Entry point (unchanged)
├── App.tsx                           # Root — entry phase state machine + world layout
├── index.css                         # Global styles, MC theme vars, Silkscreen font, beveled border utilities
├── data/
│   └── content.ts                    # All site content extracted into typed constants
├── components/
│   ├── entry/
│   │   ├── TitleScreen.tsx           # MC main menu (buttons, splash text, panorama bg)
│   │   ├── LoadingScreen.tsx         # Dirt bg, progress bar, tips
│   │   └── SpawnAnimation.tsx        # Block-by-block name build, hotbar slide-in
│   ├── sections/
│   │   ├── Hero.tsx                  # Sky biome — name, tagline, status
│   │   ├── About.tsx                 # Forest biome — oak sign narrative blocks
│   │   ├── Skills.tsx                # Cave biome — inventory grid, XP bars, tooltips
│   │   ├── Work.tsx                  # Mine shaft — achievement toasts, rail timeline
│   │   ├── PortfolioProduction.tsx   # Redstone layer — circuit diagrams, featured projects
│   │   ├── PortfolioBuilds.tsx       # Stronghold — enchanted project cards
│   │   └── Contact.tsx               # The End — chat log interface
│   ├── mc-ui/
│   │   ├── McPanel.tsx               # Beveled MC panel container (light gray, 3D border)
│   │   ├── McSlot.tsx                # Inventory slot with hover state
│   │   ├── McTooltip.tsx             # Purple-bordered MC tooltip
│   │   ├── McButton.tsx              # Beveled MC button with hover glow
│   │   ├── McAchievement.tsx         # Achievement toast banner
│   │   ├── McXpBar.tsx              # XP progress bar with level
│   │   ├── McHotbar.tsx              # Bottom navigation hotbar
│   │   └── McChat.tsx                # Chat log with input field
│   ├── animations/
│   │   ├── BlockByBlock.tsx          # Block placement reveal animation
│   │   ├── ChestOpen.tsx             # Expandable content with chest-lid animation
│   │   ├── EnchantGlint.tsx          # Diagonal shimmer overlay
│   │   ├── RedstoneCircuit.tsx       # SVG circuit with pulse animation
│   │   └── ItemPickup.tsx            # Spin-float pickup animation
│   ├── particles/
│   │   ├── ParticleCanvas.tsx        # Shared canvas renderer with lifecycle management
│   │   ├── particles.ts             # Particle behaviors: cloud, leaf, torch-spark, xp-orb, ender, redstone, block-break
│   │   └── useParticles.ts          # Hook: spawn/update/cleanup particles per biome
│   ├── BiomeBackground.tsx           # Section wrapper with biome gradient + particle canvas + transitions
│   ├── BlockBreakEffect.tsx          # Global click particle effect
│   └── icons/
│       └── pixel-icons.tsx           # All ~20 SVG pixel-art icons as React components
├── hooks/
│   ├── useEntryPhase.ts              # Entry sequence state machine + sessionStorage
│   ├── useBiomeScroll.ts             # Track which biome is active based on scroll position
│   └── useBlockBreak.ts              # Global click → particle burst handler
└── utils/
    └── mc-theme.ts                   # Color constants, font size constants, shared types
```

---

## Task 1: Foundation — Theme Constants, CSS, and Content Extraction

**Files:**
- Create: `src/utils/mc-theme.ts`
- Create: `src/data/content.ts`
- Modify: `src/index.css`
- Modify: `index.html` (add Silkscreen font)

This task sets up the design system and extracts all hardcoded content into a single data file.

- [ ] **Step 1: Create MC theme constants**

Create `src/utils/mc-theme.ts` with all color, font size, and biome configuration constants from the spec:

```typescript
// Color system
export const MC_COLORS = {
  base: '#0f0f12',
  surface: '#1a1a1e',
  elevated: '#2a2a30',
  grass: '#4ade80',
  diamond: '#38bdf8',
  redstone: '#ef4444',
  gold: '#fbbf24',
  enchant: '#c084fc',
  xpGreen: '#80ff20',
} as const;

// Biome definitions
export type BiomeId = 'sky' | 'forest' | 'cave' | 'mine' | 'redstone' | 'stronghold' | 'end';

export interface BiomeConfig {
  id: BiomeId;
  label: string;
  bgGradient: string;
  accentColor: string;
  particleType: string;
}

export const BIOMES: Record<BiomeId, BiomeConfig> = {
  sky: { id: 'sky', label: 'Sky', bgGradient: 'linear-gradient(180deg, #1a3a5c 0%, #0f0f12 100%)', accentColor: '#87ceeb', particleType: 'cloud' },
  forest: { id: 'forest', label: 'Forest', bgGradient: 'linear-gradient(180deg, #0f1a0f 0%, #0f0f12 100%)', accentColor: '#4ade80', particleType: 'leaf' },
  cave: { id: 'cave', label: 'Cave', bgGradient: 'linear-gradient(180deg, #1a1510 0%, #0f0f12 100%)', accentColor: '#8B7355', particleType: 'torch-spark' },
  mine: { id: 'mine', label: 'Mine Shaft', bgGradient: 'linear-gradient(180deg, #151515 0%, #0f0f12 100%)', accentColor: '#696969', particleType: 'xp-orb' },
  redstone: { id: 'redstone', label: 'Redstone', bgGradient: 'linear-gradient(180deg, #1a0a0a 0%, #0f0f12 100%)', accentColor: '#ef4444', particleType: 'redstone' },
  stronghold: { id: 'stronghold', label: 'Stronghold', bgGradient: 'linear-gradient(180deg, #14121e 0%, #0f0f12 100%)', accentColor: '#c084fc', particleType: 'ender' },
  end: { id: 'end', label: 'The End', bgGradient: 'linear-gradient(180deg, #0c0b14 0%, #05050a 100%)', accentColor: '#c084fc', particleType: 'ender' },
};

// Font sizes (Silkscreen at integer multiples of 8px)
export const MC_FONT = {
  sm: '16px',   // nav labels, achievement titles, button text, tooltips, xp levels, slot labels
  md: '24px',   // section headers, loading text, splash text
  lg: '32px',   // hero name on title screen
} as const;

// Entry phase type
export type EntryPhase = 'title' | 'loading' | 'spawning' | 'world';

// Section IDs map sections to biomes for scroll tracking
export type SectionId = 'hero' | 'about' | 'skills' | 'work' | 'portfolio-production' | 'portfolio-builds' | 'contact';

export const SECTION_TO_BIOME: Record<SectionId, BiomeId> = {
  'hero': 'sky',
  'about': 'forest',
  'skills': 'cave',
  'work': 'mine',
  'portfolio-production': 'redstone',
  'portfolio-builds': 'stronghold',
  'contact': 'end',
};

// Hotbar nav items
export const HOTBAR_ITEMS = [
  { key: 'home', label: 'Home', section: 'hero' as SectionId, icon: 'house' },
  { key: 'about', label: 'About', section: 'about' as SectionId, icon: 'tree' },
  { key: 'skills', label: 'Skills', section: 'skills' as SectionId, icon: 'pickaxe' },
  { key: 'work', label: 'Work', section: 'work' as SectionId, icon: 'lantern' },
  { key: 'production', label: 'Production', section: 'portfolio-production' as SectionId, icon: 'redstone-dust' },
  { key: 'builds', label: 'Builds', section: 'portfolio-builds' as SectionId, icon: 'ender-pearl' },
  { key: 'contact', label: 'Contact', section: 'contact' as SectionId, icon: 'chat-bubble' },
] as const;
```

- [ ] **Step 2: Extract all content to data file**

Create `src/data/content.ts`. Extract all hardcoded text from the current components (Hero, About, Skills, Work, Portfolio, Contact) into typed constants. Read each current component file to get the exact text. Structure:

```typescript
export const HERO_CONTENT = {
  name: 'Bryce Rambach',
  tagline: 'I make systems talk to each other.',
  role: 'Integration Specialist @ Digital Directions',
  status: 'open to work · NYC · summer 2026',
};

export const ABOUT_CONTENT = {
  blocks: [
    ["Every company I work with has the same problem — great tools that don't talk to each other. I build the integrations that fix that."],
    [
      "Day-to-day, I wire up enterprise platforms — HiBob, NetSuite, Deputy, Workato — building the automations that kill manual data entry and keep everything in sync. Employee joins in HR? Payroll, scheduling, and finance all update automatically.",
      "Finishing my CS degree at San Diego State, graduating May 2026. Targeting Solutions Engineer roles where I can go deep on technical problems and work directly with the people who need them solved.",
    ],
    ["Based in San Diego, headed to New York City summer 2026."],
  ],
};

export interface Skill {
  name: string;
  icon: string;       // key into PIXEL_ICONS
  category: string;   // tooltip lore text
  description: string;
  proficiency: number; // 0-100 for XP bar
}

export const SKILLS_CONTENT = {
  stats: [
    { label: 'Technologies', value: '15+' },
    { label: 'Platforms', value: '6' },
    { label: 'Years Building', value: '3+' },
  ],
  skills: [
    { name: 'Workato', icon: 'gear', category: 'Integration Platform', description: 'Enterprise iPaaS for building automations and integrations', proficiency: 90 },
    { name: 'HiBob', icon: 'server', category: 'HR Platform', description: 'Cloud HR platform for people management', proficiency: 85 },
    { name: 'NetSuite', icon: 'database', category: 'ERP Platform', description: 'Cloud business management suite', proficiency: 80 },
    { name: 'Deputy', icon: 'server', category: 'Workforce Management', description: 'Employee scheduling and time tracking', proficiency: 80 },
    { name: 'API Design', icon: 'link-chain', category: 'Architecture', description: 'Designing RESTful and GraphQL interfaces', proficiency: 85 },
    { name: 'Webhooks', icon: 'lightning', category: 'Integration', description: 'Event-driven HTTP callbacks', proficiency: 85 },
    { name: 'React', icon: 'atom', category: 'Frontend Framework', description: 'Component-based UI library', proficiency: 80 },
    { name: 'TypeScript', icon: 'typescript-logo', category: 'Language', description: 'Typed JavaScript superset', proficiency: 80 },
    { name: 'Node.js', icon: 'node-circle', category: 'Runtime', description: 'Server-side JavaScript runtime', proficiency: 75 },
    { name: 'Tailwind CSS', icon: 'paintbrush', category: 'Styling', description: 'Utility-first CSS framework', proficiency: 85 },
    { name: 'Next.js', icon: 'next-logo', category: 'Framework', description: 'Full-stack React framework', proficiency: 75 },
    { name: 'Systems Architecture', icon: 'server', category: 'Design', description: 'Designing scalable system architectures', proficiency: 80 },
    { name: 'Solutions Engineering', icon: 'handshake', category: 'Role', description: 'Technical problem-solving with clients', proficiency: 85 },
    { name: 'Client Communication', icon: 'handshake', category: 'Soft Skill', description: 'Translating technical concepts for stakeholders', proficiency: 90 },
    { name: 'Process Automation', icon: 'lightning', category: 'Integration', description: 'Automating manual business workflows', proficiency: 90 },
    { name: 'REST APIs', icon: 'link-chain', category: 'Protocol', description: 'RESTful API design and consumption', proficiency: 90 },
    { name: 'GraphQL', icon: 'link-chain', category: 'Protocol', description: 'Query language for APIs', proficiency: 65 },
    { name: 'CI/CD', icon: 'git-branch', category: 'DevOps', description: 'Continuous integration and deployment', proficiency: 70 },
    { name: 'Vercel', icon: 'terminal', category: 'Platform', description: 'Frontend deployment platform', proficiency: 80 },
    { name: 'PostgreSQL', icon: 'database', category: 'Database', description: 'Relational database system', proficiency: 70 },
    { name: 'Git', icon: 'git-branch', category: 'Version Control', description: 'Distributed version control', proficiency: 85 },
    { name: 'Agile', icon: 'gear', category: 'Methodology', description: 'Iterative development process', proficiency: 80 },
  ] satisfies Skill[],
};

export interface WorkEntry {
  title: string;
  company: string;
  period: string;
  active: boolean;
  icon: string;         // key into PIXEL_ICONS
  description: string;
}

export const WORK_CONTENT: WorkEntry[] = [
  {
    title: 'Integration Specialist',
    company: 'Digital Directions',
    period: 'Mar 2025 — Present',
    active: true,
    icon: 'gear',
    description: "I'm the person they call when HiBob needs to talk to NetSuite, or Deputy needs to feed payroll. Building the automations that make enterprise platforms actually work together — so nobody has to copy-paste between tabs ever again.",
  },
  {
    title: 'Founder',
    company: 'Bryce Digital',
    period: 'Jan 2025 — Present',
    active: true,
    icon: 'terminal',
    description: 'My own web development studio. I design and build high-performance sites for small businesses and creators — from first pixel to live deploy. No templates, no page builders, just clean code.',
  },
  {
    title: 'Computer Science, B.S.',
    company: 'San Diego State University',
    period: 'May 2026',
    active: false,
    icon: 'pickaxe',
    description: "Wrapping up my CS degree with a focus on systems architecture and software engineering. The theory is solid — but honestly, I learned more shipping real integrations than any textbook could teach.",
  },
];

export interface Project {
  title: string;
  type: 'production' | 'independent';
  featured?: boolean;
  accentColor: string;
  tags: string[];
  description: string;
  url?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  challenges?: Array<{ title: string; description: string }>;
  circuitNodes?: Array<{ id: string; label: string; x: number; y: number }>;
  circuitConnections?: Array<{ from: string; to: string }>;
}

export const PORTFOLIO_CONTENT: Project[] = [
  // Production projects — pull exact text from current Portfolio.tsx
  // The implementer MUST read src/components/Portfolio.tsx to extract:
  // 1. HRIS Platform (featured) — problem, solution, impact, 4 technical challenges, architecture nodes
  // 2. Client Implementation Portal — problem, solution, impact, tech tags
  // Independent projects — extract from compact cards in Portfolio.tsx:
  // Thread, Crypto Dashboard, SideQuest, Port, Bryce Digital
  // Each has: title, description, tech tags, accent color, optional URL
];

export const CONTACT_CONTENT = {
  heading: "Let's connect.",
  body: "Targeting Solutions Engineer roles in NYC, Summer 2026. Got an opportunity? Want to nerd out about integrations? I'm all ears.",
  email: 'bryce.rambach@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bryce-rambach/',
  github: 'https://github.com/brambach',
};
```

- [ ] **Step 3: Add Silkscreen font to index.html**

Add Google Fonts link for Silkscreen to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Update index.css with MC theme**

Replace the existing theme in `src/index.css`. Keep the `@import "tailwindcss"` and font imports for Inter/JetBrains Mono. Add:

- Silkscreen font-family as `--font-pixel`
- MC color CSS custom properties matching `mc-theme.ts`
- Utility classes for MC beveled borders (`.mc-bevel-out`, `.mc-bevel-in`)
- Pixel font rendering rules (`.font-pixel` class with `-webkit-font-smoothing: none`)
- Remove old blob/marquee animations, dot grid, grain texture
- Remove Instrument Serif from Google Fonts import (replaced by Silkscreen for display text)
- Keep `prefers-reduced-motion` media query (disable all animations)
- Base background: `#0f0f12`

- [ ] **Step 5: Verify fonts load and theme compiles**

Run: `npm run dev`
Open browser, inspect that Silkscreen loads and base background is `#0f0f12`.

- [ ] **Step 6: Commit**

```bash
git add src/utils/mc-theme.ts src/data/content.ts src/index.css index.html
git commit -m "feat: add MC theme foundation — colors, fonts, content extraction"
```

---

## Task 2: MC UI Primitives

**Files:**
- Create: `src/components/mc-ui/McPanel.tsx`
- Create: `src/components/mc-ui/McSlot.tsx`
- Create: `src/components/mc-ui/McTooltip.tsx`
- Create: `src/components/mc-ui/McButton.tsx`
- Create: `src/components/mc-ui/McAchievement.tsx`
- Create: `src/components/mc-ui/McXpBar.tsx`
- Create: `src/components/mc-ui/McChat.tsx`

These are the building blocks used across all sections. Each is a self-contained, styled component. Note: `McHotbar` is listed in the file structure under `mc-ui/` but is created separately in Task 8 because it depends on hooks from Task 6.

- [ ] **Step 1: Create McPanel**

The classic Minecraft inventory panel — light gray background with 3D beveled borders:

```typescript
interface McPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean; // Inner dark variant (inventory slot container)
}
```

Styling: outer border uses `border-top/left: white`, `border-right/bottom: #555`, background `#c6c6c6`. Dark variant inverts the bevel and uses `#8b8b8b` background.

- [ ] **Step 2: Create McSlot**

Inventory slot — 52x52px square with inset bevel:

```typescript
interface McSlotProps {
  icon: React.ReactNode;
  count?: string;
  label?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
  className?: string;
}
```

Hover: subtle scale(1.05). Active: white border (hotbar selection style). Count badge in bottom-right with MC text shadow.

- [ ] **Step 3: Create McTooltip**

Purple-bordered Minecraft tooltip:

```typescript
interface McTooltipProps {
  title: string;
  lore?: string;        // Purple italic category
  description?: string;  // Gray body text
  stats?: Array<{ label: string; value: string; color?: 'green' | 'red' | 'gray' }>;
  children: React.ReactNode; // Trigger element
}
```

Background `#100010`, border `2px solid #5000a0`, outline `2px solid #28007f`. Positioned above trigger on hover. Title in aqua (`#55ffff`), lore in purple (`#aa00aa`), stats in green (`#55ff55`).

- [ ] **Step 4: Create McButton**

Beveled MC button:

```typescript
interface McButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  subtext?: string;     // Small text below main label
  className?: string;
}
```

Background `#8b8b8b`, 3D bevel borders. Hover: background shifts to `#9b9bff`, text turns `#ffffa0`. Active: bevel inverts (pressed state). Disabled: darker, no hover. Subtext in smaller Inter font below pixel text.

- [ ] **Step 5: Create McAchievement**

Achievement toast banner:

```typescript
interface McAchievementProps {
  icon: React.ReactNode;
  label?: string;        // Default: "Advancement Made!"
  title: string;
  onClick?: () => void;
  expanded?: boolean;
  children?: React.ReactNode; // Expanded content
}
```

MC panel style with icon slot on left, gold label text, title in panel text color. Supports expand/collapse for work experience details.

- [ ] **Step 6: Create McXpBar**

XP progress bar:

```typescript
interface McXpBarProps {
  label: string;
  level: number;
  progress: number;  // 0-100
  sublabel?: string; // e.g., "Expert"
}
```

Dark background bar, green fill (`#80ff20`) with inset shadow. Level number centered above bar in green pixel font with MC text shadow (black outline on all sides).

- [ ] **Step 7: Create McChat**

Chat log interface for contact section:

```typescript
interface McChatProps {
  messages: Array<{
    type: 'system' | 'player' | 'link';
    name?: string;
    nameColor?: string;
    text: string;
    href?: string;
  }>;
  placeholder?: string;
  onSubmit?: (message: string) => void;
}
```

Semi-transparent black background. System messages in gray italic. Player names in yellow/aqua. Links in green. Input field at bottom with blinking cursor. On submit: opens `mailto:bryce.rambach@gmail.com?subject={text}`.

- [ ] **Step 8: Verify all MC UI components render**

Create a temporary test page in App.tsx that renders each MC UI component with sample data. Visually verify they look like Minecraft UI. Remove test page after verification.

- [ ] **Step 9: Commit**

```bash
git add src/components/mc-ui/
git commit -m "feat: add MC UI primitives — panel, slot, tooltip, button, achievement, xp bar, chat"
```

---

## Task 3: Pixel Icons

**Files:**
- Create: `src/components/icons/pixel-icons.tsx`

- [ ] **Step 1: Create SVG pixel-art icons**

Create ~20 inline SVG icons as React components. Each icon is a 16x16 pixel grid rendered as an SVG with `image-rendering: pixelated`. Icons needed:

**Hotbar nav (7):** house, tree, pickaxe, lantern, redstone-dust, ender-pearl, chat-bubble
**Skills (~13):** gear (Workato), link-chain (APIs/webhooks), atom (React), typescript-logo, node-circle, paintbrush (Tailwind/CSS), next-logo, server (architecture), handshake (client comms), lightning (automation), database (PostgreSQL), git-branch, terminal

Each icon: `interface PixelIconProps { size?: number; className?: string; }`. Default size 16. Export a lookup map: `export const PIXEL_ICONS: Record<string, React.FC<PixelIconProps>>`.

Style each as 16x16 grid using SVG `<rect>` elements for individual pixels. Keep designs simple — 2-3 colors max per icon, recognizable at small sizes.

- [ ] **Step 2: Commit**

```bash
git add src/components/icons/pixel-icons.tsx
git commit -m "feat: add pixel-art SVG icons for inventory slots and nav"
```

---

## Task 4: Particle System

**Files:**
- Create: `src/components/particles/particles.ts`
- Create: `src/components/particles/useParticles.ts`
- Create: `src/components/particles/ParticleCanvas.tsx`

- [ ] **Step 1: Define particle behaviors**

Create `src/components/particles/particles.ts` with particle types and update logic:

```typescript
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export type ParticleType = 'cloud' | 'leaf' | 'torch-spark' | 'xp-orb' | 'ender' | 'redstone' | 'block-break';

export function createParticle(type: ParticleType, canvasWidth: number, canvasHeight: number): Particle { ... }
export function updateParticle(p: Particle, type: ParticleType, dt: number): boolean { ... } // returns false when dead
```

Behaviors:
- **cloud**: slow rightward drift, large, very transparent, white
- **leaf**: slow fall + slight horizontal wobble, green squares, small
- **torch-spark**: float upward, amber, tiny, short life, random horizontal jitter
- **xp-orb**: float upward slowly, green glow, small circles
- **ender**: teleport (random position jumps), pink-purple, tiny
- **redstone**: slow drift, red, tiny, medium life
- **block-break**: burst outward from origin, gravity pull, random velocity, fade out fast (for click effects)

- [ ] **Step 2: Create useParticles hook**

Create `src/components/particles/useParticles.ts`:

```typescript
export function useParticles(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  type: ParticleType,
  options?: { maxCount?: number; spawnRate?: number; enabled?: boolean }
) { ... }
```

Uses `requestAnimationFrame`. Respects `prefers-reduced-motion` (returns early, no particles). Handles lifecycle: spawn at `spawnRate`, update each frame, remove dead particles, cap at `maxCount` (default 30 desktop, 10 mobile — detect via `window.innerWidth < 768`).

Returns `{ spawnBurst: (x: number, y: number, count: number) => void }` for on-demand particle bursts (block break).

- [ ] **Step 3: Create ParticleCanvas component**

Create `src/components/particles/ParticleCanvas.tsx`:

```typescript
interface ParticleCanvasProps {
  type: ParticleType;
  className?: string;
  enabled?: boolean;
}
```

Renders a `<canvas>` that fills its parent container. Uses `useParticles` hook. Canvas has `pointer-events: none` so it doesn't block interactions. Handles resize via ResizeObserver.

- [ ] **Step 4: Verify particles render**

Temporarily add a `<ParticleCanvas type="leaf" />` to App.tsx against a dark background. Verify leaves fall, performance is smooth, and reduced-motion disables them.

- [ ] **Step 5: Commit**

```bash
git add src/components/particles/
git commit -m "feat: add particle system — canvas renderer with 7 particle behaviors"
```

---

## Task 5: Animation Components

**Files:**
- Create: `src/components/animations/BlockByBlock.tsx`
- Create: `src/components/animations/ChestOpen.tsx`
- Create: `src/components/animations/EnchantGlint.tsx`
- Create: `src/components/animations/RedstoneCircuit.tsx`
- Create: `src/components/animations/ItemPickup.tsx`

- [ ] **Step 1: Create BlockByBlock**

Block placement reveal animation. Wraps children and reveals them character-by-character or element-by-element with a placement bounce:

```typescript
interface BlockByBlockProps {
  children: string | React.ReactNode[];  // string for character-by-character, array for element-by-element
  stagger?: number;     // ms between blocks, default 60
  trigger?: boolean;    // external trigger control
  className?: string;
  as?: 'span' | 'div' | 'h1' | 'h2';
}
```

If `children` is a string: split into characters, wrap each in a `motion.span`. If `children` is an array: wrap each element in a `motion.div`. Each block animates from `{ opacity: 0, y: -20, scale: 1.2 }` → `{ opacity: 1, y: 0, scale: 1 }` with spring physics (stiffness: 300, damping: 20). Staggers via `transition.delay`. Uses `useInView` for scroll trigger if `trigger` prop not provided. On reduced motion: renders static content.

- [ ] **Step 2: Create ChestOpen**

Expandable content with chest-lid animation:

```typescript
interface ChestOpenProps {
  trigger: React.ReactNode;  // The clickable element
  children: React.ReactNode; // Hidden content
  className?: string;
}
```

Uses `motion.div` with `AnimatePresence`. Trigger click toggles open state. Content reveals from 0 height with a slight 3D rotateX on the trigger element (like a lid tilting back). Spring animation.

- [ ] **Step 3: Create EnchantGlint**

Diagonal shimmer overlay:

```typescript
interface EnchantGlintProps {
  color?: string;    // default: enchant purple
  children: React.ReactNode;
  className?: string;
  active?: boolean;  // default: true
}
```

CSS-only: a `::after` pseudo-element with a diagonal linear gradient (transparent → white/purple at 10% opacity → transparent) that translates from bottom-left to top-right on a 3s infinite loop. `overflow: hidden` on parent. Disabled on reduced motion.

- [ ] **Step 4: Create RedstoneCircuit**

SVG circuit diagram with pulse animation:

```typescript
interface RedstoneCircuitProps {
  nodes: Array<{ id: string; label: string; x: number; y: number }>;
  connections: Array<{ from: string; to: string }>;
  trigger?: boolean;
  className?: string;
}
```

Renders SVG with nodes as labeled rectangles and connections as path lines. On trigger (scroll-based `useInView`), a red glow animates along each connection path using SVG `stroke-dashoffset` animation with staggered delays (repeater effect). Nodes light up as the pulse reaches them.

- [ ] **Step 5: Create ItemPickup**

Spin-float pickup animation:

```typescript
interface ItemPickupProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}
```

Uses `useInView` to trigger. Item starts below and offset, spins on Y axis (360deg via `rotateY`) while floating to final position. Spring physics. Reduced motion: fade in only.

- [ ] **Step 6: Commit**

```bash
git add src/components/animations/
git commit -m "feat: add MC animation components — block build, chest open, enchant glint, redstone circuit, item pickup"
```

---

## Task 6: BiomeBackground and Block Break Effect

**Files:**
- Create: `src/components/BiomeBackground.tsx`
- Create: `src/components/BlockBreakEffect.tsx`
- Create: `src/hooks/useBiomeScroll.ts`
- Create: `src/hooks/useBlockBreak.ts`

- [ ] **Step 1: Create useBiomeScroll hook**

```typescript
export function useBiomeScroll(): {
  activeSection: SectionId;
  activeBiome: BiomeId;
  sectionRefs: Record<SectionId, RefObject<HTMLElement | null>>;
} { ... }
```

Uses Intersection Observer on each section. Returns both `activeSection` (for hotbar highlighting) and `activeBiome` (for particle/accent color lookup, via `SECTION_TO_BIOME` mapping). Provides refs to attach to each section element.

- [ ] **Step 2: Create BiomeBackground**

Section wrapper that provides biome atmosphere:

```typescript
interface BiomeBackgroundProps {
  biome: BiomeId;
  children: React.ReactNode;
  className?: string;
  id?: string;
}
```

Renders a `<section>` with:
- Background gradient from `BIOMES[biome].bgGradient`
- `<ParticleCanvas>` for the biome's particle type — use Intersection Observer to track visibility. Pass `enabled={false}` when section is more than 2 viewports away (destroy canvas to reclaim memory). Re-enable on approach.
- ~150px top/bottom padding for transition overlap zones
- Biome-specific ambient effects (torch flicker box-shadow for cave, etc.)

- [ ] **Step 3: Create useBlockBreak hook**

```typescript
export function useBlockBreak(): { handleClick: (e: MouseEvent) => void } { ... }
```

Global click handler that spawns block-break particles at click position. Gets current biome's accent color from `useBiomeScroll`. Spawns 8-12 tiny pixel squares that burst outward with gravity. Uses a global canvas overlay.

- [ ] **Step 4: Create BlockBreakEffect**

Global component that renders a fixed full-screen canvas and listens for clicks via `useBlockBreak`. Placed once in App.tsx. Only fires on interactive elements (buttons, links, slots). Pointer-events: none on the canvas.

- [ ] **Step 5: Commit**

```bash
git add src/components/BiomeBackground.tsx src/components/BlockBreakEffect.tsx src/hooks/
git commit -m "feat: add biome backgrounds with particle integration and block-break click effect"
```

---

## Task 7: Entry Sequence — Title Screen, Loading, Spawn

**Files:**
- Create: `src/hooks/useEntryPhase.ts`
- Create: `src/components/entry/TitleScreen.tsx`
- Create: `src/components/entry/LoadingScreen.tsx`
- Create: `src/components/entry/SpawnAnimation.tsx`

- [ ] **Step 1: Create useEntryPhase hook**

```typescript
export function useEntryPhase(): {
  phase: EntryPhase;
  startGame: () => void;       // title → loading
  goToContact: () => void;     // title → world, scroll to contact
} { ... }
```

State machine:
- Check `sessionStorage.getItem('mc-portfolio-entered')` on mount
- Check reduced motion via `useReducedMotion()` from `motion/react` (already in deps)
- If reduced motion: phase = `'world'` immediately, no animations
- If sessionStorage set AND no hash: phase = `'spawning'` → auto-advance to `'world'` after 2s
- If sessionStorage set AND hash: phase = `'world'` immediately, then `scrollIntoView` target
- `startGame()`: sets phase to `'loading'`, after 2.5s sets to `'spawning'`, after 2s more sets to `'world'`, writes `sessionStorage`
- `goToContact()`: sets phase to `'world'`, writes `sessionStorage`, scrolls to contact

- [ ] **Step 2: Create TitleScreen**

Full-screen overlay. CSS gradient background (sky → grass → dirt). Large "BRYCE RAMBACH" in pixel font at 48px (larger than standard 32px — this is the title screen hero moment, needs to be visually impressive) with 3D text shadow. Yellow splash text with bounce/pulse animation at -15deg rotation. Three McButtons: Singleplayer (subtext "Explore Portfolio"), Multiplayer (subtext "Get In Touch"), Options (links to LinkedIn). Version text at bottom: "Portfolio v2.0". Fades out via `AnimatePresence` when phase leaves `'title'`.

- [ ] **Step 3: Create LoadingScreen**

Full-screen overlay. Dirt texture background via CSS repeating gradient (brown squares pattern). "Loading Bryce's World..." in white pixel font. Green XP-style progress bar that fills over 2.5s. Random tip text below (array of 5-6 tips). Fades out when phase leaves `'loading'`.

- [ ] **Step 4: Create SpawnAnimation**

Orchestrates the spawn-in. Renders when phase is `'spawning'`:
- Background crossfades from dirt to sky gradient
- `<BlockByBlock>` renders the hero name
- Hotbar slides up from below viewport (`motion.div` with y: 100 → 0)
- After animation completes (~2s), calls transition to `'world'` phase

- [ ] **Step 5: Wire entry sequence into App.tsx**

Replace current App.tsx content. New structure:

```tsx
function App() {
  const { phase, startGame, goToContact } = useEntryPhase();
  return (
    <>
      <AnimatePresence>
        {phase === 'title' && <TitleScreen onPlay={startGame} onContact={goToContact} />}
        {phase === 'loading' && <LoadingScreen />}
        {phase === 'spawning' && <SpawnAnimation />}
      </AnimatePresence>
      {/* World is always in DOM for SEO — hidden visually during entry */}
      <div style={{ opacity: phase === 'world' ? 1 : 0, pointerEvents: phase === 'world' ? 'auto' : 'none' }}>
        {/* sections go here in later tasks */}
      </div>
    </>
  );
}
```

- [ ] **Step 6: Test entry sequence manually**

Run dev server. Verify: title screen appears → click Singleplayer → loading screen with progress bar → spawn animation → world div visible. Clear sessionStorage → reload → full sequence. Set sessionStorage → reload → skip to spawn. Add `#test` hash → skip to world.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useEntryPhase.ts src/components/entry/ src/App.tsx
git commit -m "feat: add entry sequence — title screen, loading, spawn animation"
```

---

## Task 8: Hotbar Navigation

**Files:**
- Create: `src/components/mc-ui/McHotbar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create McHotbar**

```typescript
interface McHotbarProps {
  activeSection: string;
  visible: boolean;
}
```

Fixed to bottom of viewport. Black background strip with 7 `McSlot` components using pixel icons from `HOTBAR_ITEMS`. Active section gets white border. Smooth scroll on click. `motion.div` with slide-up entrance. Keyboard listener: keys 1-7 navigate to sections. Arrow keys move selection. Mobile: slightly larger slots (56px), no labels. Desktop: labels below icons.

- [ ] **Step 2: Wire into App.tsx**

Add `<McHotbar>` to App.tsx world div. Pass `activeBiome` from `useBiomeScroll`. Set `visible={phase === 'world'}`.

- [ ] **Step 3: Test hotbar**

Verify: appears after spawn, highlights active section on scroll, smooth scrolls on click, number keys work, responsive sizing on mobile viewport.

- [ ] **Step 4: Commit**

```bash
git add src/components/mc-ui/McHotbar.tsx src/App.tsx
git commit -m "feat: add hotbar navigation with keyboard shortcuts and scroll tracking"
```

---

## Task 9: Hero Section (Sky Biome)

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build Hero component**

Wrapped in `<BiomeBackground biome="sky">`. Content:
- Name via `<BlockByBlock as="h1">` in pixel font (32px)
- Tagline in Inter, fades in after name builds
- Role line in JetBrains Mono
- Status line with green pulsing dot (redstone-style): "open to work · NYC · summer 2026"
- Ambient cloud elements (CSS divs with slow horizontal drift animation)
- Full viewport height, content vertically centered

- [ ] **Step 2: Add to App.tsx**

Add `<Hero />` as first section in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx src/App.tsx
git commit -m "feat: add hero section — sky biome with block-by-block name build"
```

---

## Task 10: About Section (Forest Biome)

**Files:**
- Create: `src/components/sections/About.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build About component**

Wrapped in `<BiomeBackground biome="forest">`. Content:
- Section header "About" in pixel font (24px) with biome label
- Three `<McPanel>` blocks styled as oak signs, each containing one narrative block from `ABOUT_CONTENT`
- Body text in Inter (16px, good line height)
- Each panel enters with `<BlockByBlock>` stagger on scroll
- Leaf particles falling in background via BiomeBackground

- [ ] **Step 2: Add to App.tsx**

Add `<About />` after Hero in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx src/App.tsx
git commit -m "feat: add about section — forest biome with oak sign panels"
```

---

## Task 11: Skills Section (Cave Biome)

**Files:**
- Create: `src/components/sections/Skills.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build Skills component**

Wrapped in `<BiomeBackground biome="cave">`. Content:
- Section header "Inventory" in pixel font
- `<McPanel>` with dark inner panel containing inventory grid
- Grid of `<McSlot>` components — one per skill from `SKILLS_CONTENT`
  - Each slot has pixel icon + skill name
  - Wrapped in `<McTooltip>` showing: skill name (aqua), category (purple italic), description (gray), proficiency (green)
  - Wrapped in `<ItemPickup>` for scroll-triggered entrance
- Below inventory: `<McXpBar>` for 3-4 key skills (Workato, React, APIs, etc.)
- Stats row: animated counters for "15+ Technologies · 6 Platforms · 3+ Years"
- Torch flicker ambient: CSS `box-shadow` animation on panel edges with warm amber glow, randomized timing via CSS `animation-delay` with different durations

- [ ] **Step 2: Add to App.tsx**

Add `<Skills />` after About in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Skills.tsx src/App.tsx
git commit -m "feat: add skills section — cave biome with inventory grid and XP bars"
```

---

## Task 12: Work Section (Mine Shaft Biome)

**Files:**
- Create: `src/components/sections/Work.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build Work component**

Wrapped in `<BiomeBackground biome="mine">`. Content:
- Section header "Experience" in pixel font
- Vertical timeline styled as minecart rails (CSS border pattern or SVG)
- Each work entry is an `<McAchievement>` component:
  - Icon: pixel icon representing role (gear for integration, code for founder, book for education)
  - Label: "Advancement Made!" in gold pixel font
  - Title: role name
  - Subtitle: company/school + dates in JetBrains Mono
  - Click → `<ChestOpen>` reveals full description in Inter
- Active roles (Digital Directions, Bryce Digital): pulsing redstone dot on timeline
- Inactive (SDSU): stone/gray dot
- Achievements alternate left/right with scroll-triggered slide-in

- [ ] **Step 2: Add to App.tsx**

Add `<Work />` after Skills in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Work.tsx src/App.tsx
git commit -m "feat: add work section — mine shaft biome with achievement timeline"
```

---

## Task 13: Portfolio Production Section (Redstone Layer)

**Files:**
- Create: `src/components/sections/PortfolioProduction.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build PortfolioProduction component**

Wrapped in `<BiomeBackground biome="redstone">`. Content:
- Section header "Production Systems" in pixel font
- **HRIS Platform** (featured):
  - Large card with `<EnchantGlint>` in redstone red
  - `<RedstoneCircuit>` showing: HiBob node → Workato orchestration node → 4 destination nodes (MicrOpay, Deputy, MYOB, NetSuite)
  - Circuit pulse animation triggers on scroll
  - Below diagram: Problem/Solution/Impact in clean Inter text within `<McPanel>`
  - Technical challenges in 4 expandable `<ChestOpen>` blocks
  - Tech tags as `<McSlot>` mini-items
- **Client Implementation Portal**:
  - Similar card structure, different content
  - Circuit diagram showing portal architecture

- [ ] **Step 2: Add to App.tsx**

Add `<PortfolioProduction />` after Work in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PortfolioProduction.tsx src/App.tsx
git commit -m "feat: add production portfolio — redstone biome with circuit diagrams"
```

---

## Task 14: Portfolio Builds Section (Stronghold)

**Files:**
- Create: `src/components/sections/PortfolioBuilds.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build PortfolioBuilds component**

Wrapped in `<BiomeBackground biome="stronghold">`. Content:
- Section header "Independent Builds" in pixel font
- Grid layout: 2 columns desktop, 1 column mobile
- Each project card:
  - `<EnchantGlint>` with project's accent color
  - Project name in pixel font, description in Inter
  - Tech tags as mini `<McSlot>` items
  - Hover: card lifts via `translateY(-4px)`, `<ItemPickup>` spin on icon
  - Click: `<ChestOpen>` reveals full project details
- Projects from `PORTFOLIO_CONTENT`: Thread, Crypto Dashboard, SideQuest, Port, Bryce Digital
- Ender particles in background (stronghold biome)

- [ ] **Step 2: Add to App.tsx**

Add `<PortfolioBuilds />` after PortfolioProduction in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PortfolioBuilds.tsx src/App.tsx
git commit -m "feat: add builds portfolio — stronghold biome with enchanted project cards"
```

---

## Task 15: Contact Section (The End)

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build Contact component**

Wrapped in `<BiomeBackground biome="end">`. Content:
- Section header "The End" in pixel font with enchant purple
- `<McChat>` component with messages:
  - `{ type: 'system', text: "[Server] Welcome to Bryce's world!" }`
  - `{ type: 'player', name: 'Visitor', nameColor: '#55ffff', text: "Hey, love your portfolio!" }`
  - `{ type: 'player', name: 'Bryce', nameColor: '#ffff55', text: "Thanks! Let's connect" }`
  - `{ type: 'link', text: 'bryce.rambach@gmail.com', href: 'mailto:bryce.rambach@gmail.com' }`
  - `{ type: 'link', text: 'linkedin.com/in/bryce-rambach', href: 'https://www.linkedin.com/in/bryce-rambach/' }`
  - `{ type: 'link', text: 'github.com/brambach', href: 'https://github.com/brambach' }`
- Chat input with blinking cursor, submits to mailto
- Floating end island silhouettes (CSS shapes, very subtle)
- Ender particles dense in this section

- [ ] **Step 2: Add to App.tsx**

Add `<Contact />` as last section in world div.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx src/App.tsx
git commit -m "feat: add contact section — the end biome with chat log interface"
```

---

## Task 16: Easter Eggs

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/BlockBreakEffect.tsx`

- [ ] **Step 1: Add damage numbers**

In `BlockBreakEffect.tsx`, add logic: if click target is NOT interactive (no `<a>`, `<button>`, `[role=button]`, `.mc-slot` ancestor), spawn a floating red damage number instead of block-break particles. Text: random from ["Miss!", "-0 HP", "Blocked!", "Dodged!"]. Float upward and fade. Throttle: max once per 3 seconds. Desktop only (check `window.innerWidth >= 1024`).

- [ ] **Step 2: Add creeper easter egg**

Add a hidden creeper face somewhere on the site (e.g., tiny 8x8 pixel face in the footer or between sections). On hover: show "Ssssss..." text that expands outward, trigger a brief CSS `animation: shake 0.3s` on the page, spawn a burst of block-break particles in green.

- [ ] **Step 3: Preserve Konami code**

Keep the existing Konami code detection from current App.tsx. On activation: apply a Minecraft-specific effect (e.g., invert all colors briefly, or spawn a massive burst of XP orbs across the screen).

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/BlockBreakEffect.tsx
git commit -m "feat: add easter eggs — damage numbers, creeper explosion, konami code"
```

---

## Task 17: Cleanup and Old Component Removal

**Files:**
- Delete: `src/components/Navbar.tsx`
- Delete: `src/components/Footer.tsx`
- Delete: `src/components/ScrollReveal.tsx`
- Delete: `src/components/TextScramble.tsx`
- Delete: `src/components/CustomCursor.tsx`
- Delete: `src/components/Magnetic.tsx`
- Delete: Old section components (the originals in `src/components/` root)
- Modify: `src/App.tsx` — remove any remaining references to old components

- [ ] **Step 1: Remove old components**

Delete all old component files that have been replaced by the new MC-themed versions. The old Hero.tsx, About.tsx, Skills.tsx, Work.tsx, Portfolio.tsx, Contact.tsx are replaced by the new `sections/` directory. The old utility components (ScrollReveal, TextScramble, CustomCursor, Magnetic, Navbar) are replaced by MC equivalents.

**Footer:** The old Footer.tsx is deleted with no direct replacement. The Contact section (The End) now serves as the final section with all contact links. Add a minimal copyright line below the chat log in Contact.tsx: "© {year} Bryce Rambach" in pixel font, small size. This preserves the legal notice without a full footer component.

- [ ] **Step 2: Clean up App.tsx**

Remove any remaining imports or references to old components. Remove old blob animations, dot grid, grain texture, and any other legacy UI from App.tsx. The only things in App.tsx should be: entry sequence, world sections, hotbar, block break effect.

- [ ] **Step 3: Clean up index.css**

Remove any CSS that was for old components (blob keyframes, marquee, dot grid, old font variables). Keep only MC theme styles.

- [ ] **Step 4: Remove unused dependencies**

Run: `npm uninstall lucide-react`
Verify no imports of `lucide-react` remain: search the `src/` directory for any `from 'lucide-react'` imports.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: clean build with no TypeScript errors and no missing imports.

Run: `npm run lint`
Expected: no type errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove old components, legacy styles, and unused dependencies"
```

---

## Task 18: SEO, Meta, and Responsive Polish

**Files:**
- Modify: `index.html`
- Modify: `src/App.tsx`
- Modify: various section components for responsive tweaks

- [ ] **Step 1: Update meta tags**

In `index.html`:
- `<title>Bryce Rambach — Integration Specialist & Developer</title>`
- OG tags: `og:title`, `og:description`, `og:image` (placeholder path for now)
- `<meta name="description" content="...">`
- Note: OG image will be a static screenshot of the title screen, captured manually post-launch. Use a placeholder comment in the meta tag for now.

- [ ] **Step 2: Verify content is in DOM for SEO**

Confirm the world div is always rendered (not conditionally mounted). Title screen is an overlay on top, not a replacement. View source should show all content text.

- [ ] **Step 3: Responsive testing**

Test at 3 breakpoints:
- Desktop (1280px): full experience, verify hotbar labels, inventory grid columns, side-by-side layouts
- Tablet (768px): hotbar, grid wrap, card stacking
- Mobile (375px): icons-only hotbar, single column, touch targets 48px+, title screen buttons stacked

Fix any responsive issues in section components.

- [ ] **Step 4: Accessibility check**

- Toggle `prefers-reduced-motion`: verify all animations disabled, site still looks like Minecraft, all content accessible
- Tab through entire site: verify focus order makes sense
- Check color contrast on pixel font text against biome backgrounds

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SEO meta tags and responsive/accessibility polish"
```

---

## Task 19: Final Integration Test and Performance

**Files:**
- No new files

- [ ] **Step 1: Full flow test**

Clear sessionStorage. Load site. Walk through:
1. Title screen renders with name, splash text, buttons
2. Click Singleplayer → loading screen with progress bar
3. Loading completes → spawn animation (block-by-block name)
4. Scroll through all 7 biomes, verify:
   - Each biome has correct background gradient and particles
   - All content is present and readable
   - MC UI components render correctly (slots, tooltips, achievements, panels)
   - Animations fire on scroll (block build, item pickup, enchant glint, redstone pulse)
   - Chest-open expandables work
   - Chat input works (opens mailto)
5. Hotbar tracks active section, number keys work
6. Block-break particles on interactive clicks
7. Easter eggs: find creeper, damage numbers on whitespace, Konami code

- [ ] **Step 2: Repeat visit test**

Reload page (sessionStorage set). Verify: skips to spawn animation, then world.
Navigate to `#skills` directly. Verify: skips to world, scrolls to skills.

- [ ] **Step 3: Performance check**

Run: `npm run build`
Check bundle size. Run Lighthouse in Chrome DevTools:
- Target: Performance 90+
- Check: no layout shifts from entry sequence, particles don't tank FPS
- Verify: canvases pause when off-screen, destroyed when far away

- [ ] **Step 4: Fix any issues found**

Address any bugs, visual glitches, or performance problems.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Minecraft portfolio redesign — all sections, animations, and polish"
```
