import { FadeIn } from "./FadeIn";

const skills = [
  {
    category: "Enterprise Integrations",
    items: ["Workato", "HiBob", "NetSuite", "Deputy", "API Design", "Webhooks"],
  },
  {
    category: "Web Development",
    items: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js"],
  },
  {
    category: "Core Competencies",
    items: [
      "Systems Architecture",
      "Solutions Engineering",
      "Client Communication",
      "Process Automation",
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 border-t border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <FadeIn>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Skills &amp; Tech Stack
            </h3>
          </FadeIn>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <FadeIn key={skillGroup.category} delay={0.1 + index * 0.1}>
                <div className="bg-white/25 bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-3xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_16px_48px_rgba(0,0,0,0.08)]">
                  <h4 className="text-lg font-medium text-neutral-900 mb-6">
                    {skillGroup.category}
                  </h4>
                  <ul className="space-y-4">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="text-neutral-500 font-light">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
