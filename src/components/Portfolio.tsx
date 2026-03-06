import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

/* ─── Architecture Diagram ─── */
function ArchitectureDiagram() {
  return (
    <div className="my-8 p-5 md:p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]">
      <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest mb-5">
        System Architecture
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 820 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full min-w-[640px] h-auto"
        >
          {/* Source: HiBob */}
          <rect x="10" y="120" width="130" height="80" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="75" y="153" textAnchor="middle" fill="#a3a3a3" fontSize="13" fontFamily="monospace" fontWeight="600">HiBob</text>
          <text x="75" y="173" textAnchor="middle" fill="#525252" fontSize="9" fontFamily="monospace">HRIS Source</text>

          {/* Event trigger label */}
          <text x="175" y="138" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">Webhook</text>
          <text x="175" y="148" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">Triggers</text>

          {/* Arrow: HiBob -> Workato */}
          <line x1="140" y1="160" x2="230" y2="160" stroke="#34d399" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="228,156 236,160 228,164" fill="#34d399" opacity="0.8" />

          {/* Orchestration: Workato */}
          <rect x="236" y="90" width="180" height="140" rx="12" fill="rgba(52,211,153,0.04)" stroke="#34d399" strokeWidth="1.5" strokeDasharray="0" />
          <text x="326" y="120" textAnchor="middle" fill="#34d399" fontSize="13" fontFamily="monospace" fontWeight="700">Workato</text>
          <text x="326" y="136" textAnchor="middle" fill="#525252" fontSize="9" fontFamily="monospace">Orchestration Layer</text>

          {/* Inner pipeline stages */}
          <rect x="256" y="150" width="140" height="22" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
          <text x="326" y="165" textAnchor="middle" fill="#737373" fontSize="8" fontFamily="monospace">Schema Mapping &amp; Normalization</text>

          <rect x="256" y="178" width="140" height="22" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
          <text x="326" y="193" textAnchor="middle" fill="#737373" fontSize="8" fontFamily="monospace">Validation &amp; Transformation</text>

          <rect x="256" y="206" width="66" height="16" rx="3" fill="rgba(251,113,133,0.08)" stroke="rgba(251,113,133,0.25)" strokeWidth="0.75" />
          <text x="289" y="217" textAnchor="middle" fill="#fb7185" fontSize="7" fontFamily="monospace">Retry Logic</text>

          <rect x="330" y="206" width="66" height="16" rx="3" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.75" />
          <text x="363" y="217" textAnchor="middle" fill="#fbbf24" fontSize="7" fontFamily="monospace">Error Queue</text>

          {/* Arrows: Workato -> Destinations */}
          {/* MicrOpay */}
          <line x1="416" y1="130" x2="520" y2="48" stroke="#f97316" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="517,43 524,47 517,52" fill="#f97316" opacity="0.8" />

          {/* Deputy */}
          <line x1="416" y1="145" x2="520" y2="118" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="517,113 524,117 517,122" fill="#a78bfa" opacity="0.8" />

          {/* MYOB */}
          <line x1="416" y1="170" x2="520" y2="192" stroke="#fb7185" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="517,188 524,192 517,197" fill="#fb7185" opacity="0.8" />

          {/* NetSuite */}
          <line x1="416" y1="185" x2="520" y2="268" stroke="#34d399" strokeWidth="1" strokeDasharray="4 3" />
          <polygon points="517,263 524,267 517,272" fill="#34d399" opacity="0.8" />

          {/* Destination: MicrOpay */}
          <rect x="526" y="24" width="140" height="50" rx="8" fill="rgba(249,115,22,0.04)" stroke="#f97316" strokeWidth="1" />
          <text x="596" y="46" textAnchor="middle" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="600">MicrOpay</text>
          <text x="596" y="62" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">Undocumented API</text>

          {/* Destination: Deputy */}
          <rect x="526" y="94" width="140" height="50" rx="8" fill="rgba(167,139,250,0.04)" stroke="#a78bfa" strokeWidth="1" />
          <text x="596" y="116" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="600">Deputy</text>
          <text x="596" y="132" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">Leave &amp; Scheduling</text>

          {/* Destination: MYOB */}
          <rect x="526" y="168" width="140" height="50" rx="8" fill="rgba(251,113,133,0.04)" stroke="#fb7185" strokeWidth="1" />
          <text x="596" y="190" textAnchor="middle" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="600">MYOB</text>
          <text x="596" y="206" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">Accounting / Payroll</text>

          {/* Destination: NetSuite */}
          <rect x="526" y="244" width="140" height="50" rx="8" fill="rgba(52,211,153,0.04)" stroke="#34d399" strokeWidth="1" />
          <text x="596" y="266" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="600">NetSuite</text>
          <text x="596" y="282" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">ERP / Field Dependencies</text>

          {/* Legend labels on right */}
          <rect x="700" y="50" width="8" height="8" rx="2" fill="#34d399" opacity="0.6" />
          <text x="714" y="58" fill="#525252" fontSize="8" fontFamily="monospace">Event-driven</text>

          <rect x="700" y="68" width="8" height="8" rx="2" fill="#fb7185" opacity="0.6" />
          <text x="714" y="76" fill="#525252" fontSize="8" fontFamily="monospace">Failure recovery</text>

          <rect x="700" y="86" width="8" height="8" rx="2" fill="#fbbf24" opacity="0.6" />
          <text x="714" y="94" fill="#525252" fontSize="8" fontFamily="monospace">Dead-letter queue</text>
        </svg>
      </div>
    </div>
  );
}

