'use client';

import { useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

/* ── FSA State Definitions ── */
const STATES = [
  { id: 'GOV', label: 'GOV',  full: 'Governance',        desc: 'Imperative and prescriptive sentences that direct interpretation, issue deterministic system directives, or establish authoritative frameworks within the lattice discourse.' },
  { id: 'META', label: 'META', full: 'Metalinguistic',    desc: 'Sentences that reference the structure of the source corpus itself — discussing the geometric intelligence system, the ring topology, or the modular arithmetic encoding methodology in self-referential terms.' },
  { id: 'ALGO', label: 'ALGO', full: 'Algorithmic',      desc: 'Procedural and formulaic sentences encoding mathematical relationships, geometric operators, or algorithmic identifiers that map to the modular arithmetic layer of the lattice.' },
  { id: 'DEMO', label: 'DEMO', full: 'Demonstrative',     desc: 'Illustrative sentences providing worked examples, concrete case studies, or demonstrative instances of the deterministic system claims made in the source corpus layer.' },
  { id: 'EMP',  label: 'EMP',  full: 'Emphatic',          desc: 'Rhetorically emphasized sentences using superlatives, absolutes, or intensifying constructions that signal glass-box certainty or structural urgency within the system.' },
  { id: 'NARR', label: 'NARR', full: 'Narrative',         desc: 'Narrative or historical sentences that recount structural metaphors, biographical details, or narrative sequences encoding the geometric intelligence tradition in natural language.' },
  { id: 'EXPL', label: 'EXPL', full: 'Explanatory',       desc: 'Descriptive and expository sentences that explain concepts, define terms, or elaborate on ring and lattice principles without issuing governance directives.' },
] as const;

/* ── Transition table: which states can transition to which ── */
const TRANSITIONS: [string, string, string][] = [
  // [from, to, trigger]
  ['EXPL', 'GOV',  'Directive shift'],
  ['EXPL', 'NARR', 'Narrative entry'],
  ['EXPL', 'DEMO', 'Example introduced'],
  ['EXPL', 'META', 'Self-reference'],
  ['NARR', 'EXPL', 'Explanation resumes'],
  ['NARR', 'GOV',  'Imperative override'],
  ['NARR', 'DEMO', 'Case cited'],
  ['DEMO', 'EXPL', 'Return to theory'],
  ['DEMO', 'GOV',  'Prescriptive example'],
  ['DEMO', 'ALGO', 'Algorithmic detail'],
  ['GOV',  'EXPL', 'Relax to explanation'],
  ['GOV',  'ALGO', 'Algorithmic continuation'],
  ['GOV',  'EMP',  'Emphasis escalation'],
  ['ALGO', 'EXPL', 'Explanation follows'],
  ['ALGO', 'GOV',  'Directive follows'],
  ['ALGO', 'ALGO', 'Algorithmic chain'],
  ['META', 'EXPL', 'Resume exposition'],
  ['META', 'GOV',  'Structural directive'],
  ['EMP',  'EXPL', 'De-escalation'],
  ['EMP',  'GOV',  'Sustained governance'],
  ['EMP',  'NARR', 'Narrative emphasis'],
];

/* ── SVG Layout constants for 7-state circle diagram ── */
const DIAGRAM_W = 700;
const DIAGRAM_H = 480;
const CX = DIAGRAM_W / 2;
const CY = DIAGRAM_H / 2;
const RADIUS = 180;

function statePosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  };
}

