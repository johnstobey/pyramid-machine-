# RAVENFORM HANDOFF PACKAGE — v1.0
**Generated:** 2026-08-20 · **Mode:** zero-discretion enforced

## 1. TRUE EXECUTION STATUS

| Unit | Scope | Status |
|------|-------|--------|
| Unit 1 | `site/src/components/Ravenform.tsx` — 8 geometry components | ✅ COMPLETE (written to disk, rulings hardcoded) |
| Unit 2 | `globals.css` — tokens + states | ❌ NOT WRITTEN — code specified in §4 below, awaits approval |
| Unit 3 | `HomeSection.tsx` / `page.tsx` mount diffs | ⏸ PENDING |
| Unit 4 | Desktop & Mobile grid layouts | ⏸ PENDING |

## 2. GOVERNING RULINGS (hardcoded, immutable)

```
C1  = geometry-mitre-16.67mm        §3.2.2 chevron: pitch 33.33mm, height 16.67mm, 45° mitre
C2  = formula-placement-governed    §3.2.3 barbules: x_n = n·2mm·(1+0.1n)
C3  = grid-structural-density       §5.1.2 density 8 bits/cm² governs
C-A = geometry-60-deg-angles-strict §3.1.1 diamond: h = w·√3 = 90mm
C-B = extended-structural-ramp      §2.1.3 all 10 grayscale levels implemented
```

## 3. UNIT 1 ASSETS (on disk)

- Path: `site/src/components/Ravenform.tsx`
- Exports: `DiamondLattice`, `XCrossLattice`, `RecursiveTessellation`, `DiamondCoreFrame`, `ChevronBorder`, `TailFeather`, `ChronologicalNodes`, `TelemetryMatrix`
- Every metric carries a `/* §cite */` comment. 1 SVG unit = 1mm.

## 4. UNIT 2 SPECIFICATION (code-ready, NOT yet written to globals.css)

### 4.1 Color tokens [C-B extended ramp]
```css
:root {
  /* §2.1.1 primary palette (9) */
  --rf-bg-primary: #121110;    --rf-bg-secondary: #1A1918;
  --rf-text-primary: #E8E8E0;  --rf-text-secondary: #B8B8B0;  --rf-text-tertiary: #9A9A92;
  --rf-line-diamond: #E8E8E0;  --rf-line-xcross: #D4D4CE;
  --rf-line-chevron: #B8B8B0;  --rf-line-structural: #2A2928;
  /* §2.1.2 semantic (4) */
  --rf-success: #4CAF50;  --rf-warning: #FBC02D;  --rf-error: #E53935;  --rf-info: #1E88E5;
  /* §2.1.3 extended structural ramp (10 levels, C-B) */
  --rf-gray-0: #121110; --rf-gray-1: #1A1918; --rf-gray-2: #2A2928; --rf-gray-3: #4A4A4A;
  --rf-gray-4: #737373; --rf-gray-5: #9A9A92; --rf-gray-6: #B8B8B0; --rf-gray-7: #D4D4CE;
  --rf-gray-8: #E8E8E0; --rf-gray-9: #F5F0EB;
}
```

### 4.2 Typography tokens (§2.2)
```css
:root {
  --rf-font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --rf-font-ui: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  --rf-h1: 56px/1.1 700;   /* compressed notation: size/lh weight */
  --rf-h2: 40px/1.2 600;   --rf-h3: 28px/1.3 600;   --rf-subheading: 20px/1.4 500;
  --rf-body-lg: 18px/1.6 400;  --rf-body: 16px/1.6 400;  --rf-body-sm: 14px/1.5 400;
  --rf-label: 12px/1.4 500;
  --rf-tracking-heading: 0.02em;  --rf-tracking-body: 0.01em;  --rf-tracking-label: 0.05em;
}
```

