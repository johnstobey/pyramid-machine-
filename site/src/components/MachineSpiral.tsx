'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTobeyData, type LinguisticData, type MathematicalData } from '@/lib/useTobeyData';

const PHI = 1.618034;
const TAU = Math.PI * 2;

/* Jupiter transit zones — color and label for each phase */
type TransitZone = 'leo' | 'virgo' | 'libra';

const ZONE_CONFIG: Record<TransitZone, { color: string; glow: string; label: string; years: string }> = {
  leo:   { color: 'var(--accent)',          glow: 'rgba(201,168,76,0.35)',   label: 'Leo',   years: '1952' },
  virgo: { color: 'var(--emerald-accent)',  glow: 'rgba(107,143,113,0.35)', label: 'Virgo', years: '1953–56' },
  libra: { color: 'var(--coordinate)',      glow: 'rgba(180,160,140,0.30)', label: 'Libra', years: '1957' },
};

function getZone(lessonNum: number): TransitZone {
  if (lessonNum <= 8) return 'leo';
  if (lessonNum <= 16) return 'virgo';
  return 'libra';
}

function getZoneLessonRange(zone: TransitZone): [number, number] {
  if (zone === 'leo') return [1, 8];
  if (zone === 'virgo') return [9, 16];
  return [17, 24];
}

/* ── Golden spiral point generator ──
   Uses a logarithmic spiral: r = a * e^(b*θ)
   where b = ln(φ) / (π/2) so each 90° turn scales by φ */
function spiralPoint(theta: number, a: number, b: number, cx: number, cy: number): { x: number; y: number } {
  const r = a * Math.exp(b * theta);
  return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
}

