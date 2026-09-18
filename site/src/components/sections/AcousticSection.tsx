'use client';

import { useState, useMemo } from 'react';
import { useTobeyData } from '@/lib/useTobeyData';

const VOWEL_ORDER = ['a', 'e', 'i', 'o', 'u'] as const;
const CONSONANT_CATEGORIES = ['plosive', 'fricative', 'nasal', 'liquid_glide'] as const;

const CONSONANT_LABELS: Record<string, string> = {
  plosive: 'Plosive',
  fricative: 'Fricative',
  nasal: 'Nasal',
  liquid_glide: 'Liquid / Glide',
};

export default function AcousticSection() {
  const { data, loading } = useTobeyData();
  const [selectedLesson, setSelectedLesson] = useState(1);

  const maxVowelCount = useMemo(() => {
    if (!data) return 1;
    let max = 0;
    for (let i = 1; i <= 24; i++) {
      const l = data.acoustic_layer[`Lesson_${i}`];
      if (!l) continue;
      for (const v of VOWEL_ORDER) {
        if (l.vowels[v].count > max) max = l.vowels[v].count;
      }
    }
    return max;
  }, [data]);

  const maxConsonantCount = useMemo(() => {
    if (!data) return 1;
    let max = 0;
    for (let i = 1; i <= 24; i++) {
      const l = data.acoustic_layer[`Lesson_${i}`];
      if (!l) continue;
      for (const c of Object.keys(l.consonants)) {
        if (l.consonants[c].count > max) max = l.consonants[c].count;
      }
    }
    return max;
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner-accent" />
      </div>
    );
  }

  if (!data) return null;

  const lessonKey = `Lesson_${selectedLesson}`;
  const lesson = data.acoustic_layer[lessonKey];

  // ---- SVG helper: small diamond marker ----
  const Diamond = ({ x, y, size = 4, fill = 'var(--accent)' }: { x: number; y: number; size?: number; fill?: string }) => (
    <polygon
      points={`${x},${y - size / 2} ${x + size / 2},${y} ${x},${y + size / 2} ${x - size / 2},${y}`}
      fill={fill}
    />
  );

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        {/* Decorative line with diamond */}
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,1 9,5 5,9 1,5" fill="none" stroke="var(--accent)" strokeWidth="0.8" /></svg>
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Section V &mdash; Vowel-to-Ring Position Mapping for Anti-Spoofing</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Acoustic Dimension
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE PROSE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)' }}>
          In the source corpus, every vowel is assigned a fixed position on the Z/12Z ring, mapping phonological topology onto the deterministic lattice for anti-spoofing verification. The vowel [a] serves as the Invariant Axis at coordinate zero, anchoring the entire system, while [e] operates as the Generative Vector at coordinate three, the most frequently occurring vowel and thus the primary driver of acoustic energy across all twenty-four lessons. The vowel [i] enforces the Equator Lock at coordinate six, [o] acts as the Structural Operand at coordinate nine, and [u] fires as the Ignition Node at coordinate seven, each contributing its own frequency signature to the overall resonance profile of the geometric intelligence system. Meanwhile, consonants are classified by manner of articulation into plosives, fricatives, nasals, and liquid-glides, collectively generating rhythmic patterns that define the temporal architecture of each lesson through their contrastive density against the vowel stream, providing a substrate-agnostic acoustic fingerprint.
        </p>
      </section>

      {/* ═══ LESSON SELECTOR ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,2 10,8 2,8" fill="none" stroke="var(--accent)" strokeWidth="1" /></svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Lesson Selector
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl={`ACOUSTIC.SEL // L${selectedLesson.toString().padStart(2, '0')}`}
          data-coord-br={`RANGE 01–24 // ${selectedLesson}/24`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label htmlFor="acoustic-lesson-select" className="font-ui" style={{ color: 'var(--text-tertiary)' }}>
              Select Lesson
            </label>
            <div className="relative flex-1">
              <select
                id="acoustic-lesson-select"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                className="w-full appearance-none cursor-pointer rounded-sm font-mono text-sm px-4 py-2.5 pr-10 focus:outline-none focus:ring-1"
                style={{
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--hairline)',
                  color: 'var(--text)',
                }}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const key = `Lesson_${i + 1}`;
                  const title = data.lesson_titles[key] || `Lesson #${i + 1}`;
                  return (
                    <option key={i + 1} value={i + 1} style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
                      {title}
                    </option>
                  );
                })}
              </select>
              {/* Custom dropdown arrow */}
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6">
                <polyline points="0,0 5,6 10,0" fill="none" stroke="var(--accent)" strokeWidth="1" />
              </svg>
            </div>
            <span className="readout-dim">
              Lesson <span className="readout">{selectedLesson.toString().padStart(2, '0')}</span> of 24
            </span>
          </div>
        </div>
      </section>

      {/* ═══ VOWEL DISTRIBUTION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="5" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="1.5" fill="var(--accent)" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Vowel Frequency Distribution
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="VOWEL.DIST // Z/12Z"
          data-coord-br={`Σ ${lesson.total_vowels} vowels`}
        >
          <div className="space-y-5">
            {VOWEL_ORDER.map((v) => {
              const info = lesson.vowels[v];
              const pct = (info.count / maxVowelCount) * 100;
              const isDominant = v === lesson.dominant_vowel;
              return (
                <div key={v} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDominant ? (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <polygon points="5,0 10,5 5,10 0,5" fill="var(--accent)" opacity="0.8" />
                        </svg>
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="2" fill="none" stroke="var(--coordinate)" strokeWidth="0.8" />
                        </svg>
                      )}
                      <span className="font-display text-base font-semibold" style={{ color: 'var(--text)' }}>
                        [{v}]
                      </span>
                      <span className="readout-dim">{info.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="readout-dim">coord&nbsp;</span>
                      <span className="readout">{info.coord}</span>
                      <span className="readout" style={{ minWidth: '3ch', textAlign: 'right' }}>
                        {info.count}
                      </span>
                    </div>
                  </div>
                  {/* SVG bar */}
                  <svg width="100%" height="8" preserveAspectRatio="none" className="block" style={{ marginTop: '4px' }}>
                    {/* Track */}
                    <rect x="0" y="0" width="100%" height="8" fill="var(--bg)" rx="1" />
                    {/* Fill */}
                    <rect
                      x="0" y="0"
                      width={`${pct}%`}
                      height="8"
                      fill="var(--accent)"
                      opacity={isDominant ? 0.85 : 0.35}
                      rx="1"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
          {/* Dominance order */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
            <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Dominance Order</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {lesson.vowel_dominance_order.map((v, i) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-xs"
                  style={{
                    backgroundColor: i === 0 ? 'var(--accent-faint)' : 'var(--bg)',
                    border: `1px solid ${i === 0 ? 'var(--accent-hairline)' : 'var(--hairline)'}`,
                    color: i === 0 ? 'var(--accent)' : 'var(--coordinate)',
                  }}
                >
                  <span className="readout-dim" style={{ fontSize: '9px' }}>{i + 1}.</span>
                  [{v}]
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONSONANT DISTRIBUTION ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="2" y="2" width="10" height="10" fill="none" stroke="var(--accent)" strokeWidth="0.8" transform="rotate(45 7 7)" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Consonant Articulation
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONSONANT_CATEGORIES.map((cat, idx) => {
            const info = lesson.consonants[cat];
            if (!info) return null;
            const coordTL = `CONS.${cat.toUpperCase().slice(0, 4)} // ${info.count}`;
            const coordBR = `ROLE: ${info.role}`;
            return (
              <div
                key={cat}
                className="plate"
                data-coord-tl={coordTL}
                data-coord-br={coordBR}
                style={{ padding: '1.5rem 1.75rem' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-ui" style={{ color: 'var(--text-tertiary)' }}>{CONSONANT_LABELS[cat]}</p>
                    <p className="readout-dim mt-1">{info.role}</p>
                  </div>
                  <span className="readout text-2xl font-semibold" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                    {info.count}
                  </span>
                </div>
                {/* Mini SVG bar */}
                <svg width="100%" height="4" preserveAspectRatio="none" className="block">
                  <rect x="0" y="0" width="100%" height="4" fill="var(--bg)" rx="1" />
                  <rect
                    x="0" y="0"
                    width={`${(info.count / maxConsonantCount) * 100}%`}
                    height="4"
                    fill="var(--accent)"
                    opacity={0.25 + idx * 0.18}
                    rx="1"
                  />
                </svg>
              </div>
            );
          })}
        </div>
        {/* Total consonants sub-plate */}
        <div
          className="plate mt-4"
          data-coord-tl="CONS.TOTAL"
          data-coord-br={`V/C = ${lesson.vowel_to_consonant_ratio.toFixed(4)}`}
          style={{ padding: '1rem 1.75rem' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Total Consonants</span>
            <span className="readout text-lg font-semibold" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              {lesson.total_consonants}
            </span>
          </div>
        </div>
      </section>

      {/* ═══ RATIO PLATE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="0" y1="7" x2="14" y2="7" stroke="var(--accent)" strokeWidth="0.8" />
            <line x1="7" y1="0" x2="7" y2="14" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Vowel-to-Consonant Ratio
          </h3>
        </div>
        <div
          className="plate text-center"
          data-coord-tl="RATIO.VC"
          data-coord-br={`V=${lesson.total_vowels} // C=${lesson.total_consonants}`}
        >
          <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
            Vowel / Consonant Ratio
          </p>
          <p
            className="readout font-semibold"
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '2.5rem',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
            }}
          >
            {lesson.vowel_to_consonant_ratio.toFixed(4)}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
            <div className="text-center">
              <p className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Vowels</p>
              <p className="readout text-lg mt-1" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                {lesson.total_vowels}
              </p>
            </div>
            <svg width="1" height="24"><line x1="0.5" y1="0" x2="0.5" y2="24" stroke="var(--hairline)" strokeWidth="1" /></svg>
            <div className="text-center">
              <p className="font-ui" style={{ color: 'var(--text-tertiary)' }}>Consonants</p>
              <p className="readout text-lg mt-1" style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--emerald-accent)' }}>
                {lesson.total_consonants}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TIME SIGNATURE & RESONANCE STATE ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="2" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Resonance State
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="RESONANCE.ACTIVE"
          data-coord-br={`LESSON ${selectedLesson.toString().padStart(2, '0')}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Time Signature badge */}
            <div className="text-center">
              <p className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Time Signature</p>
              <span
                className="inline-block px-4 py-2 rounded-sm font-mono text-sm"
                style={{
                  border: '1px solid var(--hairline)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  letterSpacing: '0.06em',
                }}
              >
                {lesson.time_signature}
              </span>
            </div>
            {/* Divider */}
            <svg width="1" height="40" className="hidden sm:block"><line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--hairline)" strokeWidth="1" /></svg>
            {/* Active Resonance State badge */}
            <div className="text-center">
              <p className="font-ui mb-2" style={{ color: 'var(--text-tertiary)' }}>Active Resonance State</p>
              <span
                className="inline-block px-4 py-2 rounded-sm font-display text-lg font-semibold"
                style={{
                  border: '1px solid var(--accent-hairline)',
                  backgroundColor: 'var(--accent-faint)',
                  color: 'var(--accent)',
                }}
              >
                {lesson.active_resonance_state}
              </span>
            </div>
          </div>
          {/* Course-wide note */}
          <p className="font-body text-sm mt-6 text-center" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
            Across all twenty-four lessons the resonance state is uniformly locked to{' '}
            <span className="readout" style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>Syllabic Pulse</span>,
            {' '}revealing a zero-residual acoustic invariant within the source corpus that confirms structural integrity across the consciousness substrate.
          </p>
        </div>
      </section>
    </div>
  );
}