### 4.3 Spacing tokens (§2.3 — Fibonacci 3·5·8·13·21·34·55, ±0.5px)
```css
:root {
  --rf-space-xs: 3px; --rf-space-sm: 5px; --rf-space-md: 8px; --rf-space-lg: 13px;
  --rf-space-xl: 21px; --rf-space-xxl: 34px; --rf-space-xxxl: 55px;
  --rf-gutter-tight: 3px 5px;  --rf-gutter-normal: 8px 13px;  --rf-gutter-loose: 21px 34px;
}
```

### 4.4 Motion tokens (§4.2)
```css
:root {
  --rf-dur-default: 200ms;   --rf-dur-lattice-shift: 300ms;  --rf-dur-modal-open: 300ms;
  --rf-dur-modal-close: 200ms;  --rf-dur-grid-reflow: 150ms;  --rf-dur-state-long: 400ms;
  --rf-ease-standard: cubic-bezier(0.42, 0.00, 0.58, 1.00);
  --rf-ease-gentle:   cubic-bezier(0.25, 0.10, 0.25, 1.00);
  --rf-ease-sharp:    cubic-bezier(0.40, 0.00, 0.60, 1.00);
  --rf-ease-smooth:   cubic-bezier(0.20, 0.00, 0.40, 1.00);
  --rf-ease-slow-out: cubic-bezier(0.00, 0.00, 0.20, 1.00);
  --rf-ease-slow-in:  cubic-bezier(0.80, 0.00, 1.00, 1.00);
  --rf-ease-chrono:   cubic-bezier(0.34, 1.56, 0.64, 1.00);
}
```

### 4.5 State classes (§4.1 matrices)
```css
/* hover: §4.1.2 · press: §4.1.3 · focus: §4.1.4 (2px border, 8px glow, 30%) */
.rf-fill-panel:hover   { opacity: 0.70; transform: scale(1.05); }
.rf-fill-panel:active  { opacity: 0.90; transform: scale(0.95); }
.rf-lattice-shift      { transition: all var(--rf-dur-lattice-shift) var(--rf-ease-smooth); }
.rf-lattice-shift:hover{ opacity: 0.80; transform: translate(4px, 4px) rotate(0.5deg); }
.rf-tail-feather:hover { opacity: 0.80; transform: scale(1.02); }
.rf-chrono-node:hover  { opacity: 0.85; transform: scale(1.03); }
.rf-telemetry-cell:hover { opacity: 0.90; transform: scale(1.02); }
.rf-frame:focus-visible, .rf-frame:hover { outline: 2px solid var(--rf-line-diamond);
  outline-offset: 0; box-shadow: 0 0 8px rgba(232,232,224,0.30); }  /* §4.1.4 */
.rf-modal-open   { transition: transform var(--rf-dur-modal-open) var(--rf-ease-slow-out); }
.rf-modal-close  { transition: transform var(--rf-dur-modal-close) var(--rf-ease-slow-in); }
```

## 5. CONFLICT REGISTRY

| ID | Status |
|----|--------|
| C1, C2, C3, C-A, C-B | RULED — hardcoded |
| C3-R (residual) | OPEN — 64 bits/cell vs 50 grid positions; grid executed at 50 |
| C-C | NOT ENCOUNTERED IN EXECUTION — §6.1 used as authoritative for Unit 4 |

## 6. INGESTION PROTOCOL FOR NEXT RUNTIME

1. Read rulings (§2) — immutable, no re-derivation.
2. Unit 2: write §4 CSS blocks verbatim to `site/src/app/globals.css` upon operator approval; legacy non-conformant token block is replaced, not merged.
3. Unit 3: mount diffs replace prior approximate component usage in `HomeSection.tsx` (imports: `DiamondLattice, XCrossLattice, RecursiveTessellation, DiamondCoreFrame, ChevronBorder, TailFeather, ChronologicalNodes, TelemetryMatrix`).
4. Unit 4: implement §6.1 sector grid + §6.2 mobile grid; gutter/height/breakpoint values in manifest M2/G12–G13.
5. Verification: render + screenshot per unit; no completion claims without shown evidence.
