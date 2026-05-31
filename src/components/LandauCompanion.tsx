'use client';

import React, { useState } from 'react';
import { BookOpen, X, Sparkles, HelpCircle } from 'lucide-react';
import Math from './Math';
import AcademicText from './AcademicText';

interface CompanionSection {
  title: string;
  volume: string;
  sectionRef: string;
  quote: string;
  explanation: string;
  standardFormula?: string;
  landauFormula?: string;
  annotation: string;
}

const landauData: Record<number, CompanionSection> = {
  0: {
    title: "El Universo Clásico",
    volume: "Volumen 2: Teoría Clásica de los Campos, Cap. 1 & 2",
    sectionRef: "§ 1. El principio de relatividad",
    quote: "La interacción electromagnética se propaga a través del vacío con una velocidad finita, la velocidad de la luz c. Esto exige la descripción de la interacción mediante el concepto de campo, que posee infinitos grados de libertad.",
    explanation: "En la mecánica de Newton (§1 de Vol. 1), el estado físico se describe mediante coordenadas discretas. Al pasar al electromagnetismo clásico de Maxwell, la física se ve forzada a lidiar con campos continuos. Esto representa una transición fundamental: de un sistema con un número finito de grados de libertad a uno continuo con infinitos grados de libertad, sentando las bases físicas del conflicto de la radiación.",
    standardFormula: "F = G \\frac{m_1 m_2}{r^2} \\quad \\& \\quad \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}",
    landauFormula: "\\mathcal{S} = \\int \\mathcal{L} \\, dt \\quad \\& \\quad \\delta \\mathcal{S} = 0",
    annotation: "En la mecánica de Landau, el principio de mínima acción (S) es el fundamento absoluto del cual derivan todas las leyes clásicas y cuánticas."
  },
  1: {
    title: "El Cuerpo Negro",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "Consideremos la radiación electromagnética en equilibrio termodinámico dentro de una cavidad de volumen V a temperatura T. Dicha radiación puede ser considerada como un gas de Bose formado por fotones.",
    explanation: "Landau trata la radiación electromagnética no como ondas clásicas, sino rigurosamente como un gas de Bose de cuasipartículas llamadas fotones. Dado que los fotones pueden ser absorbidos o emitidos libremente por las paredes de la cavidad, el número total de partículas en equilibrio no está conservado. Esto conduce a una de las deducciones más limpias de la física teórica: el potencial químico de este gas es idénticamente cero (\\mu = 0).",
    standardFormula: "N \\text{ constante} \\quad (\\mu \\neq 0)",
    landauFormula: "\\mu = 0",
    annotation: "Que el potencial químico del gas de fotones sea nulo es la condición termodinámica de equilibrio directo que simplifica la distribución estadística."
  },
  2: {
    title: "La Pregunta Espectral",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "La distribución espectral de la radiación en equilibrio se caracteriza por la energía dE_\\omega contenida en el intervalo de frecuencias angulares d\\omega.",
    explanation: "El espectro térmico representa cómo se distribuye la energía en diferentes canales de frecuencia. Mientras que la termodinámica clásica exige que la energía dependa del volumen y la temperatura de manera global, la física espectral busca la densidad de energía detallada para cada modo individual en equilibrio.",
    standardFormula: "u(\\nu, T) \\, d\\nu",
    landauFormula: "dE_\\omega = V u(\\omega, T) \\, d\\omega",
    annotation: "Landau define el diferencial de la energía respecto a la frecuencia angular \\omega en lugar de la frecuencia estándar \\nu."
  },
  3: {
    title: "El Éxito Parcial de Wien",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "De consideraciones de escala dimensional aplicadas al campo electromagnético en equilibrio térmico, se deduce que la distribución espectral debe tener la forma general dada por la ley de Wien.",
    explanation: "La ley espectral clásica exige que la función dependa del cociente entre la energía de la onda y la temperatura clásica. Mediante pura termodinámica y la teoría clásica de campos, Wien dedujo que el pico de intensidad debe desplazarse inversamente con la temperatura. Sin embargo, su aproximación exponencial fallaba completamente a frecuencias bajas.",
    standardFormula: "\\lambda_{max} T = b",
    landauFormula: "dE_\\omega = V \\omega^3 f(\\omega/T) \\, d\\omega",
    annotation: "Landau destaca que la función f es una función universal del cociente \\omega/T (en unidades de energía), lo cual determina la ley de Wien."
  },
  4: {
    title: "Rayleigh y Jeans",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "Para bajas frecuencias, podemos aplicar el principio de equipartición clásica. Cada modo de oscilación del campo recibe una energía media igual a la temperatura T.",
    explanation: "En la física clásica, el teorema de equipartición establece que cada grado de libertad oscilatorio en equilibrio térmico almacena una energía promedio de k_B T. Landau muestra que para frecuencias bajas (\\hbar\\omega \\ll T), el comportamiento es puramente clásico, donde los cuantos cuánticos individuales no pueden distinguirse y el campo actúa como un continuo clásico.",
    standardFormula: "\\langle E \\rangle = k_B T",
    landauFormula: "\\langle E_\\omega \\rangle = T \\quad (k_B = 1)",
    annotation: "Recuerda: en la notación de Landau, la temperatura T se mide directamente en unidades de energía (k_B = 1), lo que elimina la constante de Boltzmann."
  },
  5: {
    title: "La Catástrofe Ultravioleta",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "La integración clásica de la densidad de energía sobre todas las frecuencias desde 0 hasta infinito arroja un resultado infinitamente grande. Esto representa una absurda imposibilidad física clásica.",
    explanation: "Como el número de modos oscilatorios en una cavidad crece cuadráticamente con la frecuencia (dE_\\omega \\propto V \\omega^2 T d\\omega), si cada modo recibe una energía constante T, la densidad espectral crece sin límites a frecuencias ultravioletas. Al integrar para obtener la energía total clásica, obtenemos un valor infinito. La física clásica predice que todo objeto caliente debería enfriarse instantáneamente emitiendo una radiación de energía infinita.",
    standardFormula: "u(\\nu, T) = \\frac{8\\pi\\nu^2}{c^3} k_B T",
    landauFormula: "dE_\\omega = V \\frac{\\omega^2}{\\pi^2 c^3} T \\, d\\omega",
    annotation: "Esta fórmula clásica diverge linealmente con la temperatura y cuadráticamente con la frecuencia angular."
  },
  6: {
    title: "Planck Rompe las Reglas",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "La suposición cuántica fundamental de que la energía de un oscilador sólo puede tomar valores discretos E = n\\hbar\\omega elimina de raíz la divergencia clásica.",
    explanation: "Al imponer que la energía electromagnética no es continua sino que se intercambia en paquetes discretos o cuantos, los modos de alta frecuencia (donde \\hbar\\omega \\gg T) requieren un 'escalón' de energía extremadamente alto para excitarse. La probabilidad estadística de excitar estos modos disminuye exponencialmente, 'apagándolos' y previniendo la catástrofe clásica.",
    standardFormula: "E = n h \\nu",
    landauFormula: "E = n \\hbar \\omega",
    annotation: "Donde \\hbar = h / 2\\pi. Landau utiliza la constante de Dirac \\hbar y la frecuencia angular \\omega, la cual es matemáticamente más limpia."
  },
  7: {
    title: "La Constante de Planck (\\hbar)",
    volume: "Volumen 3: Mecánica Cuántica (No Relativista), Cap. I",
    sectionRef: "§ 1. El principio de indeterminación",
    quote: "La constante fundamental de la teoría cuántica es la constante de acción de Planck, h. Su pequeñez escala determina el dominio cuántico frente al clásico.",
    explanation: "La constante \\hbar tiene dimensiones de acción (energía \\times tiempo). Define la escala a la cual el universo revela su naturaleza discreta. Si la acción de un proceso físico es del orden de \\hbar, los efectos cuánticos son dominantes; si es infinitamente mayor, la teoría clásica es una excelente aproximación límite (\\hbar \\to 0).",
    standardFormula: "h \\approx 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}",
    landauFormula: "\\hbar \\approx 1.054 \\times 10^{-34} \\text{ J}\\cdot\\text{s}",
    annotation: "En física teórica avanzada, \\hbar es considerada la verdadera unidad natural de acción cuántica."
  },
  8: {
    title: "La Solución de Planck",
    volume: "Volumen 5: Física Estadística, Parte 1, Cap. V",
    sectionRef: "§ 63. Radiación de cuerpo negro",
    quote: "Introduciendo la distribución cuántica de Bose-Einstein para fotones (\\mu = 0), obtenemos la ley espectral exacta de Planck para la radiación.",
    explanation: "Al usar la distribución estadística de Bose-Einstein, la energía promedio de un modo de frecuencia \\omega ya no es T, sino \\hbar\\omega / (e^{\\hbar\\omega/T} - 1). Multiplicando esto por la densidad de estados cuánticos en la cavidad, Landau obtiene la fórmula exacta de distribución espectral de energía en su máxima elegancia matemática.",
    standardFormula: "u(\\nu, T) = \\frac{8\\pi h\\nu^3}{c^3} \\frac{1}{e^{h\\nu/k_BT} - 1}",
    landauFormula: "dE_\\omega = V \\frac{\\hbar \\omega^3}{\\pi^2 c^3} \\frac{d\\omega}{e^{\\hbar\\omega/T} - 1}",
    annotation: "Esta es la ecuación 63.3 del Landau Vol. 5. Observa la perfecta simetría y limpieza de la formulación con \\hbar y \\omega."
  },
  9: {
    title: "Efecto Fotoeléctrico",
    volume: "Volumen 3: Mecánica Cuántica (No Relativista), Cap. I",
    sectionRef: "§ 1. El principio de indeterminación (Introducción)",
    quote: "La radiación exhibe propiedades de partícula (fotones) al interactuar con la materia en procesos atómicos de absorción y emisión rápida.",
    explanation: "Einstein demostró que la luz no sólo se emite de forma cuantizada, sino que viaja y se comporta físicamente como corpúsculos de energía concentrada. En el efecto fotoeléctrico, un fotón entrega de manera indivisible toda su energía \\hbar\\omega a un electrón del metal. Esto explica por qué el efecto es instantáneo y depende estrictamente de la frecuencia de la luz, no de su intensidad continua clásica.",
    standardFormula: "E_{k} = h\\nu - W",
    landauFormula: "E_{k} = \\hbar\\omega - W",
    annotation: "W representa el trabajo de salida clásico del metal, y E_k es la energía cinética máxima de los electrones emitidos."
  },
  10: {
    title: "El Dominó Cuántico",
    volume: "Volumen 3: Mecánica Cuántica (No Relativista), Prólogo",
    sectionRef: "Prólogo de la primera edición rusa",
    quote: "La creación de la mecánica cuántica representa un vuelco conceptual sin precedentes en la historia de la ciencia natural, modificando los cimientos mismos del pensamiento físico.",
    explanation: "A partir de la constante fundamental de Planck, la física teórica experimentó una avalancha de descubrimientos en cascada: el átomo de Bohr, la dualidad onda-partícula de de Broglie, la mecánica de matrices de Heisenberg y la ecuación diferencial de onda de Schrödinger. Cada eslabón dependió del paso cuántico original de 1900.",
    standardFormula: "\\Delta x \\Delta p \\ge \\frac{h}{4\\pi}",
    landauFormula: "\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}",
    annotation: "Esta relación de indeterminación de Heisenberg demuestra el límite absoluto del determinismo clásico."
  },
  11: {
    title: "Lo Que Realmente Cambió",
    volume: "Volumen 3: Mecánica Cuántica (No Relativista), Cap. I",
    sectionRef: "§ 1. El principio de indeterminación",
    quote: "En la mecánica cuántica, el concepto de trayectoria clásica carece de sentido. La descripción de los procesos físicos requiere formalmente el uso de amplitudes probabilísticas.",
    explanation: "Landau argumenta en el párrafo de apertura del volumen 3 que la transición a la mecánica cuántica no es meramente instrumental. La abolición de las trayectorias definidas y la introducción de los estados descritos por la función de onda \\Psi redefinen la naturaleza misma de lo que podemos medir y predecir en el universo microscópico.",
    standardFormula: "\\mathbf{r}(t) \\text{ definida} \\quad (Física Clásica)",
    landauFormula: "\\Psi(\\mathbf{r}, t) \\text{ (Función de onda)}",
    annotation: "El cuadrado del módulo |\\Psi|^2 da la densidad de probabilidad de encontrar la partícula en un punto."
  },
  12: {
    title: "Advanced Sandbox",
    volume: "Volumen 5: Física Estadística, Parte 1",
    sectionRef: "§ 63. Radiación de cuerpo negro (Límite Clásico)",
    quote: "Mediante el desarrollo en serie del factor cuántico, es fácil verificar que la fórmula clásica de Rayleigh-Jeans representa el límite formal de la ley de Planck cuando \\hbar tiende a cero.",
    explanation: "El principio de correspondencia de Bohr exige que el comportamiento cuántico transicione suavemente al comportamiento clásico a gran escala. En este laboratorio, al deslizar \\hbar \\to 0, puedes ver matemáticamente cómo la función cuántica e^{\\hbar\\omega/T} se aproxima a la expansión lineal 1 + \\hbar\\omega/T, lo que hace colapsar la fórmula cuántica de Planck de vuelta a la curva clásica de Rayleigh-Jeans.",
    standardFormula: "e^x \\approx 1 + x \\quad \\text{cuando } x \\to 0",
    landauFormula: "\\lim_{\\hbar \\to 0} \\frac{\\hbar \\omega^3}{\\pi^2 c^3} \\frac{1}{e^{\\hbar\\omega/T}-1} = \\frac{\\omega^2}{\\pi^2 c^3} T",
    annotation: "Este colapso matemático demuestra de forma hermosa la consistencia interna de la mecánica cuántica y clásica."
  }
};

