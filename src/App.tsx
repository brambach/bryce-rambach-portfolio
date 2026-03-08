import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";
import { Portfolio } from "./components/Portfolio";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { StarField } from "./components/StarField";
import { ScrollBeam } from "./components/ScrollBeam";

function SectionDivider() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 py-2">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();

  // Console signature — for the devs who inspect
  useEffect(() => {
    console.log(
      "%c BR. %c Bryce Rambach — bryce.rambach@gmail.com\n%c Built with React, Tailwind v4, and Motion.\n If you're reading this, we should probably talk.",
      "background: #3b82f6; color: white; font-size: 20px; font-weight: bold; padding: 8px 12px; border-radius: 4px;",
      "color: #e5e5e5; font-size: 13px; padding: 8px 0;",
      "color: #737373; font-size: 11px;"
    );
  }, []);

  // Konami code easter egg
  useEffect(() => {
    const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === code[index]) {
        index++;
        if (index === code.length) {
          index = 0;
          document.title = "🎮 Nice. You found it.";
          document.body.style.transition = "filter 0.6s ease";
          document.body.style.filter = "hue-rotate(180deg)";
          setTimeout(() => {
            document.body.style.filter = "";
            setTimeout(() => { document.title = "Bryce Rambach"; }, 2000);
          }, 3000);
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen text-neutral-300 font-sans selection:bg-white/10 selection:text-white relative z-0"
    >
      {/* Ambient background depth — neutral tones (reduced blur for GPU perf) */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[80px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-white/[0.015] blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full bg-white/[0.012] blur-[70px] animate-blob animation-delay-4000" />
      </div>

      {/* Noise/Grain Texture Overlay — static image, no per-frame rasterization */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <StarField />
      <ScrollBeam />

      <Navbar />
      <main className="pt-24">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Work />
        <SectionDivider />
        <Portfolio />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
