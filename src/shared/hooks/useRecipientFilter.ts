import { useState, useMemo, useCallback } from 'react';
import type { Recipient, RecipientType } from '@/shared/types';
import { filterRecipients as filterFn } from '@/shared/utils/recipientUtils';

export interface UseRecipientFilterReturn {
  selectedTypes: RecipientType[];
  setSelectedTypes: (types: RecipientType[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredRecipients: Recipient[];
}

/**
 * Combines type filter and text search into a single filtering hook.
 * Memoizes filtered results for performance.
 */
export function useRecipientFilter(recipients: Recipient[]): UseRecipientFilterReturn {
  const [selectedTypes, setSelectedTypes] = useState<RecipientType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipients = useMemo(
    () => filterFn(recipients, selectedTypes, searchQuery),
    [recipients, selectedTypes, searchQuery]
  );

  const handleSetSelectedTypes = useCallback((types: RecipientType[]) => {
    setSelectedTypes(types);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    selectedTypes,
    setSelectedTypes: handleSetSelectedTypes,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filteredRecipients,
  };
}
