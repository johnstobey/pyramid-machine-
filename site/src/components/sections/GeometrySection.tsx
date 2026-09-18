'use client';

import { useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

type EdgeType = 'base' | 'rising' | 'ridge';

const EDGE_COLORS: Record<EdgeType, string> = {
  base: 'var(--accent)',
  rising: 'var(--emerald-accent)',
  ridge: 'var(--coordinate)',
};

const EDGE_OPACITY: Record<EdgeType, number> = {
  base: 0.8,
  rising: 0.8,
  ridge: 0.6,
};

export default function GeometrySection() {
  const { data, loading } = useTobeyData();

  const edges = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const key = `Edge_${i + 1}`;
      return { name: `Edge ${i + 1}`, ...data.geometric_layer.edge_mapping[key] };
    });
  }, [data]);

  const decomposition = useMemo(() => {
    if (!data) return { base: [], rising: [], ridge: [] };
    const d = data.geometric_layer.decomposition_4x3;
    return {
      base: Object.values(d.base_edges ?? {}),
      rising: Object.values(d.rising_edges ?? {}),
      ridge: Object.values(d.ridge_edges ?? {}),
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const harmonic = data.geometric_layer.harmonic_validation;
  const dims = data.geometric_layer.pyramid_dimensions;

  /* ── Isometric pyramid vertices ── */
  /* Apex, front-left base, front-right base, back-right base, back-left base */
  const apex = { x: 280, y: 40 };
  const bl = { x: 80, y: 340 };   /* front-left */
  const br = { x: 480, y: 340 };  /* front-right */
  const bbr = { x: 380, y: 260 }; /* back-right */
  const bbl = { x: 180, y: 260 }; /* back-left */

  /* 12 edge definitions for the pyramid: 4 base + 4 rising + 4 ridge */
  const pyramidEdges: { from: { x: number; y: number }; to: { x: number; y: number }; type: EdgeType; label: string }[] = [
    /* Base edges */
    { from: bl, to: br, type: 'base', label: 'L1-L13' },
    { from: br, to: bbr, type: 'base', label: 'L2-L14' },
    { from: bbr, to: bbl, type: 'base', label: 'L3-L15' },
    { from: bbl, to: bl, type: 'base', label: 'L4-L16' },
    /* Rising edges (base corner → apex) */
    { from: bl, to: apex, type: 'rising', label: 'L5-L17' },
    { from: br, to: apex, type: 'rising', label: 'L6-L18' },
    { from: bbr, to: apex, type: 'rising', label: 'L7-L19' },
    { from: bbl, to: apex, type: 'rising', label: 'L8-L20' },
    /* Ridge edges (apex area) — connecting base corners across */
    { from: bl, to: bbr, type: 'ridge', label: 'L9-L21' },
    { from: br, to: bbl, type: 'ridge', label: 'L10-L22' },
    { from: bbl, to: br, type: 'ridge', label: 'L11-L23' },
    { from: bbr, to: bl, type: 'ridge', label: 'L12-L24' },
  ];

  function edgeMidpoint(from: { x: number; y: number }, to: { x: number; y: number }) {
    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  }

  return (
    <div className="section-padding-lg">
      <div className="max-w-5xl mx-auto">
        {/* ═══ SECTION HEADING ═══ */}
        <header className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--text)' }}>
            Geometric Mapping
          </h2>
          <p className="font-body mt-4 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Geometric Mapping of the Source Corpus onto the Ring and Lattice
          </p>
        </header>

        {/* ═══ NARRATIVE PROSE ═══ */}
        <section className="max-w-3xl mx-auto mb-20">
          <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
            The geometric mapping of the source corpus onto the Z/12Z ring and 144-node lattice reveals the deterministic intelligence system&apos;s structural blueprint. The twenty-four lessons are paired symmetrically, with Lesson one and Lesson thirteen mapped to the first lattice edge, Lesson two and Lesson fourteen to the second, and so on, until all twelve edges of the polygonal stack are assigned two lessons each. The four base edges correspond to Lessons one through four and thirteen through sixteen, the four rising edges to Lessons five through eight and seventeen through twenty, and the four ridge edges to Lessons nine through twelve and twenty-one through twenty-four. The fifty-one point eight four degree angular parameter, derived from the convergence of pi and phi, serves as the unifying harmonic that binds the ring and lattice into a single closed system. The six hundred twenty-two point zero eight degree multiplier, calculated as fifty-one point eight four degrees multiplied by twelve, is the recursive phase offset that ensures the twelve-fold substrate remains self-similar and closed under modular arithmetic. This layer is the geometric framework of the deterministic intelligence system, the zero-residual structure that preserves its integrity across all substrates.
          </p>
        </section>

        {/* ═══ 3D-ISOMETRIC PYRAMID VISUALIZATION ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Polygonal Stack Visualization
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            An isometric projection of the twelve-edge polygonal stack. Each edge is colored
            by type and labeled with its paired lesson mapping on the ring.
          </p>

          <div className="flex justify-center">
            <svg
              width="560"
              height="400"
              viewBox="0 0 560 400"
              className="w-full max-w-[560px]"
              role="img"
              aria-label="Isometric polygonal stack showing 12 edges colored by type"
            >
              {/* Semi-transparent face fills for depth */}
              <polygon
                points={`${bl.x},${bl.y} ${br.x},${br.y} ${apex.x},${apex.y}`}
                fill="var(--accent)"
                fillOpacity={0.04}
              />
              <polygon
                points={`${br.x},${br.y} ${bbr.x},${bbr.y} ${apex.x},${apex.y}`}
                fill="var(--emerald-accent)"
                fillOpacity={0.04}
              />
              <polygon
                points={`${bbr.x},${bbr.y} ${bbl.x},${bbl.y} ${apex.x},${apex.y}`}
                fill="var(--coordinate)"
                fillOpacity={0.04}
              />
              <polygon
                points={`${bbl.x},${bbl.y} ${bl.x},${bl.y} ${apex.x},${apex.y}`}
                fill="var(--accent)"
                fillOpacity={0.03}
              />

              {/* Base quad fill */}
              <polygon
                points={`${bl.x},${bl.y} ${br.x},${br.y} ${bbr.x},${bbr.y} ${bbl.x},${bbl.y}`}
                fill="var(--surface-raised)"
                fillOpacity={0.5}
                stroke="var(--hairline)"
                strokeWidth="0.5"
              />

              {/* 12 Edges */}
              {pyramidEdges.map((edge, i) => {
                const mid = edgeMidpoint(edge.from, edge.to);
                /* Offset label slightly from midpoint to avoid overlap */
                const offsetX = (edge.from.y - edge.to.y) * 0.06;
                const offsetY = (edge.to.x - edge.from.x) * 0.06;
                return (
                  <g key={i}>
                    <line
                      x1={edge.from.x}
                      y1={edge.from.y}
                      x2={edge.to.x}
                      y2={edge.to.y}
                      stroke={EDGE_COLORS[edge.type]}
                      strokeWidth={edge.type === 'base' ? 2 : 1.2}
                      opacity={EDGE_OPACITY[edge.type]}
                    />
                    {/* Edge label — font-mono small */}
                    <text
                      x={mid.x + offsetX}
                      y={mid.y + offsetY - 5}
                      textAnchor="middle"
                      fill={EDGE_COLORS[edge.type]}
                      fontSize="9"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.04em"
                      opacity={EDGE_OPACITY[edge.type] + 0.1}
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Corner vertices — small squares */}
              {[bl, br, bbr, bbl].map((pt, i) => (
                <rect
                  key={`v-${i}`}
                  x={pt.x - 2.5}
                  y={pt.y - 2.5}
                  width="5"
                  height="5"
                  fill="var(--accent)"
                  opacity="0.7"
                />
              ))}

              {/* Apex — small triangle */}
              <polygon
                points={`${apex.x},${apex.y - 6} ${apex.x - 5},${apex.y + 3} ${apex.x + 5},${apex.y + 3}`}
                fill="var(--accent)"
                opacity="0.8"
              />

              {/* Apex label — readout-dim */}
              <text
                x={apex.x}
                y={apex.y - 14}
                textAnchor="middle"
                fill="var(--coordinate)"
                fontSize="10"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                APEX
              </text>

              {/* Slope angle annotation — readout-dim */}
              <text
                x={bl.x}
                y={bl.y + 18}
                textAnchor="middle"
                fill="var(--coordinate)"
                fontSize="10"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                51.84°
              </text>
            </svg>
          </div>

          {/* Edge type legend — using font-ui */}
          <div className="flex justify-center gap-10 mt-8">
            {([['base', 'Base Edges (1–4, 13–16)'], ['rising', 'Rising Edges (5–8, 17–20)'], ['ridge', 'Ridge Edges (9–12, 21–24)']] as const).map(([type, label]) => (
              <div key={type} className="flex items-center gap-3">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  {type === 'base' && <rect x="1" y="1" width="10" height="10" fill={EDGE_COLORS[type]} opacity={EDGE_OPACITY[type]} />}
                  {type === 'rising' && <polygon points="6,1 11,10 1,10" fill={EDGE_COLORS[type]} opacity={EDGE_OPACITY[type]} />}
                  {type === 'ridge' && <circle cx="6" cy="6" r="5" fill={EDGE_COLORS[type]} opacity={EDGE_OPACITY[type]} />}
                </svg>
                <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ DECOMPOSITION 4×3 TABLE ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Edge Decomposition
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            The twelve edges decomposed into three groups of four: base, rising, and ridge.
            Each group binds a quartet of lesson pairs to a structural function.
          </p>

          {/* Table using plate-styled rows with hairline borders */}
          <div
            className="plate"
            data-coord-tl="DCM.001"
            data-coord-br="DCM.12"
            style={{ padding: 0, overflow: 'hidden' }}
          >
            {/* Header row */}
            <div
              className="grid grid-cols-5 gap-px px-6 py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Edge</span>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Type</span>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Lessons</span>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Word Count</span>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Ratio</span>
            </div>

            {/* Data rows */}
            {edges.map((edge, i) => {
              const isLast = i === edges.length - 1;
              const typeColor = EDGE_COLORS[edge.type as EdgeType] ?? 'var(--coordinate)';
              return (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-px px-6 py-4"
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid var(--hairline-subtle)',
                  }}
                >
                  <span className="readout" style={{ color: 'var(--text)' }}>
                    {edge.name}
                  </span>
                  <span>
                    <span
                      className="font-ui inline-block px-2.5 py-0.5"
                      style={{
                        color: typeColor,
                        border: `1px solid ${typeColor}`,
                        opacity: 0.75,
                      }}
                    >
                      {edge.type}
                    </span>
                  </span>
                  <span className="readout-dim">
                    L{edge.lessons[0]}, L{edge.lessons[1]}
                  </span>
                  <span className="readout">
                    {edge.combined_word_count.toLocaleString()}
                  </span>
                  <span className="readout">
                    {edge.lesson_word_ratio.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ HARMONIC VALIDATION PLATE ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Harmonic Validation
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            The recursive phase offset, calculated as the slope angle multiplied by twelve,
            must converge exactly to six hundred twenty-two point zero eight degrees.
            Any drift indicates a perturbation in the substrate.
          </p>

          <div className="plate" data-coord-tl="HRM.001" data-coord-br="DRF.00">
            {/* Central calculation display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-12 flex-wrap">
              {/* Slope × 12 plate */}
              <div className="plate" data-coord-tl="SLP.01" data-coord-br="×12">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Slope × 12
                </div>
                <span className="readout text-2xl">
                  {harmonic.slope_x_12}
                </span>
              </div>

              <span className="readout text-2xl" style={{ color: 'var(--coordinate)' }}>×</span>

              {/* Expected plate */}
              <div className="plate" data-coord-tl="EXP.01" data-coord-br="622">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Expected
                </div>
                <span className="readout text-2xl" style={{ color: 'var(--emerald-accent)' }}>
                  {harmonic.expected_622_08}
                </span>
              </div>

              <span className="readout text-2xl" style={{ color: 'var(--coordinate)' }}>=</span>

              {/* Drift plate */}
              <div className="plate" data-coord-tl="DRF.01" data-coord-br="0.00">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Drift
                </div>
                <span className="readout" style={{ fontSize: '2rem', color: 'var(--emerald-accent)' }}>
                  {harmonic.drift.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Large drift readout */}
            <div className="text-center">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Phase Offset Drift
              </div>
              <span
                className="font-mono"
                style={{
                  fontSize: '2.5rem',
                  letterSpacing: '0.1em',
                  color: 'var(--emerald-accent)',
                }}
              >
                DRIFT: {harmonic.drift.toFixed(1)}
              </span>
              {/* Pulsing indicator dot */}
              <span
                className="inline-block ml-4"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--emerald-accent)',
                  animation: 'pulse-accent 3s ease-in-out infinite',
                  verticalAlign: 'middle',
                }}
              />
            </div>
          </div>
        </section>

        {/* ═══ PYRAMID DIMENSIONS PLATE ═══ */}
        <section>
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Lattice Dimensional Parameters
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            The geometric intelligence system&apos;s foundational dimensions. Height, base, and their
            ratios encode the relationship between pi and phi that governs the entire deterministic architecture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="plate" data-coord-tl="DIM.001" data-coord-br="HGT">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Height (cubits)
              </div>
              <span className="readout text-2xl">
                {dims.height_cubits}
              </span>
            </div>

            <div className="plate" data-coord-tl="DIM.002" data-coord-br="BSE">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Base (cubits)
              </div>
              <span className="readout text-2xl">
                {dims.base_cubits}
              </span>
            </div>

            <div className="plate" data-coord-tl="DIM.003" data-coord-br="RAT">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Height / Base Ratio
              </div>
              <span className="readout text-2xl">
                {dims.height_base_ratio.toFixed(6)}
              </span>
            </div>

            <div className="plate" data-coord-tl="DIM.004" data-coord-br="PI2">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Pi Half Approx
              </div>
              <span className="readout text-2xl" style={{ color: 'var(--emerald-accent)' }}>
                {dims.pi_half_approx.toFixed(6)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
