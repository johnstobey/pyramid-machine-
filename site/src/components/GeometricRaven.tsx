'use client';

import React from 'react';

interface GeometricRavenProps {
  className?: string;
  background?: boolean;
}

/**
 * The Geometric Raven — constructed from the machine's own parts:
 * the zodiac ring (12 ticks), the modality square that holds it open,
 * and the four element triangles as the wing's cluster feathers.
 */
export default function GeometricRaven({ className = '', background = false }: GeometricRavenProps) {
  const op = background ? 0.22 : 1;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    return {
      x1: 400 + 250 * Math.cos(a),
      y1: 320 + 250 * Math.sin(a),
      x2: 400 + 268 * Math.cos(a),
      y2: 320 + 268 * Math.sin(a),
    };
  });
  // element triangles on the ring (subtle, behind the bird)
  const tri = (offset: number) => {
    const pts = [0, 4, 8].map((n) => {
      const a = (((n * 30) + offset - 90) * Math.PI) / 180;
      return `${400 + 250 * Math.cos(a)},${320 + 250 * Math.sin(a)}`;
    });
    return pts.join(' ');
  };

  return (
    <svg
      viewBox="0 0 800 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Geometric raven: zodiac ring held open by a square, wing of triangle clusters"
    >
      {/* ── the ring, held open by the square ── */}
      <g opacity={op}>
        <circle cx="400" cy="320" r="250" stroke="var(--accent)" strokeWidth="1" opacity="0.55" />
        <rect
          x={400 - 250 * Math.SQRT1_2} y={320 - 250 * Math.SQRT1_2}
          width={250 * Math.SQRT2} height={250 * Math.SQRT2}
          stroke="var(--accent)" strokeWidth="0.7" opacity="0.3"
          transform={`rotate(45 ${400} ${320})`}
        />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
        ))}
        <polygon points={tri(0)} stroke="var(--accent)" strokeWidth="0.4" opacity="0.14" fill="none" />
        <polygon points={tri(30)} stroke="var(--accent)" strokeWidth="0.4" opacity="0.14" fill="none" />
      </g>

      {/* ── the raven ── */}
      <g opacity={op}>
        {/* head: small ring with clock ticks */}
        <circle cx="552" cy="132" r="46" stroke="var(--accent)" strokeWidth="1.6" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={552 + 46 * Math.cos(a)} y1={132 + 46 * Math.sin(a)}
              x2={552 + 39 * Math.cos(a)} y2={132 + 39 * Math.sin(a)}
              stroke="var(--accent)" strokeWidth="0.7" opacity="0.6"
            />
          );
        })}
        <circle cx="566" cy="124" r="5" fill="var(--accent)" />

        {/* beak: the 30° wedge */}
        <path d="M508 138 L432 158 L514 164 Z" stroke="var(--accent)" strokeWidth="1.4" fill="var(--accent)" fillOpacity="0.12" />

        {/* body: the load-bearing triangle */}
        <polygon
          points="552,178 626,452 338,430"
          stroke="var(--accent)" strokeWidth="1.8"
          fill="var(--accent)" fillOpacity="0.05"
        />

        {/* neck line into body */}
        <path d="M548 176 Q600 260 620 442" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />
        <path d="M556 178 Q520 300 352 424" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />

        {/* wing: four triangle clusters (the element triangles) */}
        <g stroke="var(--accent)" strokeWidth="1.2">
          <polygon points="560,240 668,190 640,318" fill="var(--accent)" fillOpacity="0.07" />
          <polygon points="556,286 676,252 636,376" fill="var(--accent)" fillOpacity="0.10" />
          <polygon points="548,330 664,314 614,428" fill="var(--accent)" fillOpacity="0.13" />
          <polygon points="540,372 642,374 590,468" fill="var(--accent)" fillOpacity="0.16" />
        </g>

        {/* tail: three stepped squares (the modality squares) */}
        <g stroke="var(--accent)" strokeWidth="1.2" fill="var(--accent)" fillOpacity="0.08">
          <rect x="300" y="404" width="70" height="26" transform="rotate(28 300 404)" />
          <rect x="268" y="428" width="70" height="26" transform="rotate(18 268 428)" />
          <rect x="242" y="456" width="70" height="26" transform="rotate(8 242 456)" />
        </g>

        {/* legs standing on the ring */}
        <line x1="520" y1="430" x2="512" y2="504" stroke="var(--accent)" strokeWidth="1.4" />
        <line x1="480" y1="428" x2="462" y2="512" stroke="var(--accent)" strokeWidth="1.4" />
        <path d="M512 504 L486 512 L462 512" stroke="var(--accent)" strokeWidth="1.2" fill="none" />

        {/* the two reserved sockets, dashed, below the ring */}
        <circle cx="336" cy="556" r="9" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <circle cx="386" cy="570" r="9" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <text x="410" y="576" fill="var(--accent)" fontSize="13" opacity="0.7" fontFamily="monospace">11 · 12</text>
      </g>
    </svg>
  );
}
