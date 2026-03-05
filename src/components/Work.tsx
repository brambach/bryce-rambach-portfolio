import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const experiences = [
  {
    role: "Integration Specialist",
    company: "Digital Directions",
    period: "Mar 2025 — Present",
    description:
      "I'm the person they call when HiBob needs to talk to NetSuite, or Deputy needs to feed payroll. Building the automations that make enterprise platforms actually work together — so nobody has to copy-paste between tabs ever again.",
    active: true,
  },
  {
    role: "Founder",
    company: "Bryce Digital",
    period: "Jan 2025 — Present",
    description:
      "My own web development studio. I design and build high-performance sites for small businesses and creators — from first pixel to live deploy. No templates, no page builders, just clean code.",
    active: true,
  },
  {
    role: "Computer Science, B.S.",
    company: "San Diego State University",
    period: "May 2026",
    description:
      "Wrapping up my CS degree with a focus on systems architecture and software engineering. The theory is solid — but honestly, I learned more shipping real integrations than any textbook could teach.",
    active: false,
  },
];

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });

  // Timeline line draws from 0 to full height as section scrolls in
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="work" className="py-24 md:py-32" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              <TextScramble text="Work & Experience" />
            </h3>
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Drawing timeline line */}
          <div className="absolute left-[3px] top-0 bottom-0 w-px bg-white/[0.06]" />
          <motion.div
            className="absolute left-[3px] top-0 bottom-0 w-px bg-white/[0.15] origin-top"
            style={{ scaleY: reducedMotion ? 1 : lineScaleY }}
          />

          {/* Entries */}
          <div className="space-y-14">
            {experiences.map((exp, index) => (
              <ScrollReveal key={index}>
                <div className="relative pl-10 md:pl-12">
                  {/* Dot */}
                  <div className="absolute left-0 top-2">
                    <div
                      className={`w-[7px] h-[7px] rounded-full ${
                        exp.active ? "bg-white" : "bg-neutral-600"
                      }`}
                    />
                    {/* Pulse ring for active role */}
                    {exp.active && !reducedMotion && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white/40"
                        animate={{
                          scale: [1, 2.5],
                          opacity: [0.4, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <h4 className={`text-2xl font-display ${exp.active ? "text-white" : "text-neutral-400"}`}>
                      {exp.role}
                    </h4>
                    <span className="text-xs font-mono text-neutral-600 mt-1 sm:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest mb-4">
                    {exp.company}
                  </p>
                  <p className="text-neutral-500 leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