interface LandauCompanionProps {
  activeSection: number;
}

export default function LandauCompanion({ activeSection }: LandauCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = landauData[activeSection] || landauData[0];

  return (
    <>
      {/* Floating Tab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 right-0 -translate-y-1/2 z-50 flex items-center justify-center w-12 h-14 rounded-l-2xl border-y border-l transition-all duration-300 ease-out glass cursor-pointer group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] ${
          isOpen 
            ? 'border-accent-quantum/30 text-accent-quantum translate-x-[-380px] md:translate-x-[-420px]' 
            : 'border-white/10 text-text-muted hover:text-accent-quantum hover:border-accent-quantum/20'
        }`}
        aria-label="Abrir Cuaderno Teórico de Landau"
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-300" />
        ) : (
          <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>

      {/* Side Companion Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-[380px] md:w-[420px] z-40 glass border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 pt-24 overflow-y-auto flex flex-col gap-6 transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-accent-quantum mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">
              Landau Theoretical Companion
            </span>
          </div>
          <h2 className="text-xl font-display font-semibold tracking-wide text-text-primary">
            Cuaderno de Teoría
          </h2>
          <span className="text-[10.5px] font-mono text-text-muted mt-1">
            Notas de soporte al Curso de Física Teórica
          </span>
        </div>

        {/* Reference Info */}
        <div className="flex flex-col bg-white/3 border border-white/5 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-quantum font-semibold mb-1">
            Referencia de Obra
          </span>
          <div className="text-sm font-display text-text-primary leading-relaxed font-medium">
            {data.volume}
          </div>
          <div className="text-xs font-mono text-text-muted mt-1.5 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-quantum/60" />
            {data.sectionRef}
          </div>
        </div>

        {/* Rigorous Quote */}
        <div className="relative border-l-2 border-accent-quantum/30 pl-4 py-1.5 my-2">
          <span className="absolute -top-3 left-2 text-4xl text-accent-quantum/20 font-serif leading-none select-none">
            “
          </span>
          <AcademicText className="text-xs italic leading-relaxed text-text-muted font-serif block" text={data.quote} />
          <span className="block text-[10px] font-mono text-right text-accent-quantum/50 mt-1.5 uppercase tracking-wider">
            — L. Landau & E. Lifshitz
          </span>
        </div>

        {/* Detailed Explanation */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold">
            Análisis Académico
          </h3>
          <AcademicText className="text-xs leading-relaxed text-text-muted text-justify block" text={data.explanation} />
        </div>

        {/* Math Comparison */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold">
            Comparativa de Formulación
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Standard Math */}
            <div className="flex flex-col bg-white/2 border border-white/5 rounded-lg p-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted font-semibold mb-1.5">
                Notación Escolar
              </span>
              <div className="flex-grow flex items-center justify-center py-2 bg-black/20 rounded border border-white/3 min-h-[44px]">
                {data.standardFormula ? (
                  <Math formula={data.standardFormula} />
                ) : (
                  <span className="text-[10px] font-mono text-text-muted">N/A</span>
                )}
              </div>
            </div>

            {/* Landau Math */}
            <div className="flex flex-col bg-accent-quantum/3 border border-accent-quantum/10 rounded-lg p-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-accent-quantum font-semibold mb-1.5">
                Notación Landau
              </span>
              <div className="flex-grow flex items-center justify-center py-2 bg-black/30 rounded border border-accent-quantum/10 min-h-[44px]">
                {data.landauFormula ? (
                  <Math formula={data.landauFormula} />
                ) : (
                  <span className="text-[10px] font-mono text-accent-quantum/80">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Annotation/Hint */}
        <div className="mt-auto bg-accent-quantum/5 border border-accent-quantum/10 rounded-xl p-4 flex gap-3 items-start">
          <HelpCircle className="w-5 h-5 text-accent-quantum shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-quantum font-bold">
              Nota Teórica
            </span>
            <AcademicText className="text-[11px] leading-relaxed text-text-muted block" text={data.annotation} />
          </div>
        </div>
      </div>
    </>
  );
}
