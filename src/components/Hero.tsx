import { motion, useReducedMotion } from "motion/react";

const name = "Bryce Rambach";
const taglineWords = ["Bridging", "APIs,", "data,", "and", "systems", "at", "scale."];

export function Hero() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <section className="min-h-[90vh] flex flex-col justify-center pt-24 pb-16">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
          {name}
        </h1>
        <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight max-w-3xl leading-tight mb-4">
          Bridging APIs, data, and systems at scale.
        </h2>
        <p className="text-lg md:text-xl text-neutral-500 font-light tracking-tight mb-8">
          Integration Specialist @ Digital Directions
        </p>
        <div className="inline-flex items-center gap-4 text-sm font-medium text-neutral-400 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] px-6 py-3 rounded-full">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Graduating May 2026
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[90vh] flex flex-col justify-center pt-24 pb-16">
      {/* Letter-by-letter name with spring physics */}
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6 overflow-hidden">
        {name.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 80, opacity: 0, rotateX: 40 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 12,
              delay: 0.3 + i * 0.04,
            }}
            className="inline-block"
            style={{ transformOrigin: "bottom" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>

      {/* Tagline types word-by-word */}
      <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight max-w-3xl leading-tight mb-4">
        {taglineWords.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              delay: 1.0 + i * 0.12,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="inline-block mr-[0.3em]"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {/* Subtitle fades in */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="text-lg md:text-xl text-neutral-500 font-light tracking-tight mb-8"
      >
        Integration Specialist @ Digital Directions
      </motion.p>

      {/* Status badge fades in last with scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 2.1,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-4 text-sm font-medium text-neutral-400 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] px-6 py-3 rounded-full"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Graduating May 2026
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
