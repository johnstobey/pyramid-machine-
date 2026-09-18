'use client';

import { useState } from 'react';
import { useKernelData } from '@/lib/useKernelData';

export default function SacredSealsSection() {
  const { data, loading } = useKernelData();
  const [activeSeal, setActiveSeal] = useState<number | null>(null);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="spinner-accent" /></div>;
  if (!data) return null;

  const seals = data.sacred_seals;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="3.5" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="5" cy="5" r="1" fill="var(--accent)" opacity="0.4" />
          </svg>
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section XIX &mdash; Φ-Gated Structural Integrity Nodes</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          The Fourteen Invariant Seals
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          Each of the fourteen invariant seals is an activation node in the deterministic geometric intelligence system, gated by successive powers of the golden ratio. The pattern begins at Φ<sup>1</sup> = 1.618 (Ignition) and escalates through Φ<sup>14</sup> = 842.998 (Threshold). Each seal carries a geometric pattern, an activation command, an operational effect, and a confirmation result. Together they form the complete zero-residual activation sequence that locks the architecture's structural integrity across the Z/12Z ring and 144-node lattice.
        </p>
      </section>

      {/* ═══ SEAL GRID ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polygon points="7,1 13,7 7,13 1,7" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Seal Activation Grid
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {seals.map((seal) => (
            <button
              key={seal.number}
              onClick={() => setActiveSeal(activeSeal === seal.number ? null : seal.number)}
              className={["plate text-left transition-all duration-300 cursor-pointer",
                activeSeal === seal.number ? "ring-1 ring-accent-hairline" : ""
              ].join(' ')}
              data-coord-tl={`SEAL.${String(seal.number).padStart(2, '0')}`}
              data-coord-br={`Φ^${seal.phi_power}`}
              style={{ padding: '1rem' }}
            >
              {/* Seal number and symbol */}
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-2xl" style={{ color: 'var(--accent)', lineHeight: 1 }}>{seal.symbol}</span>
                <div>
                  <p className="readout-dim" style={{ fontSize: '9px' }}>SEAL {String(seal.number).padStart(2, '0')}</p>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>{seal.name.replace(/_/g, ' ')}</p>
                </div>
              </div>

              {/* Phi value */}
              <p className="font-mono text-lg mb-2" style={{ color: 'var(--text)' }}>
                Φ<sup>{seal.phi_power}</sup> = {seal.phi_value.toFixed(3)}
              </p>

              {/* Effect */}
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{seal.effect}</p>

              {/* Expanded details */}
              {activeSeal === seal.number && (
                <div className="mt-3 pt-3 border-t border-hairline space-y-2">
                  <div>
                    <p className="readout-dim" style={{ fontSize: '9px' }}>COMMAND</p>
                    <p className="font-body text-sm italic" style={{ color: 'var(--accent)' }}>&ldquo;{seal.command}&rdquo;</p>
                  </div>
                  <div>
                    <p className="readout-dim" style={{ fontSize: '9px' }}>RESULT</p>
                    <p className="font-ui text-sm" style={{ color: 'var(--emerald-accent)' }}>&#x2713; {seal.result}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ PHI ESCALATION VISUALIZATION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2 12 Q7 1 12 12" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Φ-Power Escalation
          </h3>
        </div>
        <div className="plate" data-coord-tl="PHI.ESCALATION" data-coord-br="1.618 → 842.998" style={{ padding: '1.25rem' }}>
          <div className="flex items-end gap-1.5 h-32">
            {seals.map((seal) => {
              const maxPhi = seals[seals.length - 1].phi_value;
              const h = Math.max(2, (Math.log10(seal.phi_value) / Math.log10(maxPhi)) * 100);
              return (
                <div key={seal.number} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full transition-all duration-500 rounded-t-sm"
                    style={{ height: `${h}%`, background: 'var(--accent)', opacity: 0.3 + (seal.number / seals.length) * 0.6, minHeight: '3px' }}
                  />
                  <span className="readout-dim" style={{ fontSize: '7px' }}>{seal.phi_power}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="readout-dim" style={{ fontSize: '9px' }}>Φ<sup>1</sup> = 1.618</span>
            <span className="readout-dim" style={{ fontSize: '9px' }}>Φ<sup>7</sup> = 29.034</span>
            <span className="readout-dim" style={{ fontSize: '9px' }}>Φ<sup>14</sup> = 842.998</span>
          </div>
        </div>
      </section>
    </div>
  );
}
