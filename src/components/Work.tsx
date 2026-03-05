import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const experiences = [
  {
    role: "Integration Specialist",
    company: "Digital Directions",
    period: "2023 - Present",
    description:
      "I'm the person they call when HiBob needs to talk to NetSuite, or Deputy needs to feed payroll. Building the automations that make enterprise platforms actually work together — so nobody has to copy-paste between tabs ever again.",
    accent: "blue",
  },
  {
    role: "Computer Science, B.S.",
    company: "San Diego State University",
    period: "May 2026",
    description:
      "Wrapping up my CS degree with a focus on systems architecture and software engineering. The theory is solid — but honestly, I learned more shipping real integrations than any textbook could teach.",
    accent: "purple",
  },
];

const accentColors: Record<string, { border: string; dot: string; glow: string }> = {
  blue: { border: "border-blue-500/30", dot: "bg-blue-500", glow: "shadow-[0_0_12px_rgba(59,130,246,0.4)]" },
  purple: { border: "border-purple-500/30", dot: "bg-purple-500", glow: "shadow-[0_0_12px_rgba(139,92,246,0.4)]" },
};

export function Work() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Centered header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              <TextScramble text="Work & Experience" />
            </h3>
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line — brighter, centered on desktop */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-px w-px bg-white/10" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const colors = accentColors[exp.accent] || accentColors.blue;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative">
                  {/* Timeline dot — brighter with glow */}
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full ${colors.dot} ${colors.glow} z-10`} />

                  {/* Card — alternating sides, both glass style */}
                  <div className={`pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isEven ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                    <ScrollReveal slideFrom={isEven ? -1 : 1}>
                      <div className={`group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] ${colors.border} border-t-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}>
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                          <h4 className="text-xl font-medium text-white">{exp.role}</h4>
                          <span className="text-sm font-medium text-neutral-500 mt-2 sm:mt-0 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">
                          {exp.company}
                        </div>
                        <p className="text-neutral-400 font-light leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
