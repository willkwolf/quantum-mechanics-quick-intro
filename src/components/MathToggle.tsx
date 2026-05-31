'use client';

import React from 'react';
import { useNotation } from '@/context/NotationContext';
import { Sparkles, GraduationCap } from 'lucide-react';

export default function MathToggle() {
  const { notation, toggleNotation } = useNotation();

  return (
    <button
      onClick={toggleNotation}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-500 ease-out glass cursor-pointer group ${
        notation === 'landau'
          ? 'border-accent-quantum/40 shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] bg-bg/80'
          : 'border-accent-classical/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] bg-bg/80'
      }`}
      aria-label="Alternar notación científica"
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {notation === 'landau' ? (
          <Sparkles className="w-5 h-5 text-accent-quantum animate-pulse" />
        ) : (
          <GraduationCap className="w-5 h-5 text-accent-classical transition-transform group-hover:scale-110" />
        )}
      </div>

      <div className="flex flex-col items-start leading-none text-left">
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted">
          Notación Física
        </span>
        <span className={`text-xs font-semibold tracking-wide transition-colors ${
          notation === 'landau' ? 'text-accent-quantum' : 'text-accent-classical'
        }`}>
          {notation === 'landau' ? 'L. Landau (Físico)' : 'Estándar (Estudiante)'}
        </span>
      </div>

      <div className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
        notation === 'landau' 
          ? 'bg-accent-quantum/10 text-accent-quantum border border-accent-quantum/20' 
          : 'bg-accent-classical/10 text-accent-classical border border-accent-classical/20'
      }`}>
        {notation === 'landau' ? 'E = ℏω' : 'E = hv'}
      </div>
    </button>
  );
}
