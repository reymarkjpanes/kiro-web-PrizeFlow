import React, { useState, useMemo, useCallback } from 'react';
import { Input, EmptyState } from '@/shared/components';
import type { Recipient } from '@/shared/types';
import { RecipientRow } from './RecipientRow';

export interface RecipientListProps {
  recipients: Recipient[];
  onEdit: (recipient: Recipient) => void;
  onDelete: (recipient: Recipient) => void;
  onAdd: () => void;
}

function RecipientList({ recipients, onEdit, onDelete, onAdd }: RecipientListProps) {
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const filteredRecipients = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return recipients;
    return recipients.filter(
      r =>
        r.name.toLowerCase().includes(query) ||
        r.contact.toLowerCase().includes(query)
    );
  }, [recipients, search]);

  if (recipients.length === 0) {
    return (
      <EmptyState
        heading="No recipients yet"
        description="Add your first recipient to start assigning prizes."
        actionLabel="Add Recipient"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="space-y-3">
      <Input
        label="Search recipients"
        value={search}
        onChange={handleSearchChange}
        placeholder="Filter by name or contact..."
        aria-label="Search recipients"
      />

      {filteredRecipients.length === 0 ? (
        <EmptyState
          heading="No results match"
          description="Try adjusting your search terms."
        />
      ) : (
        <div className="space-y-2" role="list" aria-label="Recipients list">
          {filteredRecipients.map(recipient => (
            <div role="listitem" key={recipient.id}>
              <RecipientRow
                recipient={recipient}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { RecipientList };
