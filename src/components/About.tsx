import { ScrollReveal } from "./ScrollReveal";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-16 md:space-y-24">
        {/* Block 1 — Big statement with serif */}
        <ScrollReveal slideFrom={-1}>
          <p className="text-3xl md:text-5xl font-display italic text-white/90 leading-snug max-w-4xl">
            Every company I work with has the same problem — great tools that
            don't talk to each other. I build the integrations that fix that.
          </p>
        </ScrollReveal>

        {/* Block 2 — Detail, right-aligned */}
        <ScrollReveal slideFrom={1}>
          <div className="border-l-2 border-white/10 pl-8 ml-auto max-w-2xl">
            <p className="text-lg md:text-xl font-light text-neutral-400 leading-relaxed mb-6">
              Day-to-day, I wire up enterprise platforms — HiBob, NetSuite,
              Deputy, Workato — building the automations that kill manual data
              entry and keep everything in sync. Employee joins in HR? Payroll,
              scheduling, and finance all update automatically.
            </p>
            <p className="text-lg md:text-xl font-light text-neutral-400 leading-relaxed">
              Finishing my CS degree at San Diego State, graduating May 2026.
              Targeting Solutions Engineer roles where I can go deep on
              technical problems and work directly with the people who need
              them solved.
            </p>
          </div>
        </ScrollReveal>

        {/* Block 3 — Closing line */}
        <ScrollReveal slideFrom={-1}>
          <p className="text-2xl md:text-3xl font-light text-white/80">
            Based in San Diego, headed to{" "}
            <span className="text-white font-medium">
              New York City
            </span>{" "}
            summer 2026.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
