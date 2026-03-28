'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const TIERS = ['gratuit', 'essentiel', 'premium+'];

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const { user } = useAuth();
  const [tier, setTier] = useState('gratuit');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setTier('gratuit');
      setIsLoaded(true);
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        // Créer le profil s'il n'existe pas
        await supabase.from('user_profiles').insert({ id: user.id, tier: 'gratuit' });
        setTier('gratuit');
      } else {
        setTier(TIERS.includes(data.tier) ? data.tier : 'gratuit');
      }
      setIsLoaded(true);
    };

    loadProfile();
  }, [user]);

  const isEssentiel = tier === 'essentiel' || tier === 'premium+';
  const isPremiumPlus = tier === 'premium+';
  const isPremium = isPremiumPlus;

  const setSubscription = async (newTier) => {
    if (!TIERS.includes(newTier)) return;
    setTier(newTier);
    if (user && supabase) {
      await supabase
        .from('user_profiles')
        .upsert({ id: user.id, tier: newTier, updated_at: new Date().toISOString() });
    }
  };

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
