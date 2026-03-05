import { motion, useReducedMotion } from "motion/react";

const name = "Bryce Rambach";
const taglineWords = ["Bridging", "APIs,", "data,", "and", "systems", "at", "scale."];

function OrbitalSystem() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-white/6" />
      {/* Middle ring */}
      <div className="absolute inset-[15%] rounded-full border border-white/8" />
      {/* Inner ring */}
      <div className="absolute inset-[35%] rounded-full border border-white/10" />

      {/* Center glow dot */}
      <div className="absolute inset-[46%] rounded-full bg-blue-500/60 blur-sm animate-float" />
      <div className="absolute inset-[48%] rounded-full bg-white/80" />

      {/* Orbiting dots — outer ring */}
      <div className="absolute inset-0 animate-orbit">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)]" />
      </div>
      <div className="absolute inset-0 animate-orbit" style={{ animationDelay: "-7s" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
      </div>

      {/* Orbiting dots — middle ring */}
      <div className="absolute inset-[15%] animate-orbit-reverse">
        <div className="absolute top-0 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
      </div>
      <div className="absolute inset-[15%] animate-orbit-reverse" style={{ animationDelay: "-12s" }}>
        <div className="absolute bottom-0 left-0 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
      </div>

      {/* Large glowing dot — inner ring */}
      <div className="absolute inset-[35%] animate-orbit" style={{ animationDelay: "-5s", animationDuration: "15s" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
      </div>
    </div>
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <section className="min-h-screen flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-gradient mb-6">
              {name}
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight max-w-3xl leading-tight mb-4">
              Bridging APIs, data, and <span className="text-gradient-accent">systems</span> at scale.
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column — text */}
        <div>
          {/* Letter-by-letter name with spring physics */}
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-gradient mb-6 overflow-hidden">
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
                className={`inline-block mr-[0.3em] ${word === "systems" ? "text-gradient-accent" : ""}`}
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
        </div>

        {/* Right column — orbital visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="hidden lg:flex items-center justify-center"
        >
          <OrbitalSystem />
        </motion.div>
      </div>
    </section>
  );
}
