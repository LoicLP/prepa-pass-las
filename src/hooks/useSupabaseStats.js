'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const DEFAULT_STATS = { sessions: [], totalCorrect: 0, totalAnswered: 0 };

const LOCAL_STORAGE_KEYS = {
  qcm_stats: 'prepa-qcm-stats',
  examen_stats: 'prepa-examen-stats',
};

export function useSupabaseStats(userId, statKey) {
  const [value, setValue] = useState(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!userId || !supabase) {
      setIsLoaded(true);
      return;
    }

    const load = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select(statKey)
        .eq('id', userId)
        .single();

      const supabaseStats = data?.[statKey];
      const hasSessions = supabaseStats?.sessions?.length > 0;

      if (hasSessions) {
        // Données déjà dans Supabase
        setValue(supabaseStats);
      } else {
        // Tenter une migration depuis localStorage
        const localKey = LOCAL_STORAGE_KEYS[statKey];
        if (localKey) {
          try {
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed?.sessions?.length > 0) {
                // Migrer vers Supabase
                await supabase.from('user_profiles').upsert({
                  id: userId,
                  [statKey]: parsed,
                  updated_at: new Date().toISOString(),
                });
                setValue(parsed);
                // Nettoyer localStorage
                localStorage.removeItem(localKey);
              }
            }
          } catch {}
        }
      }

      setIsLoaded(true);
    };

    load();
  }, [userId, statKey]);

  const setStoredValue = useCallback(async (newValue) => {
    setValue(prev => {
      const val = typeof newValue === 'function' ? newValue(prev) : newValue;
      if (userId && supabase) {
        supabase.from('user_profiles').upsert({
          id: userId,
          [statKey]: val,
          updated_at: new Date().toISOString(),
        });
      }
      return val;
    });
  }, [userId, statKey]);

  return [value, setStoredValue, isLoaded];
}
