import { useState, useCallback, useRef } from 'react';
import type { Prize } from '@/shared/types';
import { safeLoadPrizes } from '../utils/migration';

const STORAGE_KEY = 'prizeflow_prizes';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface UsePrizesReturn {
  prizes: Prize[];
  setPrizes: (newValue: Prize[] | ((prev: Prize[]) => Prize[])) => void;
  addPrize: (name: string, description: string) => void;
  updatePrize: (id: string, updates: Partial<Omit<Prize, 'id'>>) => void;
  deletePrize: (id: string) => void;
  assignRecipient: (prizeId: string, recipientId: string) => void;
  unassignRecipient: (prizeId: string) => void;
  claimPrize: (prizeId: string) => void;
  unclaimPrize: (prizeId: string) => void;
  clearRecipientFromPrizes: (recipientId: string) => void;
  error: string | null;
}

/**
 * Manages prize state with localStorage persistence.
 * Uses safeLoadPrizes to migrate legacy data on load and apply financial field defaults.
 * Handles QuotaExceededError on write by retaining data in memory and setting a warning.
 * Provides clearRecipientFromPrizes for cascade delete coordination.
 */
export function usePrizes(): UsePrizesReturn {
  const [error, setError] = useState<string | null>(() => {
    const { error: loadError } = safeLoadPrizes(STORAGE_KEY);
    return loadError;
  });

  const [prizes, setPrizesState] = useState<Prize[]>(() => {
    const { prizes: loadedPrizes } = safeLoadPrizes(STORAGE_KEY);
    return loadedPrizes;
  });

  const prizesRef = useRef(prizes);
  prizesRef.current = prizes;

  const setPrizes = useCallback((newValue: Prize[] | ((prev: Prize[]) => Prize[])) => {
    const resolvedValue = typeof newValue === 'function'
      ? newValue(prizesRef.current)
      : newValue;

    setPrizesState(resolvedValue);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedValue));
      setError(null);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setError('Storage quota exceeded. Changes are retained in memory but may not persist across page refreshes.');
      } else {
        setError('Failed to save data. Changes may not persist.');
      }
    }
  }, []);

  const addPrize = useCallback((name: string, description: string) => {
    const newPrize: Prize = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      recipientId: null,
      claimed: false,
      claimDate: null,
      prizeValue: null,
      currency: 'USD',
      prizeType: 'physical',
      fundingSource: null,
      sponsor: null,
      budgetCategory: null,
      distributionStatus: 'pending',
    };
    setPrizes(prev => [...prev, newPrize]);
  }, [setPrizes]);

  const updatePrize = useCallback((id: string, updates: Partial<Omit<Prize, 'id'>>) => {
    setPrizes(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }, [setPrizes]);

  const deletePrize = useCallback((id: string) => {
    setPrizes(prev => prev.filter(p => p.id !== id));
  }, [setPrizes]);

  const assignRecipient = useCallback((prizeId: string, recipientId: string) => {
    setPrizes(prev =>
      prev.map(p => p.id === prizeId ? { ...p, recipientId } : p)
    );
  }, [setPrizes]);

  const unassignRecipient = useCallback((prizeId: string) => {
    setPrizes(prev =>
      prev.map(p => p.id === prizeId ? { ...p, recipientId: null, claimed: false, claimDate: null } : p)
    );
  }, [setPrizes]);

  const claimPrize = useCallback((prizeId: string) => {
    setPrizes(prev =>
      prev.map(p => p.id === prizeId ? { ...p, claimed: true, claimDate: new Date().toISOString().slice(0, 10) } : p)
    );
  }, [setPrizes]);

  const unclaimPrize = useCallback((prizeId: string) => {
    setPrizes(prev =>
      prev.map(p => p.id === prizeId ? { ...p, claimed: false, claimDate: null } : p)
    );
  }, [setPrizes]);

  /**
   * Cascade delete: clear recipientId, claimed, and claimDate
   * on all prizes referencing the deleted recipient.
   * Called atomically with recipient deletion.
   */
  const clearRecipientFromPrizes = useCallback((recipientId: string) => {
    setPrizes(prev =>
      prev.map(p =>
        p.recipientId === recipientId
          ? { ...p, recipientId: null, claimed: false, claimDate: null }
          : p
      )
    );
  }, [setPrizes]);

  return {
    prizes,
    setPrizes,
    addPrize,
    updatePrize,
    deletePrize,
    assignRecipient,
    unassignRecipient,
    claimPrize,
    unclaimPrize,
    clearRecipientFromPrizes,
    error,
  };
}
