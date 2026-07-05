'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const DEFAULT_STATS = { sessions: [], totalCorrect: 0, totalAnswered: 0 };

const LOCAL_STORAGE_KEYS = {
  qcm_stats: 'prepa-qcm-stats',
  examen_stats: 'prepa-examen-stats',
};

export function useSupabaseStats(userId, statKey, refreshToken = 0) {
  const [value, setValue] = useState(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);
  // Ref pour toujours avoir la valeur courante sans dépendance dans le callback
  const valueRef = useRef(DEFAULT_STATS);

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
        setValue(supabaseStats);
        valueRef.current = supabaseStats;
      } else {
        // Tenter une migration depuis localStorage
        const localKey = LOCAL_STORAGE_KEYS[statKey];
        if (localKey) {
          try {
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed?.sessions?.length > 0) {
                await supabase.from('user_profiles').upsert({
                  id: userId,
                  [statKey]: parsed,
                  updated_at: new Date().toISOString(),
                });
                setValue(parsed);
                valueRef.current = parsed;
                localStorage.removeItem(localKey);
              }
            }
          } catch {}
        }
      }

      setIsLoaded(true);
    };

    load();
  }, [userId, statKey, refreshToken]);

  const setStoredValue = useCallback(async (newValue) => {
    // Calculer la nouvelle valeur à partir de l'ancienne (via ref)
    const nextVal = typeof newValue === 'function' ? newValue(valueRef.current) : newValue;

    // Mettre à jour l'état local et la ref immédiatement
    setValue(nextVal);
    valueRef.current = nextVal;

    // Persister dans Supabase séparément (pas dans le setState callback)
    if (userId && supabase) {
      try {
        await supabase.from('user_profiles').upsert({
          id: userId,
          [statKey]: nextVal,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[useSupabaseStats] Erreur upsert:', err.message);
      }
    }
  }, [userId, statKey]);

  return [value, setStoredValue, isLoaded];
}