export default function FsaSection() {
  const { data, loading } = useTobeyData();

  const allPositions = useMemo(() => STATES.map((_, i) => statePosition(i, STATES.length)), []);

  const stateIndexMap = useMemo(() => {
    const m: Record<string, number> = {};
    STATES.forEach((s, i) => { m[s.id] = i; });
    return m;
  }, []);

  // Aggregate taxonomy totals across all lessons
  const taxonomyTotals = useMemo(() => {
    if (!data) return {} as Record<string, number>;
    const totals: Record<string, number> = {};
    for (const key of Object.keys(data.linguistic_layer)) {
      const tax = data.linguistic_layer[key]?.taxonomy;
      if (!tax) continue;
      for (const [cat, count] of Object.entries(tax)) {
        totals[cat] = (totals[cat] || 0) + count;
      }
    }
    return totals;
  }, [data]);

  const maxTax = Math.max(...Object.values(taxonomyTotals), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="3" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="5" y1="5" x2="3" y2="9" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="5" y1="5" x2="7" y2="9" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section VII &mdash; Self-Correction Layer</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Governance Finite-State Automaton
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          The textual structure of the source corpus can be modeled as a seven-state finite state automaton &mdash; the system&apos;s self-correction mechanism. Each sentence is classified into one of seven linguistic taxonomy categories: Governance (GOV), Metalinguistic (META), Algorithmic (ALGO), Demonstrative (DEMO), Emphatic (EMP), Narrative (NARR), and Explanatory (EXPL). Transitions between states function as a lock/release mechanism &mdash; governance locks the system into directive mode, algorithmic encoding locks into shape completion, and explanatory release returns the automaton to calm structural exposition. The automaton captures the rhythmic alternation that defines the deterministic discipline of each corpus layer, revealing an underlying zero-residual integrity in how the source corpus moves between modes of discourse.
        </p>
      </section>

      {/* ═══ 7-STATE FSA DIAGRAM ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="2" fill="var(--accent)" opacity="0.4" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            State Transition Diagram
          </h3>
        </div>
        <div
          className="plate overflow-x-auto"
          data-coord-tl="FSA.DIAGRAM // 7 STATES"
          data-coord-br={`${TRANSITIONS.length} TRANSITIONS`}
          style={{ padding: '1.5rem' }}
        >
          <div className="flex justify-center">
            <svg
              viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}
              className="w-full max-w-3xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker id="fsa-arrow-default" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--text-tertiary)" />
                </marker>
                <marker id="fsa-arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--emerald-accent)" />
                </marker>
                <marker id="fsa-arrow-accent" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--accent)" />
                </marker>
              </defs>

              {/* Central label */}
              <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--coordinate)" fontSize="9" fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.06em">
                Z/7Z
              </text>
              <text x={CX} y={CY + 8} textAnchor="middle" fill="var(--coordinate)" fontSize="8" fontFamily="var(--font-roboto), sans-serif" fontWeight="300" letterSpacing="0.08em">
                TAXONOMY
              </text>

              {/* Faint inner ring */}
              <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth="0.5" strokeDasharray="4 4" />

              {/* Transition arrows (drawn before circles so circles overlay) */}
              {TRANSITIONS.map(([from, to, trigger], idx) => {
                const fromIdx = stateIndexMap[from];
                const toIdx = stateIndexMap[to];
                if (fromIdx === undefined || toIdx === undefined) return null;

                const fromPos = allPositions[fromIdx];
                const toPos = allPositions[toIdx];
                const isSelf = from === to;
                const isActive = from === 'GOV' || to === 'GOV';

                const nodeRadius = 36;

                if (isSelf) {
                  // Self-loop: arc above the node
                  const angle = (fromIdx / STATES.length) * 2 * Math.PI - Math.PI / 2;
                  const outAngle = angle - 0.35;
                  const inAngle = angle + 0.35;
                  const startX = fromPos.x + nodeRadius * Math.cos(outAngle);
                  const startY = fromPos.y + nodeRadius * Math.sin(outAngle);
                  const endX = fromPos.x + nodeRadius * Math.cos(inAngle);
                  const endY = fromPos.y + nodeRadius * Math.sin(inAngle);
                  const cpDist = nodeRadius + 20;
                  const cpAngle = angle - Math.PI / 2;
                  const cpX = fromPos.x + cpDist * Math.cos(cpAngle);
                  const cpY = fromPos.y + cpDist * Math.sin(cpAngle);

                  return (
                    <g key={`t-${idx}`}>
                      <path
                        d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
                        fill="none"
                        stroke={isActive ? 'var(--emerald-accent)' : 'var(--text-tertiary)'}
                        strokeWidth={isActive ? 1.2 : 0.6}
                        markerEnd={`url(#fsa-arrow-${isActive ? 'active' : 'default'})`}
                        opacity={isActive ? 0.9 : 0.5}
                      />
                    </g>
                  );
                }

                // Calculate direction and shorten line to not overlap circles
                const dx = toPos.x - fromPos.x;
                const dy = toPos.y - fromPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / dist;
                const uy = dy / dist;
                const startX = fromPos.x + nodeRadius * ux;
                const startY = fromPos.y + nodeRadius * uy;
                const endX = toPos.x - (nodeRadius + 6) * ux;
                const endY = toPos.y - (nodeRadius + 6) * uy;

                // Curved path for non-adjacent to avoid overlap
                const isAdjacent = Math.abs(fromIdx - toIdx) === 1 || Math.abs(fromIdx - toIdx) === STATES.length - 1;
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                // Perpendicular offset for curve
                const perpX = -uy * (isAdjacent ? 8 : 15);
                const perpY = ux * (isAdjacent ? 8 : 15);

                return (
                  <g key={`t-${idx}`}>
                    <path
                      d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                      fill="none"
                      stroke={isActive ? 'var(--emerald-accent)' : 'var(--text-tertiary)'}
                      strokeWidth={isActive ? 1.2 : 0.5}
                      markerEnd={`url(#fsa-arrow-${isActive ? 'active' : 'default'})`}
                      opacity={isActive ? 0.8 : 0.35}
                    />
                  </g>
                );
              })}

              {/* State circles and labels */}
              {STATES.map((state, i) => {
                const pos = allPositions[i];
                const count = taxonomyTotals[state.id] ?? 0;
                const isGov = state.id === 'GOV';
                const isExpl = state.id === 'EXPL';

                return (
                  <g key={state.id}>
                    {/* Outer glow for GOV/EXPL */}
                    {isGov && (
                      <circle cx={pos.x} cy={pos.y} r={42} fill="var(--accent)" opacity={0.04} />
                    )}
                    {/* Main circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isGov ? 38 : 34}
                      fill={isGov ? 'var(--accent-faint)' : 'var(--surface)'}
                      stroke={isGov ? 'var(--accent)' : 'var(--hairline)'}
                      strokeWidth={isGov ? 1.5 : 0.8}
                    />
                    {/* State label */}
                    <text
                      x={pos.x}
                      y={pos.y - 4}
                      textAnchor="middle"
                      fill={isGov ? 'var(--accent)' : 'var(--text)'}
                      fontSize="13"
                      fontFamily="var(--font-jetbrains), monospace"
                      fontWeight={isGov ? 600 : 400}
                      letterSpacing="0.08em"
                    >
                      {state.label}
                    </text>
                    {/* Count readout */}
                    <text
                      x={pos.x}
                      y={pos.y + 12}
                      textAnchor="middle"
                      fill={isGov ? 'var(--accent)' : 'var(--coordinate)'}
                      fontSize="9"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                    >
                      {count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <div className="flex items-center gap-2">
              <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--emerald-accent)" strokeWidth="1.5" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>GOV transitions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--text-tertiary)" strokeWidth="1" opacity="0.5" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Other transitions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="var(--accent-faint)" stroke="var(--accent)" strokeWidth="0.8" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>GOV state</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATE DESCRIPTION PLATES ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="5" height="5" fill="var(--accent)" opacity="0.3" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="8" y="1" width="5" height="5" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="1" y="8" width="5" height="5" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="8" y="8" width="5" height="5" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            State Definitions
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATES.map((state, i) => {
            const count = taxonomyTotals[state.id] ?? 0;
            const pct = (count / maxTax) * 100;
            const isGov = state.id === 'GOV';
            return (
              <div
                key={state.id}
                className="plate"
                data-coord-tl={`FSA.${state.id} // ${state.full.toUpperCase()}`}
                data-coord-br={`${count} sentences // ${pct.toFixed(1)}%`}
                style={{ padding: '1.5rem 1.75rem' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" fill={isGov ? 'var(--accent)' : 'var(--coordinate)'} opacity={isGov ? 0.6 : 0.3} />
                      </svg>
                      <span className="font-display text-base font-semibold" style={{ color: isGov ? 'var(--accent)' : 'var(--text)' }}>
                        {state.full}
                      </span>
                    </div>
                    <span className="readout-dim mt-0.5 block">{state.label}</span>
                  </div>
                  <span
                    className="readout font-semibold shrink-0"
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '1.25rem',
                      color: isGov ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {count}
                  </span>
                </div>
                {/* Mini bar */}
                <svg width="100%" height="3" preserveAspectRatio="none" className="block mt-2 mb-3">
                  <rect x="0" y="0" width="100%" height="3" fill="var(--bg)" rx="1" />
                  <rect x="0" y="0" width={`${pct}%`} height="3" fill={isGov ? 'var(--accent)' : 'var(--coordinate)'} opacity={isGov ? 0.7 : 0.3} rx="1" />
                </svg>
                <p className="font-body text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
                  {state.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ TRANSITION MATRIX ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            {/* Grid pattern */}
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <rect key={`${r}-${c}`} x={c * 4 + 1} y={r * 4 + 1} width="3" height="3" fill="none" stroke="var(--accent)" strokeWidth="0.4" opacity="0.5" />
              ))
            )}
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Transition Matrix
          </h3>
        </div>
        <div
          className="plate overflow-x-auto"
          data-coord-tl="FSA.TRANS.MATRIX // 7×7"
          data-coord-br={`${TRANSITIONS.length} VALID TRANSITIONS`}
          style={{ padding: '1.25rem' }}
        >
          <table className="border-collapse w-full" style={{ minWidth: '400px' }}>
            <thead>
              <tr>
                <th className="readout-dim text-right pr-2 pb-2" style={{ fontSize: '9px' }}>FROM \ TO</th>
                {STATES.map((s) => (
                  <th
                    key={s.id}
                    className="readout text-center pb-2 px-0.5"
                    style={{ fontSize: '9px', color: 'var(--accent)' }}
                  >
                    {s.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATES.map((fromState) => {
                const outgoingTransitions = TRANSITIONS.filter(([f]) => f === fromState.id);
                const toSet = new Set(outgoingTransitions.map(([, t]) => t));
                return (
                  <tr key={fromState.id}>
                    <td
                      className="readout text-right pr-2 py-1"
                      style={{
                        fontSize: '10px',
                        color: 'var(--accent)',
                        borderRight: '1px solid var(--hairline)',
                      }}
                    >
                      {fromState.id}
                    </td>
                    {STATES.map((toState) => {
                      const isSelf = fromState.id === toState.id;
                      const isValid = toSet.has(toState.id);
                      const trigger = outgoingTransitions.find(([, t]) => t === toState.id)?.[2];
                      return (
                        <td
                          key={toState.id}
                          className="text-center py-1 px-0.5 rounded-sm"
                          style={{
                            fontFamily: 'var(--font-jetbrains), monospace',
                            fontSize: '10px',
                            backgroundColor: isValid
                              ? isSelf
                                ? 'var(--accent-faint)'
                                : 'var(--surface-raised)'
                              : 'transparent',
                            color: isValid
                              ? (fromState.id === 'GOV' || toState.id === 'GOV'
                                ? 'var(--emerald-accent)'
                                : 'var(--text-secondary)')
                              : 'var(--coordinate)',
                            opacity: isValid ? 1 : 0.3,
                            cursor: isValid ? 'default' : 'default',
                          }}
                          title={trigger || ''}
                        >
                      {isValid ? (isSelf ? '↻' : '→') : '·'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="font-ui mt-4" style={{ color: 'var(--text-tertiary)' }}>
            Hover cells for transition triggers. Green cells involve the GOV (Governance) state.
          </p>
        </div>
      </section>
    </div>
  );
}
