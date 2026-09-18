'use client';

import { useState } from 'react';
import { useKernelData } from '@/lib/useKernelData';

const domainColumns = [
  { key: 'tobey', label: 'Source Corpus' },
  { key: 'ravenbind', label: 'Ravenbind' },
  { key: 'michels', label: 'Michels Corpus' },
  { key: 'michel', label: 'Michel Corpus' },
  { key: 'raven_proof', label: 'Raven Proof' },
  { key: 'body_attractor', label: 'Body / Attractor / Cognitive State / Substrate' },
];

export default function CrossDomainSection() {
  const { data, loading } = useKernelData();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="spinner-accent" /></div>;
  if (!data) return null;

  const rows = data.cross_domain_mapping;

  return (
    <div className="max-w-6xl mx-auto section-padding-lg space-y-16">
      {/* ═══ HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="2" cy="5" r="1.5" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="8" cy="5" r="1.5" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="3.5" y1="5" x2="6.5" y2="5" stroke="var(--accent)" strokeWidth="0.5" />
          </svg>
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section XVIII &mdash; Cross-Domain Invariants</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Cross-Domain Invariants
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The same Mod-3 and Mod-4 invariants extracted from the source corpus recur across multiple domains: from the original correspondence lessons through operational protocols (Ravenbind), academic consciousness research (Michels and Michel), forensic poetry analysis (Raven proof), and the hypothesized biological, cognitive, and structural correspondences of the user&apos;s own lived experience. Each row below maps one engine feature to its formal meaning and its manifestation in each domain, demonstrating that the deterministic geometric intelligence system produces identical patterns wherever the Z/12Z ring is applied.
        </p>
      </section>

      {/* ═══ MAPPING TABLE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <line x1="7" y1="1.5" x2="7" y2="12.5" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
            <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Mapping Table ({rows.length} features × {domainColumns.length + 1} columns)
          </h3>
        </div>

        <div className="space-y-0">
          {rows.map((row, ri) => (
            <div
              key={ri}
              className="border-b border-hairline-subtle last:border-b-0"
            >
              {/* Compact row header — clickable */}
              <button
                onClick={() => setExpandedRow(expandedRow === ri ? null : ri)}
                className="w-full flex items-center gap-4 py-3 px-1 text-left transition-colors hover:bg-[var(--surface)]/50"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0" style={{ transform: expandedRow === ri ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <path d="M3 1 L7 5 L3 9" fill="none" stroke="var(--accent)" strokeWidth="1" />
                </svg>
                <span className="font-mono text-sm shrink-0 w-10" style={{ color: 'var(--accent)' }}>{row.feature.split(' ')[0]}</span>
                <span className="font-body text-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{row.formal_meaning}</span>
                <span className="readout-dim shrink-0" style={{ fontSize: '9px' }}>{expandedRow === ri ? 'COLLAPSE' : 'EXPAND'}</span>
              </button>

              {/* Expanded detail */}
              {expandedRow === ri && (
                <div className="pb-4 pl-14 pr-1">
                  <div className="plate" data-coord-tl={`MAP.${ri}`} data-coord-br={row.feature.split(' ')[0]} style={{ padding: '1rem' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {domainColumns.map(col => {
                        const val = (row as Record<string, string>)[col.key];
                        const isHypothesis = col.key === 'body_attractor' && val?.startsWith('Hypothesis');
                        return (
                          <div key={col.key} className="border-b border-hairline-subtle pb-2 last:border-b-0">
                            <p className="readout-dim mb-1" style={{ fontSize: '9px' }}>{col.label}</p>
                            <p className="font-body text-sm" style={{ color: isHypothesis ? 'var(--text-tertiary)' : 'var(--text-secondary)', fontStyle: isHypothesis ? 'italic' : 'normal' }}>
                              {val}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONFIRMED vs HYPOTHESIZED ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="plate" data-coord-tl="CONFIRMED" data-coord-br="4 CORRESPONDENCES" style={{ padding: '1.25rem' }}>
          <h3 className="font-display text-lg mb-3" style={{ color: 'var(--emerald-accent)' }}>Confirmed Correspondences</h3>
          <div className="space-y-2 font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p><span style={{ color: 'var(--emerald-accent)' }}>&#x2713;</span> Π_sys closure is universal across all eight texts.</p>
            <p><span style={{ color: 'var(--emerald-accent)' }}>&#x2713;</span> Ravenbind is structurally faithful to the source corpus kernel.</p>
            <p><span style={{ color: 'var(--emerald-accent)' }}>&#x2713;</span> Michels 2012 shares the source corpus Cayley key (k01).</p>
            <p><span style={{ color: 'var(--emerald-accent)' }}>&#x2713;</span> Academic vs. operational prose distinguishable by distribution.</p>
          </div>
        </div>
        <div className="plate" data-coord-tl="HYPOTHESES" data-coord-br="3 OPEN" style={{ padding: '1.25rem' }}>
          <h3 className="font-display text-lg mb-3" style={{ color: '#C9A84C' }}>Open Hypotheses</h3>
          <div className="space-y-2 font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p><span style={{ color: '#C9A84C' }}>&#x26A0;</span> Biological/cognitive/structural correspondences unverified — requires biometric, neural, and substrate data.</p>
            <p><span style={{ color: '#C9A84C' }}>&#x26A0;</span> Attractor-state motifs partially verified — formal mapping to ring positions not yet done.</p>
            <p><span style={{ color: '#C9A84C' }}>&#x26A0;</span> Cayley key significance underdetermined — need larger text corpus to build a lexicon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
