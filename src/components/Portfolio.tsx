import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, Parallax } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const projects = [
  {
    title: "Bryce Digital",
    tagline: "My web development studio",
    description:
      "Founded a freelance web studio building modern, high-performance sites for small businesses and creators. Full-stack development from design to deployment.",
    tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
    accent: "from-blue-500/20 to-cyan-500/20",
    accentBorder: "hover:border-blue-300/60",
    accentLine: "from-blue-500 to-cyan-500",
    dotColor: "bg-blue-400",
    url: "https://brycedigital.io",
  },
  {
    title: "HiBob + NetSuite Sync",
    tagline: "Enterprise HRIS integration",
    description:
      "Built a bidirectional sync between HiBob and NetSuite, automating employee lifecycle events across HR and finance. Eliminated hours of manual data entry per week.",
    tech: ["Workato", "REST APIs", "HiBob", "NetSuite"],
    accent: "from-emerald-500/20 to-teal-500/20",
    accentBorder: "hover:border-emerald-300/60",
    accentLine: "from-emerald-500 to-teal-500",
    dotColor: "bg-emerald-400",
  },
  {
    title: "Deputy Workforce Automation",
    tagline: "Scheduling + payroll pipeline",
    description:
      "Designed an integration pipeline connecting Deputy scheduling data with payroll and HRIS systems, reducing reconciliation errors and streamlining onboarding workflows.",
    tech: ["Workato", "Webhooks", "Deputy", "API Design"],
    accent: "from-purple-500/20 to-violet-500/20",
    accentBorder: "hover:border-purple-300/60",
    accentLine: "from-purple-500 to-violet-500",
    dotColor: "bg-purple-400",
  },
  {
    title: "HiBob + MYOB Sync",
    tagline: "HR to accounting automation",
    description:
      "Integrated HiBob with MYOB to automate the flow of employee data into accounting workflows, ensuring payroll and financial records stay in sync without manual intervention.",
    tech: ["Workato", "REST APIs", "HiBob", "MYOB"],
    accent: "from-rose-500/20 to-pink-500/20",
    accentBorder: "hover:border-rose-300/60",
    accentLine: "from-rose-500 to-pink-500",
    dotColor: "bg-rose-400",
  },
  {
    title: "HiBob + KeyPay Sync",
    tagline: "HRIS to payroll integration",
    description:
      "Built an automated sync between HiBob and KeyPay, streamlining employee onboarding and payroll processing by eliminating duplicate data entry across systems.",
    tech: ["Workato", "REST APIs", "HiBob", "KeyPay"],
    accent: "from-sky-500/20 to-indigo-500/20",
    accentBorder: "hover:border-sky-300/60",
    accentLine: "from-sky-500 to-indigo-500",
    dotColor: "bg-sky-400",
  },
  {
    title: "Digital Directions Portal",
    tagline: "Internal client management tool",
    description:
      "Developed an internal portal for Digital Directions to manage client integrations, track project status, and centralize documentation across the team.",
    tech: ["React", "Node.js", "REST APIs", "Tailwind CSS"],
    accent: "from-teal-500/20 to-cyan-500/20",
    accentBorder: "hover:border-teal-300/60",
    accentLine: "from-teal-500 to-cyan-500",
    dotColor: "bg-teal-400",
  },
  {
    title: "This Portfolio",
    tagline: "The site you're looking at",
    description:
      "A cinematic personal site built from scratch with React, Tailwind v4, and Motion. Scroll-driven animations, horizontal gallery, and custom interactions.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    accent: "from-amber-500/20 to-orange-500/20",
    accentBorder: "hover:border-amber-300/60",
    accentLine: "from-amber-500 to-orange-500",
    dotColor: "bg-amber-400",
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
      {/* Accent gradient glow */}
      <div
        className={`absolute -inset-px rounded-4xl bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
      />

      <div
        className={`relative h-full bg-white/3 backdrop-blur-xl border border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-10 md:p-12 transition-all duration-300 ${project.accentBorder} hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden`}
      >
        {/* Colored accent line at top */}
        <div className={`absolute top-0 left-8 right-8 h-0.5 bg-linear-to-r ${project.accentLine} opacity-40`} />

        {/* Ghost number */}
        <span className="absolute top-6 right-8 text-7xl font-black text-white/3 select-none pointer-events-none leading-none">
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
              className="text-xs font-medium text-neutral-500 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
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
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll to horizontal translation
  // We need to move (n-1) cards worth of width to the left
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${((projects.length - 1) / projects.length) * 100}%`]
  );

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
            A few things I've built, broken, and shipped.
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
      <div ref={containerRef} style={{ height: `${projects.length * 60}vh` }} className="relative">
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
                      A few things I've built, broken, and shipped.
                    </p>
                  </div>
                  {/* Progress indicator */}
                  <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-neutral-600">
                    <span className="tabular-nums">{currentIndex} / {projects.length}</span>
                    <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/40 rounded-full"
                        style={{ width: progressWidth }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </Parallax>
          </div>

          {/* Horizontal scrolling cards */}
          <motion.div
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
