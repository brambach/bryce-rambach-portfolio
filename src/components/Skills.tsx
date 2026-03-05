import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";
import { TextScramble } from "./TextScramble";

const row1 = ["Workato", "HiBob", "NetSuite", "Deputy", "API Design", "Webhooks", "React", "TypeScript"];
const row2 = ["Node.js", "Tailwind CSS", "Next.js", "Systems Architecture", "Solutions Engineering", "Client Communication"];
const row3 = ["Process Automation", "REST APIs", "GraphQL", "CI/CD", "Vercel", "PostgreSQL", "Git", "Agile"];

const stats = [
  { value: 15, suffix: "+", label: "Technologies" },
  { value: 6, suffix: "", label: "Platforms" },
  { value: 3, suffix: "+", label: "Years Building" },
];

function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();

    let frame: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-blue-400 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm font-medium text-neutral-500 uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false, speed = 30 }: { items: string[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  const duration = items.length * speed / 10;

  return (
    <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        className={`flex gap-4 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-sm font-mono font-medium text-neutral-400 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/8 whitespace-nowrap hover:border-white/20 hover:text-white transition-colors duration-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CircuitLine() {
  return (
    <div className="flex items-center justify-center py-6">
      <svg width="100%" height="2" className="max-w-md" viewBox="0 0 400 2" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="1" x2="120" y2="1" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="120" cy="1" r="2" fill="rgba(59,130,246,0.4)" />
        <line x1="124" y1="1" x2="200" y2="1" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="200" cy="1" r="3" fill="rgba(139,92,246,0.5)" />
        <line x1="204" y1="1" x2="280" y2="1" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="280" cy="1" r="2" fill="rgba(16,185,129,0.4)" />
        <line x1="284" y1="1" x2="400" y2="1" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-16 md:py-20">
      {/* Centered header */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-10">
        <ScrollReveal>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            <TextScramble text="Skills & Tech Stack" />
          </h3>
        </ScrollReveal>
      </div>

      {/* Stats row — animated counters */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex justify-center gap-12 md:gap-20">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>

      {/* Circuit line */}
      <ScrollReveal>
        <CircuitLine />
      </ScrollReveal>

      {/* Full-bleed marquee */}
      <ScrollReveal>
        <div className="space-y-4">
          <MarqueeRow items={row1} speed={35} />
          <MarqueeRow items={row2} reverse speed={40} />
          <MarqueeRow items={row3} speed={30} />
        </div>
      </ScrollReveal>
    </section>
  );
}
