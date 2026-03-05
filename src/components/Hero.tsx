import { motion, useReducedMotion } from "motion/react";

const name = "Bryce Rambach";
const taglineWords = ["I", "make", "systems", "talk", "to", "each", "other."];

const codeLines = [
  { tokens: [{ text: "const", color: "text-blue-400" }, { text: " sync", color: "text-white" }, { text: " = ", color: "text-neutral-500" }, { text: "await", color: "text-blue-400" }, { text: " connect", color: "text-emerald-400" }, { text: "(", color: "text-neutral-500" }] },
  { tokens: [{ text: "  source", color: "text-neutral-400" }, { text: ":", color: "text-neutral-500" }, { text: " \"hibob\"", color: "text-amber-400" }, { text: ",", color: "text-neutral-500" }] },
  { tokens: [{ text: "  target", color: "text-neutral-400" }, { text: ":", color: "text-neutral-500" }, { text: " \"netsuite\"", color: "text-amber-400" }, { text: ",", color: "text-neutral-500" }] },
  { tokens: [{ text: "  events", color: "text-neutral-400" }, { text: ":", color: "text-neutral-500" }, { text: " [", color: "text-neutral-500" }, { text: "\"hire\"", color: "text-amber-400" }, { text: ", ", color: "text-neutral-500" }, { text: "\"terminate\"", color: "text-amber-400" }, { text: ", ", color: "text-neutral-500" }, { text: "\"update\"", color: "text-amber-400" }, { text: "]", color: "text-neutral-500" }] },
  { tokens: [{ text: ")", color: "text-neutral-500" }] },
  { tokens: [] },
  { tokens: [{ text: "sync", color: "text-white" }, { text: ".", color: "text-neutral-500" }, { text: "on", color: "text-emerald-400" }, { text: "(", color: "text-neutral-500" }, { text: "\"complete\"", color: "text-amber-400" }, { text: ", ", color: "text-neutral-500" }, { text: "(", color: "text-neutral-500" }, { text: "result", color: "text-neutral-400" }, { text: ")", color: "text-neutral-500" }, { text: " =>", color: "text-blue-400" }, { text: " {", color: "text-neutral-500" }] },
  { tokens: [{ text: "  console", color: "text-white" }, { text: ".", color: "text-neutral-500" }, { text: "log", color: "text-emerald-400" }, { text: "(", color: "text-neutral-500" }, { text: "`", color: "text-amber-400" }, { text: "synced ", color: "text-amber-400" }, { text: "${", color: "text-neutral-500" }, { text: "result.count", color: "text-white" }, { text: "}", color: "text-neutral-500" }, { text: " records", color: "text-amber-400" }, { text: "`", color: "text-amber-400" }, { text: ")", color: "text-neutral-500" }] },
  { tokens: [{ text: "})", color: "text-neutral-500" }] },
];

function CodeBlock() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          </div>
          <span className="text-xs font-mono text-neutral-600 ml-2">integration.ts</span>
        </div>

        {/* Code content */}
        <div className="p-5 font-mono text-sm leading-relaxed">
          {codeLines.map((line, lineIdx) => (
            <motion.div
              key={lineIdx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 1.2 + lineIdx * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="whitespace-pre"
            >
              <span className="text-neutral-700 select-none mr-4 inline-block w-4 text-right text-xs">
                {lineIdx + 1}
              </span>
              {line.tokens.length === 0 ? (
                <span>&nbsp;</span>
              ) : (
                line.tokens.map((token, tokenIdx) => (
                  <span key={tokenIdx} className={token.color}>
                    {token.text}
                  </span>
                ))
              )}
            </motion.div>
          ))}

          {/* Blinking cursor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            <span className="text-neutral-700 select-none mr-4 inline-block w-4 text-right text-xs">
              {codeLines.length + 1}
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
              className="inline-block w-2 h-4 bg-blue-400/60 align-middle"
            />
          </motion.div>
        </div>
      </div>

      {/* Status line below the editor */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.4 }}
        className="mt-3 flex items-center gap-2 px-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono text-neutral-600">
          847 records synced
        </span>
      </motion.div>
    </div>
  );
}

function CodeBlockStatic() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          </div>
          <span className="text-xs font-mono text-neutral-600 ml-2">integration.ts</span>
        </div>
        <div className="p-5 font-mono text-sm leading-relaxed">
          {codeLines.map((line, lineIdx) => (
            <div key={lineIdx} className="whitespace-pre">
              <span className="text-neutral-700 select-none mr-4 inline-block w-4 text-right text-xs">
                {lineIdx + 1}
              </span>
              {line.tokens.length === 0 ? (
                <span>&nbsp;</span>
              ) : (
                line.tokens.map((token, tokenIdx) => (
                  <span key={tokenIdx} className={token.color}>
                    {token.text}
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 px-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs font-mono text-neutral-600">847 records synced</span>
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
          <div className="hidden lg:block">
            <CodeBlockStatic />
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

        {/* Right column — code block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="hidden lg:block"
        >
          <CodeBlock />
        </motion.div>
      </div>
    </section>
  );
}
