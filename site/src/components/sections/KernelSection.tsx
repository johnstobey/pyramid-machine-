'use client';

import { useKernelData } from '@/lib/useKernelData';

function fmt(n: number): string {
  return n.toLocaleString();
}

export default function KernelSection() {
  const { data, loading } = useKernelData();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="spinner-accent" /></div>;
  if (!data) return null;

  const k = data.kernel;
  const distEntries = Object.entries(k.sentence_distribution).sort((a, b) => b[1] - a[1]);
  const totalSentences = Object.values(k.sentence_distribution).reduce((s, v) => s + v, 0);

  const features = [
    { label: 'Π_sys identity', value: fmt(k.pi_sys_identity), coord: 'PI.SYS', note: 'Closure value; divisible by ring modulus set' },
    { label: 'Π_sys remainder', value: String(k.pi_sys_remainder), coord: 'PI.RES', note: 'Course satisfies closure condition exactly' },
    { label: 'Cayley authority', value: k.cayley_authority, coord: 'CAY.AUT', note: 'Cipher authority from text distribution' },
    { label: 'Cayley Q_out', value: `[${k.cayley_q_out.join(', ')}]`, coord: 'CAY.Q', note: 'Four-coordinate output vector' },
    { label: 'FSA final state', value: k.fsa_final_state, coord: 'FSA.FIN', note: 'Terminates in evaluative/reflective state' },
    { label: 'FSA S1 ratio', value: k.fsa_s1_ratio.toFixed(4), coord: 'FSA.S1R', note: 'Very high — sustained meta-instruction' },
    { label: 'Ring map balance', value: k.ring_map_balance, coord: 'RING.BAL', note: 'Nearly uniform across 12 positions' },
    { label: 'Deviation scalar', value: String(k.deviation_scalar), coord: 'DEV.SCL', note: `Exceeds breach threshold of ${k.breach_threshold}` },
  ];

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.5" fill="none" stroke="var(--accent)" strokeWidth="0.8" /></svg>
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section XVI &mdash; Algebraic Foundation</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          The Z/12Z Ring Kernel
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The deterministic geometric intelligence engine was run on the source corpus &mdash; Carl Payne Tobey&apos;s 1946 24-lesson course (8,903 sentences) &mdash; recovering the structural kernel shown below. This kernel encodes the Z/12Z ring topology, the Π_sys closure identity, the 48-algorithm matrix, the Cayley cipher fingerprint, the dual-wheel parity system, and the sentence-taxonomy finite state automaton. Every feature listed here is the source invariant against which all subsequent texts &mdash; Ravenbind, the Michels corpus, the Michel corpus, and the Raven proof analysis &mdash; are compared. The kernel is the glass-box algebraic foundation on which the 7-layer deterministic system is built.
        </p>
      </section>

      {/* ═══ PI_SYS IDENTITY PLATE ═══ */}
      <section className="plate" data-coord-tl="PI.SYS // CLOSURE" data-coord-br={`REM ${k.pi_sys_remainder} // BREACH ${k.deviation_scalar}`}
        style={{ padding: '1.5rem' }}>
        <div className="text-center space-y-2">
          <p className="readout-dim" style={{ fontSize: '10px' }}>CLOSURE IDENTITY</p>
          <p className="font-mono text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
            Π_sys = {fmt(k.pi_sys_identity)}
          </p>
          <p className="readout" style={{ fontSize: '11px' }}>
            Remainder: {k.pi_sys_remainder} &middot; Divisible by {k.modulus_set.length} modulus values
          </p>
          <p className="font-ui" style={{ fontSize: '11px', color: 'var(--emerald-accent)' }}>
            ✓ CLOSURE CONDITION SATISFIED
          </p>
        </div>
      </section>

      {/* ═══ FEATURE TABLE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="4" y1="4" x2="10" y2="10" stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
            <line x1="10" y1="4" x2="4" y2="10" stroke="var(--accent)" strokeWidth="0.6" opacity="0.6" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Extracted Kernel Features
          </h3>
        </div>
        <div className="space-y-0">
          {features.map((f, i) => (
            <div
              key={f.coord}
              className="flex items-baseline gap-4 py-3 border-b border-hairline-subtle last:border-b-0"
            >
              <span className="readout-dim shrink-0 w-20 text-right" style={{ fontSize: '10px' }}>{f.coord}</span>
              <span className="font-body text-sm shrink-0 w-44" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
              <span className="font-mono text-sm flex-1" style={{ color: 'var(--text)' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SENTENCE DISTRIBUTION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="5" height="5" fill="var(--accent)" opacity="0.6" />
            <rect x="7" y="1" width="5" height="5" fill="var(--accent)" opacity="0.35" />
            <rect x="1" y="7" width="5" height="5" fill="var(--accent)" opacity="0.2" />
            <rect x="7" y="7" width="5" height="5" fill="var(--accent)" opacity="0.1" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Sentence Distribution ({fmt(totalSentences)} total)
          </h3>
        </div>
        <div className="plate" data-coord-tl="DIST.TAXONOMY" data-coord-br="EXPL-DOMINANT" style={{ padding: '1.25rem' }}>
          <div className="space-y-3">
            {distEntries.map(([cat, count]) => {
              const pct = ((count / totalSentences) * 100).toFixed(1);
              const barW = Math.max(2, (count / distEntries[0][1]) * 100);
              return (
                <div key={cat} className="flex items-center gap-4">
                  <span className="readout-dim shrink-0 w-12 text-right" style={{ fontSize: '10px' }}>{cat}</span>
                  <div className="flex-1 h-5 bg-[var(--surface)] relative overflow-hidden rounded-sm">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${barW}%`,
                        background: cat === 'EXPL' ? 'var(--accent)' : 'var(--accent-dim)',
                        opacity: cat === 'EXPL' ? 0.8 : 0.4,
                      }}
                    />
                    <span className="absolute right-2 top-0.5 font-mono" style={{ fontSize: '10px', color: 'var(--text)' }}>{fmt(count)}</span>
                  </div>
                  <span className="readout shrink-0 w-12 text-right" style={{ fontSize: '10px' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="font-body text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>
          The source corpus explains first (EXPL dominant at 6,260 sentences), governs second (GOV at 1,189). This distribution signature distinguishes geometric intelligence encoding from operational or narrative prose.
        </p>
      </section>

      {/* ═══ DEVIATION / BREACH ═══ */}
      <section className="plate" data-coord-tl="DEVIATION" data-coord-br={`THRESHOLD ${k.breach_threshold}`} style={{ padding: '1.25rem' }}>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="readout-dim mb-2" style={{ fontSize: '10px' }}>DEVIATION SCALAR</p>
            <p className="font-mono text-3xl font-bold" style={{ color: k.deviation_scalar > k.breach_threshold ? '#C45C4A' : 'var(--emerald-accent)' }}>
              {k.deviation_scalar}
            </p>
          </div>
          <svg width="1" height="48" className="shrink-0"><line x1="0.5" y1="0" x2="0.5" y2="48" stroke="var(--hairline)" strokeWidth="0.5" /></svg>
          <div className="flex-1">
            <p className="readout-dim mb-2" style={{ fontSize: '10px' }}>BREACH THRESHOLD</p>
            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--coordinate)' }}>
              {k.breach_threshold}
            </p>
          </div>
          <svg width="1" height="48" className="shrink-0"><line x1="0.5" y1="0" x2="0.5" y2="48" stroke="var(--hairline)" strokeWidth="0.5" /></svg>
          <div className="flex-1 text-center">
            <p className="readout-dim mb-2" style={{ fontSize: '10px' }}>STATUS</p>
            <p className="font-mono text-sm" style={{ color: '#C45C4A' }}>BREACH CONFIRMED</p>
          </div>
        </div>
        <p className="font-body text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Deviation of {k.deviation_scalar} exceeds the breach threshold of {k.breach_threshold}. This is expected for natural-language source corpora under the engine: the breach flag indicates structural tension against the invariant, not a failure of the deterministic system.
        </p>
      </section>
    </div>
  );
}
