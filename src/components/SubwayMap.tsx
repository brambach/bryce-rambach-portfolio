import { useEffect, useRef, useState } from 'react';

/**
 * NYC-subway-style schematic of the archive.
 * Lines are threads (Production / Lab / Practice / Toolset).
 * Stations are projects/tools.
 * Trains run continuously; when one arrives at a station, the station pulses.
 */

type Station = {
  slug?: string;          // matches PROJECTS slug — clicking opens dossier
  name: string;
  t: number;              // 0..1 along the path
  kind?: 'express' | 'local';
  side: 'top' | 'bottom' | 'right' | 'left';
  hereMark?: boolean;     // "you are here"
};

type Line = {
  id: string;
  bullet: string;         // single char on the line bullet (A, L, 2, 7)
  label: string;          // "PRODUCTION" etc
  color: string;          // line color
  path: string;           // SVG path d
  trainPeriod: number;    // seconds for the train to traverse the path
  stations: Station[];
};

const LINES: Line[] = [
  {
    id: 'A',
    bullet: 'A',
    label: 'PRODUCTION',
    color: '#0039A6',     // NYC A train royal blue
    path: 'M 80 140 H 320 L 440 260 H 1100',
    trainPeriod: 28,
    stations: [
      { slug: 'dd-portal',       name: 'DD PORTAL',       t: 0.06, kind: 'express', side: 'top' },
      { slug: 'dd-integrations', name: 'DD INTEGRATIONS', t: 0.46, kind: 'express', side: 'top' },
      { slug: 'ops-portal',      name: 'OPS PORTAL',      t: 0.96, kind: 'express', side: 'top' },
    ],
  },
  {
    id: 'L',
    bullet: 'L',
    label: 'LAB',
    color: '#A7A9AC',     // NYC L train gray
    path: 'M 440 260 L 600 360 H 1000 L 1080 440',
    trainPeriod: 32,
    stations: [
      { slug: 'sidequest', name: 'SIDEQUEST',         t: 0.55, kind: 'local', side: 'bottom' },
      { slug: 'portfolio', name: 'BRYCERAMBACH.COM',  t: 0.97, kind: 'local', side: 'bottom', hereMark: true },
    ],
  },
  {
    id: '2',
    bullet: '2',
    label: 'PRACTICE',
    color: '#EE352E',     // NYC 2 train red
    path: 'M 80 440 H 480',
    trainPeriod: 22,
    stations: [
      { slug: 'bryce-digital', name: 'BRYCE DIGITAL', t: 0.5, kind: 'local', side: 'bottom' },
    ],
  },
  {
    id: '7',
    bullet: '7',
    label: 'TOOLSET',
    color: '#B933AD',     // NYC 7 train purple
    path: 'M 1140 80 V 420',
    trainPeriod: 18,
    stations: [
      { name: 'WORKATO',  t: 0.10, kind: 'local', side: 'right' },
      { name: 'NETSUITE', t: 0.30, kind: 'local', side: 'right' },
      { name: 'CLAUDE',   t: 0.50, kind: 'local', side: 'right' },
      { name: 'DRIZZLE',  t: 0.70, kind: 'local', side: 'right' },
      { name: 'NEXT.JS',  t: 0.90, kind: 'local', side: 'right' },
    ],
  },
];

type StationPos = { x: number; y: number; angle: number };

