'use client';

/**
 * Ravenform Design Language v1.0 — Unit 1, geometry components.
 * Approved via execution mandate with hardcoded rulings:
 *   C1  = geometry-mitre-16.67mm   (§3.2.2: pitch 33.33, height 16.67, 45° mitre)
 *   C2  = formula-placement-governed (§3.2.3: x_n = n·2mm·(1+0.1n))
 *   C3  = grid-structural-density  (§5.1.2: density 8 bits/cm² governs)
 *   C-A = geometry-60-deg-angles-strict (§3.1.1: h = w·√3 = 90mm)
 *   C-B = extended-structural-ramp (Unit 2: CSS tokens)
 * 1 SVG unit = 1mm. Every value cites its lexicon section.
 */

import type React from 'react';

// §3.1.1 Diamond Lattice — unit 60mm, w = 60·cos30° = 51.962mm,
// h = w·√3 = 90mm [ruling C-A: 60°/120° angles strict],
// vertices (0,0),(w/2,h/2),(0,h),(-w/2,h/2), translations (w,0)+(w/2,h),
// line weight 1.5mm, edge-to-edge tessellation.
export function DiamondLattice({ width = 240, height = 240, className = '', opacity = 0.5 }: {
  width?: number; height?: number; className?: string; opacity?: number;
}) {
  const unit = 60;                              /* §3.1.1: unit size 60mm ±0.5 */
  const w = unit * Math.cos(Math.PI / 6);       /* §3.1.1: w = unit·cos(30°) = 51.962 */
  const h = w * Math.sqrt(3);                   /* ruling C-A: 2·atan(w/h) = 60° acute, 120° obtuse */
  const pid = 'rf-diamond';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <defs>
        <pattern id={pid} width={w} height={h} patternUnits="userSpaceOnUse">
          {/* center rhombus + corner triangles; neighbors reassemble triangles into rhombi */}
          <polygon points={`${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`}
                   fill="none" stroke="var(--text)" strokeWidth="1.5" />  /* §3.1.1: weight 1.5mm ±0.1 */
          <polygon points={`0,0 ${w},0 ${w / 2},${h / 2}`}
                   fill="none" stroke="var(--text)" strokeWidth="1.5" />
          <polygon points={`0,${h} ${w},${h} ${w / 2},${h / 2}`}
                   fill="none" stroke="var(--text)" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${pid})`} opacity={opacity} />
    </svg>
  );
}

// §3.1.2 X-Cross Lattice — 90° intersection, short arm 20mm, long arm 20·√2 = 28.28mm,
// square negative space, translations (2s+v,0)+(0,2s+v), weight 1.5mm.
export function XCrossLattice({ width = 240, height = 240, className = '', opacity = 0.5 }: {
  width?: number; height?: number; className?: string; opacity?: number;
}) {
  const s = 20;                                  /* §3.1.2: short arm 20mm ±0.5 */
  const l = s * Math.SQRT2;                      /* §3.1.2: long arm = s·√2 = 28.284mm ±0.5 */
  const v = 8;                                   /* square negative space between crosses */
  const T = 2 * s + v;                           /* §3.1.2: translation = 2s+v = 48mm */
  const c = T / 2;
  const pid = 'rf-xcross';
  const ln = (x1: number, y1: number, x2: number, y2: number, key: number) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text)" strokeWidth="1.5" />
  );
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <defs>
        <pattern id={pid} width={T} height={T} patternUnits="userSpaceOnUse">
          {ln(c - l, c - l, c + l, c + l, 0)}     /* §3.1.2: long arm, +diagonal */
          {ln(c + l, c - l, c - l, c + l, 1)}     /* §3.1.2: long arm, -diagonal */
          {ln(c - s, c, c + s, c, 2)}             /* §3.1.2: short arm, horizontal */
          {ln(c, c - s, c, c + s, 3)}             /* §3.1.2: short arm, vertical */
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${pid})`} opacity={opacity} />
    </svg>
  );
}

