'use client';

import React, { useState } from 'react';
import { useNotation } from '@/context/NotationContext';
import MathEq from './Math';
import { Layers, Flame, TrendingUp, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  standardFormula: string;
  landauFormula: string;
  annotation: string;
}

export default function ClassicalDerivation() {
  const { notation } = useNotation();
  const [activeStep, setActiveStep] = useState(0);
  
  // Interactive mini-states for Step 0 (wave frequency multiplier)
  const [waveMode, setWaveMode] = useState(2); // 1, 2, 3 standing wave modes

  const steps: StepData[] = [
    {
      title: "Paso 1: Modos en la Cavidad",
      subtitle: "Geometría de Ondas Estacionarias",
      icon: <Layers className="w-5 h-5 text-accent-classical" />,
      description: "El electromagnetismo clásico exige que la radiación térmica dentro de una cavidad metálica de volumen $V = L^3$ forme ondas estacionarias (como las cuerdas de una guitarra). Sus amplitudes deben ser nulas en las paredes. Esto restringe las longitudes de onda permitidas a $\\lambda = 2L/n$. A medida que la frecuencia aumenta, el número de formas posibles de oscilar crece de forma cuadrática ($N(\\nu) \\propto \\nu^2$).",
      standardFormula: "N(\\nu) \\, d\\nu = \\frac{8\\pi V}{c^3} \\nu^2 \\, d\\nu",
      landauFormula: "g(\\omega) \\, d\\omega = \\frac{V \\omega^2}{\\pi^2 c^3} \\, d\\omega",
      annotation: "Landau calcula la densidad de estados en función de la frecuencia angular \\omega. El factor 8\\pi estándar surge clásica y geométricamente de dos polarizaciones transversales."
    },
    {
      title: "Paso 2: Equipartición de Energía",
      subtitle: "Termodinámica Clásica de Boltzmann",
      icon: <Flame className="w-5 h-5 text-accent-classical" />,
      description: "Según el Teorema de Equipartición de la física clásica de Boltzmann, cada oscilador electromagnético en equilibrio térmico a temperatura $T$ almacena exactamente la misma energía promedio: $\\langle E \\rangle = k_B T$. La física clásica asume que la energía es un continuo fluido, por lo que cualquier oscilador, sin importar cuán inmensa sea su frecuencia, puede excitarse con esta cantidad fija de energía térmica.",
      standardFormula: "\\langle E \\rangle = k_B T",
      landauFormula: "\\langle E \\rangle = T \\quad (k_B = 1)",
      annotation: "Aquí reside la hipótesis clásica mortal: se asume que un modo de frecuencia ultravioleta o rayos X se excita con la misma energía promedio que un modo de radio de baja frecuencia."
    },
    {
      title: "Paso 3: Ley Espectral Resultante",
      subtitle: "La Multiplicación de Rayleigh-Jeans",
      icon: <TrendingUp className="w-5 h-5 text-accent-danger animate-pulse" />,
      description: "Multiplicando la densidad geométrica de los modos permitidos (Paso 1) por la energía clásica media asignada a cada modo (Paso 2), Rayleigh y Jeans obtuvieron su ley espectral. Como el número de modos crece con el cuadrado de la frecuencia ($u \\propto \\nu^2$), la densidad espectral clásica de energía se dispara de manera cuadrática e imparable al aumentar la frecuencia.",
      standardFormula: "u(\\nu, T) = \\frac{8\\pi \\nu^2}{c^3} k_B T",
      landauFormula: "dE_\\omega = V \\frac{\\omega^2}{\\pi^2 c^3} T \\, d\\omega",
      annotation: "Esta fórmula describe de manera correcta el comportamiento real de bajas frecuencias (infrarrojo), pero fracasa espectacularmente a frecuencias altas."
    },
    {
      title: "Paso 4: El Colapso Físico",
      subtitle: "La Integral Fatal de la Catástrofe",
      icon: <AlertTriangle className="w-5 h-5 text-accent-danger animate-bounce" />,
      description: "Para hallar la energía total dentro de la cavidad, Rayleigh y Jeans integraron la densidad espectral para todas las frecuencias de $0 \\to \\infty$. Dado que la función espectral es cuadrática y diverge linealmente, la integral matemática arroja un resultado infinito ($\\infty$). Físicamente, esto significaría que cualquier cuerpo caliente se enfriaría instantáneamente en una millonésima de segundo emitiendo una radiación de energía infinita.",
      standardFormula: "E_{total} = \\int_{0}^{\\infty} \\frac{8\\pi k_B T}{c^3} \\nu^2 \\, d\\nu = \\infty",
      landauFormula: "E / V = \\int_{0}^{\\infty} \\frac{\\omega^2}{\\pi^2 c^3} T \\, d\\omega = \\infty",
      annotation: "Este absurdo matemático demostró que la física clásica contenía un error fundamental y sistemático en sus cimientos. La naturaleza no es clásica."
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  // Helper parser for paragraphs with LaTeX
  const renderDescription = (text: string) => {
    const parts = text.split(/(\$[\s\S]*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        return <MathEq key={index} formula={formula} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-[850px] mx-auto glass bg-white/2 border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      
      {/* Background glow specific to catastrophe progress */}
      <div 
        className="absolute inset-0 bg-accent-danger/3 blur-[80px] pointer-events-none transition-opacity duration-700"
        style={{ opacity: activeStep === 3 ? 0.7 : 0.1 }}
      />

      <div className="flex flex-col border-b border-white/10 pb-4">
        <span className="text-[10px] font-mono text-accent-classical uppercase tracking-widest font-bold mb-1">
          Módulo de apredizaje interactivo
        </span>
        <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
          El Desglose de la Catástrofe: Deducción Paso a Paso
        </h3>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          Recorre las 4 etapas del cálculo clásico que rompió la termodinámica del siglo XIX.
        </p>
      </div>

      {/* Steps indicators navigation bar */}
      <div className="flex justify-between items-center bg-black/40 border border-white/5 rounded-2xl p-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`flex-grow flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeStep === idx 
                ? 'bg-accent-classical/10 text-accent-classical border border-accent-classical/20 font-bold' 
                : 'text-text-muted hover:text-white hover:bg-white/2 border border-transparent'
            }`}
            aria-label={`Ir al paso ${idx + 1}: ${step.title}`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${
              activeStep === idx ? 'border-accent-classical bg-accent-classical/20 text-white font-bold' : 'border-white/10 bg-white/3'
            }`}>
              {idx + 1}
            </span>
            <span className="hidden md:inline">{step.title.split(":")[1].trim()}</span>
          </button>
        ))}
      </div>

      {/* Double Column content (text info left, dynamic visuals right) */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch min-h-[300px]">
        
        {/* Left Column: Explanations and Equations */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-accent-classical">
              {steps[activeStep].icon}
              <h4 className="font-display font-bold text-lg text-white leading-none">
                {steps[activeStep].title}
              </h4>
            </div>
            
            <span className="text-xs font-mono text-text-muted italic leading-none">
              {steps[activeStep].subtitle}
            </span>

            <p className="text-xs md:text-sm leading-relaxed text-text-muted text-justify mt-2 min-h-[120px]">
              {renderDescription(steps[activeStep].description)}
            </p>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-4 mt-4 border-t border-white/5 pt-4">
            <button
              onClick={handlePrev}
              disabled={activeStep === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                activeStep === 0 
                  ? 'border-white/5 text-text-muted/40 bg-white/1 cursor-not-allowed' 
                  : 'border-white/10 hover:border-accent-classical/40 text-text-muted hover:text-white bg-white/3 hover:bg-white/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className={`flex-grow flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                activeStep === steps.length - 1 
                  ? 'border-white/5 text-text-muted/40 bg-white/1 cursor-not-allowed' 
                  : 'border-accent-classical/40 text-white bg-accent-classical/10 hover:bg-accent-classical/20 hover:border-accent-classical/60'
              }`}
            >
              Siguiente Paso
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Simulator and Formula Display */}
        <div className="flex-1 glass bg-black/40 border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
            Demostración Gráfica / Matemática
          </span>

          {/* Interactive Visual Area */}
          <div className="flex-grow flex items-center justify-center min-h-[150px] relative overflow-hidden bg-black/20 rounded-xl border border-white/3 p-3">
            
            {/* Step 0 Visual: Allowed standing waves */}
            {activeStep === 0 && (
              <div className="w-full flex flex-col gap-3 items-center">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                  Visualizador: Cavidad Resonante 1D
                </span>
                <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 60">
                  {/* Metal Box boundary walls */}
                  <rect x="18" y="5" width="4" height="50" rx="1" fill="#4b5563" />
                  <rect x="178" y="5" width="4" height="50" rx="1" fill="#4b5563" />
                  <line x1="20" y1="30" x2="180" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

                  {/* Standing wave path */}
                  {(() => {
                    const points = [];
                    const amp = 18;
                    const freq = waveMode * Math.PI;
                    for (let x = 0; x <= 160; x++) {
                      const rad = (x / 160) * freq;
                      points.push(`${x + 20},${30 + Math.sin(rad) * amp}`);
                    }
                    const pathD = `M ${points.join(' L ')}`;
                    return (
                      <>
                        <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                        <path d={pathD.replace(/30\+/g, '30-')} fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" strokeDasharray="3,3" />
                      </>
                    );
                  })()}
                  
                  {/* Wall tags */}
                  <text x="12" y="33" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="end">Pared (x=0)</text>
                  <text x="188" y="33" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="start">Pared (x=L)</text>
                </svg>

                {/* Control selectors inside simulation */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setWaveMode(mode)}
                      className={`px-2.5 py-0.5 rounded text-[9px] font-mono transition-all border cursor-pointer ${
                        waveMode === mode 
                          ? 'bg-accent-classical/10 border-accent-classical/30 text-accent-classical font-bold' 
                          : 'border-white/5 text-text-muted hover:text-white bg-white/2'
                      }`}
                    >
                      n = {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 Visual: Classical continuous pendulum oscillation */}
            {activeStep === 1 && (
              <div className="w-full flex flex-col gap-3 items-center">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                  Simulación clásica: Energía Continua del Resorte
                </span>
                
                <svg className="w-full h-20" viewBox="0 0 200 60">
                  {/* Top static base */}
                  <line x1="60" y1="5" x2="140" y2="5" stroke="#4b5563" strokeWidth="3" />
                  
                  {/* Spring coil */}
                  {(() => {
                    const loops = 12;
                    const topY = 5;
                    const bottomY = 42; 
                    const height = bottomY - topY;
                    const points = [];
                    points.push(`100, ${topY}`);
                    for (let i = 0; i <= loops; i++) {
                      const sy = topY + (i / loops) * height;
                      const sx = 100 + (i % 2 === 0 ? 8 : -8);
                      points.push(`${sx}, ${sy}`);
                    }
                    points.push(`100, ${bottomY}`);
                    return <path d={`M ${points.join(' L ')}`} fill="none" stroke="#9ca3af" strokeWidth="1.5" className="animate-pulse" />;
                  })()}

                  {/* Bouncing thermal mass */}
                  <circle cx="100" cy="46" r="8" fill="#f59e0b" className="shadow-[0_0_15px_orange]" />
                </svg>

                <div className="text-[10px] font-mono text-accent-classical text-center animate-pulse">
                  Energía Media Continua = T (Independiente de la rigidez)
                </div>
              </div>
            )}

            {/* Step 2 Visual: Spectral density multiplying */}
            {activeStep === 2 && (
              <div className="w-full flex flex-col gap-3 items-center">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">
                  Multiplicador Espectral: Modos x kT
                </span>

                <svg className="w-full h-24" viewBox="0 0 200 80">
                  <line x1="20" y1="70" x2="180" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Drawing quadratic curve showing growth */}
                  {(() => {
                    const points = [];
                    for (let x = 0; x <= 150; x++) {
                      const val = 70 - Math.pow(x / 18, 2);
                      points.push(`${x + 20},${Math.max(10, val)}`);
                    }
                    return <path d={`M ${points.join(' L ')}`} fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-pulse" />;
                  })()}
                  <text x="180" y="77" fill="rgba(255,255,255,0.3)" fontSize="6.5" textAnchor="end" fontFamily="monospace">v (Frecuencia)</text>
                  <text x="25" y="16" fill="#ef4444" fontSize="6.5" textAnchor="start" fontFamily="monospace">u espectral ∝ v²</text>
                </svg>
              </div>
            )}

            {/* Step 3 Visual: Integral explosion warning */}
            {activeStep === 3 && (
              <div className="w-full flex flex-col gap-2.5 items-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-accent-danger/10 border border-accent-danger/20 text-[10px] font-mono text-accent-danger font-bold uppercase animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Divergencia Matemática Catastrófica
                </div>

                <div className="text-[10px] text-text-muted leading-relaxed text-center px-4 max-w-sm">
                  Al no haber un límite para las frecuencias electromagnéticas, la integral espectral diverge lineal y cuadráticamente. El modelo clásico colapsa afirmando que toda la energía del universo reside en el ultravioleta.
                </div>

                <span className="text-4xl font-display font-black text-accent-danger animate-pulse">
                  E_total = ∞
                </span>
              </div>
            )}
          </div>

          {/* Equation render dynamically context styled */}
          <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-accent-classical font-semibold">
              Formulación Matemática ({notation === 'landau' ? 'Landau §63' : 'Estándar'})
            </span>
            <div className="py-1 text-center font-mono bg-black/20 rounded border border-white/3 min-h-[46px] flex items-center justify-center">
              {notation === 'landau' ? (
                <MathEq formula={steps[activeStep].landauFormula} block />
              ) : (
                <MathEq formula={steps[activeStep].standardFormula} block />
              )}
            </div>
            <span className="text-[9.5px] font-mono text-text-muted mt-1 leading-normal block">
              {steps[activeStep].annotation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
