'use client';

import { useState } from 'react';
import { useTobeyData, type LinguisticData, type MathematicalData } from '@/lib/useTobeyData';

const CATEGORIES = ['GOV', 'META', 'ALGO', 'DEMO', 'EMP', 'NARR', 'EXPL'] as const;
type Category = (typeof CATEGORIES)[number];

/* Muted category opacities — never bright rainbow */
const CATEGORY_OPACITY: Record<Category, number> = {
  GOV: 0.85,
  META: 0.72,
  ALGO: 0.65,
  DEMO: 0.55,
  EMP: 0.48,
  NARR: 0.40,
  EXPL: 0.32,
};

/* Alternating between accent gold and emerald for variety without brightness */
const CATEGORY_HUE: Record<Category, 'accent' | 'emerald'> = {
  GOV: 'accent',
  META: 'emerald',
  ALGO: 'accent',
  DEMO: 'emerald',
  EMP: 'accent',
  NARR: 'emerald',
  EXPL: 'accent',
};

function categoryColor(cat: Category) {
  const base = CATEGORY_HUE[cat] === 'accent' ? '201,168,76' : '107,143,113';
  const op = CATEGORY_OPACITY[cat];
  return `rgba(${base}, ${op})`;
}

function categoryColorFull(cat: Category) {
  const base = CATEGORY_HUE[cat] === 'accent' ? '201,168,76' : '107,143,113';
  return `rgba(${base}, 0.95)`;
}

/* ── Small geometric SVG shapes (replacing lucide icons) ── */
function TriangleMarker({ size = 12, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className} style={style}>
      <polygon points="6,1 11,10 1,10" fill="var(--accent)" opacity="0.7" />
    </svg>
  );
}

function SquareMarker({ size = 12, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className} style={style}>
      <rect x="1" y="1" width="10" height="10" fill="var(--accent)" opacity="0.7" />
    </svg>
  );
}

function CircleMarker({ size = 12, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className} style={style}>
      <circle cx="6" cy="6" r="5" fill="var(--accent)" opacity="0.7" />
    </svg>
  );
}

function DiamondMarker({ size = 12, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className} style={style}>
      <polygon points="6,0 12,6 6,12 0,6" fill="var(--emerald-accent)" opacity="0.7" />
    </svg>
  );
}

/* ── Coordinate badge helper ── */
function CoordBadge({ code }: { code: string }) {
  return (
    <span className="readout-dim ml-2">
      {code}
    </span>
  );
}

