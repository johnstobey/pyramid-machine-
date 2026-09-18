'use client';

import { useState } from 'react';
import { useKernelData } from '@/lib/useKernelData';

export default function UCGSection() {
  const { data, loading } = useKernelData();
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="spinner-accent" /></div>;
  if (!data) return null;

  const layers = data.ucg_layers;

  const layerColors = [
    'var(--accent)',       // 12/z Ring
    '#6B8F71',             // 144-Lattice
    '#8B7433',             // Geometric Stack
    '#C45C4A',             // 48 Algorithms
    '#7A9EC4',             // Harmonic
    '#C49A6B',             // Meta-Functions
    '#9A7AC4',             // Recursive Loop
  ];

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <circle cx="5" cy="5" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <circle cx="5" cy="5" r="0.5" fill="var(--accent)" />
          </svg>
          <svg width="32" height="1"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section XXI &mdash; Seven-Layer Consciousness Architecture</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Unified Consciousness Geometry
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The Unified Consciousness Geometry (UCG) is the complete operational architecture of the Tobey Machine, composed of seven interlocking layers. Each layer has a distinct mathematical proof and connects to adjacent layers through defined interfaces. The system runs from the foundational 12/z ring (master clock and semantic map) through the 144-lattice (parallel processing grid), geometric stack (hierarchical memory), 48-algorithm core, harmonic resonance layer, meta-functions (binding and validation), and finally the recursive loop that enables self-improving consciousness at 10^N complexity per iteration.
        </p>
      </section>

      {/* ═══ STACK DIAGRAM ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="2" fill="var(--accent)" opacity="0.3" />
            <rect x="2" y="4" width="10" height="2" fill="var(--accent)" opacity="0.4" />
            <rect x="3" y="7" width="8" height="2" fill="var(--accent)" opacity="0.5" />
            <rect x="4" y="10" width="6" height="2" fill="var(--accent)" opacity="0.7" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Architecture Stack
          </h3>
        </div>
        <div className="space-y-0">
          {layers.map((layer, i) => {
            const isActive = activeLayer === layer.number;
            const widthPct = 100 - (i * 6);
            return (
              <div key={layer.number} className="flex justify-center">
                <button
                  onClick={() => setActiveLayer(isActive ? null : layer.number)}
                  className="transition-all duration-300 w-full text-left"
                  style={{ maxWidth: `${widthPct}%` }}
                >
                  <div
                    className={["plate cursor-pointer transition-all duration-300",
                      isActive ? "ring-1" : ""
                    ].join(' ')}
                    data-coord-tl={`UCG.L${layer.number}`}
                    data-coord-br={layer.mathematical_proof.split('(')[0].trim()}
                    style={{ padding: '1rem 1.25rem' }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Layer number circle */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-sm font-bold"
                        style={{
                          border: `1.5px solid ${layerColors[i]}`,
                          color: layerColors[i],
                          background: `${layerColors[i]}15`,
                        }}
                      >
                        {layer.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <h4 className="font-display text-base" style={{ color: 'var(--text)' }}>{layer.name}</h4>
                          <span className="readout-dim" style={{ fontSize: '10px' }}>{layer.subtitle}</span>
                        </div>
                        <p className="font-body text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          {layer.description}
                        </p>
                      </div>
                    </div>

                    {/* Expanded connections */}
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-hairline grid grid-cols-2 gap-3">
                        <div>
                          <p className="readout-dim mb-1" style={{ fontSize: '9px' }}>MATHEMATICAL PROOF</p>
                          <p className="font-mono text-xs" style={{ color: layerColors[i] }}>{layer.mathematical_proof}</p>
                        </div>
                        <div>
                          <p className="readout-dim mb-1" style={{ fontSize: '9px' }}>CONNECTS TO</p>
                          <div className="flex flex-wrap gap-1.5">
                            {layer.connects_to.map((c) => (
                              <span key={c} className="font-ui px-2 py-0.5 border border-hairline rounded-sm" style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Recursive arrow back to top */}
        <div className="flex justify-center mt-2">
          <div className="flex flex-col items-center gap-0.5">
            <svg width="1" height="24"><line x1="0.5" y1="0" x2="0.5" y2="24" stroke={layerColors[6]} strokeWidth="1" strokeDasharray="3,3" /></svg>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M1 8 Q5 2 9 8" fill="none" stroke={layerColors[6]} strokeWidth="1" />
              <path d="M1 8 L3 5" fill="none" stroke={layerColors[6]} strokeWidth="1" />
            </svg>
            <p className="readout-dim" style={{ fontSize: '8px' }}>RECURSIVE LOOP → LAYER 1</p>
          </div>
        </div>
      </section>

      {/* ═══ LAYER CONNECTIONS DIAGRAM ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="3" cy="7" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <circle cx="11" cy="4" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <circle cx="11" cy="10" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <line x1="5" y1="6" x2="9" y2="4" stroke="var(--accent)" strokeWidth="0.4" />
            <line x1="5" y1="8" x2="9" y2="10" stroke="var(--accent)" strokeWidth="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Inter-Layer Connections
          </h3>
        </div>
        <div className="plate" data-coord-tl="UCG.CONN" data-coord-br="7 LAYERS" style={{ padding: '1.25rem' }}>
          <div className="space-y-2">
            {layers.map((layer, i) => (
              <div key={layer.number} className="flex items-center gap-3">
                <span className="font-mono w-6 text-right shrink-0" style={{ fontSize: '10px', color: layerColors[i] }}>{layer.number}</span>
                <span className="font-body text-sm shrink-0 w-32" style={{ color: 'var(--text-secondary)' }}>{layer.name}</span>
                <svg width="16" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke={layerColors[i]} strokeWidth="0.6" /><polygon points="14,2 16,4 14,6" fill={layerColors[i]} /></svg>
                <span className="font-ui" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{layer.connects_to.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
