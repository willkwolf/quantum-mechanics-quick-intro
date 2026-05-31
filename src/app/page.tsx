'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNotation } from '@/context/NotationContext';
import MathToggle from '@/components/MathToggle';
import LandauCompanion from '@/components/LandauCompanion';
import MathEq from '@/components/Math';
import { 
  ArrowDown, 
  Atom, 
  Flame, 
  TrendingUp, 
  Layers, 
  AlertTriangle, 
  Sliders, 
  Cpu, 
  Undo2,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuantumOriginsPage() {
  const { notation } = useNotation();
  const [activeSection, setActiveSection] = useState(0);

  // States for simulators
  // Section 1: Blackbody temperature
  const [tempS1, setTempS1] = useState(3000); 
  
  // Section 3: Wien's temperature
  const [tempS3, setTempS3] = useState(3000);

  // Section 6: Quantization h slider
  const [hValS6, setHValS6] = useState(1); // 1 is fully quantum, 0 is fully classical

  // Section 9: Photoelectric Effect
  const [lightFreq, setLightFreq] = useState(400); // THz (Red: 400, Violet: 750, UV: 900)
  const [lightIntensity, setLightIntensity] = useState(50); // %
  const [isPhotoelectricRunning, setIsPhotoelectricRunning] = useState(true);

  // Section 12: Advanced Sandbox
  const [sandboxTemp, setSandboxTemp] = useState(4500); // K
  const [sandboxH, setSandboxH] = useState(1.0); // Factor of h
  const [showWien, setShowWien] = useState(true);
  const [showRayleigh, setShowRayleigh] = useState(true);
  const [showPlanck, setShowPlanck] = useState(true);

  // Set up scrollytelling intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.35,
      rootMargin: "-15% 0px -25% 0px"
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = parseInt(entry.target.getAttribute('data-section-id') || '0');
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = document.querySelectorAll('section[data-section-id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Bouncing particles inside Black Body Cavity (Section 1)
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, color: string}>>([]);
  
  useEffect(() => {
    // Initialize 25 photons bouncing inside a cavity
    const initParticles = [];
    const size = 180;
    const r = size / 2;
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (r - 15);
      const speed = 1.5 + (tempS1 / 2000); // speed depends on temperature
      initParticles.push({
        x: r + Math.cos(angle) * dist,
        y: r + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: tempS1 > 5000 ? '#60a5fa' : tempS1 > 3500 ? '#fde047' : '#ef4444'
      });
    }
    setParticles(initParticles);
  }, [tempS1]);

  useEffect(() => {
    let animationFrameId: number;
    const updatePhysics = () => {
      setParticles((prevParticles) => {
        const size = 180;
        const r = size / 2;
        return prevParticles.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          
          // Distance from center
          const dx = nx - r;
          const dy = ny - r;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let nvx = p.vx;
          let nvy = p.vy;

          if (dist >= r - 8) {
            // Elastic collision with circular wall
            const normalX = dx / dist;
            const normalY = dy / dist;
            const dot = p.vx * normalX + p.vy * normalY;
            nvx = p.vx - 2 * dot * normalX;
            nvy = p.vy - 2 * dot * normalY;
            
            // Push inside slightly to prevent sticking
            nx = r + normalX * (r - 9);
            ny = r + normalY * (r - 9);
          }
          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        });
      });
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Photoelectric effect moving electrons
  const [electrons, setElectrons] = useState<Array<{x: number, y: number, speed: number, id: number}>>([]);
  const electronIdCounter = useRef(0);

  useEffect(() => {
    if (!isPhotoelectricRunning) return;

    const threshold = 520; // THz threshold (Green-Blue limit for our metal work function)
    const isAboveThreshold = lightFreq >= threshold;

    let interval: NodeJS.Timeout;
    if (isAboveThreshold) {
      // Frequency above threshold ejects electrons
      // Speed of electrons depends on excess frequency (E_k = h*v - W)
      const excess = lightFreq - threshold;
      const speed = 1.0 + (excess / 120); 
      // Emitted rate depends on intensity
      const emitInterval = Math.max(100, 1000 - (lightIntensity * 8));

      interval = setInterval(() => {
        setElectrons((prev) => [
          ...prev, 
          { 
            x: 80, 
            y: 80 + Math.random() * 80, 
            speed, 
            id: electronIdCounter.current++ 
          }
        ]);
      }, emitInterval);
    }

    return () => clearInterval(interval);
  }, [lightFreq, lightIntensity, isPhotoelectricRunning]);

  // Update electron positions in real-time
  useEffect(() => {
    if (!isPhotoelectricRunning) return;
    
    const interval = setInterval(() => {
      setElectrons((prev) => {
        return prev
          .map((e) => ({ ...e, x: e.x + e.speed }))
          .filter((e) => e.x < 280); // Filter out if it reaches the anode
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPhotoelectricRunning]);

  // Handle celebration at the final sandbox or conclusion
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#f59e0b', '#ef4444', '#10b981']
    });
  };

  // Helper to map temp to glowing color
  const getTempColor = (t: number) => {
    if (t < 1500) return 'rgb(80, 10, 10)';
    if (t < 2500) return 'rgb(180, 40, 20)';
    if (t < 3500) return 'rgb(245, 120, 30)';
    if (t < 4800) return 'rgb(253, 224, 71)';
    if (t < 6000) return 'rgb(255, 255, 255)';
    return 'rgb(147, 197, 253)';
  };

  // Scientific calculation helpers (highly customized for screen display scaling)
  // Standard frequency vs. Landau angular frequency
  // T in energy units for Landau (kb = 1)
  const getPlanckCurvePoints = (t: number, hFactor: number) => {
    const points = [];
    const resolution = 80;
    const maxFreq = 10; 
    const h = 0.8 * hFactor;
    
    for (let i = 0.5; i <= resolution; i++) {
      const freq = (i / resolution) * maxFreq;
      // standard formula: (8 * pi * h * v^3) / (c^3 * (e^(h*v/T) - 1))
      // Normalized scaling for presentation:
      const expTerm = Math.exp((h * freq) / (t / 1500));
      const val = expTerm - 1 > 0 
        ? (50 * h * Math.pow(freq, 3)) / (expTerm - 1) 
        : 0;
      points.push({ x: (freq / maxFreq) * 350, y: 150 - Math.min(140, val) });
    }
    return points;
  };

  const getWienCurvePoints = (t: number, hFactor: number) => {
    const points = [];
    const resolution = 80;
    const maxFreq = 10;
    const h = 0.8 * hFactor;
    
    for (let i = 0.5; i <= resolution; i++) {
      const freq = (i / resolution) * maxFreq;
      // Wien approximation: (8 * pi * h * v^3) * e^(-h*v/T)
      const expTerm = Math.exp(-(h * freq) / (t / 1500));
      const val = 50 * h * Math.pow(freq, 3) * expTerm;
      points.push({ x: (freq / maxFreq) * 350, y: 150 - Math.min(140, val) });
    }
    return points;
  };

  const getRayleighCurvePoints = (t: number) => {
    const points = [];
    const resolution = 80;
    const maxFreq = 10;
    
    for (let i = 0.5; i <= resolution; i++) {
      const freq = (i / resolution) * maxFreq;
      // Rayleigh-Jeans formula: (8 * pi * v^2 * T) / c^3
      // Normalized:
      const val = 4 * Math.pow(freq, 2) * (t / 1500);
      points.push({ x: (freq / maxFreq) * 350, y: 150 - Math.min(180, val) });
    }
    return points;
  };

  return (
    <div className="relative min-h-screen bg-bg text-text-primary selection:bg-accent-quantum/30 selection:text-white">
      
      {/* Floating Toggle & Companion Panel */}
      <MathToggle />
      <LandauCompanion activeSection={activeSection} />

      {/* Persistent Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-accent-classical via-accent-quantum to-accent-danger transition-all duration-300"
          style={{ width: `${(activeSection / 12) * 100}%` }}
        />
      </div>

      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-classical/5 blur-[120px] transition-all duration-1000 ease-out"
          style={{ 
            transform: `translate(${activeSection * 20}px, ${activeSection * -10}px)`,
            opacity: activeSection === 0 || activeSection === 1 ? 0.6 : 0.2
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent-quantum/5 blur-[140px] transition-all duration-1000 ease-out"
          style={{ 
            transform: `translate(${activeSection * -30}px, ${activeSection * 20}px)`,
            opacity: activeSection >= 6 ? 0.6 : 0.2
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full bg-accent-danger/5 blur-[180px] pointer-events-none pulse-glow"
          style={{ opacity: activeSection === 5 ? 0.8 : 0.1 }}
        />
      </div>

      {/* Main Content Layout */}
      <main className="relative z-10 w-full max-w-[1300px] mx-auto px-4 md:px-8">
        
        {/* ========================================================
            HERO SECTION
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col justify-center items-center py-20 text-center"
          data-section-id="0"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/3 mb-6 animate-fade-in glass">
            <Atom className="w-4 h-4 text-accent-quantum animate-spin-slow" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Scrollytelling Interactivo
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1] max-w-5xl">
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-classical to-accent-quantum">Origins</span>
          </h1>

          <p className="text-lg md:text-xl font-display text-text-muted max-w-3xl leading-relaxed mb-12">
            De la Catástrofe Ultravioleta al Nacimiento de la Mecánica Cuántica. Explora la anomalía termodinámica que forzó a la física clásica a reinventar la realidad microscópica.
          </p>

          <div className="flex flex-col items-center gap-3 animate-bounce">
            <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
              Haz scroll para comenzar
            </span>
            <ArrowDown className="w-5 h-5 text-accent-quantum" />
          </div>
        </section>

        {/* ========================================================
            SECTION 0: THE CLASSICAL UNIVERSE
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="0"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-classical font-semibold block mb-2">
              Sección 00 // El Fin de un Paradigma
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              1900: La Física Creía Haber Ganado
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4">
              <p>
                A finales del siglo XIX, las leyes fundamentales de la naturaleza parecían grabadas en piedra. La mecánica impecable de <strong>Newton</strong> gobernaba el movimiento; las elegantes ecuaciones de <strong>Maxwell</strong> describían la luz; y la termodinámica estadística de <strong>Boltzmann</strong> organizaba el calor.
              </p>
              <p>
                El célebre físico Lord Kelvin declaró célebremente que ya no quedaba nada nuevo por descubrir en física, excepto por <span className="text-accent-classical font-semibold">"dos pequeñas nubes en el horizonte"</span>. Una de esas nubes era el misterioso color térmico de un objeto caliente.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] glass rounded-full flex justify-center items-center group shadow-[0_0_50px_rgba(245,158,11,0.1)] border-white/5">
              
              {/* Harmonious Classical Orbiting spheres */}
              <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-dashed border-white/5 animate-spin-reverse" />
              
              {/* Core Perfect classical system */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-classical to-yellow-600/40 border border-accent-classical/50 flex justify-center items-center text-center p-3 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="text-[10px] font-mono font-bold uppercase text-white tracking-widest">
                  Física Clásica
                </span>
              </div>

              {/* Newton Spheres */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-bg border border-white/10 flex items-center justify-center text-xs font-mono font-bold group-hover:border-accent-classical transition-colors shadow">
                  N
                </div>
                <span className="text-[9px] font-mono text-text-muted mt-1 uppercase tracking-widest">Newton</span>
              </div>

              {/* Maxwell Spheres */}
              <div className="absolute bottom-6 left-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-bg border border-white/10 flex items-center justify-center text-xs font-mono font-bold group-hover:border-accent-classical transition-colors shadow">
                  M
                </div>
                <span className="text-[9px] font-mono text-text-muted mt-1 uppercase tracking-widest">Maxwell</span>
              </div>

              {/* Boltzmann Spheres */}
              <div className="absolute bottom-6 right-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-bg border border-white/10 flex items-center justify-center text-xs font-mono font-bold group-hover:border-accent-classical transition-colors shadow">
                  B
                </div>
                <span className="text-[9px] font-mono text-text-muted mt-1 uppercase tracking-widest">Boltzmann</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 1: WHAT IS A BLACK BODY?
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="1"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 01 // El Emisor Perfecto
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              ¿Qué es un Cuerpo Negro?
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4 mb-6">
              <p>
                Un <strong>Cuerpo Negro</strong> es un objeto idealizado que absorbe absolutamente toda la radiación electromagnética que incide sobre él. No refleja luz; es una trampa electromagnética perfecta.
              </p>
              <p>
                Sin embargo, al estar en equilibrio térmico a una temperatura <MathEq formula="T" />, debe emitir radiación para no acumular energía indefinidamente. La mejor analogía física es una cavidad metálica cerrada calentada con un pequeñísimo orificio. Toda la radiación capturada rebota infinitamente dentro; lo que escapa del orificio es la <strong>radiación pura del cuerpo negro</strong>.
              </p>
            </div>

            {/* Slider control */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl glass border-white/5 bg-white/2 max-w-md">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-accent-classical animate-pulse" />
                  Temperatura de Cavidad
                </span>
                <span className="text-white font-bold">{tempS1} K</span>
              </div>
              <input 
                type="range"
                min="300"
                max="7000"
                step="100"
                value={tempS1}
                onChange={(e) => setTempS1(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-classical"
              />
              <span className="text-[10px] font-mono text-text-muted text-right">
                {tempS1 < 1000 ? 'Infrarrojo invisible' : tempS1 < 3000 ? 'Incandescencia roja clásica' : tempS1 < 5000 ? 'Luz blanca solar' : 'Fuego azul cuántico'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
              
              {/* Hollow metal box */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="cavityGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={getTempColor(tempS1)} stopOpacity="0.4" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Cavity internal glow */}
                <circle cx="100" cy="100" r="90" fill="url(#cavityGlow)" />
                
                {/* Thick metal wall */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#2a2a35" strokeWidth="10" />

                {/* Small Hole (Aperture) on the right */}
                <path d="M 183 90 A 90 90 0 0 1 183 110" stroke="#030306" strokeWidth="14" fill="none" />
                
                {/* Aperture light beam escape */}
                <polygon points="184,95 240,70 240,130 184,105" fill={getTempColor(tempS1)} opacity="0.3" className="animate-pulse" />
                <circle cx="184" cy="100" r="8" fill={getTempColor(tempS1)} className="shadow-[0_0_20px_white] animate-pulse" />

                {/* Bouncing Photons */}
                {particles.map((p, idx) => (
                  <circle 
                    key={idx} 
                    cx={p.x} 
                    cy={p.y} 
                    r="2" 
                    fill={p.color} 
                    opacity="0.85"
                  />
                ))}
              </svg>

              {/* Glowing thermal indicator overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-full px-2.5 py-0.5 backdrop-blur-sm">
                <div 
                  className="w-2 h-2 rounded-full transition-colors duration-500" 
                  style={{ backgroundColor: getTempColor(tempS1) }}
                />
                <span className="text-[10px] font-mono text-white">Espectro Térmico</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2 & 3: THE SPECTROMETER & WIEN
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="2"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-classical font-semibold block mb-2">
              Sección 02 // El Desplazamiento Espectral
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              El Espectrómetro y la Ley de Wien
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4 mb-6">
              <p>
                Al pasar la luz del cuerpo negro por un prisma, vemos cómo se distribuye la intensidad de energía para cada color (frecuencia). Sorprendentemente, a temperaturas ordinarias, casi toda la luz es infrarroja (calor invisible).
              </p>
              <p>
                En 1893, Wilhelm Wien dedujo su ley de desplazamiento: <strong className="text-accent-classical">a medida que aumenta la temperatura, el pico de máxima emisión se desplaza hacia frecuencias más altas</strong> (longitudes de onda más cortas). Es por eso que el metal caliente primero brilla rojo oscuro, luego amarillo y finalmente azul cegador.
              </p>
            </div>

            {/* Slider control */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl glass border-white/5 bg-white/2 max-w-md">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-accent-classical" />
                  Control de Temperatura
                </span>
                <span className="text-white font-bold">{tempS3} K</span>
              </div>
              <input 
                type="range"
                min="1000"
                max="6500"
                step="100"
                value={tempS3}
                onChange={(e) => setTempS3(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-classical"
              />
              <div className="text-[10px] font-mono text-accent-classical flex justify-between">
                <span>Frecuencias Bajas (Rojo)</span>
                <span>Frecuencias Altas (Azul/UV)</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[420px] glass rounded-2xl border-white/5 bg-white/2 p-6 flex flex-col gap-4 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
                Lectura del Espectrómetro Virtual
              </span>

              {/* Dynamic SVG Plot of Wien displacement */}
              <div className="relative w-full aspect-[4/3] bg-black/40 border border-white/5 rounded-xl overflow-hidden p-2">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Axis */}
                  <line x1="40" y1="160" x2="380" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Frequency Rainbow indicator */}
                  <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="25%" stopColor="#eab308" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                  </linearGradient>
                  <rect x="40" y="156" width="340" height="4" fill="url(#rainbow)" />

                  {/* Draw Wien curve dynamically */}
                  {(() => {
                    const points = getPlanckCurvePoints(tempS3, 1); // Uses Planck as baseline representing real spectrum
                    const pathD = `M ${points.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    
                    // Peak coordinates
                    const peakX = 40 + (100 * (4500 / tempS3));
                    const peakY = 160 - (120 * (tempS3 / 6500) * (tempS3 / 6500));

                    return (
                      <>
                        {/* Area glow */}
                        <path d={`${pathD} L 390,160 L 40,160 Z`} fill={getTempColor(tempS3)} opacity="0.1" />
                        
                        {/* Wien Curve line */}
                        <path d={pathD} fill="none" stroke={getTempColor(tempS3)} strokeWidth="2.5" className="transition-all duration-300" />
                        
                        {/* Peak tracker vertical dashed */}
                        <line x1={peakX} y1={peakY} x2={peakX} y2="160" stroke="rgba(255,255,255,0.3)" strokeDasharray="3,3" />
                        <circle cx={peakX} cy={peakY} r="4.5" fill="#ffffff" stroke={getTempColor(tempS3)} strokeWidth="2" className="animate-pulse" />
                        
                        {/* Wien constant displacement path track */}
                        <path d="M 60,140 Q 150,90 280,30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      </>
                    );
                  })()}

                  {/* Grid / Labels */}
                  <text x="380" y="175" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {notation === 'landau' ? 'Frecuencia (ω)' : 'Frecuencia (v)'}
                  </text>
                  <text x="35" y="25" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end" fontFamily="monospace" transform="rotate(-90 35 25)">
                    Intensidad
                  </text>
                </svg>

                {/* Display mathematical Wien law overlay */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded bg-black/50 border border-white/5 text-[10px] font-mono select-none">
                  {notation === 'landau' ? (
                    <MathEq formula="\\omega_{max} \\propto T" />
                  ) : (
                    <MathEq formula="\\lambda_{max} T = \\text{const}" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4 & 5: RAYLEIGH-JEANS & THE CATASTROPHE
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="4"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-danger font-semibold block mb-2">
              Sección 03-04 // La Ruptura Clásica
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              Rayleigh-Jeans y la Catástrofe Ultravioleta
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4">
              <p>
                Lord Rayleigh y Sir James Jeans aplicaron rigurosamente la física clásica. Supusieron que la radiación son ondas estacionarias que rebotan en la cavidad y que, por la termodinámica, cada modo recibe exactamente la misma cantidad de energía promedio en equilibrio térmico: <strong className="text-accent-classical"><MathEq formula="k_B T" /></strong>.
              </p>
              <p className="text-accent-danger font-semibold">
                ¡Aquí reside el desastre absoluto!
              </p>
              <p>
                Hay infinitamente más modos de oscilar a altas frecuencias (longitudes de onda muy cortas, como el ultravioleta) que a bajas frecuencias. Si cada modo recibe energía clásica continua, la densidad espectral diverge hacia el infinito. Al hacer scroll, observa cómo la física clásica hace explotar la realidad térmica en la zona ultravioleta.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            {/* Cavity resonator & infinite explosion indicator */}
            <div className="w-full max-w-[420px] glass rounded-2xl border-accent-danger/20 bg-accent-danger/3 p-6 flex flex-col gap-4 shadow-[0_0_40px_rgba(239,68,68,0.05)] relative overflow-hidden">
              
              {/* Catastrophe Indicator warning banner if active */}
              <div className="absolute inset-0 bg-accent-danger/5 backdrop-blur-[1px] pointer-events-none animate-pulse" />

              <div className="flex justify-between items-center border-b border-accent-danger/10 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-danger font-semibold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-accent-danger" />
                  Alerta: Catástrofe Ultravioleta Clásica
                </span>
              </div>

              {/* Dynamic plotting exploding curve */}
              <div className="w-full aspect-[4/3] bg-black/60 border border-accent-danger/10 rounded-xl p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Axis */}
                  <line x1="40" y1="160" x2="380" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Draw classical Rayleigh-Jeans curve */}
                  {(() => {
                    const rjPoints = getRayleighCurvePoints(4000); 
                    const pPoints = getPlanckCurvePoints(4000, 1);
                    const rjPath = `M ${rjPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    const pPath = `M ${pPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;

                    return (
                      <>
                        {/* Real/Planck spectrum (shaded correctly) */}
                        <path d={`${pPath} L 390,160 L 40,160 Z`} fill="rgba(6,182,212,0.05)" />
                        <path d={pPath} fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" strokeDasharray="3,3" />

                        {/* Classical Rayleigh Curve going to infinity */}
                        <path d={rjPath} fill="none" stroke="#ef4444" strokeWidth="3" className="animate-pulse" />
                        
                        {/* Infinity symbol at UV area */}
                        <text x="350" y="35" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                          ∞
                        </text>
                        <line x1="320" y1="160" x2="320" y2="25" stroke="rgba(239,68,68,0.2)" strokeWidth="1" strokeDasharray="2,2" />
                      </>
                    );
                  })()}
                  
                  {/* Axis titles */}
                  <text x="380" y="175" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="monospace">
                    UV (Frecuencia)
                  </text>
                  <text x="35" y="25" fill="#ef4444" fontSize="9" textAnchor="end" fontWeight="bold" fontFamily="monospace" transform="rotate(-90 35 25)">
                    Divergencia (Energía)
                  </text>
                </svg>

                {/* Formula display */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded bg-accent-danger/10 border border-accent-danger/20 text-[10px] font-mono text-accent-danger">
                  {notation === 'landau' ? (
                    <MathEq formula="dE_\\omega \\propto \\omega^2 T \\, d\\omega" />
                  ) : (
                    <MathEq formula="u(\\nu, T) = \\frac{8\\pi\\nu^2}{c^3} k_B T" />
                  )}
                </div>
              </div>

              {/* Rigorous disaster warning text */}
              <div className="text-[11px] font-mono text-text-muted leading-relaxed">
                Según las leyes clásicas de Newton y Maxwell, la energía irradiada por segundo en el ultravioleta y rayos X es infinita. El universo colapsaría en un resplandor cegador. Este absurdo forzó el fin de la física clásica.
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: PLANCK BREAKS THE RULES
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="6"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 05 // La Cuantización
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              Planck Rompe las Reglas
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4 mb-6">
              <p>
                En diciembre de 1900, Max Planck propuso un "acto de desesperación" matemático. Postuló que los osciladores atómicos de la cavidad no pueden emitir ni absorber energía de forma continua. La energía térmica se intercambia en <strong>paquetes discretos</strong> llamados cuántos.
              </p>
              <p>
                Imagina una rampa (física clásica): puedes detenerte a cualquier altura/energía continua. Ahora imagina unos escalones (física cuántica): sólo puedes estar en el escalón 1, 2, 3... nunca a mitad de camino. La altura del escalón es directamente proporcional a la frecuencia de oscilación por una constante fundamental: <strong className="text-accent-quantum"><MathEq formula="E = n h \nu" /></strong> (o <MathEq formula="E = n \\hbar \\omega" />).
              </p>
            </div>

            {/* Slider to shrink h -> 0 showing correspondence */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl glass border-white/5 bg-white/2 max-w-md">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-accent-quantum" />
                  Ajustar Acción de Planck (h)
                </span>
                <span className="text-white font-bold">
                  {hValS6 === 0 ? 'Límite Clásico (h = 0)' : `Cuánto Cuántico (h = ${hValS6.toFixed(1)})`}
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={hValS6}
                onChange={(e) => setHValS6(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-quantum"
              />
              <span className="text-[10px] font-mono text-text-muted text-right">
                {hValS6 === 0 ? 'Los escalones colapsan en continuidad clásica' : 'Escalones discretos de energía bien definidos'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[400px] aspect-[4/3] glass rounded-2xl border-white/5 bg-white/2 p-6 flex flex-col justify-between shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
                Simulador: Rampa vs Escalones Cuánticos
              </span>

              {/* Dynamic steps illustration */}
              <div className="relative flex-grow flex items-end justify-center py-4 min-h-[160px]">
                <svg className="w-full h-full max-h-[160px]" viewBox="0 0 300 150">
                  {/* Classical Continuous Ramp */}
                  <path d="M 20,130 L 120,40 L 120,130 Z" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.3)" strokeWidth="2.5" />
                  <circle cx="70" cy="85" r="7" fill="#f59e0b" className="shadow-[0_0_10px_orange]" />
                  <text x="70" y="145" fill="rgba(245,158,11,0.8)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    Clásico: Continuo
                  </text>

                  {/* Quantum Staircase */}
                  {(() => {
                    const stepWidth = 25;
                    const baseStepHeight = 22;
                    const stepHeight = baseStepHeight * hValS6;
                    const startX = 150;
                    const startY = 130;
                    
                    let pathD = `M ${startX},${startY}`;
                    const stepPoints = [];

                    for (let i = 0; i < 5; i++) {
                      const sx = startX + i * stepWidth;
                      const sy = startY - i * stepHeight;
                      stepPoints.push({ x: sx + stepWidth / 2, y: sy - stepHeight / 2 });
                      
                      pathD += ` L ${sx + stepWidth},${sy} L ${sx + stepWidth},${sy - stepHeight}`;
                    }

                    return (
                      <>
                        {/* Shaded steps */}
                        <path d={`${pathD} L 275,130 Z`} fill="rgba(6,182,212,0.05)" />
                        {/* Step outlines */}
                        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                        
                        {/* Quantized photon ball hopping */}
                        {hValS6 > 0.05 ? (
                          <circle cx={stepPoints[2].x} cy={stepPoints[2].y - 8} r="6.5" fill="#06b6d4" className="animate-bounce" />
                        ) : (
                          <circle cx="210" cy="85" r="7" fill="#06b6d4" />
                        )}
                        
                        <text x="212" y="145" fill="rgba(6,182,212,0.8)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          {hValS6 === 0 ? 'Correspondencia' : 'Cuántica: Discreto'}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Quantization formula box */}
              <div className="flex items-center justify-center gap-1.5 bg-black/40 border border-white/5 rounded-xl py-2 font-mono text-xs">
                <span>Energía Cuantizada:</span>
                <span className="text-accent-quantum font-bold">
                  {notation === 'landau' ? (
                    <MathEq formula="E = n \\hbar \\omega" />
                  ) : (
                    <MathEq formula="E = n h \\nu" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 7: THE CONSTANT EMERGES
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col justify-center items-center py-24 text-center"
          data-section-id="7"
        >
          <div className="max-w-4xl flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-4">
              Sección 06 // El Cuanto de Acción
            </span>
            
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight mb-8">
              Emerge una Nueva Constante Universal
            </h2>

            {/* Giant mathematical constant display */}
            <div className="relative glass border-accent-quantum/20 bg-accent-quantum/3 rounded-3xl p-8 md:p-12 mb-10 max-w-2xl shadow-[0_0_60px_rgba(6,182,212,0.08)]">
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 border border-white/5 rounded-full px-2 py-0.5 text-[8.5px] font-mono text-accent-quantum">
                <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                Constante Universal
              </div>

              <span className="text-7xl md:text-9xl font-display font-bold text-accent-quantum block mb-4 select-all">
                {notation === 'landau' ? 'ℏ' : 'h'}
              </span>

              <div className="text-2xl md:text-4xl font-mono text-white font-bold select-all mb-4">
                {notation === 'landau' ? (
                  <MathEq formula="1.054571817 \\times 10^{-34} \\text{ J}\\cdot\\text{s}" />
                ) : (
                  <MathEq formula="6.62607015 \\times 10^{-34} \\text{ J}\\cdot\\text{s}" />
                )}
              </div>

              <div className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mx-auto">
                {notation === 'landau' ? (
                  'La constante reducida de Planck (o constante de Dirac), fundamental en la física cuántica avanzada y en las formulaciones rigurosas de la teoría de campos.'
                ) : (
                  'El cuanto fundamental de acción. Representa el límite matemático absoluto por debajo del cual los procesos electromagnéticos y físicos ya no se comportan clásicamente.'
                )}
              </div>
            </div>

            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Esta constante es inimaginablemente pequeña en nuestra escala macroscópica. Es por ello que no vemos los escalones de energía al caminar o tirar una pelota. Pero en la cavidad atómica de la luz caliente, esta diminuta escala es suficiente para detener por completo la Catástrofe Ultravioleta y salvar al universo del colapso térmico.
            </p>
          </div>
        </section>

        {/* ========================================================
            SECTION 8: THE PERFECT SOLUTION
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="8"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 07 // La Ecuación Maestra
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              La Solución Perfecta (La Ley de Planck)
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4">
              <p>
                Planck dedujo su distribución espectral y encajó <strong>perfectamente</strong> con los datos experimentales reales. A bajas frecuencias, la ley de Planck se reduce de forma natural al límite de Rayleigh-Jeans clásico; a altas frecuencias, coincide perfectamente con la ley espectral aproximada de Wien.
              </p>
              <p>
                Es una obra maestra matemática. En la barra de navegación lateral, puedes consultar la formulación clásica escolar frente a la ecuación teórica exacta de <span className="text-accent-quantum font-semibold">Landau</span> (extraída de la sección §63 del volumen 5). Trazar la radiación como un gas de Bose con potencial químico nulo es uno de los logros más bellos de la física teórica estadística.
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[420px] glass rounded-2xl border-white/5 bg-white/2 p-6 flex flex-col gap-4 shadow-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
                Comparativa de Curvas en Equilibrio (T = 4000 K)
              </span>

              {/* Graphic chart comparing Wien, Rayleigh, Planck */}
              <div className="w-full aspect-[4/3] bg-black/50 border border-white/5 rounded-xl p-2 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Axis */}
                  <line x1="40" y1="160" x2="380" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Draw Wien, Rayleigh and Planck Curves */}
                  {(() => {
                    const wPoints = getWienCurvePoints(4000, 1.1);
                    const rjPoints = getRayleighCurvePoints(4000);
                    const pPoints = getPlanckCurvePoints(4000, 1.1);

                    const wPath = `M ${wPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    const rjPath = `M ${rjPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    const pPath = `M ${pPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;

                    return (
                      <>
                        {/* Shaded Planck Area (Real) */}
                        <path d={`${pPath} L 390,160 L 40,160 Z`} fill="rgba(6,182,212,0.1)" />

                        {/* Rayleigh-Jeans (Classical) */}
                        <path d={rjPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,3" />
                        
                        {/* Wien (High-freq success) */}
                        <path d={wPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,2" />

                        {/* Planck (Perfect Match) */}
                        <path d={pPath} fill="none" stroke="#06b6d4" strokeWidth="3" />
                      </>
                    );
                  })()}

                  {/* Label legends */}
                  <text x="380" y="175" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end" fontFamily="monospace">
                    Frecuencia
                  </text>
                </svg>

                {/* Legends box overlays */}
                <div className="absolute bottom-6 left-12 flex flex-col gap-1.5 bg-black/60 border border-white/5 rounded-lg p-2 text-[8px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-[#ef4444] border-t border-dashed" />
                    <span className="text-[#ef4444]">Rayleigh-Jeans (Clásica)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-[#f59e0b] border-t border-dotted" />
                    <span className="text-[#f59e0b]">Wien (Alta Freq)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-[#06b6d4]" />
                    <span className="text-[#06b6d4] font-bold">Planck (Cuántica Exacta)</span>
                  </div>
                </div>
              </div>

              {/* Exact Formula overlay in active notation context */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-accent-quantum font-semibold">
                  Ecuación de la Ley de Planck ({notation === 'landau' ? 'Landau §63' : 'Estándar'})
                </span>
                <div className="py-1 text-center">
                  {notation === 'landau' ? (
                    <MathEq formula="dE_\\omega = V \\frac{\\hbar \\omega^3}{\\pi^2 c^3} \\frac{d\\omega}{e^{\\hbar\\omega/T} - 1}" block />
                  ) : (
                    <MathEq formula="u(\\nu,T) = \\frac{8\\pi h\\nu^3}{c^3} \\frac{1}{e^{h\\nu/k_BT} - 1}" block />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 9: EINSTEIN & PHOTOELECTRIC EFFECT
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col lg:flex-row items-center gap-12 py-24"
          data-section-id="9"
        >
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 08 // Evidencia de Partícula
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              Einstein Toma la Idea en Serio
            </h2>
            <div className="text-sm md:text-base text-text-muted leading-relaxed flex flex-col gap-4 mb-6">
              <p>
                Planck consideraba su teoría de cuantos de energía simplemente como un "truco matemático" conveniente. Pero en 1905, Albert Einstein fue mucho más allá. Postuló que <strong>la luz misma está físicamente cuantizada en fotones discretos</strong>.
              </p>
              <p>
                La prueba definitiva fue el <strong>Efecto Fotoeléctrico</strong>. Al iluminar un metal, la luz expulsa electrones de su superficie. Clásicamente, una luz roja intensa continua debería arrancar electrones lentamente. Sin embargo, en la realidad, la luz roja nunca arranca nada. Pero una tenue luz ultravioleta arranca electrones instantáneamente.
              </p>
              <p>
                ¿Por qué? Cada fotón choca como una partícula indivisible contra un electrón. Si la energía de un solo fotón (<MathEq formula="E = \\hbar\\omega" />) es menor que el trabajo de salida (<MathEq formula="W" />) del metal, el electrón nunca podrá escapar.
              </p>
            </div>

            {/* Photoelectric sliders */}
            <div className="flex flex-col gap-4 p-4 rounded-2xl glass border-white/5 bg-white/2 max-w-md">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-text-muted">Frecuencia de Luz (Luz Roja vs. UV)</span>
                  <span className="text-white font-bold">{lightFreq} THz</span>
                </div>
                <input 
                  type="range"
                  min="350"
                  max="950"
                  step="25"
                  value={lightFreq}
                  onChange={(e) => setLightFreq(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-quantum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-text-muted">Intensidad de Luz (Cantidad de Fotones)</span>
                  <span className="text-white font-bold">{lightIntensity} %</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-quantum"
                />
              </div>

              <div className="flex gap-2.5 mt-1">
                <button
                  onClick={() => setIsPhotoelectricRunning(!isPhotoelectricRunning)}
                  className="flex-grow flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-accent-quantum/40 bg-white/3 hover:bg-white/5 transition-all text-xs font-semibold font-mono cursor-pointer"
                >
                  {isPhotoelectricRunning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Pausar Simulación
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-accent-quantum" />
                      Reanudar Simulación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[400px] glass rounded-2xl border-white/5 bg-white/2 p-6 flex flex-col gap-4 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
                Simulador en Tiempo Real: Circuito Fotoeléctrico
              </span>

              {/* Photoelectric interactive schematic */}
              <div className="w-full aspect-[4/3] bg-black/60 border border-white/5 rounded-xl relative overflow-hidden">
                
                {/* Vacuum Tube SVG */}
                <svg className="w-full h-full" viewBox="0 0 300 200">
                  {/* Vacuum Tube Glass Outline */}
                  <rect x="50" y="50" width="200" height="100" rx="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <rect x="50" y="50" width="200" height="100" rx="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Metal Cathode (Plate left) */}
                  <rect x="75" y="70" width="8" height="60" rx="2" fill="#4b5563" stroke="rgba(255,255,255,0.1)" />
                  <text x="70" y="103" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="end">Metal</text>

                  {/* Anode Collector (Plate right) */}
                  <rect x="215" y="70" width="4" height="60" rx="1" fill="#9ca3af" />

                  {/* Circuit Wires */}
                  <path d="M 79,100 L 30,100 L 30,180 L 130,180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 217,100 L 270,100 L 270,180 L 170,180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  
                  {/* Ammeter */}
                  <circle cx="150" cy="180" r="12" fill="#030306" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <text x="150" y="184" fill={electrons.length > 0 ? '#06b6d4' : 'rgba(255,255,255,0.4)'} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A</text>

                  {/* Incoming Photons (light packets) */}
                  {(() => {
                    const photonColor = lightFreq < 520 ? '#ef4444' : lightFreq < 680 ? '#10b981' : lightFreq < 780 ? '#3b82f6' : '#a855f7';
                    const lines = [];
                    const count = Math.min(10, Math.ceil(lightIntensity / 10));
                    for (let i = 0; i < count; i++) {
                      const offset = i * 15 - (count * 7);
                      lines.push(
                        <path 
                          key={i}
                          d={`M ${115 + offset},10 Q ${105 + offset},35 ${80},80`} 
                          fill="none" 
                          stroke={photonColor} 
                          strokeWidth="1.5" 
                          strokeDasharray="4,4"
                          className="animate-pulse"
                        />
                      );
                    }
                    return lines;
                  })()}

                  {/* Ejected Electrons */}
                  {electrons.map((e) => (
                    <circle 
                      key={e.id}
                      cx={e.x}
                      cy={e.y}
                      r="3.5"
                      fill="#10b981"
                      className="shadow-[0_0_8px_#10b981]"
                    />
                  ))}
                </svg>

                {/* Circuit status overlay banner */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 border border-white/5 text-[9px] font-mono flex items-center gap-1.5">
                  <span className="text-text-muted">Estado del Circuito:</span>
                  {lightFreq >= 520 ? (
                    <span className="text-[#10b981] font-bold animate-pulse">Corriente Detectada</span>
                  ) : (
                    <span className="text-accent-danger font-semibold">Sin Emisión (v &lt; v_0)</span>
                  )}
                </div>
              </div>

              {/* Standard vs Landau Photoelectric Formula */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-accent-quantum font-semibold">
                  Ecuación Fotoeléctrica Einstein ({notation === 'landau' ? 'Landau Vol. 3' : 'Estándar'})
                </span>
                <div className="py-1 text-center">
                  {notation === 'landau' ? (
                    <MathEq formula="E_k = \\hbar\\omega - W" block />
                  ) : (
                    <MathEq formula="E_k = h\\nu - W" block />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 10: TIMELINE (QUANTUM DOMINO)
           ======================================================== */}
        <section 
          className="min-h-screen py-24 flex flex-col justify-center"
          data-section-id="10"
        >
          <div className="max-w-xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 09 // El Dominó Cuántico
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              El Dominó Cuántico (1900–1927)
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              La constante cuántica fundamental descubierta por Max Planck para explicar el color del cuerpo negro desató una avalancha conceptual imparable en cascada.
            </p>
          </div>

          {/* Scrolling Timeline layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* 1900: Planck */}
            <div className="glass hover:border-accent-classical/30 bg-white/2 rounded-2xl p-5 flex flex-col gap-3 relative transition-all duration-300 group">
              <span className="text-3xl font-display font-bold text-accent-classical">1900</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Max Planck</span>
                <span className="text-[10px] font-mono text-text-muted mt-0.5">Cuerpo Negro</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted mt-1.5">
                Propone la cuantización discreta de la radiación electromagnética (<MathEq formula="E = nhv" />) para resolver la divergencia infinita clásica.
              </p>
            </div>

            {/* 1905: Einstein */}
            <div className="glass hover:border-accent-quantum/30 bg-white/2 rounded-2xl p-5 flex flex-col gap-3 relative transition-all duration-300 group">
              <span className="text-3xl font-display font-bold text-accent-quantum">1905</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Albert Einstein</span>
                <span className="text-[10px] font-mono text-text-muted mt-0.5">Fotón y Fotoeléctrico</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted mt-1.5">
                Demuestra la naturaleza física de partícula de la luz afirmando que los campos electromagnéticos están compuestos por fotones reales.
              </p>
            </div>

            {/* 1913: Bohr */}
            <div className="glass hover:border-accent-classical/30 bg-white/2 rounded-2xl p-5 flex flex-col gap-3 relative transition-all duration-300 group">
              <span className="text-3xl font-display font-bold text-accent-classical">1913</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Niels Bohr</span>
                <span className="text-[10px] font-mono text-text-muted mt-0.5">Átomo Cuantizado</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted mt-1.5">
                Aplica la cuantización a los orbitales electrónicos de los átomos, explicando por qué los electrones no colapsan en espiral hacia el núcleo.
              </p>
            </div>

            {/* 1925: Heisenberg */}
            <div className="glass hover:border-accent-quantum/30 bg-white/2 rounded-2xl p-5 flex flex-col gap-3 relative transition-all duration-300 group">
              <span className="text-3xl font-display font-bold text-accent-quantum">1925</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Werner Heisenberg</span>
                <span className="text-[10px] font-mono text-text-muted mt-0.5">Mecánica de Matrices</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted mt-1.5">
                Desarrolla la mecánica cuántica formal sin usar trayectorias espaciales clásicas, basándose estrictamente en operadores algebraicos observables.
              </p>
            </div>

            {/* 1926: Schrödinger */}
            <div className="glass hover:border-accent-danger/30 bg-white/2 rounded-2xl p-5 flex flex-col gap-3 relative transition-all duration-300 group">
              <span className="text-3xl font-display font-bold text-accent-danger">1926</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Erwin Schrödinger</span>
                <span className="text-[10px] font-mono text-text-muted mt-0.5">Ecuación de Onda</span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted mt-1.5">
                Plantea su ecuación fundamental de onda, reconciliando la física cuántica con ecuaciones diferenciales continuas de la función de onda (<MathEq formula="\\Psi" />).
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 11: LO QUE REALMENTE CAMBIO
           ======================================================== */}
        <section 
          className="min-h-screen py-24 flex flex-col justify-center"
          data-section-id="11"
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 10 // La Reinvención Conceptual
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              Lo Que Realmente Cambió
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              La transición cuántica iniciada por el color del cuerpo negro destruyó por completo los pilares fundamentales del pensamiento clásico occidental.
            </p>
          </div>

          {/* Visual side-by-side conceptual comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Continuity vs Discretion */}
            <div className="glass hover:border-white/15 bg-white/1 p-6 rounded-2xl flex flex-col gap-4 shadow transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-classical/10 border border-accent-classical/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-accent-classical" />
              </div>
              <h3 className="text-lg font-semibold text-white">Continuidad vs. Discreción</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                La física clásica describe un universo suave, infinitamente subdividible. La física cuántica impone un límite fundamental: la naturaleza avanza a saltos de cuantos discretos atómicos indivisibles definidos por la constante <MathEq formula="\\hbar" />.
              </p>
            </div>

            {/* Determinism vs Probability */}
            <div className="glass hover:border-white/15 bg-white/1 p-6 rounded-2xl flex flex-col gap-4 shadow transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-quantum/10 border border-accent-quantum/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-accent-quantum" />
              </div>
              <h3 className="text-lg font-semibold text-white">Determinismo vs. Probabilidad</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                Para Newton, conociendo las condiciones iniciales exactas podías predecir el futuro absoluto del sistema. En mecánica cuántica, la función de onda de probabilidad de Schrödinger rige los procesos de medición cuánticos de forma estadística.
              </p>
            </div>

            {/* Trajectories vs Wave States */}
            <div className="glass hover:border-white/15 bg-white/1 p-6 rounded-2xl flex flex-col gap-4 shadow transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-danger/10 border border-accent-danger/20 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-accent-danger" />
              </div>
              <h3 className="text-lg font-semibold text-white">Trayectorias vs. Estados de Onda</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                En el electromagnetismo y la mecánica clásica, las partículas viajan a lo largo de líneas de trayectoria física continuas e ininterrumpidas. En mecánica cuántica, las trayectorias no existen; las partículas se distribuyen como ondas de probabilidad.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 12: ADVANCED QUANTUM SANDBOX
           ======================================================== */}
        <section 
          className="min-h-screen py-24 flex flex-col justify-center"
          data-section-id="12"
        >
          <div className="max-w-xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-2">
              Sección 11 // El Laboratorio Avanzado
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-wide text-white mb-6">
              Advanced Quantum Sandbox
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              Juega y experimenta libremente con las constantes físicas. Observa de forma interactiva y científica en tiempo real cómo las tres grandes leyes de radiación compiten y colapsan clásicamente.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Control Console Dashboard */}
            <div className="flex-1 max-w-sm flex flex-col gap-4 glass bg-white/2 border-white/5 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sliders className="w-4 h-4 text-accent-quantum" />
                <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                  Consola de Laboratorio
                </span>
              </div>

              {/* Slider T */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-text-muted">Temperatura (T)</span>
                  <span className="text-white font-semibold">{sandboxTemp} K</span>
                </div>
                <input 
                  type="range"
                  min="800"
                  max="6500"
                  step="100"
                  value={sandboxTemp}
                  onChange={(e) => setSandboxTemp(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-classical"
                />
              </div>

              {/* Slider h */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-text-muted">Constante de Planck (h)</span>
                  <span className="text-white font-semibold">{sandboxH.toFixed(2)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={sandboxH}
                  onChange={(e) => setSandboxH(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-quantum"
                />
              </div>

              {/* Toggle curves checkboxes */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">
                  Mostrar Leyes Espectrales
                </span>

                {/* Planck checkbox */}
                <label className="flex items-center gap-2.5 text-xs font-mono text-text-muted hover:text-white cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showPlanck}
                    onChange={(e) => setShowPlanck(e.target.checked)}
                    className="rounded border-white/10 text-accent-quantum focus:ring-accent-quantum bg-bg"
                  />
                  <span className="flex-grow">Planck (Cuántica Exacta)</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                </label>

                {/* Wien checkbox */}
                <label className="flex items-center gap-2.5 text-xs font-mono text-text-muted hover:text-white cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showWien}
                    onChange={(e) => setShowWien(e.target.checked)}
                    className="rounded border-white/10 text-accent-classical focus:ring-accent-classical bg-bg"
                  />
                  <span className="flex-grow">Wien (Alta Frecuencia)</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-dashed border-white/20" />
                </label>

                {/* Rayleigh checkbox */}
                <label className="flex items-center gap-2.5 text-xs font-mono text-text-muted hover:text-white cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showRayleigh}
                    onChange={(e) => setShowRayleigh(e.target.checked)}
                    className="rounded border-white/10 text-accent-danger focus:ring-accent-danger bg-bg"
                  />
                  <span className="flex-grow">Rayleigh-Jeans (Clásica)</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                </label>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  setSandboxTemp(4500);
                  setSandboxH(1.0);
                  setShowWien(true);
                  setShowRayleigh(true);
                  setShowPlanck(true);
                  triggerCelebration();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-accent-quantum/40 bg-white/3 hover:bg-white/5 transition-all text-xs font-mono font-bold mt-4 cursor-pointer"
              >
                <Undo2 className="w-4 h-4 text-accent-quantum" />
                Valores de Referencia
              </button>
            </div>

            {/* Scientific Graph Display Screen */}
            <div className="flex-grow glass bg-black/40 border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">
                Simulador Espectral de Laboratorio Quantum Origins
              </span>

              {/* Interactive Scientific SVG Plot */}
              <div className="w-full aspect-[16/9] py-4 relative overflow-hidden">
                <svg className="w-full h-full min-h-[220px]" viewBox="0 0 400 200">
                  {/* Axis */}
                  <line x1="40" y1="160" x2="380" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Draw Curves based on user checkbox configurations */}
                  {(() => {
                    const pPoints = getPlanckCurvePoints(sandboxTemp, sandboxH);
                    const wPoints = getWienCurvePoints(sandboxTemp, sandboxH);
                    const rjPoints = getRayleighCurvePoints(sandboxTemp);

                    const pPath = `M ${pPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    const wPath = `M ${wPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;
                    const rjPath = `M ${rjPoints.map(p => `${p.x + 40},${p.y}`).join(' L ')}`;

                    return (
                      <>
                        {/* Shaded Planck Area */}
                        {showPlanck && (
                          <>
                            <path d={`${pPath} L 390,160 L 40,160 Z`} fill="rgba(6,182,212,0.06)" />
                            <path d={pPath} fill="none" stroke="#06b6d4" strokeWidth="3.5" className="transition-all duration-300" />
                          </>
                        )}

                        {/* Rayleigh-Jeans classical line */}
                        {showRayleigh && (
                          <path d={rjPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,3" className="transition-all duration-300" />
                        )}

                        {/* Wien line */}
                        {showWien && (
                          <path d={wPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,2" className="transition-all duration-300" />
                        )}
                      </>
                    );
                  })()}

                  {/* Grid Titles */}
                  <text x="380" y="175" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {notation === 'landau' ? 'Frecuencia Angular (ω)' : 'Frecuencia (v)'}
                  </text>
                  <text x="35" y="25" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="monospace" transform="rotate(-90 35 25)">
                    Intensidad
                  </text>
                </svg>

                {/* Display mathematical details box */}
                <div className="absolute top-4 right-4 bg-black/60 border border-white/5 rounded-xl p-3 text-[10px] font-mono max-w-xs flex flex-col gap-1.5">
                  <span className="text-[8.5px] text-accent-quantum font-bold uppercase tracking-wider">Límite Cuántico de Bose (μ = 0)</span>
                  {notation === 'landau' ? (
                    <MathEq formula="dE_\\omega = V \\frac{\\hbar \\omega^3}{\\pi^2 c^3} \\frac{d\\omega}{e^{\\hbar\\omega/T} - 1}" block />
                  ) : (
                    <MathEq formula="u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3} \\frac{1}{e^{h\\nu/k_B T} - 1}" block />
                  )}
                  {sandboxH === 0 && (
                    <span className="text-accent-danger text-[9px] mt-1 font-bold animate-pulse">
                      * h = 0: Divergencia catastrófica clásica.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            FINAL SECTION: ONE CRISIS THAT CHANGED THE UNIVERSE
           ======================================================== */}
        <section 
          className="min-h-screen flex flex-col justify-center items-center py-24 text-center relative"
          data-section-id="12"
        >
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-[1.5px] h-24 bg-gradient-to-b from-transparent to-accent-quantum/40" />
          </div>

          <div className="max-w-4xl flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-quantum font-semibold block mb-4">
              Epílogo // La Revolución
            </span>
            
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.15] mb-8 max-w-3xl">
              Una Crisis que Cambió el Universo
            </h2>

            <p className="text-lg md:text-xl font-display text-text-muted leading-relaxed max-w-3xl mb-12">
              La mecánica cuántica no nació buscando describir átomos, ni computadores exóticos, ni realidades paralelas cuánticas. Nació intentando explicar algo tan humilde, tan familiar y tan cotidiano como el color de un trozo de hierro caliente metido en el fuego.
            </p>

            {/* Glowing morphing wave outline */}
            <div className="relative w-44 h-44 mb-14 flex items-center justify-center group">
              <div className="absolute inset-0 rounded-full border border-dashed border-accent-quantum/10 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-accent-quantum/20 animate-spin-reverse" />
              <div className="absolute w-24 h-24 rounded-full bg-accent-quantum/5 border border-accent-quantum/30 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-all">
                <Atom className="w-12 h-12 text-accent-quantum animate-spin-slow" />
              </div>
            </div>

            <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">
              ¿Listo para profundizar?
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="file:///c:/Dev/quantum-mechanics-quick-intro/Bibliography/Landau,_Theoretical_Physics_vol_3,_Quantum_Mechanics_Non_Relativistic.pdf"
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-accent-classical to-yellow-600 hover:from-accent-classical/90 hover:to-yellow-600/90 text-white font-bold shadow-lg transition-all duration-300 scale-100 hover:scale-105 cursor-pointer"
              >
                Abrir Landau: Mecánica Cuántica (PDF)
              </a>

              <a 
                href="file:///c:/Dev/quantum-mechanics-quick-intro/Bibliography/Landau,_Theoretical_Physics_Vol_5,_Statistical_Physics,_Part_1.pdf"
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-accent-quantum/40 hover:bg-white/10 text-white font-bold transition-all duration-300 scale-100 hover:scale-105 cursor-pointer"
              >
                Abrir Landau: Física Estadística (PDF)
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================
          FOOTER
         ======================================================== */}
      <footer className="relative z-10 border-t border-white/5 py-12 mt-12 bg-black/40 backdrop-blur-md">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <span className="text-sm font-display font-bold text-white tracking-wide">
              Quantum Origins
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Diseño de élite académica sobre la revolución científica del cuanto.
            </span>
          </div>

          <div className="flex gap-6 items-center">
            <a 
              href="https://github.com/willkwolf/quantum-mechanics-quick-intro.git"
              className="text-xs font-mono text-text-muted hover:text-accent-quantum transition-colors"
            >
              Repositorio de GitHub
            </a>
            <span className="text-white/10">|</span>
            <span className="text-xs font-mono text-text-muted">
              Curso de Física Teórica de Landau & Lifshitz Vol. 3 y Vol. 5
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
