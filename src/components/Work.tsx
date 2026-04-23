import { FadeIn } from './FadeIn';

const LOGOS = ['HiBob', 'NetSuite', 'MYOB', 'KeyPay', 'Deputy', 'Workato'];

export function Work() {
  return (
    <FadeIn as="section" id="work" aria-labelledby="work-heading">
      <div
        style={{
          background: 'var(--bg-light)',
          color: 'var(--text-dark)',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--ff-text)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.08px',
              color: 'var(--link-light)',
              marginBottom: 14,
            }}
          >
            Current role · Digital Directions
          </div>
          <div
            style={{
              fontFamily: 'var(--ff-display)',
              fontSize: 'clamp(64px, 12vw, 88px)',
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: '-2.5px',
              color: 'var(--text-dark)',
              marginBottom: 6,
            }}
          >
            6+
          </div>
          <h2
            id="work-heading"
            style={{
              fontFamily: 'var(--ff-text)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.22px',
              color: 'var(--text-body-on-light)',
              marginBottom: 22,
            }}
          >
            live enterprise integrations, owned solo
          </h2>
          <p
            style={{
              fontFamily: 'var(--ff-text)',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.47,
              letterSpacing: '-0.374px',
              color: 'var(--text-body-on-light)',
              maxWidth: '52ch',
              margin: '0 auto 28px',
            }}
          >
            Connecting HR, payroll, and finance systems across HiBob, NetSuite, MYOB, KeyPay, and Deputy. Built reusable integration frameworks and webhook queueing that handles 500+ records per sync cycle.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 22,
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: 'var(--ff-text)',
              fontSize: 13,
              color: 'rgba(0,0,0,0.48)',
              fontWeight: 600,
              letterSpacing: '0.3px',
              paddingTop: 22,
              borderTop: '1px solid var(--hairline-light)',
            }}
          >
            {LOGOS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
