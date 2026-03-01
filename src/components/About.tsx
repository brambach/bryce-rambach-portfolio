import { FadeIn } from "./FadeIn";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 border-t border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <FadeIn>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              About
            </h3>
          </FadeIn>
        </div>
        <div className="md:col-span-8">
          <FadeIn delay={0.1}>
            <div className="bg-white/25 bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-3xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 md:p-12 text-xl md:text-2xl font-light text-neutral-800 leading-relaxed space-y-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_16px_48px_rgba(0,0,0,0.08)]">
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