export function SubwayMap({ onOpen }: { onOpen: (slug: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const trainRefs = useRef<Record<string, SVGGElement | null>>({});
  const stationRefs = useRef<Record<string, SVGGElement | null>>({});
  const [positions, setPositions] = useState<Record<string, StationPos>>({});
  const [arrivals, setArrivals] = useState<{ line: string; station: string; at: number } | null>(null);

  // Compute station positions from paths once mounted (and on resize)
  useEffect(() => {
    const compute = () => {
      const next: Record<string, StationPos> = {};
      for (const line of LINES) {
        const path = svgRef.current?.querySelector<SVGPathElement>(`#path-${line.id}`);
        if (!path) continue;
        const length = path.getTotalLength();
        for (const s of line.stations) {
          const at = path.getPointAtLength(length * s.t);
          const ahead = path.getPointAtLength(Math.min(length, length * s.t + 1));
          const angle = Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180 / Math.PI;
          next[`${line.id}-${s.t}`] = { x: at.x, y: at.y, angle };
        }
      }
      setPositions(next);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Train animation + station pulse trigger
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const paths = LINES.map((line) => {
      const path = svgRef.current?.querySelector<SVGPathElement>(`#path-${line.id}`);
      return path ? { line, path, length: path.getTotalLength() } : null;
    }).filter((p): p is { line: Line; path: SVGPathElement; length: number } => p !== null);

    const lastT: Record<string, number> = {};
    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;

      paths.forEach(({ line, path, length }) => {
        const phase = reduce ? 0.5 : (elapsed / line.trainPeriod) % 1;
        const point = path.getPointAtLength(phase * length);
        const ahead = path.getPointAtLength(Math.min(length, phase * length + 2));
        const angle = Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180 / Math.PI;

        const train = trainRefs.current[line.id];
        if (train) {
          train.setAttribute(
            'transform',
            `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)})`,
          );
        }

        if (!reduce) {
          const prev = lastT[line.id] ?? phase;
          for (const s of line.stations) {
            const crossed = prev <= s.t && phase > s.t;
            const wrapped = prev > phase && (s.t <= phase || s.t > prev);
            if (crossed || wrapped) {
              const key = `${line.id}-${s.t}`;
              const el = stationRefs.current[key];
              if (el) {
                el.classList.remove('subway-pulsing');
                // force reflow so animation can replay
                void el.getBoundingClientRect();
                el.classList.add('subway-pulsing');
              }
              setArrivals({ line: line.id, station: s.name, at: performance.now() });
            }
          }
          lastT[line.id] = phase;
        }
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="map"
      aria-label="Archive route map"
      className="relative max-w-[1280px] mx-auto px-6 py-16"
      style={{ color: 'var(--color-ink)' }}
    >
      {/* Service status header */}
      <div
        className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10.5px]"
        style={{ letterSpacing: '0.16em', color: 'var(--color-ink-3)' }}
      >
        <span style={{ color: 'var(--color-ink-2)' }}>BR · TRANSIT</span>
        <span style={{ color: 'var(--color-ink-4)' }}>/</span>
        <span>ROUTE&nbsp;MAP</span>
        <span style={{ color: 'var(--color-ink-4)' }}>/</span>
        <span style={{ color: 'rgb(134,239,172)' }}>● GOOD SERVICE</span>
        <div className="ml-auto flex items-center gap-3">
          {LINES.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <LineBullet color={l.color} char={l.bullet} />
              <span style={{ color: 'var(--color-ink-3)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The map */}
      <div className="subway-frame rounded-[16px] overflow-hidden" style={{ border: '1px solid var(--color-hair-2)', background: 'rgba(0,0,0,0.65)' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1200 520"
          className="block w-full h-auto"
          role="img"
          aria-labelledby="subway-title"
        >
          <title id="subway-title">Bryce Rambach archive — schematic route map</title>

          <defs>
            {LINES.map((line) => (
              <path key={`def-${line.id}`} id={`path-${line.id}`} d={line.path} fill="none" />
            ))}
            {/* Subtle grid */}
            <pattern id="subway-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="1200" height="520" fill="url(#subway-grid)" />

          {/* Lines */}
          {LINES.map((line) => (
            <path
              key={`line-${line.id}`}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
          ))}

          {/* Stations */}
          {LINES.flatMap((line) =>
            line.stations.map((s) => {
              const key = `${line.id}-${s.t}`;
              const pos = positions[key];
              if (!pos) return null;
              const isExpress = s.kind === 'express';
              const r = isExpress ? 10 : 6;
              return (
                <g
                  key={key}
                  ref={(el) => { stationRefs.current[key] = el; }}
                  transform={`translate(${pos.x} ${pos.y})`}
                  className="subway-station"
                  onClick={() => s.slug && onOpen(s.slug)}
                  style={{ cursor: s.slug ? 'pointer' : 'default' }}
                >
                  {/* hit target */}
                  <circle r={20} fill="transparent" />
                  {/* express ring */}
                  {isExpress && (
                    <circle r={r + 3} fill="none" stroke="#000" strokeWidth="2" />
                  )}
                  {/* station core */}
                  <circle r={r} fill="#fff" stroke="#000" strokeWidth="2" />
                  {/* "you are here" pulsing ring */}
                  {s.hereMark && (
                    <circle r={r + 6} fill="none" stroke={line.color} strokeWidth="1.5" className="subway-here" />
                  )}
                  {/* pulse ring (added when train arrives) */}
                  <circle r={r} fill="none" stroke="#fff" strokeWidth="2" className="subway-pulse-ring" />
                  {/* label */}
                  <text
                    x={s.side === 'right' ? 16 : s.side === 'left' ? -16 : 0}
                    y={s.side === 'top' ? -16 : s.side === 'bottom' ? 22 : 4}
                    textAnchor={s.side === 'right' ? 'start' : s.side === 'left' ? 'end' : 'middle'}
                    fontFamily="ui-monospace, JetBrains Mono, Menlo, monospace"
                    fontSize="10.5"
                    fontWeight="500"
                    letterSpacing="0.1em"
                    fill="rgba(255,255,255,0.82)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {s.name}
                  </text>
                </g>
              );
            }),
          )}

          {/* Trains (rendered last so they ride on top) */}
          {LINES.map((line) => (
            <g
              key={`train-${line.id}`}
              ref={(el) => { trainRefs.current[line.id] = el; }}
            >
              <rect x={-16} y={-5} width={32} height={10} rx={2} fill={line.color} />
              <rect x={-14} y={-3.5} width={5} height={7} rx={1} fill="rgba(255,255,255,0.55)" />
              <circle cx={13} cy={0} r={2.2} fill="#fff" />
            </g>
          ))}
        </svg>

        {/* Now arriving ticker */}
        <div
          className="border-t flex items-center gap-3 px-4 py-2.5 font-mono text-[11px]"
          style={{
            borderColor: 'var(--color-hair-2)',
            background: 'rgba(255,255,255,0.02)',
            color: 'var(--color-ink-3)',
            letterSpacing: '0.08em',
          }}
        >
          <span style={{ color: 'rgb(134,239,172)' }}>▸</span>
          <span style={{ color: 'var(--color-ink-3)' }}>NOW ARRIVING</span>
          <span style={{ color: 'var(--color-ink-2)' }}>
            {arrivals
              ? <>{arrivals.station} <span style={{ color: 'var(--color-ink-4)' }}>· </span><LineBulletInline lineId={arrivals.line} /></>
              : 'AWAITING NEXT TRAIN'}
          </span>
          <span className="ml-auto" style={{ color: 'var(--color-ink-4)' }}>CLICK ANY STATION TO OPEN ITS DOSSIER</span>
        </div>
      </div>
    </section>
  );
}

function LineBullet({ color, char }: { color: string; char: string }) {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] font-bold"
      style={{ background: color, color: '#fff', letterSpacing: 0 }}
    >
      {char}
    </span>
  );
}

function LineBulletInline({ lineId }: { lineId: string }) {
  const line = LINES.find((l) => l.id === lineId);
  if (!line) return null;
  return <LineBullet color={line.color} char={line.bullet} />;
}