// §3.1.3 Recursive Tessellation — Fibonacci squares F(0..6) = 1,1,2,3,5,8,13,
// rotation 90° per iteration (90°·(n mod 4)), termination at 13-unit boundary.
export function RecursiveTessellation({ size = 240, className = '', opacity = 0.5 }: {
  size?: number; className?: string; opacity?: number;
}) {
  const F = [1, 1, 2, 3, 5, 8, 13];              /* §3.1.3 growth table; boundary F = 13 units */
  const u = size / 21;                           /* total spread ≤ 21 units, scaled to fit */
  const squares: Array<{ x: number; y: number; s: number }> = [];
  let bx = 0, by = 0, bw = F[0] * u, bh = F[0] * u;
  squares.push({ x: 0, y: 0, s: bw });
  for (let n = 1; n < F.length; n++) {
    const s = F[n] * u;
    let x = bx, y = by;                          /* §3.1.3: rotation = 90°·(n mod 4) */
    switch (n % 4) {
      case 1: x = bx + bw; y = by; break;        // attach right
      case 2: x = bx; y = by + bh; break;        // attach bottom
      case 3: x = bx - s; y = by + bh - s; break; // attach left
      case 0: x = bx + bw - s; y = by - s; break; // attach top
    }
    squares.push({ x, y, s });
    const nx = Math.min(bx, x), ny = Math.min(by, y);
    const nw = Math.max(bx + bw, x + s) - nx, nh = Math.max(by + bh, y + s) - ny;
    bx = nx; by = ny; bw = nw; bh = nh;
  }
  const ox = -bx, oy = -by;
  return (
    <svg width={bw + ox} height={bh + oy} viewBox={`0 0 ${bw + ox} ${bh + oy}`}
         className={className} aria-hidden="true">
      <g stroke="var(--text)" fill="none" opacity={opacity}>
        {squares.map((q, i) => (
          <rect key={i} x={q.x + ox} y={q.y + oy} width={q.s} height={q.s}
                strokeWidth={i === squares.length - 1 ? 1.5 : 0.75} />  /* 13-unit boundary emphasized */
        ))}
      </g>
    </svg>
  );
}

// §3.2.1 Diamond Core Frame — border 12% of container width, mullion offset
// 22.5° from lattice axes, 8 equal glazing panes, opaque frame, ≥85% glazing.
export function DiamondCoreFrame({ size = 150, className = '', opacity = 0.9 }: {
  size?: number; className?: string; opacity?: number;
}) {
  const c = size / 2;
  const R = c - 1;
  const inset = R * 0.12 * 2;                    /* §3.2.1: border thickness = 12% ±0.5% of width */
  const r = R - inset;
  const outer = `${c},${c - R} ${c + R},${c} ${c},${c + R} ${c - R},${c}`;
  const inner = `${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`;
  const mullions = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) * i + Math.PI / 8;   /* §3.2.1: mullion offset 22.5° ±0.1° */
    return (
      <line key={i} x1={c} y1={c} x2={c + r * Math.cos(a)} y2={c + r * Math.sin(a)} strokeWidth="1" />
    );                                           /* 8 radial mullions → 8 equal panes */
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      <g stroke="var(--text)" fill="none" opacity={opacity}>
        <polygon points={outer} strokeWidth="1.5" />
        <polygon points={inner} strokeWidth="1.5" />
        {mullions}
      </g>
    </svg>
  );
}

// §3.2.2 Chevron Border [ruling C1: geometry-mitre-16.67mm]
// pitch = 10cm/3 = 33.33mm, peak height 16.67mm, mitre 45° (rise/run = 1), weight 2.0mm.
export function ChevronBorder({ width = 360, className = '', opacity = 0.9 }: {
  width?: number; className?: string; opacity?: number;
}) {
  const pitch = 100 / 3;                         /* §3.2.2: 10cm/3 = 33.333mm ±0.5 */
  const height = 100 / 6;                        /* ruling C1: 16.667mm; mitre 45° ±0.1 (tan = 1) */
  const n = Math.ceil(width / pitch);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    pts.push(`${(i * pitch).toFixed(2)},${i % 2 === 0 ? height : 0}`);
  }
  return (
    <svg width={width} height={height + 2} viewBox={`0 0 ${width} ${height + 2}`}
         className={className} aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke="var(--text)"
                strokeWidth="2" opacity={opacity} />  /* §3.2.2: line weight 2.0mm ±0.1 */
    </svg>
  );
}

