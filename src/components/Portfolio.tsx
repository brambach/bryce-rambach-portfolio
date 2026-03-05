import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, Parallax } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

interface ProjectNode {
  label: string;
  sublabel: string;
}

const projects = [
  {
    title: "Bryce Digital",
    tagline: "My web development studio",
    description:
      "My own studio. I design and build high-performance sites for small businesses and creators — from first pixel to live deploy. No templates, no page builders, just clean code.",
    tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
    source: { label: "Design", sublabel: "Figma" },
    target: { label: "Deploy", sublabel: "Vercel" },
    flowLabel: "components",
    accentGlow: "bg-blue-500/15",
    accentBorder: "hover:border-blue-400/40",
    accentLine: "bg-blue-500",
    accentColor: "#3b82f6",
    dotColor: "bg-blue-400",
    url: "https://brycedigital.io",
  },
  {
    title: "HiBob + NetSuite Sync",
    tagline: "Enterprise HRIS integration",
    description:
      "Two-way sync between HiBob and NetSuite. When someone joins, gets promoted, or leaves — HR, payroll, and finance all know instantly. Killed hours of manual entry per week.",
    tech: ["Workato", "REST APIs", "HiBob", "NetSuite"],
    source: { label: "HiBob", sublabel: "HRIS" },
    target: { label: "NetSuite", sublabel: "ERP" },
    flowLabel: "employee data",
    accentGlow: "bg-emerald-500/15",
    accentBorder: "hover:border-emerald-400/40",
    accentLine: "bg-emerald-500",
    accentColor: "#10b981",
    dotColor: "bg-emerald-400",
  },
  {
    title: "Deputy Workforce Automation",
    tagline: "Scheduling + payroll pipeline",
    description:
      "Connected Deputy scheduling data to payroll and HRIS in real-time. Onboarding that used to take three systems and a spreadsheet now just... happens.",
    tech: ["Workato", "Webhooks", "Deputy", "API Design"],
    source: { label: "Deputy", sublabel: "Scheduling" },
    target: { label: "Payroll", sublabel: "HRIS" },
    flowLabel: "schedules",
    accentGlow: "bg-purple-500/15",
    accentBorder: "hover:border-purple-400/40",
    accentLine: "bg-purple-500",
    accentColor: "#a855f7",
    dotColor: "bg-purple-400",
  },
  {
    title: "HiBob + MYOB Sync",
    tagline: "HR to accounting automation",
    description:
      "Piped employee data from HiBob straight into MYOB accounting. Payroll and financial records stay locked in sync — no one touches a spreadsheet.",
    tech: ["Workato", "REST APIs", "HiBob", "MYOB"],
    source: { label: "HiBob", sublabel: "HRIS" },
    target: { label: "MYOB", sublabel: "Accounting" },
    flowLabel: "payroll data",
    accentGlow: "bg-rose-500/15",
    accentBorder: "hover:border-rose-400/40",
    accentLine: "bg-rose-500",
    accentColor: "#f43f5e",
    dotColor: "bg-rose-400",
  },
  {
    title: "HiBob + KeyPay Sync",
    tagline: "HRIS to payroll integration",
    description:
      "Automated the entire employee lifecycle from HiBob to KeyPay. New hire? Payroll's already set up before they finish orientation.",
    tech: ["Workato", "REST APIs", "HiBob", "KeyPay"],
    source: { label: "HiBob", sublabel: "HRIS" },
    target: { label: "KeyPay", sublabel: "Payroll" },
    flowLabel: "employee records",
    accentGlow: "bg-sky-500/15",
    accentBorder: "hover:border-sky-400/40",
    accentLine: "bg-sky-500",
    accentColor: "#0ea5e9",
    dotColor: "bg-sky-400",
  },
  {
    title: "Digital Directions Portal",
    tagline: "Internal client management tool",
    description:
      "Built the internal tool my team actually wanted — track client integrations, manage project status, and stop losing docs in Slack threads.",
    tech: ["React", "Node.js", "REST APIs", "Tailwind CSS"],
    source: { label: "Client", sublabel: "Request" },
    target: { label: "Portal", sublabel: "Dashboard" },
    flowLabel: "project data",
    accentGlow: "bg-teal-500/15",
    accentBorder: "hover:border-teal-400/40",
    accentLine: "bg-teal-500",
    accentColor: "#14b8a6",
    dotColor: "bg-teal-400",
  },
  {
    title: "This Portfolio",
    tagline: "The site you're looking at right now",
    description:
      "You're scrolling through it. Built from scratch — scroll-driven horizontal gallery, 3D card tilts, animated counters, and way too many hover states. Had fun with this one.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    source: { label: "Code", sublabel: "React" },
    target: { label: "Browser", sublabel: "You" },
    flowLabel: "pixels",
    accentGlow: "bg-amber-500/15",
    accentBorder: "hover:border-amber-400/40",
    accentLine: "bg-amber-500",
    accentColor: "#f59e0b",
    dotColor: "bg-amber-400",
    url: "#",
  },
];

const FLOW_PATH = "M 50,50 C 150,20 310,20 410,50";

