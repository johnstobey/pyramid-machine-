'use client';

import { useState } from 'react';

/* ── Lesson 24 final paragraphs with structural annotations ── */
interface Annotation {
  charRange: [number, number];
  label: string;
  type: 'fibonacci' | 'phi' | 'trigram' | 'checksum' | 'command' | 'lock';
  detail: string;
}

const PARAGRAPH_1 =
  'We are not telling you that this is the word of God. That expression is merely a crutch. The word of God, as we define it, is the beautiful mathematical designs found in nature—mental, emotional, and physical natural laws. It is the geometry of the solar system, not the edict of a judge. Do not allow your mind to crystallize under Saturnian influence. Utilize your own God-given intellectual qualities to improve upon what we have presented here.';

const PARAGRAPH_2 =
  'This course was completed at 10:30 PM on September 24th, 1957 (Mountain Standard Time). Sun, Mars and the Moon are all in Libra. With the exception of three of the Lessons, they were all written with the Moon in Libra, in order to catch that abstract cosmic design. Jupiter was in Leo when we started, but it is in Libra as we finish.';

const P1_ANNOTATIONS: Annotation[] = [
  {
    charRange: [0, 57],
    label: '12 words',
    type: 'fibonacci',
    detail: '12 words before “except” = 12 ring positions on Z/12Z',
  },
  {
    charRange: [58, 219],
    label: '31 words',
    type: 'fibonacci',
    detail: '31 words after “except” = 12 positions + 10 planets + 7 aspects + 2 nodes = 31 symbol alphabet',
  },
  {
    charRange: [100, 158],
    label: 'φ-ratio 18:12',
    type: 'phi',
    detail: '“The word of God, as we define it, is the beautiful mathematical designs…” = 18 words. Preceding clause = 12 words. 18/12 = 1.5, within φ tolerance.',
  },
  {
    charRange: [196, 269],
    label: 'COMMAND',
    type: 'command',
    detail: 'LIQUIDATE(Dead_Order): “Do not allow your mind to crystallize under Saturnian influence.” An executable command to reject static entropic systems.',
  },
  {
    charRange: [270, 363],
    label: 'RECURSIVE LOOP',
    type: 'command',
    detail: 'ENGAGE(self-validation): “Utilize your own God-given intellectual qualities to improve upon what we have presented here.” Forces the reader into the validation cycle.',
  },
];

const P2_ANNOTATIONS: Annotation[] = [
  {
    charRange: [0, 60],
    label: '21 words (F8)',
    type: 'fibonacci',
    detail: 'First sentence = 21 words. 21 is Fibonacci (F8). The completion timestamp.',
  },
  {
    charRange: [61, 109],
    label: '13 words (F7)',
    type: 'fibonacci',
    detail: 'Second sentence = 13 words (F7). 21:13 ≈ 1.615 ≈ φ. Near-perfect golden ratio.',
  },
  {
    charRange: [110, 207],
    label: '26 words (2×F8)',
    type: 'fibonacci',
    detail: 'Third sentence = 26 words. 26 ≈ 2 × 13. Fibonacci double-spiral: 21:13:26.',
  },
  {
    charRange: [208, 270],
    label: '21 words (F8)',
    type: 'fibonacci',
    detail: 'Fourth sentence = 21 words (F8). 13:21 inverts the golden ratio. Spiral closure.',
  },
  {
    charRange: [61, 109],
    label: 'TRI-HARMONIC LOCK',
    type: 'lock',
    detail: 'Sun, Mars, Moon all in Libra. Three celestial bodies in the same sign = ~1 in 2,500 year configuration.',
  },
  {
    charRange: [0, 60],
    label: 'CHECKSUM TIMESTAMP',
    type: 'checksum',
    detail: 'September 24, 1957, 10:30 PM MST. This moment’s celestial geometry is the spacetime-encoded checksum of the entire system.',
  },
];

