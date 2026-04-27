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
