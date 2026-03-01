import { FadeIn } from "./FadeIn";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center pt-24 pb-16">
      <FadeIn>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-neutral-900 mb-6">
          Bryce Rambach
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 className="text-2xl md:text-4xl font-normal text-neutral-500 tracking-tight max-w-3xl leading-tight mb-4">
          Bridging APIs, data, and systems at scale.
        </h2>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="text-lg md:text-xl text-neutral-400 font-light tracking-tight mb-8">
          Integration Specialist @ Digital Directions
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <motion.div 
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-4 text-sm font-medium text-neutral-600 bg-white/25 bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-3xl border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(0,0,0,0.04)] px-6 py-3 rounded-full"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Graduating May 2026
          </span>
        </motion.div>
      </FadeIn>
    </section>
  );
}
