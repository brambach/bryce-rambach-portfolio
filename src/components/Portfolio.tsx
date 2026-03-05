import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, Parallax } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const projects = [
  {
    title: "Bryce Digital",
    tagline: "Web development studio",
    description:
      "My own studio. I design and build high-performance sites for small businesses and creators — from first pixel to live deploy. No templates, no page builders, just clean code.",
    tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
    accent: "border-blue-400/40",
    accentHex: "#60a5fa",
    url: "https://brycedigital.io",
  },
  {
    title: "HiBob + NetSuite Sync",
    tagline: "Enterprise HRIS integration",
    description:
      "Two-way sync between HiBob and NetSuite. When someone joins, gets promoted, or leaves — HR, payroll, and finance all know instantly. Killed hours of manual entry per week.",
    tech: ["Workato", "REST APIs", "HiBob", "NetSuite"],
    accent: "border-emerald-400/40",
    accentHex: "#34d399",
  },
  {
    title: "Deputy Workforce Automation",
    tagline: "Scheduling + payroll pipeline",
    description:
      "Connected Deputy scheduling data to payroll and HRIS in real-time. Onboarding that used to take three systems and a spreadsheet now just... happens.",
    tech: ["Workato", "Webhooks", "Deputy", "API Design"],
    accent: "border-purple-400/40",
    accentHex: "#c084fc",
  },
  {
    title: "HiBob + MYOB Sync",
    tagline: "HR to accounting automation",
    description:
      "Piped employee data from HiBob straight into MYOB accounting. Payroll and financial records stay locked in sync — no one touches a spreadsheet.",
    tech: ["Workato", "REST APIs", "HiBob", "MYOB"],
    accent: "border-rose-400/40",
    accentHex: "#fb7185",
  },
  {
    title: "HiBob + KeyPay Sync",
    tagline: "HRIS to payroll integration",
    description:
      "Automated the entire employee lifecycle from HiBob to KeyPay. New hire? Payroll's already set up before they finish orientation.",
    tech: ["Workato", "REST APIs", "HiBob", "KeyPay"],
    accent: "border-sky-400/40",
    accentHex: "#38bdf8",
  },
  {
    title: "Digital Directions Portal",
    tagline: "Internal client management tool",
    description:
      "Built the internal tool my team actually wanted — track client integrations, manage project status, and stop losing docs in Slack threads.",
    tech: ["React", "Node.js", "REST APIs", "Tailwind CSS"],
    accent: "border-teal-400/40",
    accentHex: "#2dd4bf",
  },
  {
    title: "This Portfolio",
    tagline: "The site you're looking at right now",
    description:
      "You're scrolling through it. Built from scratch — scroll-driven horizontal gallery, 3D card tilts, animated counters, and way too many hover states. Had fun with this one.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    accent: "border-amber-400/40",
    accentHex: "#fbbf24",
    url: "#",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 6,
      rotateY: (x - 0.5) * 6,
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

  const num = String(index + 1).padStart(2, "0");

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
      style={{ transformStyle: "preserve-3d" }}
      data-cursor="card"
    >
      {/* Glare overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovering ? 0.05 : 0,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, white, transparent 60%)`,
        }}
      />

      <div
        className="relative h-full border border-white/[0.04] rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden flex flex-col"
        style={{
          borderLeftWidth: "2px",
          borderLeftColor: isHovering ? project.accentHex : "rgba(255,255,255,0.06)",
          background: isHovering ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
        }}
      >
        {/* Index + Title row */}
        <div className="flex items-start gap-3 mb-1">
          <span className="font-mono text-xs text-neutral-700 pt-1.5 shrink-0">{num}</span>
          <div className="flex-1 flex items-start justify-between">
            <h4 className="text-xl font-display text-white leading-tight">
              {project.title}
            </h4>
            {project.url && project.url !== "#" && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 ml-3 p-1 text-neutral-700 hover:text-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest ml-8 mb-5">
          {project.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <p className="font-mono text-[11px] text-neutral-600">
          {project.tech.join(" · ")}
        </p>
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      setScrollRange(track.scrollWidth - window.innerWidth + 48);
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

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [currentIndex, setCurrentIndex] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrentIndex(Math.min(Math.floor(v * projects.length) + 1, projects.length));
  });

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
            <div key={project.title} style={{ perspective: 800 }}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="px-6 md:px-12">
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
                  <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-neutral-600">
                    <span className="tabular-nums">{currentIndex} / {projects.length}</span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/20 rounded-full"
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
                className="w-[80vw] max-w-[480px] shrink-0"
                style={{ perspective: 800 }}
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
