'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem('prepa-premium') === 'true');
    setIsLoaded(true);
  }, []);

  const togglePremium = (value) => {
    const newVal = typeof value === 'boolean' ? value : !isPremium;
    localStorage.setItem('prepa-premium', newVal ? 'true' : 'false');
    setIsPremium(newVal);
  };

  return (
    <PremiumContext.Provider value={{ isPremium, togglePremium, isLoaded }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