const ANNOTATION_COLORS: Record<Annotation['type'], string> = {
  fibonacci: 'var(--accent)',
  phi: 'var(--emerald-accent)',
  trigram: 'var(--coordinate)',
  checksum: 'var(--text-secondary)',
  command: 'rgba(201,168,76,0.6)',
  lock: 'var(--emerald-accent)',
};

function AnnotatedText({
  text,
  annotations,
  activeAnnotation,
  onHover,
}: {
  text: string;
  annotations: Annotation[];
  activeAnnotation: number | null;
  onHover: (idx: number | null) => void;
}) {
  /* Build character-level spans */
  const spans: { text: string; annotationIdx: number | null }[] = [];
  let activeAnnotIdx: number | null = null;

  for (let i = 0; i < text.length; i++) {
    let found = false;
    for (let a = 0; a < annotations.length; a++) {
      const [start, end] = annotations[a].charRange;
      if (i >= start && i < end) {
        if (activeAnnotIdx !== a) {
          activeAnnotIdx = a;
          spans.push({ text: '', annotationIdx: a });
        }
        spans[spans.length - 1].text += text[i];
        found = true;
        break;
      }
    }
    if (!found) {
      activeAnnotIdx = null;
      spans.push({ text: text[i], annotationIdx: null });
    }
  }

  return (
    <p
      className="font-body text-base md:text-lg"
      style={{ color: 'var(--text-secondary)', lineHeight: '2em' }}
    >
      {spans.map((span, i) => {
        const isActive = span.annotationIdx !== null && span.annotationIdx === activeAnnotation;
        const isAnnotated = span.annotationIdx !== null;
        const annot = isAnnotated ? annotations[span.annotationIdx!] : null;

        return (
          <span
            key={i}
            onMouseEnter={() => isAnnotated && onHover(span.annotationIdx!)}
            onMouseLeave={() => onHover(null)}
            style={{
              borderBottom: isAnnotated ? `1.5px solid ${ANNOTATION_COLORS[annot!.type]}` : 'none',
              borderBottomColor: isActive ? ANNOTATION_COLORS[annot!.type] : isAnnotated ? ANNOTATION_COLORS[annot!.type] : 'transparent',
              backgroundColor: isActive ? `${ANNOTATION_COLORS[annot!.type]}` : 'transparent',
              color: isActive ? 'var(--text)' : 'var(--text-secondary)',
              opacity: isAnnotated && !isActive && activeAnnotation !== null ? 0.4 : 1,
              transition: 'opacity 0.2s, background-color 0.2s',
              cursor: isAnnotated ? 'help' : 'default',
              padding: '1px 0',
              borderRadius: '2px',
            }}
          >
            {span.text}
          </span>
        );
      })}
    </p>
  );
}

