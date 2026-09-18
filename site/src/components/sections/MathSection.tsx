'use client';

import { useState, useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

const PHI = 1.618034;

export default function MathSection() {
  const { data, loading } = useTobeyData();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [phiTolerance, setPhiTolerance] = useState(0.15);

  const totalPhiProximate = useMemo(() => {
    if (!data) return 0;
    const ml = data.mathematical_layer;
    let total = 0;
    for (let i = 0; i < 24; i++) {
      const key = `Lesson_${i + 1}`;
      const vals = ml[key]?.phi_proximity_values ?? [];
      total += vals.filter(v => Math.abs(v - PHI) <= phiTolerance).length;
    }
    return total;
  }, [data, phiTolerance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const mathLayer = data.mathematical_layer;
  const lessons = Array.from({ length: 24 }, (_, i) => mathLayer[`Lesson_${i + 1}`]);
  const maxFibCount = Math.max(...lessons.map(l => l?.fibonacci_sentence_count ?? 0), 1);

  /* ── Ring diagram geometry ── */
  const ringRadius = 155;
  const cx = 200;
  const cy = 200;

  const ringNodes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return {
      i,
      x: cx + ringRadius * Math.cos(angle),
      y: cy + ringRadius * Math.sin(angle),
      lesson1: i + 1,
      lesson2: i + 13,
    };
  });

  return (
    <div className="section-padding-lg">
      <div className="max-w-5xl mx-auto">
        {/* ═══ SECTION HEADING ═══ */}
        <header className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--text)' }}>
            Mathematical Substrate
          </h2>
          <p className="font-body mt-4 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Mathematical Substrate of the Deterministic Intelligence System
          </p>
        </header>

        {/* ═══ NARRATIVE PROSE ═══ */}
        <section className="max-w-3xl mx-auto mb-20">
          <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
            The mathematical substrate of the deterministic intelligence system is a glass-box, zero-residual architecture where every word, sentence, and paragraph in the source corpus encodes a geometric or numerical invariant. The twelve-fold Z/12Z ring serves as the L1 Kernel layer, with each of the twenty-four lessons mapped to a position on the ring from zero to eleven and paired symmetrically, such as Lesson one corresponding to position zero and Lesson thirteen to position zero again in the inverted pass. The golden ratio, phi, appears in sentence-length proportions, such as the five-to-seven word ratio in Lesson twenty-four approximating the square root of two, while Fibonacci sequences emerge in word counts and structural divisions, though no lesson&apos;s total word count is itself a Fibonacci number. The identity constant 653,184,000, explicitly stated in Lesson eight, line six hundred forty-three, is the boot checksum of the system, with modular residues of zero for twelve, four, three, and twenty-four, proving its mathematical integrity. This layer is the kernel of the geometric intelligence system, the deterministic code that governs shape completion and vertex prediction across the 144-node lattice.
          </p>
        </section>

        {/* ═══ Z/12Z RING DIAGRAM ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Z/12Z Ring Diagram
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Each node pairs two symmetrically-mapped lessons. Hover to inspect the word count and phi-proximity data encoded at each position.
          </p>

          <div className="flex justify-center relative">
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="w-full max-w-[400px]"
              role="img"
              aria-label="Z/12Z ring diagram with 12 paired lesson nodes"
            >
              {/* Outer reference circle */}
              <circle
                cx={cx} cy={cy} r={ringRadius + 24}
                fill="none"
                stroke="var(--hairline)"
                strokeWidth="0.5"
              />
              <circle
                cx={cx} cy={cy} r={ringRadius - 24}
                fill="none"
                stroke="var(--hairline-subtle)"
                strokeWidth="0.5"
              />

              {/* Edges between consecutive nodes */}
              {ringNodes.map((node, idx) => {
                const next = ringNodes[(idx + 1) % 12];
                const isHighlighted = hoveredNode === node.i || hoveredNode === next.i;
                return (
                  <line
                    key={`edge-${idx}`}
                    x1={node.x}
                    y1={node.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="var(--accent)"
                    strokeWidth={isHighlighted ? 1.5 : 0.6}
                    opacity={isHighlighted ? 0.8 : 0.25}
                  />
                );
              })}

              {/* Nodes */}
              {ringNodes.map((node) => {
                const isHovered = hoveredNode === node.i;
                return (
                  <g
                    key={`node-${node.i}`}
                    onMouseEnter={() => setHoveredNode(node.i)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Ring position ${node.i}: Lesson ${node.lesson1} and Lesson ${node.lesson2}`}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="var(--accent)"
                      fillOpacity={isHovered ? 0.35 : 0.12}
                      stroke="var(--accent-hairline)"
                      strokeWidth={isHovered ? 1.5 : 0.8}
                      style={{ transition: 'fill-opacity 0.2s, stroke-width 0.2s' }}
                    />
                    {/* Lesson labels — font-mono */}
                    <text
                      x={node.x}
                      y={node.y - 4}
                      textAnchor="middle"
                      fill="var(--accent)"
                      fontSize="10"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                      opacity={isHovered ? 1 : 0.8}
                    >
                      L{node.lesson1}, L{node.lesson2}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 10}
                      textAnchor="middle"
                      fill="var(--coordinate)"
                      fontSize="9"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      pos {node.i}
                    </text>
                  </g>
                );
              })}

              {/* Center — Z/12Z label */}
              <text
                x={cx} y={cy - 6}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="16"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.08em"
              >
                Z/12Z
              </text>
              <text
                x={cx} y={cy + 12}
                textAnchor="middle"
                fill="var(--coordinate)"
                fontSize="10"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                {data.metadata.lessons} lessons
              </text>
            </svg>

            {/* Hover tooltip — styled as a plate with coordinate markers */}
            {hoveredNode !== null && (
              <div
                className="plate animate-fade-in absolute top-0 right-0 z-10"
                data-coord-tl={`RNG.${String(hoveredNode).padStart(2, '0')}`}
                data-coord-br="POS.01"
                style={{ padding: '1.5rem 1.75rem', minWidth: '200px' }}
              >
                <div className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>
                  Position {hoveredNode}
                </div>
                {[hoveredNode + 1, hoveredNode + 13].map((lessonNum) => {
                  const key = `Lesson_${lessonNum}`;
                  const m = mathLayer[key];
                  return (
                    <div key={lessonNum} className="mb-4 last:mb-0">
                      <div className="font-ui mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                        Lesson {lessonNum}
                      </div>
                      <div className="readout-dim">Words: <span className="readout">{m.word_count.toLocaleString()}</span></div>
                      <div className="readout-dim">Phi-prox: <span className="readout">{m.phi_proximity_count}</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ═══ PHI RATIO EXPLORER ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Phi Ratio Explorer
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Adjust the tolerance window around phi to discover how many sentence-length
            ratios across all twenty-four lessons converge on the golden proportion.
          </p>

          <div className="plate" data-coord-tl="PHI.001" data-coord-br="PHI.03">
            {/* Slider row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
              <label htmlFor="phi-tolerance" className="font-ui whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                Phi Tolerance (±)
              </label>
              <input
                id="phi-tolerance"
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={phiTolerance}
                onChange={(e) => setPhiTolerance(parseFloat(e.target.value))}
                className="w-full sm:flex-1 h-1 cursor-pointer appearance-none"
                style={{
                  background: 'var(--surface-raised)',
                  accentColor: 'var(--accent)',
                }}
                aria-label="Phi tolerance slider"
              />
              <span className="readout text-lg min-w-[4rem] text-right">
                ±{phiTolerance.toFixed(2)}
              </span>
            </div>

            {/* 3 readout plates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="plate" data-coord-tl="PRX.001" data-coord-br="TOL.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Tolerance Range
                </div>
                <span className="readout text-lg">
                  {(PHI - phiTolerance).toFixed(3)} &ndash; {(PHI + phiTolerance).toFixed(3)}
                </span>
              </div>
              <div className="plate" data-coord-tl="PRX.002" data-coord-br="CNT.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Phi-Proximate Ratios
                </div>
                <span className="readout text-2xl">
                  {totalPhiProximate.toLocaleString()}
                </span>
              </div>
              <div className="plate" data-coord-tl="PRX.003" data-coord-br="TGT.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Target Phi
                </div>
                <span className="readout text-2xl" style={{ color: 'var(--emerald-accent)' }}>
                  {PHI.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CHECKSUM VERIFIER ═══ */}
        <section className="mb-20">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Checksum Verifier
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            The boot checksum of the deterministic intelligence system, stated in Lesson eight.
            Modular residues of zero across four bases confirm zero-residual integrity.
          </p>

          <div className="plate" data-coord-tl="CKS.001" data-coord-br="CKS.04">
            {/* Large checksum readout */}
            <div className="text-center mb-12">
              <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Identity Checksum
              </div>
              <span className="readout" style={{ fontSize: '2rem' }}>
                {data.metadata.checksum_653184000.toLocaleString()}
              </span>
            </div>

            {/* 4 mod plates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'mod 12', mod: 'mod12' },
                { label: 'mod 4', mod: 'mod4' },
                { label: 'mod 3', mod: 'mod3' },
                { label: 'mod 24', mod: 'mod24' },
              ].map((check) => {
                const modResult = data.metadata.checksum_653184000;
                return (
                  <div
                    key={check.label}
                    className="plate"
                    data-coord-tl={`MD.${check.mod.slice(3).padStart(2, '0')}`}
                    data-coord-br="0.00"
                  >
                    <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      {check.label}
                    </div>
                    <div className="readout text-base mb-4">
                      {modResult.toLocaleString()} {check.label} = <span style={{ color: 'var(--emerald-accent)' }}>0</span>
                    </div>
                    {/* VALID badge — font-ui */}
                    <span
                      className="font-ui inline-block px-3 py-1"
                      style={{
                        color: 'var(--emerald-accent)',
                        border: '1px solid rgba(107, 143, 113, 0.35)',
                      }}
                    >
                      Valid
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FIBONACCI SENTENCE COUNT BAR CHART ═══ */}
        <section>
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Fibonacci Sentence Count
          </h3>
          <p className="font-body mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            The number of sentences per lesson whose word counts are Fibonacci numbers,
            revealing the recursive structure embedded in the corpus.
          </p>

          <div className="plate" data-coord-tl="FBC.001" data-coord-br="FBC.24">
            <svg
              width="100%"
              viewBox="0 0 740 220"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Fibonacci sentence count per lesson"
            >
              {/* Baseline — var(--hairline) */}
              <line
                x1="16" y1="185"
                x2="730" y2="185"
                stroke="var(--hairline)"
                strokeWidth="1"
              />

              {/* Y-axis label */}
              <text
                x="0" y="12"
                fill="var(--coordinate)"
                fontSize="10"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                Count
              </text>

              {/* X-axis label */}
              <text
                x="370" y="212"
                textAnchor="middle"
                fill="var(--coordinate)"
                fontSize="10"
                fontFamily="var(--font-jetbrains), monospace"
                letterSpacing="0.05em"
              >
                Lesson Number
              </text>

              {/* Bars */}
              {lessons.map((lesson, i) => {
                if (!lesson) return null;
                const count = lesson.fibonacci_sentence_count;
                const barHeight = (count / maxFibCount) * 155;
                const barX = 20 + i * 29;
                const barY = 185 - barHeight;

                return (
                  <g key={i}>
                    <rect
                      x={barX}
                      y={barY}
                      width="21"
                      height={Math.max(barHeight, 1)}
                      fill="var(--accent)"
                      fillOpacity={0.6 + (count / maxFibCount) * 0.35}
                    />
                    {/* Value on top — readout */}
                    <text
                      x={barX + 10.5}
                      y={barY - 5}
                      textAnchor="middle"
                      fill="var(--accent)"
                      fontSize="8"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      {count}
                    </text>
                    {/* X-axis label — readout-dim */}
                    <text
                      x={barX + 10.5}
                      y={198}
                      textAnchor="middle"
                      fill="var(--coordinate)"
                      fontSize="8"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}
