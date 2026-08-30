import { lazy, Suspense } from 'react';
import { Reveal } from './Reveal';

const HeroIcosahedron = lazy(() => import('./HeroIcosahedron'));

export function Hero() {
  return (
    <>
      <section
      id="top"
      aria-labelledby="hero-h"
      className="hero relative max-w-[1280px] mx-auto px-6 pt-[120px] pb-16 min-h-screen"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-end">
        <div>
          <Reveal delay={1}>
            <h1
              id="hero-h"
              className="hero-h1 font-serif"
              style={{
                fontSize: 'clamp(48px, 7.6vw, 104px)',
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
              }}
            >
              Bryce <em className="font-serif italic">Rambach</em>.<br />
              Engineering high-fidelity bridges between<br />
              <span className="hero-accent">human intent &amp; scalable systems.</span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p
              className="mt-8 max-w-[56ch] text-[15px] md:text-[17px] font-light"
              style={{ color: 'var(--color-ink-2)', lineHeight: 1.6 }}
            >
              A digital archive of solo-built production systems, enterprise integration architectures,
              and spatial AI experiments. No clients page. No pricing table. Just the work.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px]"
              style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}
            >
              <span>SAN&nbsp;DIEGO &nbsp;→&nbsp; SF&nbsp;/&nbsp;NYC</span>
              <span>·</span>
              <span>FULL-STACK</span>
              <span>·</span>
              <span>INDEX&nbsp;0&nbsp;OF&nbsp;6</span>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:bryce.rambach@gmail.com"
                className="hero-magnet inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-mono text-[12px] transition"
                style={{
                  border: '1px solid var(--color-hair-2)',
                  background: 'rgba(255,255,255,0.025)',
                  color: 'var(--color-ink)',
                  letterSpacing: '0.02em',
                }}
              >
                bryce.rambach@gmail.com
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 9 L9 3 M5 3 H9 V7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="/Bryce_Rambach_Resume.pdf"
                target="_blank"
                rel="noopener"
                className="hero-magnet inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] font-mono text-[12px] transition"
                style={{
                  border: '1px solid var(--color-hair-2)',
                  background: 'rgba(255,255,255,0.025)',
                  color: 'var(--color-ink)',
                  letterSpacing: '0.02em',
                }}
              >
                résumé.pdf
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M6 2 V8 M3 6 L6 9 L9 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="hero-figure-slot relative h-[360px] md:h-[560px]" aria-hidden="true">
          <Suspense fallback={null}>
            <HeroIcosahedron />
          </Suspense>
        </div>
      </div>

      <Reveal delay={5}>
        <div
          className="mt-9 flex flex-wrap justify-between gap-2 font-mono text-[11px]"
          style={{ color: 'var(--color-ink-3)', letterSpacing: '0.08em' }}
        >
          <span>↓&nbsp;&nbsp;SCROLL TO ENTER ARCHIVE</span>
          <span>LAT&nbsp;32.7157 &nbsp;·&nbsp; LON&nbsp;−117.1611</span>
        </div>
      </Reveal>
    </section>
    </>
  );
}
