import { motion, useReducedMotion } from "motion/react";

const name = "Bryce Rambach";
const taglineWords = ["I", "make", "systems", "talk", "to", "each", "other."];

export function Hero() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <section className="min-h-screen flex items-center px-6 md:px-12">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-display tracking-tight text-white leading-[0.9] mb-6">
            {name}
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight leading-tight mb-8">
            I make <em className="font-display italic text-white" style={{ fontStyle: "italic" }}>systems</em> talk to each other.
          </h2>
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-600">
            <span className="text-neutral-500">Integration Specialist @ Digital Directions</span>
          </div>
          <div className="w-12 h-px bg-white/10 my-6" />
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-600">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-500">open to work</span>
            </span>
            <span className="text-white/10">·</span>
            <span>NYC</span>
            <span className="text-white/10">·</span>
            <span>summer 2026</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center px-6 md:px-12">
      <div className="max-w-5xl mx-auto w-full">
        {/* Name — massive serif */}
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-display tracking-tight text-white leading-[0.9] pb-3 mb-6 overflow-hidden">
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 14,
                delay: 0.2 + i * 0.04,
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Tagline — "systems" in italic serif */}
        <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight leading-tight mb-8">
          {taglineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.4,
                delay: 0.9 + i * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className={`inline-block mr-[0.3em] ${
                word === "systems" ? "font-display italic text-white" : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="font-mono text-xs text-neutral-500 tracking-wide"
        >
          Integration Specialist @ Digital Directions
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 2.0, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-12 h-px bg-white/10 my-6 origin-left"
        />

        {/* Status line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="flex items-center gap-4 font-mono text-xs text-neutral-600"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-neutral-500">open to work</span>
          </span>
          <span className="text-white/10">·</span>
          <span>NYC</span>
          <span className="text-white/10">·</span>
          <span>summer 2026</span>
        </motion.div>
      </div>
    </section>
  );
}
