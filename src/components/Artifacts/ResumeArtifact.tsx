import { Download } from 'lucide-react';
import { ArtifactPiece } from './ArtifactPiece';
import { BIO } from '@/src/lib/content';
import './artifacts.css';

export function ResumeArtifact() {
  return (
    <article className="artifact">
      <ArtifactPiece index={0} from="top-right">
        <div className="artifact-eyebrow">Résumé · one-minute version</div>
      </ArtifactPiece>
      <ArtifactPiece index={1}>
        <h3 className="artifact-title">{BIO.name}</h3>
      </ArtifactPiece>
      <ArtifactPiece index={2}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
            Education
          </strong>
          <br />
          B.S. Computer Science, San Diego State University · May 2026
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={3}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
            Current role
          </strong>
          <br />
          Integration Specialist · Digital Directions · March 2025 – Present
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={4}>
        <div className="artifact-body">
          <strong style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
            Highlights
          </strong>
          <br />
          Solo-built DD Client Portal · 6+ concurrent enterprise integrations ·
          Uses Claude Code daily.
        </div>
      </ArtifactPiece>
      <ArtifactPiece index={5} from="bottom-right">
        <a
          className="artifact-button"
          href="/Bryce_Rambach_Resume.pdf"
          download
        >
          <Download size={14} /> Download PDF
        </a>
      </ArtifactPiece>
    </article>
  );
}
