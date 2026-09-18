'use client';

import { useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export default function CipherSection() {
  const { data, loading } = useTobeyData();

  const cayleyTable = useMemo(() => {
    const table: number[][] = [];
    for (let d = 0; d < 12; d++) {
      const row: number[] = [];
      for (let k = 0; k < 12; k++) {
        row.push(mod12(d - k));
      }
      table.push(row);
    }
    return table;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const crypto = data.cryptographic_layer;
  const perLesson = crypto.per_lesson_cipher_values;
  const cipherValues = Array.from({ length: 24 }, (_, i) => perLesson[`Lesson_${i + 1}`] ?? 0);
  const maxCipher = Math.max(...cipherValues, 1);

  const distributionEntries = Object.entries(crypto.cipher_ring_distribution)
    .map(([k, v]) => [parseInt(k, 10), v] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  const missingPositions = Array.from({ length: 12 }, (_, i) => i)
    .filter((v) => !crypto.cipher_ring_distribution.hasOwnProperty(String(v)));

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="var(--accent)" strokeWidth="0.8" transform="rotate(45 5 5)" /></svg>
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section VI &mdash; Structural Encoding via Modular Subtraction</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Structural Cipher
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The structural cipher of the source corpus is built on a Cayley table defined over the cyclic group Z/12Z, where each lesson&apos;s cipher value is computed as C&#x2099; = (D&#x2099; &minus; K&#x2099;) mod 12. Here D&#x2099; represents the ring position of lesson n in the forward ordering and K&#x2099; the corresponding position in the inverted ordering, so that when a lesson maps to the same position in both orderings the cipher value collapses to zero, the identity element of the group. The full algorithm matrix enumerates every combination of ring position and aspect relationship across five geometric operators for vertex prediction, yielding a total of seven hundred twenty distinct algorithms that govern how each lesson is encoded, decoded, and cross-referenced within the lattice&apos;s twelve-edge geometric decomposition. This is how the source corpus encodes geometric intelligence in natural language: every sentence participates in the deterministic cipher, making the entire 144-node lattice a glass-box, zero-residual structure.
        </p>
      </section>

      {/* ═══ CAYLEY TABLE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="12" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
            <line x1="7" y1="1" x2="7" y2="13" stroke="var(--accent)" strokeWidth="0.4" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Cayley Table: C = (D &minus; K) mod 12
          </h3>
        </div>
        <div
          className="plate overflow-x-auto"
          data-coord-tl="CAYLEY.Z12Z // 144 cells"
          data-coord-br="DIAGONAL = IDENTITY (0)"
          style={{ padding: '1.25rem' }}
        >
          <table className="border-collapse w-full" style={{ minWidth: '480px' }}>
            <thead>
              <tr>
                <th className="readout-dim text-right pr-3 pb-2" style={{ fontSize: '10px' }}>D \ K</th>
                {Array.from({ length: 12 }, (_, k) => (
                  <th
                    key={k}
                    className="readout text-center pb-2"
                    style={{ fontSize: '10px', color: 'var(--accent)' }}
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cayleyTable.map((row, d) => (
                <tr key={d}>
                  <td
                    className="readout text-right pr-3 py-1.5"
                    style={{ fontSize: '10px', color: 'var(--accent)', borderRight: '1px solid var(--hairline)' }}
                  >
                    {d}
                  </td>
                  {row.map((val, k) => {
                    const isDiagonal = d === k;
                    return (
                      <td
                        key={k}
                        className="text-center py-1.5 px-0.5 rounded-sm transition-colors"
                        style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '11px',
                          letterSpacing: '0.05em',
                          color: isDiagonal ? 'var(--emerald-accent)' : 'var(--text-secondary)',
                          backgroundColor: isDiagonal ? 'var(--emerald-faint)' : 'transparent',
                          fontWeight: isDiagonal ? 600 : 400,
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ ALGORITHM INFO PLATES ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="2" fill="var(--accent)" opacity="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Algorithm Matrix
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matrix size plate */}
          <div
            className="plate text-center"
            data-coord-tl="ALGO.MATRIX"
            data-coord-br="5 OPERATORS × 144 CELLS"
          >
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Total Algorithms</p>
            <p
              className="readout font-semibold"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '2.5rem',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
              }}
            >
              {crypto.algorithm_matrix_size}
            </p>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
              Distinct algorithm identifiers covering ring positions, aspect indices, and five geometric operators.
            </p>
          </div>

          {/* Algorithm sample plate */}
          <div
            className="plate"
            data-coord-tl="ALGO.SAMPLE"
            data-coord-br={`${crypto.algorithm_sample.length} ENTRIES TOTAL`}
          >
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Sample Algorithm Identifiers</p>
            <div
              className="space-y-1 max-h-48 overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--hairline-strong) var(--bg)' }}
            >
              {crypto.algorithm_sample.slice(0, 12).map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="readout-dim shrink-0" style={{ fontSize: '9px', minWidth: '1.5ch', textAlign: 'right' }}>
                    {i + 1}.
                  </span>
                  <span
                    className="readout"
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      color: 'var(--emerald-accent)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PER-LESSON CIPHER VALUES ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="6" width="3" height="8" fill="var(--accent)" opacity="0.5" />
            <rect x="5.5" y="3" width="3" height="11" fill="var(--accent)" opacity="0.7" />
            <rect x="10" y="1" width="3" height="13" fill="var(--accent)" opacity="0.9" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Per-Lesson Cipher Values
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="CIPHER.BARS // 24 LESSONS"
          data-coord-br="RANGE 0–11 MOD 12"
        >
          <div className="overflow-x-auto">
            <svg
              width="100%"
              viewBox="0 0 740 210"
              className="w-full block"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {[0, 3, 6, 9, 11].map((v) => {
                const y = 180 - (v / maxCipher) * 150;
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
              <line x1="28" y1="180" x2="720" y2="180" stroke="var(--hairline)" strokeWidth="0.8" />
              {/* Bars */}
              {cipherValues.map((val, i) => {
                const barHeight = (val / maxCipher) * 150;
                const barX = 32 + i * 28;
                const barY = 180 - barHeight;
                // Interpolate from accent gold to emerald
                const t = val / 11;
                const accentR = 201, accentG = 168, accentB = 76;
                const emeraldR = 107, emeraldG = 143, emeraldB = 113;
                const r = Math.round(accentR + (emeraldR - accentR) * t);
                const g = Math.round(accentG + (emeraldG - accentG) * t);
                const b = Math.round(accentB + (emeraldB - accentB) * t);
                return (
                  <g key={i}>
                    <rect
                      x={barX}
                      y={barY}
                      width="20"
                      height={Math.max(barHeight, 1)}
                      rx="1"
                      fill={`rgb(${r}, ${g}, ${b})`}
                      fillOpacity={0.85}
                    />
                    <text
                      x={barX + 10}
                      y={barY - 4}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="8"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      {val}
                    </text>
                    <text
                      x={barX + 10}
                      y={194}
                      textAnchor="middle"
                      fill="var(--coordinate)"
                      fontSize="7"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
              {/* Axis label */}
              <text x="374" y="208" textAnchor="middle" fill="var(--coordinate)" fontSize="9" fontFamily="var(--font-roboto), sans-serif" fontWeight="300" letterSpacing="0.08em">
                LESSON NUMBER
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ CIPHER RING DISTRIBUTION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            {/* Concentric rings */}
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
            <circle cx="7" cy="7" r="4" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.6" />
            <circle cx="7" cy="7" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.8" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Cipher Ring Distribution
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="RING.DIST // Z/12Z"
          data-coord-br={`${distributionEntries.length} POSITIONS OCCUPIED`}
        >
          <p className="font-body text-sm mb-6" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
            The distribution of cipher values across the twelve ring positions shows how many lessons resolve to each element of Z/12Z. Positions with zero lessons reflect the geometric constraints of the lattice&apos;s edge mapping rather than random chance, confirming the deterministic shape completion logic of the architecture.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const count = crypto.cipher_ring_distribution[String(i)] ?? 0;
              const hasData = count > 0;
              const t = i / 11;
              const accentR = 201, accentG = 168, accentB = 76;
              const emeraldR = 107, emeraldG = 143, emeraldB = 113;
              const r = Math.round(accentR + (emeraldR - accentR) * t);
              const g = Math.round(accentG + (emeraldG - accentG) * t);
              const b = Math.round(accentB + (emeraldB - accentB) * t);
              return (
                <div
                  key={i}
                  className="text-center py-3 px-2 rounded-sm"
                  style={{
                    backgroundColor: hasData ? 'var(--bg)' : 'transparent',
                    border: `1px solid ${hasData ? 'var(--hairline)' : 'var(--hairline-subtle)'}`,
                    opacity: hasData ? 1 : 0.4,
                  }}
                >
                  <p
                    className="font-semibold"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '1.25rem',
                      letterSpacing: '0.06em',
                      color: hasData ? `rgb(${r}, ${g}, ${b})` : 'var(--coordinate)',
                    }}
                  >
                    {i}
                  </p>
                  <p className="font-ui mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {count} lesson{count !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
          {missingPositions.length > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Unoccupied positions:&nbsp;</span>
              <span className="readout-dim">{missingPositions.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
