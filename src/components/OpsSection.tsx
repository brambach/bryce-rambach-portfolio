import { SectionHead } from './SectionHead';
import { GlassCard } from './GlassCard';
import { Reveal } from './Reveal';

const ROWS: { name: string; ms: string; status: 'ok' | 'warn'; sparkline: string }[] = [
  { name: 'hibob → netsuite', ms: '42 ms',  status: 'ok',   sparkline: '0,16 8,12 16,15 24,8 32,11 40,6 48,9 60,4' },
  { name: 'hibob → keypay',   ms: '128 ms', status: 'ok',   sparkline: '0,12 8,14 16,11 24,13 32,10 40,12 48,9 60,11' },
  { name: 'hibob ↔ deputy',   ms: '301 ms', status: 'warn', sparkline: '0,18 8,16 16,8 24,18 32,12 40,4 48,18 60,14' },
  { name: 'workato webhook q',ms: '14 ms',  status: 'ok',   sparkline: '0,14 8,12 16,13 24,11 32,12 40,10 48,11 60,9' },
  { name: 'claude triage',    ms: '86 ms',  status: 'ok',   sparkline: '0,15 8,9 16,13 24,7 32,11 40,5 48,9 60,3' },
];

export function OpsSection({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section id="ops" aria-labelledby="op-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <SectionHead
        num="04 / Production"
        title={<>A production-grade<br />operational frontend.</>}
        description="// The internal Ops Portal — where realtime integration health, incident triage, and AI summaries converge into one operator surface."
        headingId="op-h"
      />

      <Reveal>
        <GlassCard className="p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[320px_1fr] items-start">
            <div>
              <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>RT-OPS · INTERNAL</div>
              <h3 className="font-serif mt-2" style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.1, color: 'var(--color-ink)' }}>
                Operators see what<br />matters — fast.
              </h3>
              <p className="mt-3 text-[13.5px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}>
                Realtime fleet health for 10+ enterprise integrations: webhook queues,
                sync latencies, retry storms, and Claude-summarized incidents in a single pane.
              </p>
              <ul className="mt-4 space-y-1.5 text-[12px] font-mono" style={{ color: 'var(--color-ink-2)', letterSpacing: '0.04em' }}>
                <li><b style={{ color: 'var(--color-ink-3)' }}>STACK</b> &nbsp; Next.js · TS · Drizzle · Postgres · Claude</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>UPTIME</b>&nbsp; 99.9% over 9mo</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>ROLE</b> &nbsp;&nbsp; Sole engineer · designer · operator</li>
                <li><b style={{ color: 'var(--color-ink-3)' }}>USERS</b>&nbsp;&nbsp; Internal ops, leadership</li>
              </ul>
              <button
                onClick={() => onOpen('ops-portal')}
                className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-2 rounded-md"
                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: 'rgb(186,230,253)', letterSpacing: '0.08em' }}
              >
                OPEN DOSSIER
              </button>
            </div>

            <div className="ops-mock rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--color-hair-2)', background: 'rgba(8,10,14,0.7)' }}>
              <div className="flex items-center gap-2 px-3 py-2 font-mono text-[11px]" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-hair-2)', color: 'var(--color-ink-3)' }}>
                <span className="flex gap-1">
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                  <i className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.18)' }} />
                </span>
                <span className="ml-1">ops.digitaldirections.io / fleet</span>
                <span className="ml-auto inline-flex items-center gap-1.5" style={{ color: 'rgb(134,239,172)' }}>● live</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <div className="p-2 text-[11px] font-mono space-y-0.5" style={{ background: 'rgba(255,255,255,0.015)', borderRight: '1px solid var(--color-hair-2)', color: 'var(--color-ink-3)' }}>
                  {['Overview', 'Fleet', 'Queues', 'Incidents', 'Recipes', 'Settings'].map((s) => (
                    <div key={s} className={`px-2 py-1 rounded ${s === 'Fleet' ? 'bg-white/5 text-white' : ''}`}>{s}</div>
                  ))}
                </div>
                <div className="p-2 space-y-1.5">
                  {ROWS.map((r) => (
                    <div key={r.name} className="grid grid-cols-[1fr_70px_70px_60px] items-center gap-3 px-2 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <span className="font-mono text-[11px]" style={{ color: 'var(--color-ink-2)' }}>{r.name}</span>
                      <span className="font-mono text-[10.5px] text-right" style={{ color: 'var(--color-ink-3)' }}>{r.ms}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-center" style={{
                        background: r.status === 'ok' ? 'rgba(134,239,172,0.10)' : 'rgba(245,158,11,0.10)',
                        color: r.status === 'ok' ? 'rgb(134,239,172)' : 'rgb(245,158,11)',
                        letterSpacing: '0.06em',
                      }}>{r.status === 'ok' ? 'OK' : 'RETRY'}</span>
                      <svg viewBox="0 0 60 22" width="60" height="22" aria-hidden="true">
                        <polyline points={r.sparkline} fill="none" stroke={r.status === 'ok' ? 'rgba(134,239,172,0.9)' : 'rgba(245,158,11,0.95)'} strokeWidth="1.4" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
