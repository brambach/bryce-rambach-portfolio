import { AppleButton } from './AppleButton';

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      style={{
        background: 'var(--bg-dark)',
        color: 'var(--text-light)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px 24px 64px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--ff-text)',
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: '-0.08px',
            color: 'rgba(255,255,255,0.72)',
            marginBottom: 18,
          }}
        >
          <span className="availability-dot" aria-hidden="true" />
          Available summer 2026 · SF / NYC
        </div>
        <h1
          id="hero-heading"
          style={{
            fontFamily: 'var(--ff-display)',
            fontSize: 'clamp(40px, 8vw, 56px)',
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: '-0.28px',
            margin: '0 0 16px',
          }}
        >
          Bryce Rambach.
        </h1>
        <p
          style={{
            fontFamily: 'var(--ff-text)',
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: '-0.374px',
            color: 'rgba(255,255,255,0.88)',
            margin: '0 0 32px',
          }}
        >
          Full-stack engineer. Ships production solo.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <AppleButton variant="primary" href="#projects">
            View projects
          </AppleButton>
          <AppleButton
            variant="ghost"
            href="/Bryce_Rambach_Resume.pdf"
            target="_blank"
            rel="noopener"
          >
            Résumé
          </AppleButton>
        </div>
      </div>
    </section>
  );
}
