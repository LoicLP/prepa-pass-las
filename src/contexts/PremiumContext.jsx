'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const TIERS = ['gratuit', 'essentiel', 'premium+'];

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const [tier, setTier] = useState('gratuit');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Migration depuis l'ancien système booléen
    const oldPremium = localStorage.getItem('prepa-premium');
    const savedTier = localStorage.getItem('prepa-tier');

    if (savedTier && TIERS.includes(savedTier)) {
      setTier(savedTier);
    } else if (oldPremium === 'true') {
      // Migration : ancien isPremium=true → premium+
      setTier('premium+');
      localStorage.setItem('prepa-tier', 'premium+');
    }
    // Sinon, reste 'gratuit' par défaut

    setIsLoaded(true);
  }, []);

  // Helpers
  const isEssentiel = tier === 'essentiel' || tier === 'premium+';
  const isPremiumPlus = tier === 'premium+';

  // Rétrocompatibilité
  const isPremium = isPremiumPlus;

  const setSubscription = (newTier) => {
    if (TIERS.includes(newTier)) {
      localStorage.setItem('prepa-tier', newTier);
      // Sync ancien flag pour rétrocompatibilité
      localStorage.setItem('prepa-premium', newTier === 'premium+' ? 'true' : 'false');
      setTier(newTier);
    }
  };

  // Rétrocompatibilité : togglePremium pour les anciens usages
  const togglePremium = (value) => {
    const newVal = typeof value === 'boolean' ? value : !isPremium;
    setSubscription(newVal ? 'premium+' : 'gratuit');
  };

  return (
    <PremiumContext.Provider value={{ tier, isEssentiel, isPremiumPlus, isPremium, setSubscription, togglePremium, isLoaded }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
