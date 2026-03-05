import { FadeIn } from "./FadeIn";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Bryce Digital",
    tagline: "My web development studio",
    description:
      "Founded a freelance web studio building modern, high-performance sites for small businesses and creators. Full-stack development from design to deployment.",
    tech: ["React", "Next.js", "Tailwind CSS", "Vercel"],
    accent: "from-blue-500/20 to-cyan-500/20",
    accentBorder: "group-hover:border-blue-300/60",
    url: "https://brycedigital.io",
  },
  {
    title: "HiBob + NetSuite Sync",
    tagline: "Enterprise HRIS integration",
    description:
      "Built a bidirectional sync between HiBob and NetSuite, automating employee lifecycle events across HR and finance. Eliminated hours of manual data entry per week.",
    tech: ["Workato", "REST APIs", "HiBob", "NetSuite"],
    accent: "from-emerald-500/20 to-teal-500/20",
    accentBorder: "group-hover:border-emerald-300/60",
  },
  {
    title: "Deputy Workforce Automation",
    tagline: "Scheduling + payroll pipeline",
    description:
      "Designed an integration pipeline connecting Deputy scheduling data with payroll and HRIS systems, reducing reconciliation errors and streamlining onboarding workflows.",
    tech: ["Workato", "Webhooks", "Deputy", "API Design"],
    accent: "from-purple-500/20 to-violet-500/20",
    accentBorder: "group-hover:border-purple-300/60",
  },
  {
    title: "HiBob + MYOB Sync",
    tagline: "HR to accounting automation",
    description:
      "Integrated HiBob with MYOB to automate the flow of employee data into accounting workflows, ensuring payroll and financial records stay in sync without manual intervention.",
    tech: ["Workato", "REST APIs", "HiBob", "MYOB"],
    accent: "from-rose-500/20 to-pink-500/20",
    accentBorder: "group-hover:border-rose-300/60",
  },
  {
    title: "HiBob + KeyPay Sync",
    tagline: "HRIS to payroll integration",
    description:
      "Built an automated sync between HiBob and KeyPay, streamlining employee onboarding and payroll processing by eliminating duplicate data entry across systems.",
    tech: ["Workato", "REST APIs", "HiBob", "KeyPay"],
    accent: "from-sky-500/20 to-indigo-500/20",
    accentBorder: "group-hover:border-sky-300/60",
  },
  {
    title: "Digital Directions Portal",
    tagline: "Internal client management tool",
    description:
      "Developed an internal portal for Digital Directions to manage client integrations, track project status, and centralize documentation across the team.",
    tech: ["React", "Node.js", "REST APIs", "Tailwind CSS"],
    accent: "from-teal-500/20 to-cyan-500/20",
    accentBorder: "group-hover:border-teal-300/60",
  },
  {
    title: "This Portfolio",
    tagline: "The site you're looking at",
    description:
      "A glassmorphism-styled personal site built from scratch with React, Tailwind v4, and Framer Motion. Designed to feel clean but not sterile.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    accent: "from-amber-500/20 to-orange-500/20",
    accentBorder: "group-hover:border-amber-300/60",
    url: "#",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 md:py-32 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <FadeIn>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Portfolio
            </h3>
            <p className="mt-4 text-neutral-500 font-light leading-relaxed max-w-xs">
              A few things I've built, broken, and shipped.
            </p>
          </FadeIn>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <FadeIn key={project.title} delay={0.1 + index * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-full"
                >
                  {/* Accent gradient glow */}
                  <div
                    className={`absolute -inset-px rounded-4xl bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                  />

                  <div
                    className={`relative h-full bg-white/3 backdrop-blur-xl border border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl p-8 transition-all duration-300 ${project.accentBorder} hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-lg font-semibold text-white">
                        {project.title}
                      </h4>
                      {project.url && project.url !== "#" && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 ml-3 p-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-500 hover:text-white transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-medium text-neutral-500 mb-4 tracking-wide">
                      {project.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-neutral-400 font-light leading-relaxed text-sm mb-6">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-medium text-neutral-500 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
