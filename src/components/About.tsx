import { ScrollReveal } from "./ScrollReveal";

export function About() {
  return (
    <section id="about" className="py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-24 md:space-y-32">
        {/* Block 1 — Big statement */}
        <ScrollReveal slideFrom={-1}>
          <p className="text-3xl md:text-5xl font-light text-white/90 leading-snug max-w-4xl">
            I bridge the gap between complex technical systems and real-world
            business needs — turning integrations into competitive advantages.
          </p>
        </ScrollReveal>

        {/* Block 2 — Detail, right-aligned */}
        <ScrollReveal slideFrom={1}>
          <div className="border-l-2 border-white/10 pl-8 ml-auto max-w-2xl">
            <p className="text-lg md:text-xl font-light text-neutral-400 leading-relaxed mb-6">
              As an Integration Specialist, I build enterprise HRIS
              integrations — connecting platforms like HiBob, NetSuite, Deputy,
              and Workato to create efficient, automated workflows that save
              companies time and reduce errors.
            </p>
            <p className="text-lg md:text-xl font-light text-neutral-400 leading-relaxed">
              I'm a Computer Science student at San Diego State University,
              graduating in May 2026, targeting Solutions Engineer roles where I
              can leverage deep technical expertise and strategic
              problem-solving.
            </p>
          </div>
        </ScrollReveal>

        {/* Block 3 — Closing line */}
        <ScrollReveal slideFrom={-1}>
          <p className="text-2xl md:text-3xl font-light text-white/80">
            Currently based in{" "}
            <span className="text-gradient-accent font-medium">
              New York City
            </span>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
