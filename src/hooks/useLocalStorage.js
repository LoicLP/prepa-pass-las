'use client';
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
    setIsLoaded(true);
  }, [key]);

  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const val = typeof newValue === 'function' ? newValue(prev) : newValue;
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    });
  }, [key]);

  return [value, setStoredValue, isLoaded];
}
