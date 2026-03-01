import { FadeIn } from "./FadeIn";

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
    <section id="work" className="py-24 md:py-32 border-t border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <FadeIn>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Work &amp; Experience
            </h3>
          </FadeIn>
        </div>
        <div className="md:col-span-8">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <FadeIn key={index} delay={0.1 + index * 0.1}>
                <div className="group relative bg-white/25 bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-3xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_16px_48px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                    <h4 className="text-xl font-medium text-neutral-900">
                      {exp.role}
                    </h4>
                    <span className="text-sm font-medium text-neutral-400 mt-2 sm:mt-0 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">
                    {exp.company}
                  </div>
                  <p className="text-neutral-600 font-light leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
