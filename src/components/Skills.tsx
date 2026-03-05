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
    <section id="skills" className="py-24 md:py-32 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <FadeIn>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Skills &amp; Tech Stack
            </h3>
          </FadeIn>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <FadeIn key={skillGroup.category} delay={0.1 + index * 0.1}>
                <div className="bg-white/3 backdrop-blur-xl border border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                  <h4 className="text-lg font-medium text-white mb-6">
                    {skillGroup.category}
                  </h4>
                  <ul className="space-y-4">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="text-neutral-400 font-light">
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
