import { GlassCard } from './GlassCard';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';

const LINKS = [
  { label: 'bryce.rambach@gmail.com', href: 'mailto:bryce.rambach@gmail.com' },
  { label: '(831) 236-1922', href: 'tel:+18312361922' },
  { label: 'linkedin/bryce-rambach', href: 'https://linkedin.com/in/bryce-rambach' },
  { label: 'github/brambach', href: 'https://github.com/brambach' },
];

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="ct-h" className="relative max-w-[1280px] mx-auto px-6 py-24">
      <Reveal>
        <TiltCard>
          <GlassCard className="p-8 md:p-12">
            <div className="font-mono text-[10.5px] uppercase" style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}>
              END&nbsp;OF&nbsp;ARCHIVE · INDEX&nbsp;05
            </div>
            <h3 id="ct-h" className="font-serif mt-3" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, color: 'var(--color-ink)' }}>
              Let's build<br />something <em className="font-serif italic">load-bearing.</em>
            </h3>
            <p className="mt-4 max-w-[60ch] text-[14px]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
              Open to full-stack roles at early-stage startups. Relocating to SF or NYC,
              summer 2026. Direct lines below — no contact form, no funnel.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener' : undefined}
                    className="inline-flex items-center gap-2 font-mono text-[12.5px]"
                    style={{ color: 'var(--color-ink)', letterSpacing: '0.02em' }}
                  >
                    <span style={{ color: 'rgb(56,189,248)' }}>↳</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.22)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(134,239,172)' }} />
              <span className="font-mono text-[10.5px] uppercase" style={{ color: 'var(--color-ink-2)', letterSpacing: '0.16em' }}>
                Currently shipping at Digital Directions · Open to convo
              </span>
            </div>
          </GlassCard>
        </TiltCard>
      </Reveal>
    </section>
  );
}
