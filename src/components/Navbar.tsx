import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      // Only trigger re-render when the state actually changes
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="text-lg font-semibold tracking-tight text-white">
          BR.
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
          {['About', 'Skills', 'Work', 'Portfolio', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors relative group py-1"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-200 ease-in-out group-hover:w-full rounded-full"></span>
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
