import { ScrollReveal, Parallax } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <Parallax offset={-30}>
            <ScrollReveal>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                <TextScramble text="About" />
              </h3>
            </ScrollReveal>
          </Parallax>
        </div>
        <div className="md:col-span-8">
          <ScrollReveal slideFrom={1}>
            <div className="bg-white/3 backdrop-blur-xl border border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-8 md:p-12 text-xl md:text-2xl font-light text-neutral-300 leading-relaxed space-y-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <p>
                I'm a 21-year-old Computer Science student at San Diego State University, graduating in May 2026. My focus is on bridging the gap between complex technical systems and real-world business needs.
              </p>
              <p>
                As an Integration Specialist, I build enterprise HRIS integrations—connecting platforms like HiBob, NetSuite, Deputy, and Workato to create efficient, automated workflows that save companies time and reduce errors.
              </p>
              <p>
                Currently, I'm targeting Solutions Engineer roles in New York City. I thrive in environments where I can leverage both my deep technical expertise and strategic problem-solving skills to drive business value.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
