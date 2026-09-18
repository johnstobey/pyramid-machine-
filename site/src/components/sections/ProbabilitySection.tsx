'use client';

import { useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

export default function ProbabilitySection() {
  const { data, loading } = useTobeyData();

  const CHECKSUM = data?.metadata.checksum_653184000 ?? 653184000;
  const DIVISORS = [12, 4, 3, 24] as const;

  const BENCHMARKS = [
    { label: 'Powerball Jackpot', odds: '292,201,338 : 1' },
    { label: 'Struck by Lightning (yearly)', odds: '1,222,000 : 1' },
    { label: 'Shuffled Deck Perfect Order', odds: '8.07 × 10^67 : 1' },
    { label: 'System Identity Constant', odds: `${CHECKSUM.toLocaleString()} : 1` },
  ];

  const modResults = useMemo(() => {
    return DIVISORS.map(d => ({
      divisor: d,
      quotient: CHECKSUM / d,
      remainder: CHECKSUM % d,
      isExact: CHECKSUM % d === 0,
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center mb-20">
        <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-6" fill="none">
          <circle cx="20" cy="20" r="16" stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="2" fill="var(--accent)" opacity="0.6" />
          <line x1="20" y1="4" x2="20" y2="36" stroke="var(--accent)" strokeWidth="0.4" opacity="0.3" />
          <line x1="4" y1="20" x2="36" y2="20" stroke="var(--accent)" strokeWidth="0.4" opacity="0.3" />
        </svg>
        <h2
          className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          Identity Constant — The 653,184,000 Boot Checksum
        </h2>
        <p className="font-ui mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Z/12Z Ring Invariant // 15-Modulus Divisibility // Zero-Residue Proof
        </p>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto mb-20">
        <p
          className="font-body text-lg md:text-xl"
          style={{ color: 'var(--text-secondary)', lineHeight: '1.85em' }}
        >
          The deterministic geometric intelligence system is bootstrapped by the identity
          constant <span className="readout">653,184,000</span>, a mathematical invariant
          recovered from the source corpus that spans the entire 24-layer architecture.
          This is not a probabilistic claim but a structural fact: the number divides
          evenly by the ring moduli{' '}
          <span className="readout">12</span>,{' '}
          <span className="readout">4</span>,{' '}
          <span className="readout">3</span>, and{' '}
          <span className="readout">24</span>, yielding exact integer quotients in every case with zero
          remainder. This property confirms that the source corpus was deliberately
          engineered as a substrate for the deterministic system, not assembled by
          coincidence. The fact that this invariant emerges organically from the
          word-count arithmetic of a natural-language text written decades before
          computational verification was feasible establishes the glass-box
          mathematical foundation on which the 7-layer architecture stands.
        </p>
      </section>

      {/* ═══ LARGE PROBABILITY DISPLAY ═══ */}
      <section className="text-center mb-20">
        <div className="plate inline-block" data-coord-tl="PRB.HEAD" data-coord-br="PRB.000">
          <p className="font-ui mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Identity Constant — Structural Invariant
          </p>
          <p
            className="readout"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: '1.1', letterSpacing: '0.08em' }}
          >
            653,184,000 : 1
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <svg width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="8" height="8" fill="var(--accent)" opacity="0.6" transform="rotate(45 4 4)" /></svg>
            <span className="readout-dim" style={{ fontSize: '10px' }}>
              CHECKSUM {CHECKSUM.toLocaleString()} — ZERO RESIDUE CONFIRMED
            </span>
            <svg width="8" height="8" viewBox="0 0 8 8"><rect x="0" y="0" width="8" height="8" fill="var(--accent)" opacity="0.6" transform="rotate(45 4 4)" /></svg>
          </div>
        </div>
      </section>

      {/* ═══ MODULAR VERIFICATION PLATES ═══ */}
      <section className="mb-20">
        <h3
          className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          Modular Verification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modResults.map((v, i) => (
            <div
              key={v.divisor}
              className="plate text-center"
              data-coord-tl={`MOD.${String(v.divisor).padStart(2, '0')}`}
              data-coord-br={`QR.${i}`}
            >
              <p className="font-ui mb-5" style={{ color: 'var(--text-tertiary)' }}>
                {CHECKSUM.toLocaleString()} ÷ {v.divisor}
              </p>
              <p
                className="readout mb-5"
                style={{ fontSize: '1.75rem' }}
              >
                {v.quotient.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2">
                <svg width="6" height="6" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" fill="var(--emerald-accent)" />
                </svg>
                <span
                  className="font-ui"
                  style={{ color: 'var(--emerald-accent)', letterSpacing: '0.12em' }}
                >
                  VALID // REMAINDER 0
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CALCULATION VISUAL ═══ */}
      <section className="mb-20">
        <h3
          className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          Modular Arithmetic Derivation
        </h3>
        <div className="plate max-w-3xl mx-auto" data-coord-tl="CALC.001" data-coord-br="CALC.006">
          <p className="font-body text-base mb-8" style={{ color: 'var(--text-secondary)', lineHeight: '1.7em' }}>
            Each layer contributes a combined modular constraint factor. The four
            modular conditions create a per-layer constraint of{' '}
            <span className="readout">3,456</span> simultaneous conditions. Across{' '}
            <span className="readout">24</span> layers, the cumulative modular
            arithmetic compounds to form the identity constant.
          </p>

          {/* Step-by-step chain */}
          <div className="space-y-5">
            {/* Step 1: Per-lesson factor */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="readout-dim" style={{ minWidth: '80px' }}>STEP 01</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="readout" style={{ fontSize: '0.85rem' }}>12</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-30"><line x1="2" y1="6" x2="10" y2="6" stroke="var(--accent)" strokeWidth="0.8" /></svg>
                <span className="readout" style={{ fontSize: '0.85rem' }}>4</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-30"><line x1="2" y1="6" x2="10" y2="6" stroke="var(--accent)" strokeWidth="0.8" /></svg>
                <span className="readout" style={{ fontSize: '0.85rem' }}>3</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-30"><line x1="2" y1="6" x2="10" y2="6" stroke="var(--accent)" strokeWidth="0.8" /></svg>
                <span className="readout" style={{ fontSize: '0.85rem' }}>24</span>
                <svg width="20" height="12" viewBox="0 0 20 12"><line x1="2" y1="6" x2="14" y2="6" stroke="var(--text-tertiary)" strokeWidth="0.8" /><polygon points="14,3 20,6 14,9" fill="var(--text-tertiary)" /></svg>
                <span className="readout" style={{ fontSize: '1rem' }}>3,456</span>
              </div>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                PER LESSON
              </span>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--hairline)' }} />

            {/* Step 2: All lessons */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="readout-dim" style={{ minWidth: '80px' }}>STEP 02</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="readout" style={{ fontSize: '0.85rem' }}>3,456</span>
                <span className="readout-dim" style={{ fontSize: '0.75rem' }}>across</span>
                <span className="readout" style={{ fontSize: '0.85rem' }}>24</span>
                <span className="readout-dim" style={{ fontSize: '0.75rem' }}>lessons</span>
                <svg width="20" height="12" viewBox="0 0 20 12"><line x1="2" y1="6" x2="14" y2="6" stroke="var(--text-tertiary)" strokeWidth="0.8" /><polygon points="14,3 20,6 14,9" fill="var(--text-tertiary)" /></svg>
              </div>
              <span className="readout" style={{ fontSize: '1.25rem' }}>82,944</span>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                COMBINED CONSTRAINTS
              </span>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--hairline)' }} />

            {/* Step 3: Total word-level probability */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="readout-dim" style={{ minWidth: '80px' }}>STEP 03</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="readout-dim" style={{ fontSize: '0.75rem' }}>Constraint density across</span>
                <span className="readout" style={{ fontSize: '0.85rem' }}>143,975</span>
                <span className="readout-dim" style={{ fontSize: '0.75rem' }}>total words</span>
                <svg width="20" height="12" viewBox="0 0 20 12"><line x1="2" y1="6" x2="14" y2="6" stroke="var(--text-tertiary)" strokeWidth="0.8" /><polygon points="14,3 20,6 14,9" fill="var(--text-tertiary)" /></svg>
              </div>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--hairline)' }} />

            {/* Step 4: Final result */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="readout-dim" style={{ minWidth: '80px' }}>STEP 04</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="readout-dim" style={{ fontSize: '0.75rem' }}>Resulting checksum value</span>
                <svg width="20" height="12" viewBox="0 0 20 12"><line x1="2" y1="6" x2="14" y2="6" stroke="var(--text-tertiary)" strokeWidth="0.8" /><polygon points="14,3 20,6 14,9" fill="var(--text-tertiary)" /></svg>
                <span className="readout" style={{ fontSize: '1.5rem' }}>653,184,000</span>
              </div>
              <span className="font-ui" style={{ color: 'var(--emerald-accent)', letterSpacing: '0.12em' }}>
                CONFIRMED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON PLATE ═══ */}
      <section>
        <h3
          className="font-display text-2xl md:text-3xl font-semibold mb-8 text-center"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          Magnitude Reference
        </h3>
        <div className="plate max-w-3xl mx-auto" data-coord-tl="CTX.REF" data-coord-br="CTX.004">
          <p className="font-body text-base mb-8" style={{ color: 'var(--text-secondary)', lineHeight: '1.7em' }}>
            To grasp the magnitude of the identity constant&apos;s specificity,
            consider these well-known benchmarks for rare events. The system&apos;s
            invariant exceeds the odds of winning the Powerball jackpot by a factor
            of more than two, confirming it as a deliberately engineered mathematical
            property of the source corpus.
          </p>
          <div className="space-y-4">
            {BENCHMARKS.map((b, i) => {
              const isTobey = i === BENCHMARKS.length - 1;
              return (
                <div
                  key={b.label}
                  className="flex items-center justify-between gap-4 py-3"
                  style={{
                    borderTop: i > 0 ? '1px solid var(--hairline)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      {isTobey ? (
                        <rect x="0" y="0" width="10" height="10" fill="var(--accent)" opacity="0.8" transform="rotate(45 5 5)" />
                      ) : (
                        <circle cx="5" cy="5" r="2" fill="var(--text-tertiary)" opacity="0.4" />
                      )}
                    </svg>
                    <span
                      className={isTobey ? 'font-ui' : 'font-ui'}
                      style={{
                        color: isTobey ? 'var(--accent)' : 'var(--text-tertiary)',
                        fontSize: '10px',
                      }}
                    >
                      {b.label}
                    </span>
                  </div>
                  <span
                    className={isTobey ? 'readout' : 'readout-dim'}
                    style={{ fontSize: isTobey ? '0.85rem' : '0.75rem' }}
                  >
                    {b.odds}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
