'use client';

import React from 'react';
import MathEq from './Math';

interface AcademicTextProps {
  text: string;
  className?: string;
}

export default function AcademicText({ text, className = "" }: AcademicTextProps) {
  if (!text) return null;

  // Split text by block math ($$...$$) and inline math ($...$)
  // By using capturing parenthesis in the regex, the matched delimiters 
  // are included as separate elements in the returned array.
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Block equations
          const formula = part.slice(2, -2).trim();
          return <MathEq key={index} formula={formula} block />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline equations
          const formula = part.slice(1, -1).trim();
          return <MathEq key={index} formula={formula} />;
        } else {
          // Plain text
          return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
}
