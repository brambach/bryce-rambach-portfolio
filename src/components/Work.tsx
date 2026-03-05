import { ScrollReveal, Parallax } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const experiences = [
  {
    role: "Enterprise HRIS Integrations",
    company: "Various Clients",
    period: "2023 - Present",
    description:
      "Building robust integrations between platforms like HiBob, NetSuite, Deputy, and Workato. Translating complex business requirements into technical solutions that reduce manual data entry and improve data integrity.",
  },
  {
    role: "Computer Science Student",
    company: "San Diego State University",
    period: "Graduating May 2026",
    description:
      "Pursuing a degree in Computer Science with a focus on software engineering principles, algorithms, and systems architecture.",
  },
];

export function Work() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <Parallax offset={-30}>
            <ScrollReveal>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                <TextScramble text="Work & Experience" />
              </h3>
            </ScrollReveal>
          </Parallax>
        </div>
        <div className="md:col-span-8">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index}>
              <ScrollReveal
                slideFrom={index % 2 === 0 ? 1 : -1}
              >
                <div className="group relative bg-white/3 backdrop-blur-xl border border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                    <h4 className="text-xl font-medium text-white">
                      {exp.role}
                    </h4>
                    <span className="text-sm font-medium text-neutral-500 mt-2 sm:mt-0 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">
                    {exp.company}
                  </div>
                  <p className="text-neutral-400 font-light leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </div>
              </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
