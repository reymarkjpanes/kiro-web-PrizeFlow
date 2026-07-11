/**
 * Storage Layer — key-based persistence with graceful error handling.
 * Separate from useLocalStorage hook for pure utility usage.
 */

const STORAGE_PREFIX = 'prizeflow_';

export interface WriteResult {
  success: boolean;
  error?: string;
}

/**
 * Read a value from localStorage with JSON parsing.
 * Returns defaultValue on any failure.
 */
export function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored === null) return defaultValue;

    const parsed = JSON.parse(stored);

    // Validate array shape if default is array
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      console.warn(`[Storage] Key "${key}": expected array, got ${typeof parsed}`);
      return defaultValue;
    }

    return parsed as T;
  } catch (e) {
    console.warn(`[Storage] Key "${key}": read failed`, e);
    return defaultValue;
  }
}

/**
 * Write a value to localStorage as JSON.
 * Catches QuotaExceededError and other failures gracefully.
 */
export function writeStorage<T>(key: string, value: T): WriteResult {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    return { success: true };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return { success: false, error: 'Storage quota exceeded' };
    }
    return { success: false, error: 'Write failed' };
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Silently ignore removal errors
  }
}

// Storage keys
export const STORAGE_KEYS = {
  RECIPIENTS: 'recipients',
  PRIZES: 'prizes',
} as const;
