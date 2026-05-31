'use client';

import React, { createContext, useContext, useState } from 'react';

export type NotationType = 'standard' | 'landau';

interface NotationContextType {
  notation: NotationType;
  setNotation: (notation: NotationType) => void;
  toggleNotation: () => void;
}

const NotationContext = createContext<NotationContextType | undefined>(undefined);

export function NotationProvider({ children }: { children: React.ReactNode }) {
  const [notation, setNotationState] = useState<NotationType>('standard');

  const setNotation = (mode: NotationType) => {
    setNotationState(mode);
  };

  const toggleNotation = () => {
    setNotationState((prev) => (prev === 'standard' ? 'landau' : 'standard'));
  };

  return (
    <NotationContext.Provider value={{ notation, setNotation, toggleNotation }}>
      {children}
    </NotationContext.Provider>
  );
}

export function useNotation() {
  const context = useContext(NotationContext);
  if (!context) {
    throw new Error('useNotation must be used within a NotationProvider');
  }
  return context;
}
