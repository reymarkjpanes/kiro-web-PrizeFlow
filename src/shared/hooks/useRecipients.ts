import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Recipient, RecipientFormData } from '@/shared/types';
import { migrateRecipients } from '@/shared/utils/recipientMigration';
import { duplicateRecipient as duplicateRecipientUtil } from '@/shared/utils/recipientUtils';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface UseRecipientsReturn {
  recipients: Recipient[];
  addRecipient: (data: RecipientFormData) => void;
  updateRecipient: (id: string, updates: Partial<Omit<Recipient, 'id'>>) => void;
  deleteRecipient: (id: string) => void;
  duplicateRecipient: (id: string) => Recipient | null;
  error: string | null;
}

/**
 * Manages recipient state with localStorage persistence.
 * Runs data migration on mount to upgrade legacy records.
 */
export function useRecipients(): UseRecipientsReturn {
  const { value: recipients, setValue: setRecipients, error } = useLocalStorage<Recipient[]>('prizeflow_recipients', []);
  const migrationRan = useRef(false);

  // Run migration on mount (once)
  useEffect(() => {
    if (migrationRan.current) return;
    migrationRan.current = true;

    // Check if any records need migration
    const raw = recipients as unknown[];
    const migrated = migrateRecipients(raw);
    
    // Only write back if something changed
    const needsMigration = raw.some((r: any) => !('type' in r));
    if (needsMigration) {
      setRecipients(migrated);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addRecipient = useCallback((data: RecipientFormData) => {
    const newRecipient: Recipient = {
      id: generateId(),
      type: data.type,
      displayName: data.displayName.trim(),
      contactPerson: data.contactPerson.trim(),
      contactInfo: data.contactInfo.trim(),
      members: data.members,
      memberCount: data.members.length,
      notes: data.notes.trim(),
      customLabel: data.customLabel.trim(),
    };
    setRecipients(prev => [...prev, newRecipient]);
  }, [setRecipients]);

  const updateRecipient = useCallback((id: string, updates: Partial<Omit<Recipient, 'id'>>) => {
    setRecipients(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        // Recompute memberCount if members changed
        if (updates.members) {
          updated.memberCount = updates.members.length;
        }
        return updated;
      })
    );
  }, [setRecipients]);

  const deleteRecipient = useCallback((id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  }, [setRecipients]);

  const duplicateRecipient = useCallback((id: string): Recipient | null => {
    const original = recipients.find(r => r.id === id);
    if (!original) return null;

    const duplicatedData = duplicateRecipientUtil(original);
    const newRecipient: Recipient = {
      id: generateId(),
      ...duplicatedData,
    };
    setRecipients(prev => [...prev, newRecipient]);
    return newRecipient;
  }, [recipients, setRecipients]);

  return { recipients, addRecipient, updateRecipient, deleteRecipient, duplicateRecipient, error };
}
