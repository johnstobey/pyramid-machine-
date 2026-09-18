'use client';

import React, { useState, useId } from 'react';

interface CorvusCoraxProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function CorvusCorax({ size = 44, className = '', animate = false }: CorvusCoraxProps) {
  const stableId = useId().replace(/:/g, '');
  const id = animate ? `cc-${stableId}` : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Corvus Corax crest"
      role="img"
    >
      <defs>
        {id && (
          <>
            <style>
              {`@keyframes crest-draw-${id} {
                from { stroke-dashoffset: 400; }
                to { stroke-dashoffset: 0; }
              }`}
            </style>
            <linearGradient id={`accent-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-dim)" />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Outer shield boundary */}
      <path
        d="M50 4 L92 20 L92 55 Q92 82 50 96 Q8 82 8 55 L8 20 Z"
        stroke={id ? `url(#accent-grad-${id})` : 'var(--accent)'}
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
        strokeDasharray={id ? '400' : undefined}
        style={id ? { animation: `crest-draw-${id} 2s ease-out forwards` } : undefined}
      />

      {/* Inner triangular pyramid form (3 lines converging) */}
      <line x1="50" y1="18" x2="28" y2="78" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="50" y1="18" x2="72" y2="78" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
      <line x1="28" y1="78" x2="72" y2="78" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />

      {/* 12 radial tick marks around inner circle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 50;
        const cy = 46;
        const r1 = 16;
        const r2 = 21;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(angle)}
            y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)}
            y2={cy + r2 * Math.sin(angle)}
            stroke="var(--accent)"
            strokeWidth="0.6"
            opacity={i % 3 === 0 ? 0.6 : 0.25}
          />
        );
      })}

      {/* Central dot */}
      <circle cx="50" cy="46" r="2" fill="var(--accent)" opacity="0.7" />

      {/* Inner circle ring */}
      <circle cx="50" cy="46" r="16" stroke="var(--accent)" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Raven silhouette - abstract geometric bird */}
      <path
        d="M50 28 L46 32 L42 30 L40 34 L36 33 L38 37 L34 38 L37 41 L35 44 L39 43 L41 46 L44 44 L47 47 L50 44 L53 47 L56 44 L59 43 L63 44 L61 41 L64 38 L60 37 L62 33 L58 34 L56 30 L52 32 Z"
        stroke="var(--accent)"
        strokeWidth="0.7"
        fill="var(--accent)"
        fillOpacity="0.08"
        opacity="0.8"
      />

      {/* "CC" monogram below pyramid */}
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.15em"
        fill="var(--accent)"
        opacity="0.5"
      >
        CC
      </text>
    </svg>
  );
}