function IntegrationDiagram({
  source,
  target,
  flowLabel,
  accentColor,
  isActive,
  reducedMotion,
}: {
  source: ProjectNode;
  target: ProjectNode;
  flowLabel: string;
  accentColor: string;
  isActive: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <div className="relative h-[100px] mb-4">
      {/* SVG connection line + particles */}
      <svg
        viewBox="0 0 460 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Connection line */}
        <path
          d={FLOW_PATH}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="transition-opacity duration-400"
          style={{
            opacity: isActive ? 0.5 : 0.15,
            animation: isActive && !reducedMotion ? "dash-flow 1s linear infinite" : "none",
          }}
        />

        {/* Flow label — centered above the arc */}
        <text
          x="230"
          y="14"
          textAnchor="middle"
          fill={accentColor}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.05em",
            opacity: isActive ? 0.6 : (reducedMotion ? 0.4 : 0),
            transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
          }}
        >
          {flowLabel}
        </text>

        {/* Particles — only render if not reduced motion */}
        {!reducedMotion && [0, 0.8, 1.6].map((delay, i) => (
          <circle
            key={i}
            r="2.5"
            fill={accentColor}
            className="transition-opacity duration-500"
            style={{
              opacity: isActive ? 0.8 : 0,
              transitionDelay: "0.1s",
            }}
          >
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path={FLOW_PATH}
              begin={`${delay}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Source node — positioned over SVG left side */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-[70px]"
      >
        <div
          className="w-[10px] h-[10px] rounded-sm bg-white/[0.06] border transition-all duration-300"
          style={{
            borderColor: isActive ? `${accentColor}66` : "rgba(255,255,255,0.08)",
            boxShadow: isActive ? `0 0 12px ${accentColor}30` : "none",
          }}
        />
        <span
          className="font-mono text-xs transition-colors duration-300"
          style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
        >
          {source.label}
        </span>
        <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider leading-none">
          {source.sublabel}
        </span>
      </div>

      {/* Target node — positioned over SVG right side */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-[70px]"
      >
        <div
          className="w-[10px] h-[10px] rounded-sm bg-white/[0.06] border transition-all duration-300"
          style={{
            borderColor: isActive ? `${accentColor}66` : "rgba(255,255,255,0.08)",
            boxShadow: isActive ? `0 0 12px ${accentColor}30` : "none",
          }}
        />
        <span
          className="font-mono text-xs transition-colors duration-300"
          style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
        >
          {target.label}
        </span>
        <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider leading-none">
          {target.sublabel}
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const maxTilt = 8;
    setTilt({
      rotateX: (0.5 - y) * maxTilt,
      rotateY: (x - 0.5) * maxTilt,
    });
    setGlarePos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  // On touch devices, diagram is always subtly active
  const diagramActive = isTouchDevice || isHovering;

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      data-cursor="card"
    >
      {/* Accent glow on hover */}
      <div
        className={`absolute -inset-px rounded-4xl ${project.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
      />

      <div
        className={`relative h-full bg-white/[0.04] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-8 md:p-10 transition-all duration-300 ${project.accentBorder} hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden`}
      >
        {/* Colored accent line at top */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] ${project.accentLine} opacity-50 rounded-t-4xl`} />

        {/* Ghost number */}
        <span className="absolute top-6 right-8 text-8xl font-black text-white/[0.06] select-none pointer-events-none leading-none font-display">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Glare overlay */}
        <div
          className="absolute inset-0 rounded-4xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovering ? 0.08 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, white, transparent 60%)`,
          }}
        />

        {/* Integration Diagram */}
        <IntegrationDiagram
          source={project.source}
          target={project.target}
          flowLabel={project.flowLabel}
          accentColor={project.accentColor}
          isActive={diagramActive}
          reducedMotion={reducedMotion}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between mb-2">
          <h4 className="text-2xl font-semibold text-white">
            {project.title}
          </h4>
          {project.url && project.url !== "#" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 ml-3 p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-500 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
            </a>
          )}
        </div>
        <p className="relative text-sm font-medium text-neutral-500 mb-6 tracking-wide flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${project.dotColor}`} />
          {project.tagline}
        </p>

        {/* Description */}
        <p className="relative text-neutral-400 font-light leading-relaxed mb-8">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="relative flex flex-wrap gap-2 mt-auto">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono font-medium text-neutral-500 bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/[0.08]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Measure actual scrollable width using ResizeObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollRange(trackWidth - viewportWidth + 48); // 48px = px-6 padding on each side
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Map vertical scroll to pixel-based horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Fraction counter
  const [currentIndex, setCurrentIndex] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrentIndex(Math.min(Math.floor(v * projects.length) + 1, projects.length));
  });

  // Fallback for reduced motion: normal vertical layout
  if (reducedMotion) {
    return (
      <section id="portfolio" className="py-24 md:py-32 max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            Portfolio
          </h3>
          <p className="mt-4 text-neutral-500 font-light leading-relaxed max-w-xs">
            Things I've built, broken, and shipped.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div key={project.title}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="px-6 md:px-12">
      {/* This tall container is what we scroll through — height drives horizontal movement */}
      <div ref={containerRef} style={{ height: `${projects.length * 70}vh` }} className="relative">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-24">
          {/* Header + progress */}
          <div className="mb-8 px-0">
            <Parallax offset={-20}>
              <ScrollReveal>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                      <TextScramble text="Portfolio" />
                    </h3>
                    <p className="mt-2 text-neutral-500 font-light leading-relaxed max-w-xs text-sm">
                      Things I've built, broken, and shipped.
                    </p>
                  </div>
                  {/* Progress indicator */}
                  <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-neutral-600">
                    <span className="tabular-nums">{currentIndex} / {projects.length}</span>
                  </div>
                </div>
                {/* Full-width progress bar */}
                <div className="w-full h-px bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-400/60 rounded-full"
                    style={{ width: progressWidth }}
                  />
                </div>
              </ScrollReveal>
            </Parallax>
          </div>

          {/* Horizontal scrolling cards */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6"
          >
            {projects.map((project, i) => (
              <div
                key={project.title}
                className={`w-[80vw] max-w-[600px] shrink-0 ${i % 2 === 1 ? "mt-8" : "mt-0"}`}
              >
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
