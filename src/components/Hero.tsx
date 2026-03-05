import { motion, useReducedMotion } from "motion/react";

const name = "Bryce Rambach";
const taglineWords = ["I", "make", "systems", "talk", "to", "each", "other."];

const nodes = [
  { name: "HiBob", x: 50, y: 6, delay: 0 },
  { name: "NetSuite", x: 90, y: 34, delay: 1.2 },
  { name: "Workato", x: 78, y: 78, delay: 0.6 },
  { name: "Deputy", x: 22, y: 78, delay: 1.8 },
  { name: "React", x: 10, y: 34, delay: 2.4 },
];

function IntegrationNetwork() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Connection lines — animated dashes suggest data flow */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
        {nodes.map((node, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.25"
            strokeDasharray="1.5 2"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-3.5"
              dur={`${2.5 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
        {/* Subtle orbital ring */}
        <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,0.04)" strokeWidth="0.25" fill="none" />
        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.025)" strokeWidth="0.25" fill="none" strokeDasharray="2 3" />
      </svg>

      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/15 blur-2xl rounded-full" />
          <div className="relative w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center backdrop-blur-sm">
            <span className="text-base font-bold text-white/70 tracking-tight font-display">BR</span>
          </div>
        </div>
      </div>

      {/* Platform nodes */}
      {nodes.map((node) => (
        <div
          key={node.name}
          className="absolute animate-float"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            animationDelay: `${node.delay}s`,
          }}
        >
          <div className="px-4 py-2 bg-white/[0.05] border border-white/[0.12] rounded-full text-xs font-medium text-neutral-400 backdrop-blur-sm whitespace-nowrap hover:border-white/25 hover:text-neutral-200 transition-colors duration-300">
            {node.name}
          </div>
        </div>
      ))}
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
            <h1 className="text-6xl md:text-8xl font-display tracking-tight text-white mb-6">
              {name}
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-neutral-400 tracking-tight max-w-3xl leading-tight mb-4">
              I make <span className="text-blue-400">systems</span> talk to each other.
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 font-light tracking-tight mb-8">
              Integration Specialist @ Digital Directions
            </p>
            <div className="inline-flex items-center gap-3 font-mono text-xs text-neutral-500 bg-white/[0.04] border border-white/[0.08] px-5 py-2.5 rounded-xl">
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400">open to work</span>
              </span>
              <span className="text-white/10">|</span>
              <span>NYC</span>
              <span className="text-white/10">|</span>
              <span>summer 2026</span>
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
          {/* Name with serif display font */}
          <h1 className="text-6xl md:text-8xl font-display tracking-tight text-white mb-6 overflow-hidden">
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
                className={`inline-block mr-[0.3em] ${word === "systems" ? "text-blue-400" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-lg md:text-xl text-neutral-500 font-light tracking-tight mb-8"
          >
            Integration Specialist @ Digital Directions
          </motion.p>

          {/* Status badge */}
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
            <div className="inline-flex items-center gap-3 font-mono text-xs text-neutral-500 bg-white/[0.04] border border-white/[0.08] px-5 py-2.5 rounded-xl">
              <span className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400">open to work</span>
              </span>
              <span className="text-white/10">|</span>
              <span>NYC</span>
              <span className="text-white/10">|</span>
              <span>summer 2026</span>
            </div>
          </motion.div>
        </div>

        {/* Right column — integration network */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="hidden lg:flex items-center justify-center"
        >
          <IntegrationNetwork />
        </motion.div>
      </div>
    </section>
  );
}
