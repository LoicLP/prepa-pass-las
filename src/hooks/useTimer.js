'use client';
import { useState, useRef, useCallback } from 'react';

export function useTimer({ mode = 'up', durationMinutes = 30, onExpire } = {}) {
  const [seconds, setSeconds] = useState(mode === 'down' ? durationMinutes * 60 : 0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = mode === 'down' ? prev - 1 : prev + 1;
        if (mode === 'down' && next <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [mode, onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(mode === 'down' ? durationMinutes * 60 : 0);
  }, [mode, durationMinutes, stop]);

  const formatted = `${Math.floor(Math.abs(seconds) / 60).toString().padStart(2, '0')}:${(Math.abs(seconds) % 60).toString().padStart(2, '0')}`;

  return { seconds, formatted, start, stop, reset };
}