/* ─── Technical Challenges ─── */
function TechnicalChallenges() {
  const challenges = [
    {
      label: "Undocumented APIs",
      detail:
        "Reverse-engineered MicrOpay's payroll API with no official documentation and an unresponsive vendor. Mapped request/response schemas through systematic endpoint probing and built a custom abstraction layer.",
      accent: "#f97316",
    },
    {
      label: "Missing API Objects",
      detail:
        "MYOB had no native leave request endpoint. Designed a workaround using timesheets as a proxy object for leave records — creative data modeling under hard platform constraints.",
      accent: "#fb7185",
    },
    {
      label: "Field Dependency Chains",
      detail:
        "NetSuite's deeply nested record types required multi-pass writes with ordered field resolution. Built a dependency graph to sequence API calls and avoid referential integrity failures.",
      accent: "#34d399",
    },
    {
      label: "Idempotency & Failure Recovery",
      detail:
        "Designed all sync operations to be idempotent with automatic retry and dead-letter queuing. Ensured partial failures never left destination systems in an inconsistent state.",
      accent: "#a78bfa",
    },
  ];

  return (
    <div className="my-6">
      <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest mb-4">
        Technical Challenges
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {challenges.map((c) => (
          <div
            key={c.label}
            className="border border-white/[0.04] rounded-lg p-4 bg-white/[0.015] hover:bg-white/[0.025] transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: c.accent }}
              />
              <span className="text-xs text-white font-medium">{c.label}</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">{c.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Featured Integration Card (visually heavier) ─── */
function FeaturedIntegrationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (0.5 - y) * 3, rotateY: (x - 0.5) * 3 });
  }, []);

  const accent = "#34d399";

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      data-cursor="card"
    >
      <div
        className="relative border border-white/[0.06] rounded-2xl p-8 md:p-10 transition-all duration-500 overflow-hidden"
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: isHovering ? accent : "rgba(255,255,255,0.08)",
          background: isHovering
            ? "rgba(255,255,255,0.03)"
            : "rgba(255,255,255,0.015)",
        }}
      >
        {/* Subtle top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
          }}
        />

        {/* Header */}
        <div className="mb-2">
          <p className="font-mono text-[10px] text-emerald-400/60 uppercase tracking-widest mb-2">
            Production Infrastructure
          </p>
          <h4 className="text-2xl md:text-3xl font-display text-white leading-tight">
            HRIS-to-Payroll Orchestration Platform
          </h4>
        </div>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest mb-8">
          4 Greenfield Integrations &middot; Enterprise Clients &middot; Live Entertainment &amp; Services
        </p>

        {/* Problem / Solution / Impact */}
        <div className="space-y-5 mb-6">
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Problem
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1.5">
              Enterprise clients running HiBob as their HRIS had no automated path to sync employee data
              into payroll, accounting, and workforce management systems. Each destination &mdash; MicrOpay,
              Deputy, MYOB, and NetSuite &mdash; exposed incompatible schemas, undocumented endpoints, and
              vendor-specific edge cases. Manual reconciliation across these systems consumed hours of weekly
              administrative overhead and introduced a class of data inconsistency errors caused by schema
              mismatches and stale batch processes.
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Solution
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1.5">
              Designed and built an event-driven orchestration platform on Workato that normalizes HR data
              from HiBob and routes it through vendor-specific transformation pipelines. Each integration
              handles schema mapping, field validation, and data normalization before writing to the
              destination API. Implemented idempotent sync operations with automatic retry logic, dead-letter
              queuing for poison messages, and structured error reporting. Reverse-engineered undocumented
              APIs, invented proxy data models where vendor endpoints were missing, and resolved complex
              field dependency chains across deeply nested record types.
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Impact
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1.5">
              Reduced manual reconciliation from weekly batch processes to near-real-time event-driven sync.
              Eliminated an entire category of data inconsistency errors caused by manual re-keying and
              schema drift. Shipped four production integrations under client deadlines with zero senior
              engineering oversight &mdash; operating as the sole integration engineer across all workstreams.
            </p>
          </div>
        </div>

        {/* Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Technical Challenges */}
        <TechnicalChallenges />

        {/* Tech stack */}
        <div className="pt-5 border-t border-white/[0.06]">
          <p className="font-mono text-[11px] text-neutral-600">
            Workato &middot; REST APIs &middot; Webhooks &middot; HiBob &middot; NetSuite &middot; Deputy &middot; MYOB &middot; MicrOpay
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Standard Case Study Card ─── */
function CaseStudyCard({
  title,
  subtitle,
  problem,
  solution,
  impact,
  tech,
  accent,
  url,
}: {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  accent: string;
  url?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (0.5 - y) * 4, rotateY: (x - 0.5) * 4 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      data-cursor="card"
    >
      <div
        className="relative border border-white/[0.04] rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden"
        style={{
          borderLeftWidth: "2px",
          borderLeftColor: isHovering ? accent : "rgba(255,255,255,0.06)",
          background: isHovering
            ? "rgba(255,255,255,0.025)"
            : "rgba(255,255,255,0.015)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-xl md:text-2xl font-display text-white leading-tight">
            {title}
          </h4>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 ml-3 p-1 text-neutral-700 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest mb-6">
          {subtitle}
        </p>

        {/* Case study body */}
        <div className="space-y-4 mb-6">
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Problem
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1">
              {problem}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Solution
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1">
              {solution}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Impact
            </span>
            <p className="text-sm text-neutral-400 leading-relaxed mt-1">
              {impact}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="pt-4 border-t border-white/[0.04]">
          <p className="font-mono text-[11px] text-neutral-600">
            {tech.join(" · ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Compact Project Card ─── */
function CompactCard({
  title,
  tagline,
  description,
  tech,
  accent,
  url,
}: {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  accent: string;
  url?: string;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-cursor="card"
    >
      <div
        className="relative h-full border border-white/[0.04] rounded-2xl p-5 md:p-6 transition-all duration-500 overflow-hidden flex flex-col"
        style={{
          borderLeftWidth: "2px",
          borderLeftColor: isHovering ? accent : "rgba(255,255,255,0.06)",
          background: isHovering
            ? "rgba(255,255,255,0.025)"
            : "rgba(255,255,255,0.015)",
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-base font-display text-white leading-tight">
            {title}
          </h4>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 ml-2 p-0.5 text-neutral-700 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
          {tagline}
        </p>
        <p className="text-sm text-neutral-500 leading-relaxed mb-4 flex-1">
          {description}
        </p>
        <p className="font-mono text-[10px] text-neutral-600">
          {tech.join(" · ")}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Portfolio Section ─── */
export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <ScrollReveal>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-3">
              <TextScramble text="Selected Work" />
            </h3>
            <p className="text-neutral-500 font-light leading-relaxed max-w-lg text-sm">
              Production systems I built from scratch and shipped under real
              deadlines, plus independent builds where I explore ideas
              end-to-end.
            </p>
          </ScrollReveal>
        </div>

        {/* ═══ PRODUCTION SYSTEMS ═══ */}
        <div className="mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h4 className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                Production Systems
              </h4>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Featured: HRIS-to-Payroll Orchestration Platform */}
            <ScrollReveal>
              <FeaturedIntegrationCard />
            </ScrollReveal>

            {/* Featured: Client Portal */}
            <ScrollReveal>
              <CaseStudyCard
                title="Client Implementation Portal"
                subtitle="Full-Stack Internal + Client-Facing Platform"
                problem="The consultancy managed dozens of concurrent implementation projects across spreadsheets, Slack threads, and email — losing documents, missing status updates, and lacking visibility into integration health across client environments."
                solution="Purpose-built a full-stack portal (not white-label) with role-based access, a 9-stage implementation lifecycle with visual phase tracking, real-time integration health monitoring across five vendor APIs, a support ticket system with time tracking and Slack notifications, and cryptographically secure invite-only client accounts."
                impact="Consolidated project management, client communication, file sharing, and system health monitoring into a single platform. Replaced ad-hoc processes with a structured, auditable workflow."
                tech={[
                  "Next.js 15",
                  "TypeScript",
                  "Tailwind CSS",
                  "Clerk Auth",
                  "Drizzle ORM",
                  "Vercel Postgres",
                ]}
                accent="#38bdf8"
              />
            </ScrollReveal>
          </div>
        </div>

        {/* ═══ INDEPENDENT BUILDS ═══ */}
        <div>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <h4 className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                Independent Builds
              </h4>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
          </ScrollReveal>

          {/* Featured: Thread */}
          <ScrollReveal>
            <div className="mb-8">
              <CaseStudyCard
                title="Thread"
                subtitle="Personal Life Management PWA"
                problem="Existing productivity apps forced context-switching between separate tools for habits, tasks, calendar, journaling, and workout tracking — none of them talked to each other, and none fit the way I actually work."
                solution="Built a unified PWA with seven interconnected modules: morning habit checklists with streak tracking and grace-day logic, a task system with quick-capture inbox and Cmd+K, drag-and-drop calendar time-blocking, auto-saving journal with voice input, a workout logger with live PR detection, and a 'Close the Day' ritual that auto-generates daily recaps and rolls over unfinished tasks."
                impact="Daily driver. Ships as a PWA on Vercel with offline support. Demonstrates full product thinking — from UX design to data modeling to deployment."
                tech={[
                  "Next.js 16",
                  "React 19",
                  "TypeScript",
                  "Drizzle ORM",
                  "Neon Postgres",
                  "Framer Motion",
                  "dnd-kit",
                ]}
                accent="#a78bfa"
              />
            </div>
          </ScrollReveal>

          {/* Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScrollReveal>
              <CompactCard
                title="Crypto Dashboard"
                tagline="3D Interactive Data Visualization"
                description="Space-themed cryptocurrency dashboard with a Three.js globe, orbiting coin system with hover interactions, scroll-driven camera, and an AI chat panel for market analysis with streaming responses."
                tech={[
                  "Next.js",
                  "React Three Fiber",
                  "Three.js",
                  "Framer Motion",
                ]}
                accent="#fbbf24"
              />
            </ScrollReveal>
            <ScrollReveal>
              <CompactCard
                title="SideQuest"
                tagline="AI Location-Aware iOS App"
                description="AI-powered quest generator using GPS context and GPT-4o. Features a rarity system with distinct visuals and haptics, trust-based progression tiers, and AI photo reactions analyzing completion photos."
                tech={[
                  "SwiftUI",
                  "OpenAI API",
                  "CoreLocation",
                  "CoreHaptics",
                ]}
                accent="#f97316"
              />
            </ScrollReveal>
            <ScrollReveal>
              <CompactCard
                title="Port"
                tagline="iOS Focus Boundary App"
                description="Binary work/rest state with a deliberate 1-second close gesture triggering a cinematic 'Horizon Collapse' animation — synchronized haptics, sound, and visual compression. Auto-closes when charging."
                tech={["Swift", "SwiftUI", "WidgetKit", "AVFoundation"]}
                accent="#fb7185"
              />
            </ScrollReveal>
            <ScrollReveal>
              <CompactCard
                title="Bryce Digital"
                tagline="Studio Portfolio + Lead Gen"
                description="Custom-built studio site with 3D tilt cards, scroll-triggered animated counters, particle system with motion trails, terminal-style typing hero, and mouse-tracked radial gradient spotlights."
                tech={[
                  "Next.js 16",
                  "GSAP",
                  "Framer Motion",
                  "Lenis",
                  "Supabase",
                  "Stripe",
                ]}
                accent="#60a5fa"
                url="https://brycedigital.io"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