// §3.2.3 Tail Feather [ruling C2: formula-placement-governed]
// rachis θ(x) = 3° per 5cm; barbules x_n = n·2mm·(1+0.1n), l_n = l₀·(1−0.02n),
// angle 45° ±5°, paired, vane split 60/40, overlap 30%.
export function TailFeather({ width = 220, className = '', opacity = 0.8 }: {
  width?: number; className?: string; opacity?: number;
}) {
  const L = width;                               /* rendered rachis span (spec: 50cm reference) */
  const l0 = L * 0.22;                           /* l₀ base barbule length */
  const scale = L / 220;                         /* mm→panel scale factor */
  const barbules: React.ReactNode[] = [];
  let n = 0, x = 0;
  while (x < L - 4 && n < 80) {
    const xn = n * 2 * (1 + 0.1 * n);            /* §3.2.3 [ruling C2]: x_n = n·2mm·(1+0.1n) */
    x = xn * scale;
    const ln = l0 * (1 - 0.02 * n);              /* §3.2.3: l_n = l₀·(1−0.02n) */
    const dy = ln * Math.SQRT1_2;                /* §3.2.3: barbule angle 45° */
    const yCurve = (x / L) * (L * 0.06);         /* §3.2.3: rachis deflection 3°/5cm arc */
    if (x < L - 2) {
      barbules.push(
        <g key={n}>
          <line x1={x} y1={yCurve} x2={x + ln * 0.6} y2={yCurve + dy * 0.6} strokeWidth="0.5" />  {/* 60% vane */}
          <line x1={x} y1={yCurve} x2={x - ln * 0.4} y2={yCurve + dy * 0.4} strokeWidth="0.5" />  {/* 40% vane */}
        </g>
      );
    }
    n++;
  }
  const endY = 0.06 * L;                         /* terminal rachis deflection */
  return (
    <svg width={width} height={width * 0.55} viewBox={`0 0 ${width} ${width * 0.55}`}
         className={className} aria-hidden="true">
      <g stroke="var(--text)" fill="none" opacity={opacity}>
        <path d={`M0,2 Q${L / 2},${endY / 2 + 2} ${L},${endY}`} strokeWidth="1.5" />  {/* smooth rachis arc */}
        {barbules}
      </g>
    </svg>
  );
}

// §5.1.1 Chronological Nodes — 12 nodes, 30°±0.1 increments clockwise,
// rotation axis y-offset 15% of container height, majors at 0/90/180/270°,
// node Ø 4mm, connections 0.5mm straight, center-terminated, 100% opacity.
export function ChronologicalNodes({ size = 200, className = '', opacity = 0.9 }: {
  size?: number; className?: string; opacity?: number;
}) {
  const cx = size / 2;
  const cy = size / 2 + size * 0.15;             /* §5.1.1: axis Y-offset 15% ±1% of container */
  const R = size * 0.32;
  const nodes: Array<{ x: number; y: number; major: boolean }> = [];
  for (let i = 0; i < 12; i++) {                 /* §5.1.1: 12 nodes exact */
    const a = (i * 30 * Math.PI) / 180;          /* 30° ±0.1 steps, clockwise from top */
    nodes.push({
      x: cx + R * Math.sin(a),
      y: cy - R * Math.cos(a),
      major: i % 3 === 0,                        /* majors at 0°, 90°, 180°, 270° */
    });
  }
  const links = nodes.map((p, i) => {
    const q = nodes[(i + 1) % 12];
    return <line key={`l${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} strokeWidth="0.5" />;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      <g stroke="var(--text)" fill="none" opacity={opacity}>
        {links}
        {nodes.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.major ? 2 : 1.5}   /* Ø 4mm major / 3mm minor */
                  fill={p.major ? 'var(--text)' : 'none'} strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}

// §5.1.2 Telemetry Matrix [ruling C3: grid-structural-density]
// 3 rows × 5 columns, cells 20×40mm (1:2 w:h ±0.05), collapsed borders
// (1mm → 0.5mm visible = 50% collapse), markers 2mm circles at 4mm spacing.
// Density ruling 8 bits/cm² = 64 bits/cell; the 4mm marker grid admits 50
// positions per cell (5×10) — residual conflict C3-R flagged, grid executed.
export function TelemetryMatrix({ className = '', opacity = 0.9 }: {
  className?: string; opacity?: number;
}) {
  const cw = 20, ch = 40;                        /* §5.1.2: cell 20×40mm, ratio 1:2 */
  const cols = 5, rows = 3;                      /* §5.1.2: 5 columns × 3 rows exact */
  const W = cols * cw, H = rows * ch;
  const cells: React.ReactNode[] = [];
  const markers: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw, y = r * ch;
      cells.push(
        <rect key={`c${r}${c}`} x={x} y={y} width={cw} height={ch} strokeWidth="0.5" />
      );                                         /* §5.1.2: visible border 0.5mm (50% collapse of 1mm) */
      for (let my = 3; my <= ch - 3; my += 4) {  /* §5.1.2: marker spacing 4mm ±0.5 */
        for (let mx = 3; mx <= cw - 3; mx += 4) {
          const idx = (my / 4) * 5 + (mx / 4);
          markers.push(
            <circle key={`b${r}${c}_${idx}`} cx={x + mx} cy={y + my} r="1"
                    fill="var(--text)" stroke="none" opacity={idx % 3 === 0 ? 0.9 : 0.25} />
          );                                     /* §5.1.2: marker 2mm circle, accent */
        }
      }
    }
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      <g stroke="var(--text)" fill="none" opacity={opacity}>{cells}</g>
      <g opacity={opacity}>{markers}</g>
    </svg>
  );
}