export default function LessonsSection() {
  const { data, loading } = useTobeyData();
  const [selectedLesson, setSelectedLesson] = useState<string>('1');
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(CATEGORIES)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const lessonKey = `Lesson_${selectedLesson}`;
  const linguistic: LinguisticData | undefined = data.linguistic_layer[lessonKey];
  const mathematical: MathematicalData | undefined = data.mathematical_layer[lessonKey];
  const title = data.lesson_titles[lessonKey] || `Lesson ${selectedLesson}`;

  const taxonomy = linguistic?.taxonomy ?? {};
  const maxTaxonomyValue = Math.max(...Object.values(taxonomy), 1);

  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const hapaxWords = (linguistic?.hapax_legomena_sample ?? []).slice(0, 20);

  return (
    <div className="section-padding-lg">
      <div className="max-w-5xl mx-auto">
        {/* ═══ SECTION HEADING ═══ */}
        <header className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--text)' }}>
            Source Corpus
          </h2>
          <p className="font-body mt-4 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Navigate the 24-node lattice and inspect each node’s structural signature—
            its ring position, symbol distribution, and lattice-unique tokens that appear
            at exactly one node in the corpus.
          </p>
        </header>

        {/* ═══ LESSON SELECTOR ═══ */}
        <div className="flex items-center gap-5 mb-14 flex-wrap">
          <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
            Select Lesson
          </span>
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="font-mono text-sm px-5 py-2.5 cursor-pointer focus:outline-none"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--hairline)',
            }}
            aria-label="Select lesson to explore"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Lesson {i + 1}: {data.lesson_titles[`Lesson_${i + 1}`] ?? `Lesson ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* ═══ INFO PLATES (4) ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Title plate */}
          <div className="plate" data-coord-tl="WRD.001" data-coord-br="LSS.01">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              <TriangleMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
              Title
            </div>
            <p className="font-display text-lg leading-snug" style={{ color: 'var(--text)' }}>
              {title}
            </p>
            <CoordBadge code={`LSS.${selectedLesson.padStart(2, '0')}`} />
          </div>

          {/* Word Count plate */}
          <div className="plate" data-coord-tl="WRD.002" data-coord-br="CNT.01">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              <SquareMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
              Word Count
            </div>
            <span className="readout text-2xl">
              {linguistic?.total_words?.toLocaleString() ?? '—'}
            </span>
            <CoordBadge code="CNT.01" />
          </div>

          {/* Sentence Count plate */}
          <div className="plate" data-coord-tl="WRD.003" data-coord-br="CNT.02">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              <CircleMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
              Sentence Count
            </div>
            <span className="readout text-2xl">
              {linguistic?.total_sentences?.toLocaleString() ?? '—'}
            </span>
            <CoordBadge code="CNT.02" />
          </div>

          {/* Unique Words plate */}
          <div className="plate" data-coord-tl="WRD.004" data-coord-br="UNQ.01">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              <DiamondMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
              Unique Words
            </div>
            <span className="readout text-2xl">
              {linguistic?.unique_words?.toLocaleString() ?? '—'}
            </span>
            <CoordBadge code="UNQ.01" />
          </div>
        </div>

        {/* ═══ 7-CATEGORY TAXONOMY BAR CHART ═══ */}
        <section className="mb-16">
          <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            Sentence Taxonomy
          </h3>
          <p className="font-body mb-8" style={{ color: 'var(--text-secondary)' }}>
            Each sentence is classified into one of seven functional categories
            across the lattice. Toggle categories to isolate distributions per node.
          </p>

          {/* Category toggle buttons — font-ui style */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="font-ui px-4 py-1.5 cursor-pointer transition-opacity"
                  style={{
                    color: isActive ? categoryColorFull(cat) : 'var(--coordinate)',
                    border: `1px solid ${isActive ? categoryColor(cat) : 'var(--hairline-subtle)'}`,
                    background: 'transparent',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* SVG Bar Chart */}
          <div className="plate" data-coord-tl="TAX.001" data-coord-br="TAX.07">
            <svg
              width="100%"
              viewBox="0 0 640 300"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Taxonomy bar chart"
            >
              {CATEGORIES.map((cat, idx) => {
                const count = taxonomy[cat] ?? 0;
                const barWidth = maxTaxonomyValue > 0 ? (count / maxTaxonomyValue) * 420 : 0;
                const isActive = activeCategories.has(cat);
                const y = idx * 40 + 8;
                const barColor = categoryColor(cat);
                const barColorFull = categoryColorFull(cat);

                return (
                  <g key={cat}>
                    {/* Category label — font-mono */}
                    <text
                      x="0"
                      y={y + 18}
                      fill={isActive ? barColorFull : 'var(--coordinate)'}
                      fontSize="13"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                      opacity={isActive ? 1 : 0.45}
                    >
                      {cat}
                    </text>
                    {/* Bar background track */}
                    <rect
                      x="70"
                      y={y + 4}
                      width="420"
                      height="22"
                      fill="var(--surface-raised)"
                      opacity="0.8"
                    />
                    {/* Bar fill */}
                    <rect
                      x="70"
                      y={y + 4}
                      width={Math.max(barWidth, 0)}
                      height="22"
                      fill={isActive ? barColor : 'var(--hairline-subtle)'}
                      opacity={isActive ? 1 : 0.6}
                    />
                    {/* Count value — font-mono / readout */}
                    <text
                      x={70 + barWidth + 12}
                      y={y + 19}
                      fill={isActive ? 'var(--accent)' : 'var(--coordinate)'}
                      fontSize="13"
                      fontFamily="var(--font-jetbrains), monospace"
                      letterSpacing="0.05em"
                      opacity={isActive ? 1 : 0.45}
                    >
                      {count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* ═══ MATHEMATICAL DATA PLATES ═══ */}
        {mathematical && (
          <section className="mb-16">
            <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
              Mathematical Data
            </h3>
            <p className="font-body mb-8" style={{ color: 'var(--text-secondary)' }}>
              The ring position on Z/12Z, phi ratio, and Fibonacci signatures encoded within
              this node&rsquo;s sentence and word structure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ring Position */}
              <div className="plate" data-coord-tl="MAT.001" data-coord-br="RNG.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <TriangleMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Ring Position
                </div>
                <span className="readout text-2xl">
                  {mathematical.ring_position}
                </span>
                <span className="readout-dim ml-3">/ 11</span>
              </div>

              {/* Phi */}
              <div className="plate" data-coord-tl="MAT.002" data-coord-br="PHI.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <SquareMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Phi (φ)
                </div>
                <span className="readout text-2xl">
                  {mathematical.phi.toFixed(6)}
                </span>
              </div>

              {/* Fibonacci Status */}
              <div className="plate" data-coord-tl="MAT.003" data-coord-br="FIB.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <CircleMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Fibonacci Word Count
                </div>
                <span
                  className="readout text-2xl"
                  style={{
                    color: mathematical.is_fibonacci
                      ? 'var(--emerald-accent)'
                      : 'var(--coordinate)',
                  }}
                >
                  {mathematical.is_fibonacci ? 'YES' : 'NO'}
                </span>
              </div>

              {/* Phi-Proximity Count */}
              <div className="plate" data-coord-tl="MAT.004" data-coord-br="PPX.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <DiamondMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Phi-Proximity Count
                </div>
                <span className="readout text-2xl">
                  {mathematical.phi_proximity_count}
                </span>
              </div>

              {/* Fibonacci Sentence Count */}
              <div className="plate" data-coord-tl="MAT.005" data-coord-br="FSC.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <TriangleMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Fibonacci Sentences
                </div>
                <span className="readout text-2xl">
                  {mathematical.fibonacci_sentence_count}
                </span>
              </div>

              {/* Lexical Density */}
              <div className="plate" data-coord-tl="MAT.006" data-coord-br="LXD.01">
                <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  <SquareMarker size={10} className="inline mr-1.5" style={{ verticalAlign: 'middle' }} />
                  Lexical Density
                </div>
                <span className="readout text-2xl">
                  {linguistic ? `${(linguistic.lexical_density * 100).toFixed(1)}%` : '—'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ═══ HAPAX LEGOMENA TAG CLOUD ═══ */}
        {hapaxWords.length > 0 && (
          <section>
            <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
              Hapax Legomena
            </h3>
            <p className="font-body mb-10" style={{ color: 'var(--text-secondary)' }}>
              Tokens that appear at exactly one node in the lattice — a sample of twenty.
              These are the structural fingerprints of singular expression.
            </p>
            <div className="flex flex-wrap gap-3">
              {hapaxWords.map((word, i) => {
                const sizes = ['text-sm', 'text-base', 'text-lg'];
                const size = sizes[i % sizes.length];
                const opacities = [0.6, 0.7, 0.8, 0.85, 0.9];
                const op = opacities[i % opacities.length];
                return (
                  <span
                    key={word}
                    className={`${size} font-body inline-block px-4 py-1.5 transition-opacity hover:opacity-100`}
                    style={{
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--hairline)',
                      opacity: op,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
