import { useEffect, useState, type ReactNode } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import useMeasure from 'react-use-measure';
import {
  Webhook, Building2, Users, DollarSign, BadgeDollarSign, Clock,
  Database, Layers, Hexagon, Code2, Wind, Sparkles, Terminal, Triangle,
  Mail, ShieldAlert, Github, Cpu,
} from 'lucide-react';

type SliderProps = {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  reverse?: boolean;
};

function InfiniteSlider({
  children, gap = 20, speed = 30, speedOnHover, reverse = false,
}: SliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width }] = useMeasure();
  const x = useMotionValue(0);
  const [phase, setPhase] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (!width) return;
    const contentSize = width + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    const dist = Math.abs(to - from);
    const duration = dist / currentSpeed;

    if (transitioning) {
      const remaining = Math.abs(x.get() - to);
      const transDuration = remaining / currentSpeed;
      const controls = animate(x, [x.get(), to], {
        ease: 'linear',
        duration: transDuration,
        onComplete: () => { setTransitioning(false); setPhase((p) => p + 1); },
      });
      return () => controls.stop();
    }

    x.set(from);
    const controls = animate(x, [from, to], {
      ease: 'linear', duration, repeat: Infinity, repeatType: 'loop',
    });
    return () => controls.stop();
  }, [phase, currentSpeed, width, gap, reverse, transitioning, x]);

  const hover = speedOnHover ? {
    onHoverStart: () => { setTransitioning(true); setCurrentSpeed(speedOnHover); },
    onHoverEnd: () => { setTransitioning(true); setCurrentSpeed(speed); },
  } : {};

  return (
    <div className="overflow-hidden">
      <motion.div ref={ref} className="flex w-max" style={{ x, gap: `${gap}px` }} {...hover}>
        {children}{children}
      </motion.div>
    </div>
  );
}

function Chip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      title={label}
      aria-label={label}
      className="relative flex size-12 items-center justify-center rounded-full transition-colors hover:!border-white/25"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--color-hair-2)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        color: 'var(--color-ink-2)',
      }}
    >
      <div className="size-5">{children}</div>
    </div>
  );
}

export function IntegrationsRing() {
  return (
    <div
      className="relative mx-auto max-w-[440px] space-y-5 py-6"
      style={{ WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 55%, transparent 100%)', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 55%, transparent 100%)' }}
      aria-label="Integration surface"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.55,
        }}
      />

      <InfiniteSlider speed={22} speedOnHover={10}>
        <Chip label="Workato"><Webhook className="size-full" /></Chip>
        <Chip label="NetSuite"><Building2 className="size-full" /></Chip>
        <Chip label="HiBob"><Users className="size-full" /></Chip>
        <Chip label="Postgres"><Database className="size-full" /></Chip>
        <Chip label="Next.js"><Hexagon className="size-full" /></Chip>
        <Chip label="Vercel"><Triangle className="size-full" /></Chip>
      </InfiniteSlider>

      <InfiniteSlider speed={22} speedOnHover={10} reverse>
        <Chip label="Claude API"><Sparkles className="size-full" /></Chip>
        <Chip label="Drizzle"><Layers className="size-full" /></Chip>
        <Chip label="KeyPay"><DollarSign className="size-full" /></Chip>
        <Chip label="TypeScript"><Code2 className="size-full" /></Chip>
        <Chip label="Tailwind"><Wind className="size-full" /></Chip>
        <Chip label="Resend"><Mail className="size-full" /></Chip>
      </InfiniteSlider>

      <InfiniteSlider speed={22} speedOnHover={10}>
        <Chip label="Sentry"><ShieldAlert className="size-full" /></Chip>
        <Chip label="Claude Code"><Terminal className="size-full" /></Chip>
        <Chip label="MYOB"><BadgeDollarSign className="size-full" /></Chip>
        <Chip label="Deputy"><Clock className="size-full" /></Chip>
        <Chip label="GitHub"><Github className="size-full" /></Chip>
        <Chip label="React"><Cpu className="size-full" /></Chip>
      </InfiniteSlider>

      <div className="pointer-events-none absolute inset-0 m-auto flex size-fit items-center justify-center">
        <div
          className="flex size-16 items-center justify-center rounded-full font-serif italic text-[18px] text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.55), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            boxShadow: '0 10px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          BR
        </div>
      </div>
    </div>
  );
}
