import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const experiences = [
  {
    role: "Integration Specialist",
    company: "Digital Directions",
    period: "2025 - Present",
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

const accentColors: Record<string, { border: string; dot: string }> = {
  blue: { border: "border-blue-500/30", dot: "bg-blue-500" },
  purple: { border: "border-purple-500/30", dot: "bg-purple-500" },
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

        {/* Clean left-border layout */}
        <div className="space-y-10 max-w-3xl mx-auto">
          {experiences.map((exp, index) => {
            const colors = accentColors[exp.accent] || accentColors.blue;

            return (
              <ScrollReveal key={index}>
                <div className={`relative border-l-2 ${colors.border} pl-8 md:pl-10`}>
                  {/* Dot on the border */}
                  <div className={`absolute left-0 top-1.5 -translate-x-[5px] w-2 h-2 rounded-full ${colors.dot}`} />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3">
                    <h4 className="text-xl font-medium text-white">{exp.role}</h4>
                    <span className="text-sm font-mono text-neutral-500 mt-1 sm:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-neutral-600 mb-3 uppercase tracking-wider">
                    {exp.company}
                  </div>
                  <p className="text-neutral-400 font-light leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