export default function MachineSpiral() {
  const { data, loading } = useTobeyData();
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  /* Spiral parameters — tuned so 24 lessons fill ~2.5 turns */
  const spiralA = 18;
  const spiralB = Math.log(PHI) / (Math.PI / 2);
  const totalTurns = 2.5;
  const maxTheta = totalTurns * TAU;

  /* Generate 24 lesson positions along the spiral */
  const lessonPositions = useMemo(() => {
    const positions: { num: number; x: number; y: number; theta: number; r: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const t = (i + 0.5) / 24; // distribute evenly along the spiral
      const theta = t * maxTheta - Math.PI / 2; // start from top
      const pt = spiralPoint(theta, spiralA, spiralB, 0, 0);
      positions.push({ num: i + 1, ...pt, theta, r: Math.sqrt(pt.x * pt.x + pt.y * pt.y) });
    }
    return positions;
  }, []);

  /* Generate the spiral path itself (smooth curve) */
  const spiralPath = useMemo(() => {
    const steps = 300;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const theta = t * maxTheta - Math.PI / 2;
      const pt = spiralPoint(theta, spiralA, spiralB, 0, 0);
      d += (i === 0 ? 'M' : 'L') + `${pt.x.toFixed(2)},${pt.y.toFixed(2)} `;
    }
    return d;
  }, []);

  /* Z/12Z ring positions (background) */
  const ringRadius = Math.max(...lessonPositions.map(p => p.r)) + 35;
  const ringPositions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      return {
        pos: i,
        x: ringRadius * Math.cos(angle),
        y: ringRadius * Math.sin(angle),
      };
    });
  }, [ringRadius]);

  /* Ring connection lines (lesson pairs: N and N+12 share same ring position) */
  const pairLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const a = lessonPositions[i];
      const b = lessonPositions[i + 12];
      return { from: a, to: b, ringPos: i };
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const activeLesson = selectedLesson ?? hoveredLesson;
  const activeZone = activeLesson ? getZone(activeLesson) : null;
  const zoneConf = activeZone ? ZONE_CONFIG[activeZone] : null;

  /* Data for the active lesson tooltip */
  const activeLinguistic: LinguisticData | undefined = activeLesson
    ? data.linguistic_layer[`Lesson_${activeLesson}`]
    : undefined;
  const activeMath: MathematicalData | undefined = activeLesson
    ? data.mathematical_layer[`Lesson_${activeLesson}`]
    : undefined;
  const activeTitle = activeLesson
    ? (data.lesson_titles[`Lesson_${activeLesson}`] || `Lesson ${activeLesson}`)
    : '';

  /* Bounding box for viewBox */
  const allX = [...lessonPositions.map(p => p.x), ...ringPositions.map(p => p.x)];
  const allY = [...lessonPositions.map(p => p.y), ...ringPositions.map(p => p.y)];
  const minX = Math.min(...allX) - 60;
  const maxX = Math.max(...allX) + 60;
  const minY = Math.min(...allY) - 60;
  const maxY = Math.max(...allY) + 60;
  const viewW = maxX - minX;
  const viewH = maxY - minY;
  const viewSize = Math.max(viewW, viewH);
  const viewCx = (minX + maxX) / 2;
  const viewCy = (minY + maxY) / 2;

  return (
    <section className="flex flex-col items-center section-padding-lg">
      <h2
        className="font-display text-3xl md:text-4xl font-semibold mb-4 text-center"
        style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
      >
        The Machine
      </h2>
      <p
        className="font-body text-base md:text-lg mb-4 text-center max-w-2xl"
        style={{ color: 'var(--text-secondary)', lineHeight: '1.7em' }}
      >
        Twenty-four lessons spiral through a golden-ratio progression.
        Each winding tightens through Jupiter&apos;s transit—Leo, Virgo, Libra—
        converging on a single point.
      </p>

      {/* Transit zone legend */}
      <div className="flex justify-center gap-8 mb-10">
        {(Object.entries(ZONE_CONFIG) as [TransitZone, typeof ZONE_CONFIG.leo][]).map(([zone, cfg]) => {
          const [lo, hi] = getZoneLessonRange(zone);
          return (
            <div key={zone} className="flex items-center gap-2">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill={cfg.color} opacity="0.7" />
              </svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
                {cfg.label} <span className="readout-dim">({cfg.years})</span>{' '}
                <span className="readout-dim">L{lo}–L{hi}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Main SVG — Diamond Lattice backing per Ravenform spec */}
      <div className="relative w-full lattice-diamond" style={{ maxWidth: '640px' }}>
        <svg
          viewBox={`${viewCx - viewSize / 2} ${viewCy - viewSize / 2} ${viewSize} ${viewSize}`}
          className="w-full"
          role="img"
          aria-label="Golden-ratio spiral showing 24 lessons winding through Jupiter transit zones"
        >
          <defs>
            {/* Glow filter for hovered/selected node */}
            <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Soft glow for spiral path */}
            <filter id="spiral-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>

          {/* ── Z/12Z Ring (background) ── */}
          <circle
            cx="0" cy="0" r={ringRadius}
            fill="none"
            stroke="var(--hairline)"
            strokeWidth="0.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          {/* Ring position markers + labels */}
          {ringPositions.map((rp) => (
            <g key={`ring-${rp.pos}`}>
              <circle
                cx={rp.x} cy={rp.y} r="2"
                fill="var(--hairline)"
                opacity="0.5"
              />
              <text
                x={rp.x + (rp.x > 0 ? 8 : -8)}
                y={rp.y + (rp.y > 0 ? 12 : -6)}
                textAnchor={rp.x > 0 ? 'start' : 'end'}
                fill="var(--hairline-subtle)"
                fontSize="8"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                {rp.pos}
              </text>
            </g>
          ))}

          {/* ── Pair connection lines (N ↔ N+12) ── */}
          {pairLines.map((pl) => {
            const isActive = activeLesson === pl.from.num || activeLesson === pl.to.num;
            return (
              <line
                key={`pair-${pl.ringPos}`}
                x1={pl.from.x} y1={pl.from.y}
                x2={pl.to.x} y2={pl.to.y}
                stroke="var(--hairline)"
                strokeWidth={isActive ? 1 : 0.4}
                strokeDasharray="2 4"
                opacity={isActive ? 0.6 : 0.2}
              />
            );
          })}

          {/* ── Golden spiral path (glow layer) ── */}
          <path
            d={spiralPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            opacity="0.08"
            filter="url(#spiral-glow)"
          />
          {/* ── Golden spiral path (main) ── */}
          <path
            d={spiralPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* ── Lesson nodes ── */}
          {lessonPositions.map((lp) => {
            const zone = getZone(lp.num);
            const cfg = ZONE_CONFIG[zone];
            const isActive = activeLesson === lp.num;
            const isDimmed = activeLesson !== null && !isActive;
            const nodeR = isActive ? 8 : 5;

            return (
              <g
                key={`lesson-${lp.num}`}
                onMouseEnter={() => { setHoveredLesson(lp.num); }}
                onMouseLeave={() => { setHoveredLesson(null); }}
                onClick={() => { setSelectedLesson(selectedLesson === lp.num ? null : lp.num); }}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Lesson ${lp.num}: ${data.lesson_titles[`Lesson_${lp.num}`] || ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedLesson(selectedLesson === lp.num ? null : lp.num);
                }}
              >
                {/* Outer glow ring for active */}
                {isActive && (
                  <circle
                    cx={lp.x} cy={lp.y} r={14}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={lp.x} cy={lp.y} r={nodeR}
                  fill={cfg.color}
                  opacity={isDimmed ? 0.15 : isActive ? 0.9 : 0.5}
                  filter={isActive ? 'url(#node-glow)' : undefined}
                />
                {/* Lesson number label */}
                <text
                  x={lp.x + (lp.x > 0 ? 10 : -10)}
                  y={lp.y + 3}
                  textAnchor={lp.x >= 0 ? 'start' : 'end'}
                  fill={isDimmed ? 'var(--hairline-subtle)' : cfg.color}
                  fontSize={isActive ? '11' : '9'}
                  fontFamily="var(--font-jetbrains), monospace"
                  letterSpacing="0.04em"
                  opacity={isDimmed ? 0.3 : 1}
                >
                  {lp.num}
                </text>
              </g>
            );
          })}

          {/* ── Center point — convergence ── */}
          <circle cx="0" cy="0" r="3" fill="var(--accent)" opacity="0.6" />
          <text
            x="0" y="14"
            textAnchor="middle"
            fill="var(--coordinate)"
            fontSize="8"
            fontFamily="var(--font-jetbrains), monospace"
            letterSpacing="0.08em"
            opacity="0.5"
          >
            CONVERGENCE
          </text>
        </svg>

        {/* ── Tooltip / Info Panel ── */}
        {activeLesson && (
          <div
            className="absolute top-4 right-0 plate animate-fade-in z-10"
            data-coord-tl={`MSN.L${String(activeLesson).padStart(2, '0')}`}
            data-coord-br={`Z/${12}Z p${(activeLesson - 1) % 12}`}
            style={{ padding: '1.25rem 1.5rem', minWidth: '220px', maxWidth: '260px' }}
          >
            {/* Zone badge */}
            {zoneConf && (
              <span
                className="font-ui inline-block px-2.5 py-0.5 mb-3"
                style={{
                  color: zoneConf.color,
                  border: `1px solid ${zoneConf.color}`,
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  opacity: 0.8,
                }}
              >
                {zoneConf.label} TRANSIT // {zoneConf.years}
              </span>
            )}

            <div className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
              Lesson {activeLesson}
            </div>
            <div className="readout-dim mb-4" style={{ fontSize: '10px' }}>
              {activeTitle}
            </div>

            {/* Ring position */}
            {activeMath && (
              <div className="space-y-2.5">
                <div>
                  <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Ring Position</div>
                  <div className="readout">{activeMath.ring_position} / 11</div>
                </div>
                <div>
                  <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Words</div>
                  <div className="readout">{activeMath.word_count.toLocaleString()}</div>
                </div>
                <div>
                  <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Phi</div>
                  <div className="readout">{activeMath.phi.toFixed(6)}</div>
                </div>
                <div>
                  <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Fibonacci Sents</div>
                  <div className="readout" style={{
                    color: activeMath.is_fibonacci ? 'var(--emerald-accent)' : 'var(--coordinate)',
                  }}>
                    {activeMath.fibonacci_sentence_count}
                  </div>
                </div>
                {activeLinguistic && (
                  <div>
                    <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Lexical Density</div>
                    <div className="readout">{(activeLinguistic.lexical_density * 100).toFixed(1)}%</div>
                  </div>
                )}
                {/* Paired lesson */}
                <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: '8px', marginTop: '4px' }}>
                  <div className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>Paired With</div>
                  <div className="readout">
                    L{activeLesson <= 12 ? activeLesson + 12 : activeLesson - 12}
                    <span className="readout-dim ml-2" style={{ fontSize: '9px' }}>
                      (Edge {((activeLesson - 1) % 12) + 1})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom annotation ── */}
      <div className="mt-8 text-center max-w-lg">
        <p className="readout-dim" style={{ fontSize: '10px', lineHeight: '1.7em' }}>
          Each node is a lesson. The spiral tightens through Jupiter&apos;s three-sign transit
          (1952–1957). Lessons N and N+12 share a Z/12Z ring position — connected by dashed lines.
          Hover or click any node to inspect.
        </p>
      </div>
    </section>
  );
}
