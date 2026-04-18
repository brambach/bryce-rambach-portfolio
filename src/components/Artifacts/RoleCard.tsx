import { ArtifactPiece } from './ArtifactPiece';
import './artifacts.css';

const HIGHLIGHTS = [
  'Sole technical owner across 6+ concurrent production integrations.',
  'Built reusable integration frameworks and webhook queueing with retry logic.',
  "Used Claude Code to re-engineer the team's Workato recipe development.",
  'Owns uptime, incident response, and technical documentation.',
];

export function RoleCard() {
  return (
    <article className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Current role</div>
      </ArtifactPiece>
      <ArtifactPiece index={1}>
        <h3 className="artifact-title">
          Integration Specialist · <em>Digital Directions</em>
        </h3>
        <p className="artifact-body">March 2025 – Present · Remote</p>
      </ArtifactPiece>
      <ArtifactPiece index={2} from="bottom-right">
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
          }}
        >
          {HIGHLIGHTS.map((h) => (
            <li key={h} style={{ marginBottom: 4 }}>
              {h}
            </li>
          ))}
        </ul>
      </ArtifactPiece>
    </article>
  );
}
