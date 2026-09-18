'use client';

import React from 'react';

interface GeometricRavenProps {
  className?: string;
  background?: boolean;
}

/** Tapered feather: quad from a base segment to a tip segment. */
function feather(bx0: number, by0: number, bx1: number, by1: number,
                 tx: number, ty: number, baseW: number, tipW: number): string {
  const dx = bx1 - bx0, dy = by1 - by0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;
  return [
    `${bx0 + nx * baseW / 2},${by0 + ny * baseW / 2}`,
    `${tx + nx * tipW / 2},${ty + ny * tipW / 2}`,
    `${tx - nx * tipW / 2},${ty - ny * tipW / 2}`,
    `${bx0 - nx * baseW / 2},${by0 - ny * baseW / 2}`,
  ].join(' ');
  void mx; void my;
}

/**
 * The Geometric Raven — faceted corvid with real mass: closed dark silhouette,
 * layered wing (coverts over primaries), wedge tail, standing on the zodiac
 * ring (12 ticks) held open by the inscribed square. Sockets 11 · 12 reserved.
 */
export default function GeometricRaven({ className = '', background = false }: GeometricRavenProps) {
  const op = background ? 0.9 : 1;
  const C = { x: 470, y: 330 };
  const R = 290;
  const d = R * Math.SQRT1_2;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    return {
      x1: C.x + R * Math.cos(a), y1: C.y + R * Math.sin(a),
      x2: C.x + (R + 18) * Math.cos(a), y2: C.y + (R + 18) * Math.sin(a),
    };
  });

  // ── wing: primaries (7 long, outer arc) from a root line on the back ──
  const rootA = [600, 268];
  const rootB = [634, 428];
  const primTips = [
    [768, 88], [812, 136], [848, 192], [874, 254],
    [888, 320], [888, 386], [874, 448],
  ];
  const primaries = primTips.map((tip, i) => {
    const t0 = i / primTips.length, t1 = (i + 1.15) / primTips.length;
    const bx0 = rootA[0] + (rootB[0] - rootA[0]) * t0, by0 = rootA[1] + (rootB[1] - rootA[1]) * t0;
    const bx1 = rootA[0] + (rootB[0] - rootA[0]) * t1, by1 = rootA[1] + (rootB[1] - rootA[1]) * t1;
    return feather(bx0, by0, bx1, by1, tip[0], tip[1], 26, 5);
  });
  // ── coverts: 3 short layered feathers near the shoulder ──
  const covTips = [[678, 232], [702, 268], [718, 306]];
  const coverts = covTips.map((tip, i) => {
    const t0 = i / 6, t1 = (i + 1.4) / 6;
    const bx0 = rootA[0] + (rootB[0] - rootA[0]) * t0, by0 = rootA[1] + (rootB[1] - rootA[1]) * t0;
    const bx1 = rootA[0] + (rootB[0] - rootA[0]) * t1, by1 = rootA[1] + (rootB[1] - rootA[1]) * t1;
    return feather(bx0, by0, bx1, by1, tip[0], tip[1], 30, 8);
  });

  return (
    <svg
      viewBox="0 0 1000 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Geometric raven standing on the zodiac ring held open by a square, layered triangle-cluster wing"
    >
      <g opacity={op}>
        {/* ── the ring, held open by the square ── */}
        <circle cx={C.x} cy={C.y} r={R} stroke="var(--accent)" strokeWidth="1.2" opacity="0.5" />
        <rect
          x={C.x - d} y={C.y - d} width={d * 2} height={d * 2}
          stroke="var(--accent)" strokeWidth="0.8" opacity="0.28"
          transform={`rotate(45 ${C.x} ${C.y})`}
        />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
        ))}

        {/* ── the raven ── */}
        {/* wedge tail: one bold bounded shape with dividers */}
        <polygon
          points="536,446 828,646 862,596 620,420"
          stroke="var(--accent)" strokeWidth="2" fill="var(--accent)" fillOpacity="0.14"
        />
        <line x1="596" y1="452" x2="776" y2="626" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        <line x1="646" y1="442" x2="812" y2="606" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />

        {/* wing: layered primaries (behind body) */}
        {primaries.map((pts, i) => (
          <polygon key={`p${i}`} points={pts} stroke="var(--accent)" strokeWidth="1.3"
            fill="var(--accent)" fillOpacity={0.08 + (i % 3) * 0.06} />
        ))}

        {/* body: closed, chest-heavy silhouette with real mass */}
        <polygon
          points="484,222 588,250 640,348 624,472 508,460 462,344"
          stroke="var(--accent)" strokeWidth="2.6" fill="#141922"
        />
        {/* facet lines across the mass */}
        <line x1="486" y1="290" x2="612" y2="306" stroke="var(--accent)" strokeWidth="0.9" opacity="0.5" />
        <line x1="472" y1="366" x2="622" y2="378" stroke="var(--accent)" strokeWidth="0.9" opacity="0.45" />
        <line x1="482" y1="436" x2="616" y2="446" stroke="var(--accent)" strokeWidth="0.9" opacity="0.4" />

        {/* coverts layer over the body's back */}
        {coverts.map((pts, i) => (
          <polygon key={`c${i}`} points={pts} stroke="var(--accent)" strokeWidth="1.2"
            fill="var(--accent)" fillOpacity={0.16 + i * 0.05} />
        ))}

        {/* head: solid, ringed like the clock */}
        <circle cx="466" cy="180" r="54" stroke="var(--accent)" strokeWidth="2.6" fill="#141922" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          return (
            <line key={i}
              x1={466 + 54 * Math.cos(a)} y1={180 + 54 * Math.sin(a)}
              x2={466 + 45 * Math.cos(a)} y2={180 + 45 * Math.sin(a)}
              stroke="var(--accent)" strokeWidth="1.1" opacity="0.7" />
          );
        })}
        <circle cx="444" cy="168" r="7.5" fill="var(--accent)" />
        <circle cx="447" cy="165" r="2.2" fill="#141922" />

        {/* beak: the 30° wedge — long, sharp, heavy */}
        <polygon points="424,158 306,206 430,220" stroke="var(--accent)" strokeWidth="2"
          fill="var(--accent)" fillOpacity="0.38" />
        <line x1="306" y1="206" x2="428" y2="188" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6" />

        {/* neck join */}
        <polygon points="458,228 526,212 540,264 488,296" stroke="var(--accent)" strokeWidth="1.6"
          fill="#141922" />

        {/* legs gripping the ring */}
        <line x1="558" y1="464" x2="548" y2="548" stroke="var(--accent)" strokeWidth="3" />
        <line x1="600" y1="466" x2="602" y2="554" stroke="var(--accent)" strokeWidth="3" />
        <path d="M548 548 l-17 10 M548 548 l4 15 M548 548 l17 8" stroke="var(--accent)" strokeWidth="1.8" fill="none" />
        <path d="M602 554 l-17 10 M602 554 l4 15 M602 554 l17 8" stroke="var(--accent)" strokeWidth="1.8" fill="none" />

        {/* the two reserved sockets, dashed, below the ring */}
        <circle cx="382" cy="652" r="10" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
        <circle cx="438" cy="666" r="10" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
        <text x="462" y="672" fill="var(--accent)" fontSize="15" opacity="0.75" fontFamily="monospace">11 · 12</text>
      </g>
    </svg>
  );
}
