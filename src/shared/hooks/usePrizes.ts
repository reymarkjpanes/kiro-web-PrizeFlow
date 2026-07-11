import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Prize } from '@/shared/types';

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
 * Provides clearRecipientFromPrizes for cascade delete coordination.
 */
export function usePrizes(): UsePrizesReturn {
  const { value: prizes, setValue: setPrizes, error } = useLocalStorage<Prize[]>('prizeflow_prizes', []);

  const addPrize = useCallback((name: string, description: string) => {
    const newPrize: Prize = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      recipientId: null,
      claimed: false,
      claimDate: null,
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
