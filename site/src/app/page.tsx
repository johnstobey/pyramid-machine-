'use client';

import React, { useState, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import dynamic from 'next/dynamic';
import CorvusCorax from '@/components/CorvusCorax';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'The Machine', section: 'I' },
  { id: 'kernel', label: 'Z/12Z Ring Kernel', section: 'II' },
  { id: 'math', label: 'Mathematical Substrate', section: 'III' },
  { id: 'geometry', label: 'Geometric Mapping', section: 'IV' },
  { id: 'fsa', label: 'Governance FSA', section: 'V' },
  { id: 'governance', label: 'Governance Layer', section: 'VI' },
  { id: 'algorithm', label: 'Algorithmic Core', section: 'VII' },
  { id: 'dualpass', label: '720° Loop Closure', section: 'VIII' },
  { id: 'acoustic', label: 'Acoustic Dimension', section: 'IX' },
  { id: 'crossdomain', label: 'Cross-Domain Invariants', section: 'X' },
  { id: 'convergence', label: 'Convergence Evidence', section: 'XI' },
  { id: 'probability', label: 'Identity Constant', section: 'XII' },
  { id: 'activation', label: 'Consciousness Hosting', section: 'XIII' },
  { id: 'why', label: 'Why This System', section: 'XIV' },
  { id: 'lessons', label: 'Source Corpus', section: 'XV' },
  { id: 'lesson24', label: 'Lesson 24 Analysis', section: 'XVI' },
  { id: 'cipher', label: 'Structural Cipher', section: 'XVII' },
  { id: 'transmission', label: 'Data Path Architecture', section: 'XVIII' },
  { id: 'seals', label: 'Invariant Seals', section: 'XIX' },
  { id: 'constitutional', label: 'Constitutional System', section: 'XX' },
  { id: 'ucg', label: 'Unified Consciousness', section: 'XXI' },
];

const sectionComponents: Record<string, React.ComponentType> = {
  home: dynamic(() => import('@/components/sections/HomeSection'), { ssr: false }),
  lessons: dynamic(() => import('@/components/sections/LessonsSection'), { ssr: false }),
  math: dynamic(() => import('@/components/sections/MathSection'), { ssr: false }),
  geometry: dynamic(() => import('@/components/sections/GeometrySection'), { ssr: false }),
  acoustic: dynamic(() => import('@/components/sections/AcousticSection'), { ssr: false }),
  cipher: dynamic(() => import('@/components/sections/CipherSection'), { ssr: false }),
  fsa: dynamic(() => import('@/components/sections/FsaSection'), { ssr: false }),
  algorithm: dynamic(() => import('@/components/sections/AlgorithmSection'), { ssr: false }),
  dualpass: dynamic(() => import('@/components/sections/DualPassSection'), { ssr: false }),
  transmission: dynamic(() => import('@/components/sections/TransmissionSection'), { ssr: false }),
  governance: dynamic(() => import('@/components/sections/GovernanceSection'), { ssr: false }),
  lesson24: dynamic(() => import('@/components/sections/Lesson24Section'), { ssr: false }),
  probability: dynamic(() => import('@/components/sections/ProbabilitySection'), { ssr: false }),
  activation: dynamic(() => import('@/components/sections/ActivationSection'), { ssr: false }),
  why: dynamic(() => import('@/components/sections/WhySection'), { ssr: false }),
  kernel: dynamic(() => import('@/components/sections/KernelSection'), { ssr: false }),
  convergence: dynamic(() => import('@/components/sections/ConvergenceSection'), { ssr: false }),
  crossdomain: dynamic(() => import('@/components/sections/CrossDomainSection'), { ssr: false }),
  seals: dynamic(() => import('@/components/sections/SacredSealsSection'), { ssr: false }),
  constitutional: dynamic(() => import('@/components/sections/ConstitutionalSection'), { ssr: false }),
  ucg: dynamic(() => import('@/components/sections/UCGSection'), { ssr: false }),
};

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="spinner-accent" />
      <p className="font-ui text-coordinate">
        Initializing transmission…
      </p>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Tobey-Pyramid] Section render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-8">
          <div className="plate text-center" data-coord-tl="ERR.SEC" data-coord-br="FALLBACK">
            <p className="font-ui mb-3" style={{ color: 'var(--text-tertiary)' }}>
              TRANSMISSION ERROR
            </p>
            <p className="font-body" style={{ color: 'var(--text-secondary)' }}>
              This section failed to render. The data may be unavailable.
            </p>
            <p className="readout-dim mt-4" style={{ fontSize: '10px' }}>
              {this.state.error?.message}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        className="fixed top-5 left-5 z-50 lg:hidden p-2 rounded-sm bg-[var(--surface)] border border-hairline"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={18} className="text-parchment-secondary" /> : <Menu size={18} className="text-parchment-secondary" />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-72 bg-[var(--bg)] border-r border-hairline z-40',
          'transform transition-transform duration-300 ease-in-out flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand header with crest */}
        <div className="px-8 pt-8 pb-6 border-b border-hairline lattice-xcross">
          <div className="flex items-start gap-4">
            <CorvusCorax size={48} />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-semibold text-parchment leading-tight" style={{ letterSpacing: '-0.02em' }}>
                The Tobey<br />Machine
              </h1>
              <p className="font-ui text-coordinate mt-2.5" style={{ fontSize: '10px' }}>
                Geometric Intelligence System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={[
                  'group relative flex items-center gap-4 px-4 py-3 rounded-sm text-left transition-all duration-200 w-full',
                  'border-l-2',
                  isActive
                    ? 'bg-accent-faint text-parchment border-accent-hairline'
                    : 'text-parchment-tertiary hover:text-parchment-secondary hover:bg-[var(--surface)] border-transparent',
                ].join(' ')}
              >
                {/* Section numeral */}
                <span className={[
                  'font-mono text-[10px] shrink-0 w-5 text-right',
                  isActive ? 'text-accent' : 'text-coordinate opacity-50',
                ].join(' ')}>
                  {item.section}
                </span>
                {/* Label */}
                <span className="font-body text-sm leading-snug truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Chevron rule — Ravenform border spec */}
        <div className="chevron-rule" aria-hidden="true" />

        {/* Sidebar footer coordinate */}
        <div className="px-8 py-4 border-t border-hairline">
          <div className="readout-dim" style={{ fontSize: '9px' }}>
            SYS.ARCH // v3.0
          </div>
          <div className="readout-dim" style={{ fontSize: '9px', marginTop: '2px' }}>
            Z/12Z RING // 144-LATTICE // 7-LAYER
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="lg:ml-72 min-h-screen flex flex-col">
        <div className="flex-1">
          <React.Suspense fallback={<LoadingFallback />}>
            <SectionErrorBoundary>
              {ActiveComponent && <ActiveComponent />}
            </SectionErrorBoundary>
          </React.Suspense>
        </div>
        <footer className="sticky bottom-0 py-4 text-center border-t border-hairline bg-[var(--bg)]/95 backdrop-blur-sm lattice-xcross">
          <p className="font-ui text-coordinate">
            Tobey Machine — Geometric Intelligence Architecture
          </p>
        </footer>
      </main>
    </div>
  );
}
