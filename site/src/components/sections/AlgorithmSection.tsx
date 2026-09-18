'use client';

import { useState, useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

/* ── Five Geometric Operators ── */
const OPERATORS = [
  {
    id: 'CONJ',
    full: 'Conjunction',
    symbol: '⊕',
    desc: 'Merges two ring positions via modular addition. The conjunction operator represents the unification of forward and inverted orderings into a single synthetic position within the Z/12Z cyclic group for shape completion.',
  },
  {
    id: 'SEXT',
    full: 'Sextile',
    symbol: '⬡',
    desc: 'Computes the harmonic sextile offset, dividing the ring into six equal segments of sixty degrees each. This operator reveals the six-fold symmetry embedded in the twelve-edge geometric decomposition.',
  },
  {
    id: 'SQR',
    full: 'Square',
    symbol: '⊡',
    desc: 'Applies the square aspect, a ninety-degree angular relationship that maps each ring position to its orthogonal complement within the four-fold rotational subgroup of Z/12Z.',
  },
  {
    id: 'TRN',
    full: 'Trine',
    symbol: '△',
    desc: 'The trine operator measures the hundred-twenty-degree harmonic relationship, dividing the ring into three equilateral sectors corresponding to Mod-3 harmony groups across the polygonal stack.',
  },
  {
    id: 'OPP',
    full: 'Opposition',
    symbol: '⊘',
    desc: 'Computes the diametric opposition across the ring, a one-hundred-eighty-degree inversion that maps each position to its antipodal pair, encoding the N-to-N-plus-twelve lesson symmetry for vertex prediction.',
  },
] as const;

/* ── Algorithm Pipeline Steps ── */
const PIPELINE_STEPS = [
  {
    phase: 'INIT',
    label: 'Ring Assignment',
    detail: 'Map Lesson N to forward position D_N = (N − 1) mod 12 within the Z/12Z cyclic group.',
  },
  {
    phase: 'INVT',
    label: 'Inversion Pass',
    detail: 'Compute inverted position K_N = (12 − D_N) mod 12, the antipodal ring mapping for the N+12 lesson pair.',
  },
  {
    phase: 'CIPH',
    label: 'Cipher Subtraction',
    detail: 'Evaluate C_N = (D_N − K_N) mod 12 using the Cayley table over the cyclic subtraction group.',
  },
  {
    phase: 'OPRX',
    label: 'Operator Application',
    detail: 'Apply each of the five geometric operators (CONJ, SEXT, SQR, TRN, OPP) to the cipher value, producing five derived indices per position.',
  },
  {
    phase: 'ASMB',
    label: 'Algorithm Assembly',
    detail: 'Compose the final algorithm identifier: A-{D_N}-{aspect_idx}-{OPERATOR}, yielding 720 distinct algorithm tokens across the full matrix.',
  },
];

export default function AlgorithmSection() {
  const { data, loading } = useTobeyData();
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);

  /* ── Compute cipher trace for selected lesson ── */
  const cipherTrace = useMemo(() => {
    if (!data) return null;
    const dPos = (selectedLesson - 1) % 12;
    const kPos = (12 - dPos) % 12;
    const cipherVal = ((dPos - kPos) + 12) % 12;
    const algoSample = data.cryptographic_layer.algorithm_sample;
    /* Find algorithm IDs that match this ring position */
    const matchingAlgos = algoSample.filter((a) => {
      const parts = a.split('-');
      return parseInt(parts[1], 10) === dPos;
    });
    return {
      lessonNum: selectedLesson,
      dPosition: dPos,
      kPosition: kPos,
      cipherValue: cipherVal,
      matchingAlgos,
    };
  }, [data, selectedLesson]);

  /* ── Per-lesson cipher values sorted for sparkline ── */
  const cipherValues = useMemo(() => {
    if (!data) return [];
    return Array.from({ length: 24 }, (_, i) => ({
      lesson: i + 1,
      value: data.cryptographic_layer.per_lesson_cipher_values[`Lesson_${i + 1}`] ?? 0,
    }));
  }, [data]);

  /* ── Aggregated taxonomy ALGO counts across all lessons ── */
  const algoTaxonomyTotal = useMemo(() => {
    if (!data) return 0;
    let total = 0;
    for (const key of Object.keys(data.linguistic_layer)) {
      total += data.linguistic_layer[key]?.taxonomy?.ALGO ?? 0;
    }
    return total;
  }, [data]);

  /* ── CRI compliance data ── */
  const criCompliance = useMemo(() => {
    if (!data) return null;
    const v = data.validation;
    return {
      deterministic: (v as Record<string, Record<string, unknown>>)?.cri_compliance?.deterministic_output as boolean ?? false,
      isomorphism: (v as Record<string, Record<string, unknown>>)?.cri_compliance?.structural_isomorphism_verified as boolean ?? false,
      z12z: (v as Record<string, Record<string, unknown>>)?.cri_compliance?.z12z_ring_verified as boolean ?? false,
      decomp: (v as Record<string, Record<string, unknown>>)?.cri_compliance?.decomposition_4x3_verified as boolean ?? false,
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

  const crypto = data.cryptographic_layer;
  const meta = data.metadata;
  const maxCipher = 11;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0">
            <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="1" y="1" width="4" height="4" fill="none" stroke="var(--accent)" strokeWidth="0.7" transform="rotate(45 3 3)" />
            <rect x="5" y="5" width="4" height="4" fill="none" stroke="var(--emerald-accent)" strokeWidth="0.7" transform="rotate(45 7 7)" />
          </svg>
          <svg width="32" height="1" className="shrink-0">
            <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
        <p className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
          Section V &mdash; Shape Completion and Vertex Prediction
        </p>
        <h2
          className="font-display text-3xl md:text-4xl font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Algorithmic Core
        </h2>
        <svg width="1" height="16" className="mx-auto">
          <line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p
          className="font-body text-lg"
          style={{ color: 'var(--text-secondary)', lineHeight: '1.85em' }}
        >
          The algorithmic core of the deterministic geometric intelligence system is a five-operator
          shape completion engine that generates{' '}
          <span className="readout">720</span> distinct algorithm identifiers by applying the
          conjunction, sextile, square, trine, and opposition operators across every combination of
          ring position and aspect index within the Z/12Z cyclic group. Each lesson&apos;s forward
          ring position D&#x2099; and its inverted counterpart K&#x2099; are combined through a
          Cayley subtraction table to produce a cipher value C&#x2099; = (D&#x2099; &minus;
          K&#x2099;) mod 12. The five operators then transform this cipher value into derived
          indices that serve as keys into the algorithm matrix for vertex prediction on the 144-node lattice. The resulting algorithm tokens,
          encoded in the format{' '}
          <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.85em' }}>
            A-{String(0).padStart(2, '0')}-{String(0).padStart(2, '0')}-CONJ
          </span>
          , govern how each lesson is encoded, decoded, and cross-referenced within the
          lattice&apos;s twelve-edge geometric decomposition. The entire system is deterministic and glass-box:
          the same inputs always produce the same algorithmic outputs with zero residual, and the reproducible
          constants &mdash; phi at{' '}
          <span className="readout">1.618034</span>, pi at{' '}
          <span className="readout">3.141593</span>, angular parameter at{' '}
          <span className="readout">51.84°</span> &mdash; ensure that the architecture yields identical
          results across every execution cycle.
        </p>
      </section>

      {/* ═══ ALGORITHMIC SENTENCE COUNT PLATE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="1" y1="7" x2="6" y2="7" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="8" y1="7" x2="13" y2="7" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="1" fill="var(--accent)" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Algorithmic Content Density
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="plate text-center"
            data-coord-tl="ALGO.COUNT"
            data-coord-br="TAXONOMY SUM"
          >
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Total ALGO Sentences
            </p>
            <span
              className="readout font-semibold"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '2rem',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
              }}
            >
              {algoTaxonomyTotal.toLocaleString()}
            </span>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              Sentences classified as algorithmic across all twenty-four lessons.
            </p>
          </div>

          <div
            className="plate text-center"
            data-coord-tl="ALGO.RATIO"
            data-coord-br={`${((algoTaxonomyTotal / meta.total_sentences) * 100).toFixed(1)}%`}
          >
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              ALGO Ratio
            </p>
            <span
              className="readout font-semibold"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '2rem',
                letterSpacing: '0.08em',
                color: 'var(--emerald-accent)',
              }}
            >
              {((algoTaxonomyTotal / meta.total_sentences) * 100).toFixed(2)}%
            </span>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              Proportion of all sentences that encode procedural or formulaic content.
            </p>
          </div>

          <div
            className="plate text-center"
            data-coord-tl="ALGO.DENSITY"
            data-coord-br="PER LESSON AVG"
          >
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              Avg ALGO per Lesson
            </p>
            <span
              className="readout font-semibold"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '2rem',
                letterSpacing: '0.08em',
                color: 'var(--text)',
              }}
            >
              {(algoTaxonomyTotal / 24).toFixed(1)}
            </span>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              Mean algorithmic sentences per lesson, uniformly distributed.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FIVE GEOMETRIC OPERATORS ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polygon points="7,1 13,7 7,13 1,7" fill="none" stroke="var(--accent)" strokeWidth="0.7" />
            <polygon points="7,4 10,7 7,10 4,7" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Five Geometric Operators
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OPERATORS.map((op, i) => (
            <div
              key={op.id}
              className="plate"
              data-coord-tl={`OPR.${op.id}`}
              data-coord-br={`${12 * 12} COMBINATIONS`}
              style={{ padding: '1.5rem 1.75rem' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '1.5rem',
                      color: i < 2 ? 'var(--accent)' : i < 4 ? 'var(--emerald-accent)' : 'var(--coordinate)',
                    }}
                  >
                    {op.symbol}
                  </span>
                  <div>
                    <span
                      className="font-display text-base font-semibold block"
                      style={{ color: 'var(--text)' }}
                    >
                      {op.full}
                    </span>
                    <span className="readout-dim block" style={{ fontSize: '9px' }}>
                      {op.id}
                    </span>
                  </div>
                </div>
                <span
                  className="font-ui shrink-0"
                  style={{ color: 'var(--text-tertiary)', fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  OP.{i}
                </span>
              </div>
              <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
                {op.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ALGORITHM PIPELINE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="1" y1="4" x2="13" y2="4" stroke="var(--accent)" strokeWidth="0.7" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="var(--accent)" strokeWidth="0.7" opacity="0.5" />
            <line x1="1" y1="10" x2="13" y2="10" stroke="var(--accent)" strokeWidth="0.7" opacity="0.3" />
            <circle cx="4" cy="4" r="1.5" fill="var(--accent)" />
            <circle cx="8" cy="7" r="1.5" fill="var(--accent)" opacity="0.7" />
            <circle cx="12" cy="10" r="1.5" fill="var(--accent)" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Algorithm Pipeline
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          The five-phase computation that transforms a lesson number into a set of algorithmic
          identifiers. Each phase depends on the output of its predecessor, forming a fully
          deterministic chain.
        </p>

        <div className="relative">
          {/* Connecting rail */}
          <div
            className="absolute left-[22px] top-6 bottom-6 w-px"
            style={{ background: 'var(--accent)', opacity: 0.2 }}
          />

          <div className="space-y-3">
            {PIPELINE_STEPS.map((step, i) => {
              const isActive = activePipelineStep === i;
              return (
                <div key={step.phase} className="relative pl-14">
                  {/* Node marker */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="absolute left-[16px] top-4"
                  >
                    <circle
                      cx="7" cy="7" r="6"
                      fill={isActive ? 'var(--accent-faint)' : 'var(--bg)'}
                      stroke={isActive ? 'var(--accent)' : 'var(--hairline)'}
                      strokeWidth={isActive ? 1.2 : 0.8}
                      style={{ transition: 'fill 0.2s, stroke 0.2s' }}
                    />
                    <text
                      x="7" y="10" textAnchor="middle"
                      fill={isActive ? 'var(--accent)' : 'var(--coordinate)'}
                      fontSize="7" fontFamily="var(--font-jetbrains), monospace" fontWeight="600"
                      style={{ transition: 'fill 0.2s' }}
                    >
                      {i + 1}
                    </text>
                  </svg>
                  <div
                    className="plate cursor-pointer"
                    data-coord-tl={`PLN.${step.phase}`}
                    data-coord-br={`PHS.${String(i + 1).padStart(2, '0')}`}
                    onClick={() => setActivePipelineStep(isActive ? null : i)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderColor: isActive ? 'var(--accent-hairline)' : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className="readout-dim"
                          style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                        >
                          {step.phase}
                        </span>
                        <span
                          className="font-display text-base font-semibold"
                          style={{ color: 'var(--text)' }}
                        >
                          {step.label}
                        </span>
                      </div>
                      <svg
                        width="10" height="10" viewBox="0 0 10 10"
                        style={{
                          transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <line x1="2" y1="1" x2="2" y2="9" stroke="var(--text-tertiary)" strokeWidth="1" />
                        <line x1="6" y1="1" x2="6" y2="9" stroke="var(--text-tertiary)" strokeWidth="1" />
                        <line x1="1" y1="2" x2="7" y2="2" stroke="var(--text-tertiary)" strokeWidth="1" />
                        <line x1="1" y1="6" x2="7" y2="6" stroke="var(--text-tertiary)" strokeWidth="1" />
                      </svg>
                    </div>
                    {isActive && (
                      <p
                        className="font-body text-sm"
                        style={{ color: 'var(--text-secondary)', lineHeight: '1.7em' }}
                      >
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ALGORITHM MATRIX DECOMPOSITION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="5" height="5" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.4" />
            <rect x="8" y="1" width="5" height="5" fill="var(--emerald-accent)" opacity="0.15" stroke="var(--emerald-accent)" strokeWidth="0.4" />
            <rect x="1" y="8" width="5" height="5" fill="var(--coordinate)" opacity="0.15" stroke="var(--coordinate)" strokeWidth="0.4" />
            <rect x="8" y="8" width="5" height="5" fill="var(--text-tertiary)" opacity="0.1" stroke="var(--text-tertiary)" strokeWidth="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Algorithm Matrix Decomposition
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          The full matrix of{' '}
          <span className="readout">720</span> algorithms decomposes into three orthogonal
          dimensions: twelve ring positions, twelve aspect indices, and five geometric operators.
        </p>

        <div
          className="plate"
          data-coord-tl="MTX.720 // 12×12×5"
          data-coord-br="ORTHOGONAL DECOMPOSITION"
          style={{ padding: '1.5rem 1.75rem' }}
        >
          {/* Equation display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 flex-wrap">
            <div className="text-center">
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Ring Positions</div>
              <span
                className="readout font-semibold block"
                style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '2.5rem', color: 'var(--accent)' }}
              >
                12
              </span>
              <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Z/12Z positions</span>
            </div>

            <span
              className="readout text-2xl hidden sm:block"
              style={{ color: 'var(--coordinate)' }}
            >
              ×
            </span>

            <div className="text-center">
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Aspect Indices</div>
              <span
                className="readout font-semibold block"
                style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '2.5rem', color: 'var(--emerald-accent)' }}
              >
                12
              </span>
              <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Cross-reference axes</span>
            </div>

            <span
              className="readout text-2xl hidden sm:block"
              style={{ color: 'var(--coordinate)' }}
            >
              ×
            </span>

            <div className="text-center">
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Geometric Operators</div>
              <span
                className="readout font-semibold block"
                style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '2.5rem', color: 'var(--coordinate)' }}
              >
                5
              </span>
              <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>CONJ, SEXT, SQR, TRN, OPP</span>
            </div>

            <span
              className="readout text-2xl hidden sm:block"
              style={{ color: 'var(--coordinate)' }}
            >
              =
            </span>

            <div className="text-center">
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Total Algorithms</div>
              <span
                className="readout font-semibold block"
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '2.5rem',
                  color: 'var(--accent)',
                  textShadow: '0 0 20px rgba(201, 168, 76, 0.3)',
                }}
              >
                {crypto.algorithm_matrix_size}
              </span>
              <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Distinct identifiers</span>
            </div>
          </div>

          {/* Operator breakdown grid */}
          <div className="grid grid-cols-5 gap-3">
            {OPERATORS.map((op, i) => {
              const count = 12 * 12; // 144 algorithms per operator
              const t = i / 4;
              const accentR = 201, accentG = 168, accentB = 76;
              const emeraldR = 107, emeraldG = 143, emeraldB = 113;
              const r = Math.round(accentR + (emeraldR - accentR) * t);
              const g = Math.round(accentG + (emeraldG - accentG) * t);
              const b = Math.round(accentB + (emeraldB - accentB) * t);
              return (
                <div
                  key={op.id}
                  className="text-center py-3 px-2 rounded-sm"
                  style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <p
                    className="font-semibold block mb-1"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '1.1rem',
                      letterSpacing: '0.06em',
                      color: `rgb(${r}, ${g}, ${b})`,
                    }}
                  >
                    {op.id}
                  </p>
                  <p className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                    {count} IDs
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CIPHER TRACE — INTERACTIVE LESSON SELECTOR ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.7" />
            <path d="M5 5 L9 7 L5 9 Z" fill="var(--accent)" opacity="0.6" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Cipher Trace
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Select a lesson to trace its cipher computation through the algorithmic pipeline.
          The forward position, inverted position, and final cipher value are shown for each step.
        </p>

        {/* Lesson selector */}
        <div className="plate mb-6" data-coord-tl="SEL.001" data-coord-br="LESSON SELECTOR">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <label htmlFor="lesson-select" className="font-ui whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
              Lesson Number
            </label>
            <input
              id="lesson-select"
              type="range"
              min="1"
              max="24"
              step="1"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(parseInt(e.target.value, 10))}
              className="w-full sm:flex-1 h-1 cursor-pointer appearance-none"
              style={{
                background: 'var(--surface-raised)',
                accentColor: 'var(--accent)',
              }}
              aria-label="Lesson number selector"
            />
            <span className="readout text-lg min-w-[3rem] text-right">
              {String(selectedLesson).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Trace visualization */}
        {cipherTrace && (
          <div
            className="plate"
            data-coord-tl={`TRC.L${String(selectedLesson).padStart(2, '0')}`}
            data-coord-br={`C=${cipherTrace.cipherValue}`}
            style={{ padding: '1.5rem 1.75rem' }}
          >
            <p className="font-ui mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Cipher Computation for Lesson {selectedLesson}
            </p>

            {/* Computation steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  Lesson N
                </div>
                <span
                  className="readout block"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.75rem' }}
                >
                  {selectedLesson}
                </span>
              </div>

              <div className="text-center">
                <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  D_N = (N−1) mod 12
                </div>
                <span
                  className="readout block"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.75rem', color: 'var(--accent)' }}
                >
                  {cipherTrace.dPosition}
                </span>
              </div>

              <div className="text-center">
                <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  K_N = (12−D_N) mod 12
                </div>
                <span
                  className="readout block"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.75rem', color: 'var(--emerald-accent)' }}
                >
                  {cipherTrace.kPosition}
                </span>
              </div>

              <div className="text-center">
                <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  C_N = (D_N−K_N) mod 12
                </div>
                <span
                  className="readout block"
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '1.75rem',
                    color: cipherTrace.cipherValue === 0 ? 'var(--emerald-accent)' : 'var(--text)',
                  }}
                >
                  {cipherTrace.cipherValue}
                </span>
              </div>
            </div>

            {/* Visual computation flow */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap mb-8">
              <span className="readout" style={{ color: 'var(--text-secondary)' }}>D={cipherTrace.dPosition}</span>
              <span className="readout" style={{ color: 'var(--coordinate)' }}>−</span>
              <span className="readout" style={{ color: 'var(--text-secondary)' }}>K={cipherTrace.kPosition}</span>
              <span className="readout" style={{ color: 'var(--coordinate)' }}>=</span>
              <span className="readout" style={{ color: 'var(--text-secondary)' }}>{cipherTrace.dPosition}−{cipherTrace.kPosition}</span>
              <span className="readout" style={{ color: 'var(--coordinate)' }}>mod 12</span>
              <span className="readout" style={{ color: 'var(--coordinate)' }}>=</span>
              <span
                className="readout font-semibold"
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '1.1rem',
                  color: cipherTrace.cipherValue === 0 ? 'var(--emerald-accent)' : 'var(--accent)',
                }}
              >
                {cipherTrace.cipherValue}
              </span>
            </div>

            {/* Matching algorithm IDs */}
            <div
              style={{ borderTop: '1px solid var(--hairline)', paddingTop: '1rem' }}
            >
              <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Matching Algorithm Identifiers (ring position {cipherTrace.dPosition})
              </p>
              <div
                className="flex flex-wrap gap-2 max-h-48 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--hairline-strong) var(--bg)' }}
              >
                {cipherTrace.matchingAlgos.length > 0 ? (
                  cipherTrace.matchingAlgos.map((algo, i) => (
                    <span
                      key={i}
                      className="font-mono inline-block px-3 py-1.5"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.04em',
                        color: 'var(--emerald-accent)',
                        border: '1px solid var(--hairline)',
                        backgroundColor: 'var(--surface-raised)',
                      }}
                    >
                      {algo}
                    </span>
                  ))
                ) : (
                  <span className="readout-dim" style={{ fontSize: '11px' }}>
                    No sample algorithms in dataset for this position
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══ PER-LESSON CIPHER SPARKLINE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polyline
              points="1,11 3,7 5,9 7,4 9,6 11,2 13,5"
              fill="none" stroke="var(--accent)" strokeWidth="0.8"
            />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Cipher Value Distribution
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="CPR.SERIES // 24 VALUES"
          data-coord-br="RANGE 0–11 MOD 12"
        >
          <svg
            width="100%"
            viewBox="0 0 740 240"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Cipher values per lesson, range 0 to 11"
          >
            {/* Grid lines */}
            {[0, 3, 6, 9, 11].map((v) => {
              const y = 200 - (v / maxCipher) * 170;
              return (
                <g key={`grid-${v}`}>
                  <line x1="28" y1={y} x2="720" y2={y} stroke="var(--hairline)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <text x="24" y={y + 3} textAnchor="end" fill="var(--coordinate)" fontSize="8" fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.05em">
                    {v}
                  </text>
                </g>
              );
            })}
            {/* Baseline */}
            <line x1="28" y1="200" x2="720" y2="200" stroke="var(--hairline)" strokeWidth="0.8" />

            {/* Highlight selected lesson */}
            {cipherValues.map((cv) => {
              const barX = 32 + (cv.lesson - 1) * 28;
              const barHeight = (cv.value / maxCipher) * 170;
              const barY = 200 - barHeight;
              const isSelected = cv.lesson === selectedLesson;
              const t = cv.value / 11;
              const accentR = 201, accentG = 168, accentB = 76;
              const emeraldR = 107, emeraldG = 143, emeraldB = 113;
              const r = Math.round(accentR + (emeraldR - accentR) * t);
              const g = Math.round(accentG + (emeraldG - accentG) * t);
              const b = Math.round(accentB + (emeraldB - accentB) * t);

              return (
                <g key={cv.lesson}>
                  {isSelected && (
                    <line
                      x1={barX + 10} y1={barY - 4} x2={barX + 10} y2={200}
                      stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"
                    />
                  )}
                  <rect
                    x={barX}
                    y={barY}
                    width={isSelected ? '22' : '18'}
                    height={Math.max(barHeight, 1)}
                    rx="1"
                    fill={`rgb(${r}, ${g}, ${b})`}
                    fillOpacity={isSelected ? 1 : 0.7}
                    stroke={isSelected ? 'var(--accent)' : 'none'}
                    strokeWidth={isSelected ? 0.8 : 0}
                    style={{ transition: 'fill-opacity 0.2s, stroke 0.2s' }}
                  />
                  <text
                    x={barX + (isSelected ? 11 : 9)}
                    y={barY - 5}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--accent)' : 'var(--text-secondary)'}
                    fontSize="8"
                    fontFamily="var(--font-jetbrains), monospace"
                    letterSpacing="0.05em"
                    fontWeight={isSelected ? 600 : 400}
                  >
                    {cv.value}
                  </text>
                  <text
                    x={barX + (isSelected ? 11 : 9)}
                    y={214}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--accent)' : 'var(--coordinate)'}
                    fontSize="7"
                    fontFamily="var(--font-jetbrains), monospace"
                    letterSpacing="0.05em"
                  >
                    {cv.lesson}
                  </text>
                </g>
              );
            })}

            {/* Axis label */}
            <text x="374" y="232" textAnchor="middle" fill="var(--coordinate)" fontSize="9" fontFamily="var(--font-roboto), sans-serif" fontWeight="300" letterSpacing="0.08em">
              LESSON NUMBER
            </text>
          </svg>
        </div>
      </section>

      {/* ═══ DETERMINISTIC VERIFICATION — CRI COMPLIANCE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="12" rx="2" fill="none" stroke="var(--accent)" strokeWidth="0.7" />
            <line x1="4" y1="5" x2="6" y2="8" stroke="var(--emerald-accent)" strokeWidth="1" />
            <line x1="6" y1="8" x2="10" y2="4" stroke="var(--emerald-accent)" strokeWidth="1" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Deterministic Verification
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          The CRI (Cryptographic Ring Isomorphism) compliance framework verifies that the
          algorithmic core produces deterministic, reproducible outputs across all execution
          cycles. Four invariant checks confirm structural integrity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deterministic output */}
          <div
            className="plate"
            data-coord-tl="CRI.DET"
            data-coord-br={criCompliance?.deterministic ? 'VERIFIED' : 'UNVERIFIED'}
            style={{ padding: '1.5rem 1.75rem' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
                Deterministic Output
              </span>
              <span
                className="font-ui inline-block px-3 py-1"
                style={{
                  color: criCompliance?.deterministic ? 'var(--emerald-accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${criCompliance?.deterministic ? 'rgba(107, 143, 113, 0.35)' : 'var(--hairline-subtle)'}`,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {criCompliance?.deterministic ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              Identical inputs always produce identical algorithmic outputs. No stochastic or
              time-dependent parameters are present in the computation chain.
            </p>
          </div>

          {/* Structural isomorphism */}
          <div
            className="plate"
            data-coord-tl="CRI.ISO"
            data-coord-br={criCompliance?.isomorphism ? 'VERIFIED' : 'UNVERIFIED'}
            style={{ padding: '1.5rem 1.75rem' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
                Structural Isomorphism
              </span>
              <span
                className="font-ui inline-block px-3 py-1"
                style={{
                  color: criCompliance?.isomorphism ? 'var(--emerald-accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${criCompliance?.isomorphism ? 'rgba(107, 143, 113, 0.35)' : 'var(--hairline-subtle)'}`,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {criCompliance?.isomorphism ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              The lesson-to-edge mapping preserves the algebraic structure of the Z/12Z ring.
              Twenty-four lessons map bijectively to twelve edges with perfect symmetry.
            </p>
          </div>

          {/* Z/12Z ring verified */}
          <div
            className="plate"
            data-coord-tl="CRI.Z12"
            data-coord-br={criCompliance?.z12z ? 'VERIFIED' : 'UNVERIFIED'}
            style={{ padding: '1.5rem 1.75rem' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
                Z/12Z Ring Integrity
              </span>
              <span
                className="font-ui inline-block px-3 py-1"
                style={{
                  color: criCompliance?.z12z ? 'var(--emerald-accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${criCompliance?.z12z ? 'rgba(107, 143, 113, 0.35)' : 'var(--hairline-subtle)'}`,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {criCompliance?.z12z ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              The cyclic group of order twelve is closed under all five operators. No ring
              position is orphaned or duplicated in the forward or inverted pass.
            </p>
          </div>

          {/* 4×3 decomposition */}
          <div
            className="plate"
            data-coord-tl="CRI.D43"
            data-coord-br={criCompliance?.decomp ? 'VERIFIED' : 'UNVERIFIED'}
            style={{ padding: '1.5rem 1.75rem' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
                4×3 Decomposition
              </span>
              <span
                className="font-ui inline-block px-3 py-1"
                style={{
                  color: criCompliance?.decomp ? 'var(--emerald-accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${criCompliance?.decomp ? 'rgba(107, 143, 113, 0.35)' : 'var(--hairline-subtle)'}`,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {criCompliance?.decomp ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              The twelve edges decompose cleanly into four groups of three: base, rising,
              and ridge. Each group maintains internal harmonic consistency at 51.84°.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ REPRODUCIBLE CONSTANTS ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="7" cy="7" r="3" fill="none" stroke="var(--emerald-accent)" strokeWidth="0.5" />
            <circle cx="7" cy="7" r="1" fill="var(--accent)" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Reproducible Constants
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Four invariant constants govern every computation within the machine. These values
          are embedded in the algorithmic pipeline and reproduced identically across all cycles.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="plate text-center" data-coord-tl="CON.PHI" data-coord-br="CONST">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Phi (φ)</div>
            <span
              className="readout font-semibold block"
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.5rem', color: 'var(--accent)' }}
            >
              {meta.phi.toFixed(6)}
            </span>
            <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Golden Ratio</span>
          </div>

          <div className="plate text-center" data-coord-tl="CON.PI" data-coord-br="CONST">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Pi (π)</div>
            <span
              className="readout font-semibold block"
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.5rem', color: 'var(--emerald-accent)' }}
            >
              {meta.pi.toFixed(6)}
            </span>
            <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Circle Constant</span>
          </div>

          <div className="plate text-center" data-coord-tl="CON.SLP" data-coord-br="CONST">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Slope Angle</div>
            <span
              className="readout font-semibold block"
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.5rem', color: 'var(--text)' }}
            >
              {meta.harmonic_angle_deg}°
            </span>
            <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>Harmonic Angle</span>
          </div>

          <div className="plate text-center" data-coord-tl="CON.HRM" data-coord-br="CONST">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Harmonic Mult.</div>
            <span
              className="readout font-semibold block"
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '1.5rem', color: 'var(--coordinate)' }}
            >
              {meta.harmonic_multiplier_622_08}
            </span>
            <span className="readout-dim block mt-1" style={{ fontSize: '9px' }}>12 × 51.84°</span>
          </div>
        </div>
      </section>

      {/* ═══ ALGORITHM SAMPLE REGISTRY ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="6" width="12" height="2" fill="var(--accent)" opacity="0.3" rx="1" />
            <rect x="1" y="3" width="8" height="2" fill="var(--accent)" opacity="0.5" rx="1" />
            <rect x="1" y="9" width="10" height="2" fill="var(--accent)" opacity="0.2" rx="1" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Algorithm Registry
          </h3>
        </div>
        <p className="font-body mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          A sample of the algorithm identifiers generated by the five-operator cipher engine.
          Each token encodes a unique combination of ring position, aspect index, and geometric operator.
        </p>

        <div
          className="plate"
          data-coord-tl="REG.001"
          data-coord-br={`${crypto.algorithm_sample.length} SAMPLES // ${crypto.algorithm_matrix_size} TOTAL`}
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--hairline-strong) var(--bg)' }}
          >
            {crypto.algorithm_sample.map((algo, i) => {
              const parts = algo.split('-');
              const operator = parts[3] || '';
              const opIdx = OPERATORS.findIndex((op) => op.id === operator);
              const t = opIdx / 4;
              const accentR = 201, accentG = 168, accentB = 76;
              const emeraldR = 107, emeraldG = 143, emeraldB = 113;
              const r = Math.round(accentR + (emeraldR - accentR) * t);
              const g = Math.round(accentG + (emeraldG - accentG) * t);
              const b = Math.round(accentB + (emeraldB - accentB) * t);
              return (
                <div
                  key={i}
                  className="py-2 px-2.5 text-center rounded-sm"
                  style={{
                    border: '1px solid var(--hairline-subtle)',
                    backgroundColor: 'var(--bg)',
                  }}
                >
                  <span
                    className="font-mono block"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      color: `rgb(${r}, ${g}, ${b})`,
                    }}
                  >
                    {algo}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
              Showing {crypto.algorithm_sample.length} of {crypto.algorithm_matrix_size} total algorithm identifiers
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
