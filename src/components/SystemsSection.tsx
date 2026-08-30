import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';
import { IntegrationsRing } from './IntegrationsRing';

type Arch = {
  name: string;
  meta: string;
  body: string;
  role: string;
  scale: string;
};

const ARCH: Arch[] = [
  { name: 'Workato',      meta: 'ORCHESTRATION', body: 'Orchestration layer for the integration fleet — backend-driven recipes written from scratch, not no-code drag-and-drop.', role: 'Connector author', scale: '6 production recipes' },
  { name: 'NetSuite',     meta: 'FINANCE ERP',   body: 'SuiteScript & REST integrations — bi-directional sync to HR / payroll. Reconciliation hardened against partial failures.', role: 'Solo integrator',  scale: '500 rec/cycle' },
  { name: 'Claude API',   meta: 'INTELLIGENCE',  body: 'Intelligence layer in the DD portal — summarization, error diagnosis, and triage. Not a chatbot bolt-on; a load-bearing surface.', role: 'Architect',      scale: '3 internal tools' },
  { name: 'Next.js 15',   meta: 'RUNTIME',       body: 'App Router, server components, edge handlers — the chassis under every artifact in the archive.', role: 'Daily driver',   scale: '4+ prod apps' },
  { name: 'Drizzle + PG', meta: 'DATA PLANE',    body: 'Type-safe schema, migrations, and queue tables for retryable webhooks. Postgres as the source of truth.', role: 'Schema owner',   scale: '500/cycle' },
  { name: 'Claude Code',  meta: 'PAIR',          body: 'Daily pair programming. Accelerates shipping and re-engineers my team’s approach to integration delivery.', role: 'Operator',       scale: 'Daily' },
];

function ArchCard({ a, delay }: { a: Arch; delay: 0 | 1 | 2 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <TiltCard className="h-full">
        <GlassCard className="h-full p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="font-serif text-[24px] leading-none" style={{ color: 'var(--color-ink)' }}>{a.name}</div>
            <div className="font-mono text-[10px] uppercase pt-1" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.18em' }}>{a.meta}</div>
          </div>
          <p className="text-[13px] flex-1" style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}>{a.body}</p>
          <dl className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1.5 text-[11px] font-mono pt-3" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em', borderTop: '1px solid var(--color-hair)' }}>
            <dt>ROLE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.role}</dd>
            <dt>SCALE</dt><dd style={{ color: 'var(--color-ink-2)' }}>{a.scale}</dd>
          </dl>
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

      <Reveal>
        <IntegrationsRing />
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr">
        {ARCH.map((a, i) => (
          <ArchCard key={a.name} a={a} delay={(i % 3) as 0 | 1 | 2} />
        ))}
      </div>
    </section>
  );
}
