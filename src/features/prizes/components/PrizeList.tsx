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
}: PrizeListProps) {
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  // Build a map of recipient names for efficient lookup
  const recipientMap = useMemo(() => {
    const map = new Map<string, string>();
    recipients.forEach(r => map.set(r.id, r.name));
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { PrizeList };
