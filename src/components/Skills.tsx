import { ScrollReveal, Parallax } from "./ScrollReveal";

const row1 = ["Workato", "HiBob", "NetSuite", "Deputy", "API Design", "Webhooks", "React", "TypeScript"];
const row2 = ["Node.js", "Tailwind CSS", "Next.js", "Systems Architecture", "Solutions Engineering", "Client Communication"];
const row3 = ["Process Automation", "REST APIs", "GraphQL", "CI/CD", "Vercel", "PostgreSQL", "Git", "Agile"];

function MarqueeRow({ items, reverse = false, speed = 30 }: { items: string[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  const duration = items.length * speed / 10;

  return (
    <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex gap-4 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-sm font-medium text-neutral-400 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/8 whitespace-nowrap hover:border-white/20 hover:text-white transition-colors duration-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <Parallax offset={-30}>
            <ScrollReveal>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                Skills &amp; Tech Stack
              </h3>
            </ScrollReveal>
          </Parallax>
        </div>
        <div className="md:col-span-8">
          <ScrollReveal>
            <div className="space-y-4">
              <MarqueeRow items={row1} speed={35} />
              <MarqueeRow items={row2} reverse speed={40} />
              <MarqueeRow items={row3} speed={30} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
