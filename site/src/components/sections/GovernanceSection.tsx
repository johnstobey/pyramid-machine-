'use client';

import { useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

/* ── Governance band thresholds ── */
const BANDS = [
  { label: 'High Governance',  minPct: 30, color: 'var(--accent)',          bg: 'var(--accent-faint)',  opacity: 1 },
  { label: 'Moderate',          minPct: 15, color: 'var(--emerald-accent)',  bg: 'var(--emerald-accent)', opacity: 0.55 },
  { label: 'Low Governance',    minPct: 0,  color: 'var(--coordinate)',      bg: 'var(--surface-raised)', opacity: 0.4 },
] as const;

/* ── Governance archetypes ── */
const ARCHETYPES = [
  {
    id: 'DIRECTIVE',
    label: 'Directive',
    desc: 'Imperative sentences issuing explicit instructions that steer the reader toward a specific operational frame. These form the primary command channel—the structural directives that activate specific regions of the geometric architecture.',
  },
  {
    id: 'PROHIBITION',
    label: 'Prohibition',
    desc: 'Negative imperatives that establish boundary conditions around the system’s geometric invariants. These enforce the architectural constraints that prevent invalid state transitions—the equivalent of the governance automaton’s lock state in linguistic form.',
  },
  {
    id: 'DECLARATION',
    label: 'Declaration',
    desc: 'Authoritative declaratives presented as axiomatic truth—the geometric laws stated as fixed points. These anchor the architecture in invariant principles that all subsequent operations must satisfy, analogous to the kernel constant’s role as boot checksum.',
  },
  {
    id: 'FRAMING',
    label: 'Structural Framing',
    desc: 'Metadiscursive sentences that govern the sequence and hierarchy of the architecture’s data paths. These determine the order in which geometric structures are introduced and connected, mirroring the fixed routing of the twelve inter-layer paths.',
  },
  {
    id: 'VALIDATION',
    label: 'Validation',
    desc: 'Sentences that confirm or reinforce prior directives, creating recursive loops of structural consistency. These are the linguistic equivalent of the 720° double-pass validation—each validation sentence ties the current context back to the system’s established geometric state.',
  },
] as const;

export default function GovernanceSection() {
  const { data, loading } = useTobeyData();

  /* ── Per-lesson governance data ── */
  const lessonGovData = useMemo(() => {
    if (!data) return [];
    const entries: {
      key: string;
      lesson: number;
      govCount: number;
      totalSentences: number;
      govPct: number;
      title: string;
    }[] = [];

    for (const [key, ling] of Object.entries(data.linguistic_layer)) {
      const govCount = ling.taxonomy?.GOV ?? 0;
      const total = ling.total_sentences;
      const lessonNum = entries.length + 1;
      entries.push({
        key,
        lesson: lessonNum,
        govCount,
        totalSentences: total,
        govPct: total > 0 ? (govCount / total) * 100 : 0,
        title: data.lesson_titles?.[`lesson_${String(lessonNum).padStart(2, '0')}`] ?? `Lesson ${lessonNum}`,
      });
    }

    return entries.sort((a, b) => a.lesson - b.lesson);
  }, [data]);

  /* ── Aggregated stats ── */
  const stats = useMemo(() => {
    if (!lessonGovData.length) return null;
    const totalGov = lessonGovData.reduce((s, l) => s + l.govCount, 0);
    const totalSent = lessonGovData.reduce((s, l) => s + l.totalSentences, 0);
    const avgPct = lessonGovData.length > 0
      ? lessonGovData.reduce((s, l) => s + l.govPct, 0) / lessonGovData.length
      : 0;
    const maxLesson = lessonGovData.reduce((m, l) => l.govPct > m.govPct ? l : m, lessonGovData[0]);
    const minLesson = lessonGovData.reduce((m, l) => l.govPct < m.govPct ? l : m, lessonGovData[0]);
    const highGovLessons = lessonGovData.filter(l => l.govPct >= 30);
    return { totalGov, totalSent, avgPct, maxLesson, minLesson, highGovLessons };
  }, [lessonGovData]);

  /* ── Band assignment helper ── */
  function getBand(pct: number) {
    return BANDS.find(b => pct >= b.minPct) ?? BANDS[BANDS.length - 1];
  }

  /* ── Distribution histogram buckets ── */
  const histogram = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0]; // 0-5%, 5-10%, 10-15%, 15-20%, 20-25%, 25-30%, 30-35%, 35%+
    for (const l of lessonGovData) {
      const idx = Math.min(Math.floor(l.govPct / 5), 7);
      buckets[idx]++;
    }
    return buckets;
  }, [lessonGovData]);

  const maxBucket = Math.max(...histogram, 1);

  /* ── Cumulative governance curve data ── */
  const cumulativeData = useMemo(() => {
    return lessonGovData.reduce<Array<{ lesson: number; cumulativeGov: number; cumulativeTotal: number; cumulativePct: number }>>((acc, l) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : null;
      const cumulativeGov = (prev?.cumulativeGov ?? 0) + l.govCount;
      const cumulativeTotal = (prev?.cumulativeTotal ?? 0) + l.totalSentences;
      const cumulativePct = cumulativeTotal > 0 ? (cumulativeGov / cumulativeTotal) * 100 : 0;
      acc.push({ lesson: l.lesson, cumulativeGov, cumulativeTotal, cumulativePct });
      return acc;
    }, []);
  }, [lessonGovData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data || !stats) return null;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 1 L13 5 L13 9 L7 13 L1 9 L1 5 Z" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <path d="M7 4 L10 6 L10 9 L7 11 L4 9 L4 6 Z" fill="var(--accent)" opacity="0.25" stroke="var(--accent)" strokeWidth="0.5" />
          </svg>
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section VI &mdash; Governance Analysis</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Governance Layer
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)', lineHeight: '1.85em' }}>
          The governance layer is the mechanism by which the Tobey Machine enforces its own
          structural integrity. In the source corpus, governance-classified sentences (GOV)
          encode the system&apos;s control logic: the directives, prohibitions, and structural
          framings that determine how the geometric architecture is navigated and interpreted.
          Their distribution across the twenty-four lessons reveals the density of self-referential
          constraint in each section of the system. High governance density indicates regions
          where the architecture&apos;s invariant laws are most rigorously enforced. This analysis
          maps the governance layer as it exists in the encoded source material—the linguistic
          fingerprint of the system&apos;s self-governing capacity.
        </p>
      </section>

      {/* ═══ AGGREGATE STATISTICS ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="3" width="12" height="8" rx="1" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="4" y1="3" x2="4" y2="11" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
            <line x1="8" y1="3" x2="8" y2="11" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
            <circle cx="2.5" cy="6" r="0.8" fill="var(--accent)" opacity="0.6" />
            <circle cx="6" cy="8" r="0.8" fill="var(--accent)" opacity="0.6" />
            <circle cx="10" cy="5" r="0.8" fill="var(--accent)" opacity="0.6" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Governance Aggregate
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="plate" data-coord-tl="GOV.TOTAL" data-coord-br={`${((stats.totalGov / stats.totalSent) * 100).toFixed(1)}% OF ALL`}>
            <div className="font-ui text-coordinate mb-3" style={{ fontSize: '10px' }}>Total GOV Sentences</div>
            <div className="readout text-2xl md:text-3xl font-semibold">{stats.totalGov.toLocaleString()}</div>
          </div>
          <div className="plate" data-coord-tl="GOV.AVG" data-coord-br="ACROSS 24 LESSONS">
            <div className="font-ui text-coordinate mb-3" style={{ fontSize: '10px' }}>Mean GOV Density</div>
            <div className="readout text-2xl md:text-3xl font-semibold">{stats.avgPct.toFixed(1)}%</div>
          </div>
          <div className="plate" data-coord-tl="GOV.MAX" data-coord-br={`L${String(stats.maxLesson.lesson).padStart(2, '0')}`}>
            <div className="font-ui text-coordinate mb-3" style={{ fontSize: '10px' }}>Peak Density</div>
            <div className="readout text-2xl md:text-3xl font-semibold" style={{ color: 'var(--accent)' }}>{stats.maxLesson.govPct.toFixed(1)}%</div>
          </div>
          <div className="plate" data-coord-tl="GOV.HIGH" data-coord-br={`${stats.highGovLessons.length} LESSONS`}>
            <div className="font-ui text-coordinate mb-3" style={{ fontSize: '10px' }}>High-Governance (≥30%)</div>
            <div className="readout text-2xl md:text-3xl font-semibold" style={{ color: 'var(--emerald-accent)' }}>{stats.highGovLessons.length}</div>
          </div>
        </div>
      </section>

      {/* ═══ PER-LESSON GOVERNANCE BAR CHART ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="9" width="2" height="4" fill="var(--accent)" opacity="0.5" />
            <rect x="4" y="5" width="2" height="8" fill="var(--accent)" opacity="0.7" />
            <rect x="7" y="2" width="2" height="11" fill="var(--accent)" opacity="0.9" />
            <rect x="10" y="7" width="2" height="6" fill="var(--accent)" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Per-Lesson Governance Density
          </h3>
        </div>
        <div className="plate" data-coord-tl="GOV.DENSITY.CHART" data-coord-br={`${lessonGovData.length} LESSONS`} style={{ padding: '1.5rem 1.75rem' }}>
          <div className="flex items-end gap-[3px] md:gap-[5px]" style={{ height: '200px' }}>
            {lessonGovData.map((l) => {
              const band = getBand(l.govPct);
              const barH = Math.max((l.govPct / (Math.max(...lessonGovData.map(x => x.govPct), 1))) * 100, 2);
              const isMax = l.lesson === stats.maxLesson.lesson;
              return (
                <div
                  key={l.key}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="plate px-2 py-1 whitespace-nowrap" style={{ padding: '4px 8px', fontSize: '9px' }}>
                      <span className="readout">L{l.lesson.toString().padStart(2, '0')}</span>{' '}
                      <span style={{ color: band.color }}>{l.govPct.toFixed(1)}%</span>{' '}
                      <span className="readout-dim">({l.govCount})</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-sm transition-all duration-200"
                    style={{
                      height: `${barH}%`,
                      backgroundColor: band.bg,
                      border: isMax
                        ? `1px solid ${band.color}`
                        : '1px solid transparent',
                      opacity: isMax ? 1 : band.opacity,
                      boxShadow: isMax ? `0 0 8px ${band.color}33` : 'none',
                    }}
                  />
                  {/* Lesson label */}
                  <span
                    className="readout-dim"
                    style={{
                      fontSize: '7px',
                      color: isMax ? 'var(--accent)' : 'var(--coordinate)',
                      fontWeight: isMax ? 600 : 400,
                    }}
                  >
                    {l.lesson}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
            {BANDS.map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <svg width="12" height="12"><rect x="1" y="1" width="10" height="10" rx="1" fill={b.bg} stroke={b.color} strokeWidth="0.5" /></svg>
                <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  {b.label} ({b.minPct === 0 ? '&lt;15' : b.minPct === 15 ? '15–29' : '≥30'}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DISTRIBUTION HISTOGRAM ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M1 13 Q4 13 5 10 Q6 7 7 7 Q8 7 9 4 Q10 1 13 1" fill="none" stroke="var(--accent)" strokeWidth="1" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Density Distribution
          </h3>
        </div>
        <div className="plate" data-coord-tl="GOV.HISTOGRAM" data-coord-br="5%-WIDTH BINS" style={{ padding: '1.5rem 1.75rem' }}>
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {histogram.map((count, idx) => {
              const label = idx < 7 ? `${idx * 5}–${(idx + 1) * 5}%` : '35%+';
              const barH = (count / maxBucket) * 100;
              const hasData = count > 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  {/* Count above bar */}
                  {hasData && (
                    <span className="readout" style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                      {count}
                    </span>
                  )}
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: `${Math.max(barH, 3)}%`,
                      backgroundColor: idx >= 6 ? 'var(--accent-faint)' : 'var(--surface-raised)',
                      border: idx >= 6 ? '1px solid var(--accent)' : '1px solid var(--hairline)',
                      opacity: hasData ? 1 : 0.3,
                    }}
                  />\n                  <span className="readout-dim text-center" style={{ fontSize: '7px', lineHeight: '1.2em' }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="font-ui mt-4" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
            Histogram showing how many lessons fall into each 5-percentage-point governance density bin.
          </p>
        </div>
      </section>

      {/* ═══ CUMULATIVE GOVERNANCE CURVE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="2" y1="12" x2="12" y2="2" stroke="var(--accent)" strokeWidth="1" />
            <circle cx="12" cy="2" r="1.5" fill="var(--accent)" opacity="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Cumulative Governance Ratio
          </h3>
        </div>
        <div className="plate" data-coord-tl="GOV.CUMULATIVE" data-coord-br="RUNNING AVERAGE" style={{ padding: '1.5rem 1.75rem' }}>
          <svg
            viewBox="0 0 660 200"
            className="w-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ maxHeight: '220px' }}
          >
            {/* Grid lines */}
            {[0, 25, 50].map((pct: number) => {
              const y = 180 - (pct / 60) * 160;
              return (
                <g key={pct}>
                  <line x1="40" y1={y} x2="640" y2={y} stroke="var(--hairline)" strokeWidth="0.5" strokeDasharray="4 3" />
                  <text x="35" y={y + 3} textAnchor="end" fill="var(--coordinate)" fontSize="8" fontFamily="var(--font-jetbrains), monospace">
                    {`${pct}%`}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {cumulativeData.filter((_, i) => i % 4 === 0 || i === cumulativeData.length - 1).map(d => {
              const x = 40 + ((d.lesson - 1) / 23) * 600;
              return (
                <text key={d.lesson} x={x} y="198" textAnchor="middle" fill="var(--coordinate)" fontSize="8" fontFamily="var(--font-jetbrains), monospace">
                  L{d.lesson.toString().padStart(2, '0')}
                </text>
              );
            })}

            {/* Average line */}
            {(() => {
              const avgY = 180 - (stats.avgPct / 60) * 160;
              return (
                <line x1="40" y1={avgY} x2="640" y2={avgY} stroke="var(--emerald-accent)" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.5" />
              );
            })()}

            {/* Area fill */}
            <path
              d={[
                `M 40 180`,
                ...cumulativeData.map(d => {
                  const x = 40 + ((d.lesson - 1) / 23) * 600;
                  const y = 180 - (d.cumulativePct / 60) * 160;
                  return `L ${x} ${y}`;
                }),
                `L 640 180 Z`,
              ].join(' ')}
              fill="var(--accent)"
              opacity="0.06"
            />

            {/* Line */}
            <path
              d={cumulativeData.map((d, i) => {
                const x = 40 + ((d.lesson - 1) / 23) * 600;
                const y = 180 - (d.cumulativePct / 60) * 160;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {cumulativeData.map(d => {
              const x = 40 + ((d.lesson - 1) / 23) * 600;
              const y = 180 - (d.cumulativePct / 60) * 160;
              return (
                <circle
                  key={d.lesson}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="var(--bg)"
                  stroke="var(--accent)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          <div className="flex items-center justify-center gap-6 mt-3 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--accent)" strokeWidth="1.5" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Cumulative ratio</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--emerald-accent)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Mean ({stats.avgPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GOVERNANCE ARCHETYPES ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <polygon points="7,1 9,5 13,5 10,8 11,12 7,9.5 3,12 4,8 1,5 5,5" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Governance Archetypes
          </h3>
        </div>
        <div className="space-y-3">
          {ARCHETYPES.map((arch, idx) => (
            <div
              key={arch.id}
              className="plate"
              data-coord-tl={`GOV.ARCH.${arch.id}`}
              data-coord-br={`TYPE ${idx + 1} / ${ARCHETYPES.length}`}
              style={{ padding: '1.25rem 1.5rem' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm mt-0.5"
                  style={{
                    border: '1px solid var(--accent)',
                    backgroundColor: 'var(--accent-faint)',
                  }}
                >
                  <span className="readout" style={{ fontSize: '11px', color: 'var(--accent)' }}>
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {arch.label}
                  </h4>
                  <span className="readout-dim block mb-2" style={{ fontSize: '9px' }}>{arch.id}</span>
                  <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
                    {arch.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DETAILED LESSON TABLE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="12" height="12" rx="1" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
            <line x1="1" y1="4.5" x2="13" y2="4.5" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
            <line x1="1" y1="8" x2="13" y2="8" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
            <line x1="1" y1="11.5" x2="13" y2="11.5" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
            <line x1="5" y1="1" x2="5" y2="13" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
            <line x1="9" y1="1" x2="9" y2="13" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Lesson-by-Lesson Breakdown
          </h3>
        </div>
        <div
          className="plate overflow-x-auto"
          data-coord-tl="GOV.TABLE // 24 ENTRIES"
          data-coord-br={`${stats.totalGov.toLocaleString()} TOTAL GOV`}
          style={{ padding: '1.25rem' }}
        >
          <table className="border-collapse w-full" style={{ minWidth: '500px' }}>
            <thead>
              <tr>
                <th className="readout-dim text-left pb-3 pr-4" style={{ fontSize: '9px' }}>LESSON</th>
                <th className="readout-dim text-left pb-3 pr-4" style={{ fontSize: '9px' }}>TITLE</th>
                <th className="readout-dim text-right pb-3 px-3" style={{ fontSize: '9px' }}>GOV</th>
                <th className="readout-dim text-right pb-3 px-3" style={{ fontSize: '9px' }}>TOTAL</th>
                <th className="readout-dim text-right pb-3 pl-3" style={{ fontSize: '9px' }}>DENSITY</th>
                <th className="readout-dim text-left pb-3 pl-4" style={{ fontSize: '9px' }}>BAND</th>
              </tr>
            </thead>
            <tbody>
              {lessonGovData.map((l) => {
                const band = getBand(l.govPct);
                const isMax = l.lesson === stats.maxLesson.lesson;
                const isMin = l.lesson === stats.minLesson.lesson;
                return (
                  <tr
                    key={l.key}
                    style={{
                      backgroundColor: isMax ? 'var(--accent-faint)' : 'transparent',
                    }}
                  >
                    <td className="readout py-1.5 pr-4" style={{ fontSize: '10px', color: isMax ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      L{l.lesson.toString().padStart(2, '0')}
                    </td>
                    <td className="font-body py-1.5 pr-4" style={{ fontSize: '12px', color: 'var(--text-tertiary)', maxWidth: '200px' }}>
                      <span className="truncate block">{l.title}</span>
                    </td>
                    <td className="readout text-right py-1.5 px-3" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {l.govCount}
                    </td>
                    <td className="readout-dim text-right py-1.5 px-3" style={{ fontSize: '10px' }}>
                      {l.totalSentences}
                    </td>
                    <td className="readout text-right py-1.5 pl-3" style={{ fontSize: '11px', color: band.color, fontWeight: isMax ? 600 : 400 }}>
                      {l.govPct.toFixed(1)}%
                      {isMax && <span className="ml-1" style={{ fontSize: '8px' }}>▲</span>}
                      {isMin && <span className="ml-1" style={{ fontSize: '8px' }}>▼</span>}
                    </td>
                    <td className="py-1.5 pl-4">
                      <span
                        className="inline-block px-2 py-0.5 rounded-sm font-ui"
                        style={{
                          fontSize: '8px',
                          border: `1px solid ${band.color}`,
                          color: band.color,
                          backgroundColor: band.bg,
                          opacity: band.opacity,
                        }}
                      >
                        {band.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="font-ui mt-4" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
            ▲ Peak governance density &nbsp;&middot;&nbsp; ▼ Minimum governance density
          </p>
        </div>
      </section>

      {/* ═══ GOVERNANCE HEAT MAP ── 4×6 GRID (mirrors pyramid 4×3 decomposition) ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            {Array.from({ length: 12 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const intensity = (i + 1) / 12;
              return (
                <rect
                  key={i}
                  x={col * 3 + 1}
                  y={row * 4 + 1}
                  width="2"
                  height="3"
                  rx="0.3"
                  fill="var(--accent)"
                  opacity={intensity * 0.8 + 0.1}
                />
              );
            })}
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Governance Heat Map
          </h3>
        </div>
        <div className="plate" data-coord-tl="GOV.HEATMAP" data-coord-br="4×6 DECOMPOSITION" style={{ padding: '1.5rem 1.75rem' }}>
          <p className="font-ui mb-5" style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
            Cell opacity encodes governance density. The grid structure mirrors the 12×4 decomposition of the 144-node lattice.
          </p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {lessonGovData.map((l) => {
              const maxPct = Math.max(...lessonGovData.map(x => x.govPct), 1);
              const intensity = l.govPct / maxPct;
              const band = getBand(l.govPct);
              return (
                <div
                  key={l.key}
                  className="flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-sm transition-colors"
                  style={{
                    backgroundColor: `var(--accent)`,
                    opacity: Math.max(intensity * 0.85 + 0.08, 0.1),
                    border: '1px solid var(--hairline)',
                  }}
                  title={`L${l.lesson.toString().padStart(2, '0')}: ${l.govPct.toFixed(1)}% (${l.govCount} sentences)`}
                >
                  <span className="readout" style={{ fontSize: '10px', color: intensity > 0.6 ? 'var(--bg)' : 'var(--text)' }}>
                    L{l.lesson.toString().padStart(2, '0')}
                  </span>
                  <span className="readout-dim" style={{ fontSize: '8px', color: intensity > 0.6 ? 'var(--bg)' : 'var(--text-tertiary)' }}>
                    {l.govPct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
          {/* Gradient legend */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="readout-dim" style={{ fontSize: '9px' }}>Low</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-3 rounded-sm"
                  style={{
                    backgroundColor: 'var(--accent)',
                    opacity: (i + 1) / 10 * 0.85 + 0.08,
                  }}
                />
              ))}
            </div>
            <span className="readout-dim" style={{ fontSize: '9px' }}>High</span>
          </div>
        </div>
      </section>
    </div>
  );
}
