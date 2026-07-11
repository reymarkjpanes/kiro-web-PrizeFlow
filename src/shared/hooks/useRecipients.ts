import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Recipient } from '@/shared/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface UseRecipientsReturn {
  recipients: Recipient[];
  addRecipient: (name: string, contact: string) => void;
  updateRecipient: (id: string, updates: Partial<Omit<Recipient, 'id'>>) => void;
  deleteRecipient: (id: string) => void;
  error: string | null;
}

/**
 * Manages recipient state with localStorage persistence.
 *
 * NOTE: deleteRecipient requires a cascadeUpdate function to clean up
 * prize references. This is coordinated at the App level.
 */
export function useRecipients(): UseRecipientsReturn {
  const { value: recipients, setValue: setRecipients, error } = useLocalStorage<Recipient[]>('prizeflow_recipients', []);

  const addRecipient = useCallback((name: string, contact: string) => {
    const newRecipient: Recipient = {
      id: generateId(),
      name: name.trim(),
      contact: contact.trim(),
    };
    setRecipients(prev => [...prev, newRecipient]);
  }, [setRecipients]);

  const updateRecipient = useCallback((id: string, updates: Partial<Omit<Recipient, 'id'>>) => {
    setRecipients(prev =>
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  }, [setRecipients]);

  const deleteRecipient = useCallback((id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  }, [setRecipients]);

  return { recipients, addRecipient, updateRecipient, deleteRecipient, error };
}
