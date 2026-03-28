'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const DEFAULT_STATS = { sessions: [], totalCorrect: 0, totalAnswered: 0 };

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

      if (data?.[statKey]) {
        setValue(data[statKey]);
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
