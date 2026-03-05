import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const experiences = [
  {
    role: "Enterprise HRIS Integrations",
    company: "Various Clients",
    period: "2023 - Present",
    description:
      "Building robust integrations between platforms like HiBob, NetSuite, Deputy, and Workato. Translating complex business requirements into technical solutions that reduce manual data entry and improve data integrity.",
    accent: "blue",
  },
  {
    role: "Computer Science Student",
    company: "San Diego State University",
    period: "Graduating May 2026",
    description:
      "Pursuing a degree in Computer Science with a focus on software engineering principles, algorithms, and systems architecture.",
    accent: "purple",
  },
];

const accentColors: Record<string, { border: string; dot: string }> = {
  blue: { border: "border-blue-500/30", dot: "bg-blue-500" },
  purple: { border: "border-purple-500/30", dot: "bg-purple-500" },
};

export function Work() {
  return (
    <section id="work" className="py-32 md:py-40">
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
          {/* Vertical timeline line — centered on desktop, left edge on mobile */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-px w-px bg-linear-to-b from-blue-500/20 via-purple-500/20 to-transparent" />

          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const colors = accentColors[exp.accent] || accentColors.blue;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full ${colors.dot} shadow-[0_0_8px_rgba(255,255,255,0.15)] z-10`} />

                  {/* Card — alternating sides on desktop */}
                  <div className={`pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isEven ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}>
                    <ScrollReveal slideFrom={isEven ? -1 : 1}>
                      {isEven ? (
                        /* Card style 1: glass card with colored top border */
                        <div className={`group relative bg-white/3 backdrop-blur-xl border border-white/6 ${colors.border} border-t-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}>
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
                      ) : (
                        /* Card style 2: minimal with left border accent */
                        <div className={`border-l-2 ${colors.border} pl-6 py-2`}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                            <h4 className="text-xl font-medium text-white">{exp.role}</h4>
                            <span className="text-sm font-medium text-neutral-500 mt-2 sm:mt-0">
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
                      )}
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
