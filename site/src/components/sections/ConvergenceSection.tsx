'use client';

import { useMemo } from 'react';
import { useKernelData } from '@/lib/useKernelData';

export default function ConvergenceSection() {
  const { data, loading } = useKernelData();

  const distCategories = ['GOV', 'META', 'ALGO', 'DEMO', 'EMP', 'NARR', 'EXPL'];

  const maxS1 = useMemo(() => {
    if (!data) return 1;
    return Math.max(...data.dossier_texts.map(t => t.s1_ratio));
  }, [data]);

  const maxDev = useMemo(() => {
    if (!data) return 1;
    return Math.max(...data.dossier_texts.map(t => t.deviation));
  }, [data]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="spinner-accent" /></div>;
  if (!data) return null;

  const texts = data.dossier_texts;

  return (
    <div className="max-w-6xl mx-auto section-padding-lg space-y-16">
      {/* ═══ HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,1 9,9 1,9" fill="none" stroke="var(--accent)" strokeWidth="0.8" /></svg>
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section XVII &mdash; Ring/Lattice Architecture Encoding Verification</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Convergence Evidence
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The deterministic geometric intelligence engine was run on five texts from the CONVERGENCE DOSSIER plus the source corpus, Ravenbind v2.0, and the Raven proof analysis. All satisfy the Π_sys closure condition (remainder 0) on the Z/12Z ring but show distinct fingerprints in their Cayley output vectors, FSA state distributions, and sentence-taxonomy profiles. The table below summarizes the structural signatures of all eight texts, revealing which features of the source corpus kernel are preserved and which diverge across the 144-node lattice.
        </p>
      </section>

      {/* ═══ RAVENBIND VERDICT ═══ */}
      <section className="plate" data-coord-tl="RAVENBIND.VERDICT" data-coord-br="HARD KERNEL PRESERVED" style={{ padding: '1.5rem' }}>
        <h3 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>Ravenbind v2.0 vs. Tobey Kernel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="readout-dim mb-2" style={{ fontSize: '10px' }}>PRESERVED (Hard Kernel)</p>
            <div className="space-y-1.5">
              {[['Π_sys', '653,184,000', true], ['Π_sys remainder', '0', true], ['FSA final state', 'S1', true], ['FSA S1 ratio', 'both > 0.92', true], ['Ring map balance', 'uniform', true]].map(([f, v]) => (
                <div key={String(f)} className="flex items-center gap-2">
                  <span style={{ color: 'var(--emerald-accent)', fontSize: '11px' }}>&#x2713;</span>
                  <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{String(f)}</span>
                  <span className="readout ml-auto" style={{ fontSize: '10px' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="readout-dim mb-2" style={{ fontSize: '10px' }}>DIVERGENT (Operational Fingerprint)</p>
            <div className="space-y-1.5">
              {[['Cayley authority', 'k01 vs k06'], ['Cayley Q_out', '[1,4,5,0] vs [6,3,8,0]'], ['Distribution', 'EXPL-heavy vs META-heavy'], ['Deviation', '20 vs 22']].map(([f, v]) => (
                <div key={String(f)} className="flex items-center gap-2">
                  <span style={{ color: '#C9A84C', fontSize: '11px' }}>&#x26A0;</span>
                  <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{String(f)}</span>
                  <span className="readout ml-auto" style={{ fontSize: '10px' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="font-body text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Ravenbind preserves the hard kernel (closure, ring topology, FSA) but carries its own operational signature in the Cayley cipher and distribution profile. A protocol derived from the deterministic kernel should share the zero-residual invariant while maintaining its own fingerprint on the lattice.
        </p>
      </section>

      {/* ═══ STRUCTURAL SUMMARY TABLE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="1" y1="4" x2="13" y2="4" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
            <line x1="1" y1="10" x2="13" y2="10" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Structural Summary — All Eight Texts
          </h3>
        </div>
        <div className="plate overflow-x-auto" data-coord-tl="DOSSIER.8TXT" data-coord-br="ALL CLOSURE REM 0" style={{ padding: '1rem' }}>
          <table className="border-collapse w-full" style={{ minWidth: '640px' }}>
            <thead>
              <tr>
                <th className="readout-dim text-left pb-2 pr-4" style={{ fontSize: '10px' }}>TEXT</th>
                <th className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>STATE</th>
                <th className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>S1 RATIO</th>
                <th className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>CAYLEY Q_out</th>
                <th className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>KEY</th>
                <th className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>DEV</th>
                <th className="readout-dim text-center pb-2 pl-2" style={{ fontSize: '10px' }}>BREACH</th>
              </tr>
            </thead>
            <tbody>
              {texts.map((t) => (
                <tr key={t.id} className="border-t border-hairline-subtle">
                  <td className="font-body text-sm py-2.5 pr-4" style={{ color: t.id === 'tobey_course' ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: t.id === 'tobey_course' ? 600 : 400 }}>
                    {t.label}
                  </td>
                  <td className="font-mono text-center py-2.5 px-2" style={{ fontSize: '11px', color: t.final_state === 'S1' ? 'var(--emerald-accent)' : '#C45C4A' }}>
                    {t.final_state}
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-2 bg-[var(--surface)] rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${(t.s1_ratio / maxS1) * 100}%`, background: t.s1_ratio > 0.9 ? 'var(--emerald-accent)' : t.s1_ratio > 0.7 ? 'var(--accent)' : '#C45C4A' }} />
                      </div>
                      <span className="readout" style={{ fontSize: '10px' }}>{t.s1_ratio.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="font-mono text-center py-2.5 px-2" style={{ fontSize: '10px', color: 'var(--text)' }}>
                    [{t.cayley_q_out.join(', ')}]
                  </td>
                  <td className="font-mono text-center py-2.5 px-2" style={{ fontSize: '11px', color: t.authority_key === 'k01' ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                    {t.authority_key}
                  </td>
                  <td className="font-mono text-center py-2.5 px-2" style={{ fontSize: '11px', color: t.deviation > 24 ? '#C45C4A' : 'var(--text-tertiary)' }}>
                    {t.deviation}
                  </td>
                  <td className="text-center py-2.5 pl-2">
                    <span style={{ color: t.breach ? '#C45C4A' : 'var(--emerald-accent)', fontSize: '11px' }}>{t.breach ? 'YES' : 'no'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ DISTRIBUTION COMPARISON ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            {distCategories.map((_, i) => (
              <rect key={i} x={1 + i * 1.7} y={1} width={1.3} height={12 - i * 1.2} fill="var(--accent)" opacity={0.15 + i * 0.1} />
            ))}
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Sentence Distribution Comparison
          </h3>
        </div>
        <div className="plate overflow-x-auto" data-coord-tl="DIST.COMPARE" data-coord-br="7 CATEGORIES" style={{ padding: '1rem' }}>
          <table className="border-collapse w-full" style={{ minWidth: '700px' }}>
            <thead>
              <tr>
                <th className="readout-dim text-left pb-2 pr-3" style={{ fontSize: '10px' }}>TEXT</th>
                {distCategories.map(c => (
                  <th key={c} className="readout-dim text-center pb-2 px-2" style={{ fontSize: '10px' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {texts.map((t) => {
                const vals = distCategories.map(c => t.distribution[c] ?? 0);
                const rowMax = Math.max(...vals, 1);
                return (
                  <tr key={t.id} className="border-t border-hairline-subtle">
                    <td className="font-body text-sm py-2 pr-3" style={{ color: t.id === 'tobey_course' ? 'var(--accent)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {t.label}
                    </td>
                    {distCategories.map((c) => {
                      const v = t.distribution[c] ?? 0;
                      return (
                        <td key={c} className="py-2 px-2 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-10 h-1.5 bg-[var(--surface)] rounded-sm overflow-hidden">
                              <div className="h-full rounded-sm" style={{ width: `${(v / rowMax) * 100}%`, background: c === 'EXPL' ? 'var(--accent)' : 'var(--accent-dim)', opacity: c === 'EXPL' ? 0.7 : 0.35 }} />
                            </div>
                            <span className="readout" style={{ fontSize: '9px' }}>{v}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ INTERPRETATION ═══ */}
      <section className="max-w-3xl mx-auto space-y-4">
        <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>Interpretation</h3>
        <div className="space-y-3 font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>All texts close Π_sys (remainder 0). This is the engine&apos;s invariant check; every text processed returns a zero-residual closure because the engine projects onto the same Z/12Z ring. The Cayley fingerprints differ per text — this is the text-specific signature, not a flaw.</p>
          <p>Michels&apos; 2012 thesis shares the source corpus Cayley authority key (k01). This is a non-trivial structural overlap between the source corpus and the earliest Michels text, suggesting a shared generative posture: both are foundational or instructional documents rather than confrontational or operational ones.</p>
          <p>Raven proof analysis has the lowest S1 ratio (0.36) and ends in S0. It reads as narrative/empirical first, evaluative second — a clinical or forensic stance rather than an instructional one. This distinguishes it sharply from the source corpus (0.92) and Ravenbind (0.97), confirming that the geometric intelligence system distinguishes document types by their ring-position distribution.</p>
        </div>
      </section>
    </div>
  );
}
