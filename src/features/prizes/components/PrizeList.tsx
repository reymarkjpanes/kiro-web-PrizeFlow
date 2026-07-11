import React, { useState, useMemo, useCallback } from 'react';
import { Input, EmptyState } from '@/shared/components';
import type { Prize, Recipient } from '@/shared/types';
import { PrizeRow } from './PrizeRow';

export interface PrizeListProps {
  prizes: Prize[];
  recipients: Recipient[];
  onEdit: (prize: Prize) => void;
  onDelete: (prize: Prize) => void;
  onAssign: (prizeId: string, recipientId: string) => void;
  onClaim: (prizeId: string) => void;
  onUnclaim: (prizeId: string) => void;
  onAdd: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

function PrizeList({
  prizes,
  recipients,
  onEdit,
  onDelete,
  onAssign,
  onClaim,
  onUnclaim,
  onAdd,
  canEdit = true,
  canDelete = true,
}: PrizeListProps) {
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  // Build a map of recipient displayNames for efficient lookup
  const recipientMap = useMemo(() => {
    const map = new Map<string, string>();
    recipients.forEach(r => map.set(r.id, r.displayName));
    return map;
  }, [recipients]);

  const filteredPrizes = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return prizes;
    return prizes.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const recipientName = p.recipientId ? recipientMap.get(p.recipientId) : undefined;
      const recipientMatch = recipientName ? recipientName.toLowerCase().includes(query) : false;
      return nameMatch || recipientMatch;
    });
  }, [prizes, search, recipientMap]);

  if (prizes.length === 0) {
    return (
      <EmptyState
        heading="No prizes yet"
        description="Add your first prize to start managing giveaways."
        actionLabel="Add Prize"
        onAction={onAdd}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <Input
        label="Search prizes"
        value={search}
        onChange={handleSearchChange}
        placeholder="Filter by prize name or recipient..."
        aria-label="Search prizes"
      />

      {filteredPrizes.length === 0 ? (
        <EmptyState
          heading="No results match"
          description="Try adjusting your search terms."
        />
      ) : (
        <div className="space-y-2" role="list" aria-label="Prizes list">
          {filteredPrizes.map(prize => (
            <div role="listitem" key={prize.id}>
              <PrizeRow
                prize={prize}
                recipientName={prize.recipientId ? recipientMap.get(prize.recipientId) : undefined}
                recipients={recipients}
                onEdit={onEdit}
                onDelete={onDelete}
                onAssign={onAssign}
                onClaim={onClaim}
                onUnclaim={onUnclaim}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { PrizeList };
