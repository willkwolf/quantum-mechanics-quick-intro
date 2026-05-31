'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathProps {
  formula: string;
  block?: boolean;
}

export default function Math({ formula, block = false }: MathProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [formula, block]);

  return (
    <span 
      ref={containerRef} 
      className={block ? 'block my-3 math-block text-center text-sm md:text-base overflow-x-auto w-full select-all' : 'inline-block select-all'} 
    />
  );
}