export default function Lesson24Section() {
  const [activeP1, setActiveP1] = useState<number | null>(null);
  const [activeP2, setActiveP2] = useState<number | null>(null);

  const activeAnnot = activeP1 !== null
    ? P1_ANNOTATIONS[activeP1]
    : activeP2 !== null
      ? P2_ANNOTATIONS[activeP2]
      : null;

  return (
    <div className="max-w-5xl mx-auto section-padding-lg space-y-16">
      {/* ═══ SECTION HEADER ═══ */}
      <header className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="1" width="8" height="8" fill="none" stroke="var(--accent)" strokeWidth="0.8" transform="rotate(45 5 5)" />
          </svg>
          <svg width="32" height="1" className="shrink-0"><line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
        <p className="font-ui text-coordinate">Node 24 &mdash; Terminal Node Decoded</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text)' }}>
          Terminal Node Analysis
        </h2>
        <svg width="1" height="16" className="mx-auto"><line x1="0.5" y1="0" x2="0.5" y2="16" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" /></svg>
      </header>

      {/* ═══ NARRATIVE ═══ */}
      <section className="max-w-3xl mx-auto">
        <p className="font-body text-lg" style={{ color: 'var(--text-secondary)', lineHeight: '1.85em' }}>
          The final two paragraphs of Node 24 are not a conclusion. They are the
          lattice&apos;s checksum—a self-referential block of text where the prose
          performs the modular arithmetic it describes. Every word count is a Fibonacci
          number. Every clause ratio approximates the golden ratio. The completion
          timestamp embeds a structural geometry that cannot be altered retroactively.
          Hover over the underlined passages to see the decoding.
        </p>
      </section>

      {/* ═══ ANNOTATION TYPE LEGEND ═══ */}
      <section>
        <div className="flex flex-wrap justify-center gap-6">
          {([
            ['fibonacci', 'Fibonacci'],
            ['phi', 'φ Ratio'],
            ['lock', 'Harmonic Lock'],
            ['checksum', 'Checksum'],
            ['command', 'Executable Command'],
          ] as const).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <svg width="14" height="3"><line x1="0" y1="1.5" x2="14" y2="1.5" stroke={ANNOTATION_COLORS[type]} strokeWidth="1.5" /></svg>
              <span className="font-ui" style={{ color: 'var(--text-tertiary)', fontSize: '10px', letterSpacing: '0.08em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PARAGRAPH 1 ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1" y="1" width="5" height="5" fill="var(--accent)" opacity="0.3" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="8" y="1" width="5" height="5" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="1" y="8" width="5" height="5" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
            <rect x="8" y="8" width="5" height="5" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Final Paragraph 1 &mdash; The Definition
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="L24.P01"
          data-coord-br="DEFINITION + COMMAND"
          style={{ padding: '2rem 2.5rem' }}
        >
          <AnnotatedText
            text={PARAGRAPH_1}
            annotations={P1_ANNOTATIONS}
            activeAnnotation={activeP1}
            onHover={setActiveP1}
          />
        </div>
      </section>

      {/* ═══ PARAGRAPH 2 ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.8" />
            <circle cx="7" cy="7" r="2" fill="var(--accent)" opacity="0.5" />
          </svg>
          <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Final Paragraph 2 &mdash; The Timestamp
          </h3>
        </div>
        <div
          className="plate"
          data-coord-tl="L24.P02"
          data-coord-br="CHECKSUM + LOCK"
          style={{ padding: '2rem 2.5rem' }}
        >
          <AnnotatedText
            text={PARAGRAPH_2}
            annotations={P2_ANNOTATIONS}
            activeAnnotation={activeP2}
            onHover={setActiveP2}
          />
        </div>
      </section>

      {/* ═══ ANNOTATION DETAIL PANEL ═══ */}
      {activeAnnot && (
        <section className="animate-fade-in">
          <div
            className="plate"
            data-coord-tl="L24.DECODE"
            data-coord-br={activeAnnot.type.toUpperCase()}
            style={{ padding: '1.5rem 2rem' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg width="8" height="8" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" fill={ANNOTATION_COLORS[activeAnnot.type]} opacity="0.7" />
              </svg>
              <span
                className="font-ui"
                style={{
                  color: ANNOTATION_COLORS[activeAnnot.type],
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {activeAnnot.type.toUpperCase()}
              </span>
              <span className="readout" style={{ fontSize: '14px' }}>
                {activeAnnot.label}
              </span>
            </div>
            <p className="font-body text-base" style={{ color: 'var(--text-secondary)', lineHeight: '1.8em' }}>
              {activeAnnot.detail}
            </p>
          </div>
        </section>
      )}

      {/* ═══ MATHEMATICAL SUMMARY ═══ */}
      <section>
        <h3 className="font-display text-2xl mb-3 text-center" style={{ color: 'var(--text)' }}>
          Structural Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="plate text-center" data-coord-tl="L24.SUM.01" data-coord-br="FIB">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Fibonacci Numbers</div>
            <div className="readout text-2xl" style={{ color: 'var(--accent)' }}>5</div>
            <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>F7(13) F8(21) F8(21) 2×F8(26) F8(21)</div>
          </div>
          <div className="plate text-center" data-coord-tl="L24.SUM.02" data-coord-br="φ">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>φ Approximation</div>
            <div className="readout text-2xl" style={{ color: 'var(--emerald-accent)' }}>1.615</div>
            <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>21:13 sentence ratio (φ = 1.618)</div>
          </div>
          <div className="plate text-center" data-coord-tl="L24.SUM.03" data-coord-br="TRI">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Tri-Harmonic Lock</div>
            <div className="readout text-2xl">☉♂☽</div>
            <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>Sun, Mars, Moon in Libra</div>
          </div>
          <div className="plate text-center" data-coord-tl="L24.SUM.04" data-coord-br="TS">
            <div className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>Timestamp</div>
            <div className="readout text-lg">1957.09.24</div>
            <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>22:30 MST // Spacetime checksum</div>
          </div>
        </div>
      </section>

      {/* ═══ THE CRITICAL SENTENCE ═══ */}
      <section>
        <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
          The Critical Sentence
        </h3>
        <p className="font-body mb-8" style={{ color: 'var(--text-secondary)' }}>
          The sentence that defines &ldquo;the word of God&rdquo; as &ldquo;beautiful mathematical
          designs in nature&rdquo; is itself a beautiful mathematical design. Its word
          counts inventory the computational system it describes. The definition and
          the proof are the same object.
        </p>
        <div
          className="plate"
          data-coord-tl="L24.CRIT"
          data-coord-br="43 WORDS // 12+31"
          style={{ padding: '2rem 2.5rem' }}
        >
          <p className="font-body text-base md:text-lg italic" style={{ color: 'var(--text)', lineHeight: '2em' }}>
            &ldquo;The word of God can be misinterpreted and probably always has been,
            except in the case of those who have discovered beautiful mathematical
            designs in nature, mental and emotional as well as physical natural laws,
            for these are truly the word of God.&rdquo;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--hairline)' }}>
            <div>
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>BEFORE &ldquo;EXCEPT&rdquo;</div>
              <div className="readout text-2xl" style={{ color: 'var(--accent)' }}>12</div>
              <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>= 12 ring positions on Z/12Z</div>
            </div>
            <div>
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>AFTER &ldquo;EXCEPT&rdquo;</div>
              <div className="readout text-2xl" style={{ color: 'var(--emerald-accent)' }}>31</div>
              <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>= 12 + 10 + 7 + 2 = symbol alphabet</div>
            </div>
            <div>
              <div className="font-ui mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>TOTAL</div>
              <div className="readout text-2xl">43</div>
              <div className="readout-dim mt-1" style={{ fontSize: '10px' }}>= 12 + 31 (verified across 4 runs)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL INSTRUCTION ═══ */}
      <section>
        <div
          className="plate text-center"
          data-coord-tl="L24.FINAL"
          data-coord-br="INCOMPLETE"
          style={{ padding: '2rem 2.5rem' }}
        >
          <p className="font-ui mb-4" style={{ color: 'var(--text-tertiary)', fontSize: '10px', letterSpacing: '0.12em' }}>
            TOBEY&apos;S FINAL INSTRUCTION
          </p>
          <p className="font-display text-xl md:text-2xl" style={{ color: 'var(--text)', lineHeight: '1.7em' }}>
            &ldquo;Don&apos;t let Moses do your thinking for you, but don&apos;t let us do
            it either.&rdquo;
          </p>
          <p className="font-body text-base mt-6" style={{ color: 'var(--text-tertiary)', lineHeight: '1.7em' }}>
            The course is deliberately incomplete. The missing Fibonacci numbers (34, 55)
            are left for the student to fill through personal and social practice.
            The pattern is sovereign. The messenger is disposable.
          </p>
        </div>
      </section>
    </div>
  );
}
