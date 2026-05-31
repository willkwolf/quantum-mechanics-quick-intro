# Quantum Origins
## De la Catástrofe Ultravioleta al Nacimiento de la Mecánica Cuántica

---

# Visión General

Sitio web single-page interactivo basado en scrollytelling.

Objetivo:

Mostrar cómo una anomalía experimental aparentemente menor
(el espectro del cuerpo negro)
destruyó los fundamentos de la física clásica y condujo a la
mecánica cuántica.

Duración estimada:

15–20 minutos.

Audiencia:

- Estudiantes universitarios.
- Curiosos sin formación matemática avanzada.
- Profesores de física.
- Público STEM.

---

# Stack Tecnológico

## Framework

Next.js 15

React 19

TypeScript

---

## Visualización

D3.js

Observable Plot

Motion (Framer Motion)

Three.js

React Three Fiber

Leva

---

## Scroll Storytelling

GSAP ScrollTrigger

o

Motion Scroll

---

## Rendering Matemático

KaTeX

---

## Gráficos Científicos

Plotly

---

## Accesibilidad

WCAG AA

Modo oscuro nativo

Tipografía:

- Inter
- Source Serif 4

---

# Arquitectura Narrativa

La historia avanza mediante scroll.

Cada sección ocupa aproximadamente una pantalla.

Las visualizaciones evolucionan continuamente.

---

# SECCIÓN 0

## El Universo Clásico

Título:

"1900: La Física Creía Haber Ganado"

Visual:

Mapa conceptual animado:

- Newton
- Maxwell
- Termodinámica

Narrativa:

A finales del siglo XIX parecía que las leyes fundamentales de la naturaleza estaban descubiertas.

Sólo quedaban pequeños detalles experimentales.

Uno de ellos era el color de un objeto caliente.

---

Interacción:

Scroll revela:

- Mecánica clásica
- Electromagnetismo
- Termodinámica

Convergencia visual.

---

# SECCIÓN 1

## ¿Qué es un Cuerpo Negro?

Visual principal:

Horno con pequeña abertura.

Simulación interactiva.

Usuario puede:

Mover temperatura:

300 K → 7000 K

---

Conceptos:

- Absorción perfecta.
- Emisión térmica.
- Equilibrio.

---

Visualización:

Color del objeto cambia.

Rojo.

Naranja.

Blanco.

Azulado.

---

# SECCIÓN 2

## La Pregunta

Visual:

Espectrómetro.

Gráfico vacío.

Eje X:

Frecuencia.

Eje Y:

Intensidad.

---

Pregunta:

¿Cuánta energía emite cada frecuencia?

---

Scroll:

Aparecen datos experimentales reales.

---

# SECCIÓN 3

## El Primer Éxito: Wien

Visual:

Curva experimental.

Curva de Wien.

---

Fórmula:

λ_max T = constante

---

Interacción:

Control de temperatura.

Usuario observa:

Pico se desplaza.

---

Mensaje:

Wien funciona bien para altas frecuencias.

---

# SECCIÓN 4

## Rayleigh y Jeans

Visual:

Nueva curva clásica.

---

Supuestos revelados uno por uno.

1.

Ondas estacionarias.

2.

Equipartición energética.

3.

Energía continua.

---

Animación:

Cada modo recibe energía.

---

# SECCIÓN 5

## La Catástrofe Ultravioleta

Momento central del sitio.

Visualización fullscreen.

---

Curva experimental.

Curva Rayleigh-Jeans.

---

Al hacer scroll:

La curva clásica explota.

Tiende a infinito.

---

Animación:

Pantalla saturada por energía ultravioleta.

---

Mensaje:

La física clásica predice energía infinita.

La naturaleza no.

---

Fórmula:

u(ν,T)=
8πν²/c³ · kT

---

Panel lateral:

"Infinito"

Indicador rojo.

---

# SECCIÓN 6

## Planck Rompe las Reglas

Visual:

Bloques discretos de energía.

---

Animación:

Antes:

Rampa continua.

Después:

Escalones.

---

Hipótesis:

E = nhν

---

Narrativa:

Planck introduce una idea que considera meramente matemática.

La energía sólo puede intercambiarse en paquetes discretos.

---

Interacción:

Slider:

h → 0

Muestra transición hacia mundo clásico.

---

# SECCIÓN 7

## Nace la Constante de Planck

Visual principal:

Zoom cosmológico.

Constante emerge.

---

Mostrar:

h

6.62607015×10⁻³⁴ J·s

---

Animación:

Comparación de escalas.

---

Mensaje:

Demasiado pequeña para percibirla cotidianamente.

Pero suficiente para cambiar toda la física.

---

# SECCIÓN 8

## La Solución Perfecta

Visual:

Tres curvas simultáneas.

Experimental.

Wien.

Rayleigh-Jeans.

Planck.

---

Scroll:

Planck encaja perfectamente.

---

Fórmula:

u(ν,T)=

8πhν³/c³

────────────

e^(hν/kT)-1

---

Opción:

Modo matemático.

Modo intuitivo.

---

# SECCIÓN 9

## Einstein Toma la Idea en Serio

Visual:

Fotones golpeando metal.

---

Animación:

Frecuencia variable.

Intensidad variable.

---

Experimento fotoeléctrico.

---

Concepto:

La luz parece estar cuantizada.

---

Fórmula:

E=hν

---

# SECCIÓN 10

## El Dominó Cuántico

Timeline interactivo.

---

1900

Planck

↓

1905

Einstein

↓

1913

Bohr

↓

1925

Heisenberg

↓

1926

Schrödinger

↓

1927

Principio de incertidumbre

---

# SECCIÓN 11

## Lo Que Realmente Cambió

Comparación interactiva.

---

Física clásica

vs

Física cuántica

---

Continuidad

vs

Discreción

---

Determinismo

vs

Probabilidad

---

Trayectorias

vs

Estados

---

# SECCIÓN 12

## Sandbox

Laboratorio interactivo.

Controles:

Temperatura.

Frecuencia.

Constante de Planck.

---

Gráficos en tiempo real.

---

Curvas:

Experimental.

Wien.

Rayleigh.

Planck.

---

Usuario descubre:

La cuantización elimina la divergencia.

---

# SECCIÓN FINAL

## Una Crisis que Cambió el Universo

Visual:

La curva de Planck se transforma gradualmente en:

- Átomo de Bohr.
- Función de onda.
- Computador cuántico.

---

Texto final:

La mecánica cuántica no nació buscando describir átomos.

Nació intentando explicar el color de un objeto caliente.

---

# Componentes Interactivos Clave

1. Simulador de cuerpo negro.

2. Comparador de leyes.

3. Catástrofe ultravioleta animada.

4. Visualizador de cuantización.

5. Simulador del efecto fotoeléctrico.

6. Timeline histórico.

7. Sandbox matemático final.

---

# Principio Pedagógico Central

No introducir la mecánica cuántica como una teoría.

Introducirla como una respuesta inevitable
a una contradicción experimental que la física clásica no podía resolver.
