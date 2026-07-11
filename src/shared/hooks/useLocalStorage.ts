import { useState, useCallback, useRef } from 'react';

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  error: string | null;
}

/**
 * Generic localStorage hook with graceful error handling.
 *
 * - Reads from localStorage on mount with JSON.parse
 * - Returns defaultValue on parse failure or invalid data, logs console.warn
 * - On QuotaExceededError, retains value in memory and sets error
 * - Memoizes setValue with useCallback
 */
export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  const [error, setError] = useState<string | null>(null);

  const [value, setValueState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;

      const parsed = JSON.parse(stored);

      // If defaultValue is an array, validate parsed is also an array
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
        console.warn(`[useLocalStorage] Key "${key}": expected array, got ${typeof parsed}. Using default.`);
        return defaultValue;
      }

      return parsed as T;
    } catch (e) {
      console.warn(`[useLocalStorage] Key "${key}": failed to parse stored value. Using default.`, e);
      return defaultValue;
    }
  });

  // Keep a ref to avoid stale closures in setValue
  const valueRef = useRef(value);
  valueRef.current = value;

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(valueRef.current)
      : newValue;

    setValueState(resolvedValue);

    try {
      localStorage.setItem(key, JSON.stringify(resolvedValue));
      setError(null);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setError('Storage quota exceeded. Changes may not persist across page refreshes.');
        console.warn(`[useLocalStorage] Key "${key}": QuotaExceededError. State retained in memory only.`);
      } else {
        setError('Failed to save data. Changes may not persist.');
        console.warn(`[useLocalStorage] Key "${key}": write failed.`, e);
      }
    }
  }, [key]);

  return { value, setValue, error };
}
