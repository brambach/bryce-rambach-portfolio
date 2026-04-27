import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';

type Arch = {
  name: string;
  meta: string;
  body: string;
  role: string;
  scale: string;
  bar: number;
};

const ARCH: Arch[] = [
  { name: 'Workato', meta: 'ORCHESTRATION', body: 'Orchestration layer for the integration fleet — backend-driven recipes written from scratch, not no-code drag-and-drop.', role: 'Connector author', scale: '6 production recipes', bar: 92 },
  { name: 'NetSuite', meta: 'FINANCE ERP', body: 'SuiteScript & REST integrations — bi-directional sync to HR / payroll. Reconciliation hardened against partial failures.', role: 'Solo integrator', scale: '500 rec/cycle', bar: 86 },
  { name: 'Claude API', meta: 'INTELLIGENCE', body: 'Intelligence layer in the DD portal — summarization, error diagnosis, and triage. Not a chatbot bolt-on; a load-bearing surface.', role: 'Architect', scale: '3 internal tools', bar: 88 },
  { name: 'Next.js 15', meta: 'RUNTIME', body: 'App Router, server components, edge handlers — the chassis under every artifact in the archive.', role: 'Daily driver', scale: '4+ prod apps', bar: 95 },
  { name: 'Drizzle + PG', meta: 'DATA PLANE', body: 'Type-safe schema, migrations, and queue tables for retryable webhooks. Postgres as the source of truth.', role: 'Schema owner', scale: '500/cycle', bar: 78 },
  { name: 'Claude Code', meta: 'PAIR', body: 'Daily pair programming. Accelerates shipping and re-engineers my team’s approach to integration delivery.', role: 'Operator', scale: 'Daily', bar: 90 },
];

function ArchCard({ a, delay }: { a: Arch; delay: 0 | 1 | 2 }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <Reveal delay={delay}>
      <TiltCard>
        <GlassCard className="h-full p-5">
          <div className="flex items-start justify-between">
            <div className="font-serif text-[22px]" style={{ color: 'var(--color-ink)' }}>{a.name}</div>
            <div className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.16em' }}>{a.meta}</div>
          </div>
          <p className="mt-3 text-[13px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.55 }}>{a.body}</p>
          <dl className="mt-4 grid grid-cols-[60px_1fr] gap-y-1.5 text-[11px] font-mono" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}>
            <dt>ROLE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.role}</dd>
            <dt>SCALE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.scale}</dd>
          </dl>
          <div ref={ref} className="mt-5 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${a.bar}%` } : undefined}
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.8), rgba(168,85,247,0.6))' }}
            />
          </div>
        </GlassCard>
      </TiltCard>
    </Reveal>
  );
}

export function SystemsSection() {
  return (
    <section id="systems" aria-labelledby="sys-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="02 / Systems"
        title={<>System architectures<br />I operate fluently.</>}
        description="// Integration specialist — Workato, NetSuite, and enterprise API automation as first-class engineering surfaces, not glue work."
        headingId="sys-h"
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ARCH.map((a, i) => (
          <ArchCard key={a.name} a={a} delay={(i % 3) as 0 | 1 | 2} />
        ))}
      </div>
    </section>
  );
}
