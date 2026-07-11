import React, { useCallback } from 'react';
import { Input, EmptyState, FilterPills } from '@/shared/components';
import type { Recipient, Prize, RecipientType } from '@/shared/types';
import { TYPE_BADGE_CONFIG } from '@/shared/utils';
import { useRecipientFilter } from '@/shared/hooks';
import { RecipientRow } from './RecipientRow';

export interface RecipientListProps {
  recipients: Recipient[];
  prizes: Prize[];
  onEdit: (recipient: Recipient) => void;
  onDelete: (recipient: Recipient) => void;
  onDuplicate: (recipientId: string) => void;
  onAdd: () => void;
}

// Build filter pill options from TYPE_BADGE_CONFIG
const TYPE_FILTER_OPTIONS = (Object.entries(TYPE_BADGE_CONFIG) as [RecipientType, { label: string; classes: string }][]).map(
  ([value, config]) => ({
    value,
    label: config.label,
  })
);

function RecipientList({ recipients, prizes, onEdit, onDelete, onDuplicate, onAdd }: RecipientListProps) {
  const {
    selectedTypes,
    setSelectedTypes,
    searchQuery,
    setSearchQuery,
    filteredRecipients,
  } = useRecipientFilter(recipients);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleTypeFilterChange = useCallback((selected: string[]) => {
    setSelectedTypes(selected as RecipientType[]);
  }, [setSelectedTypes]);

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
      {/* Type filter pills */}
      <FilterPills
        options={TYPE_FILTER_OPTIONS}
        selected={selectedTypes}
        onChange={handleTypeFilterChange}
        aria-label="Filter recipients by type"
      />

      <Input
        label="Search recipients"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Filter by name, contact, or members..."
        aria-label="Search recipients"
      />

      {filteredRecipients.length === 0 ? (
        <EmptyState
          heading="No results match"
          description="Try adjusting your search terms or filters."
        />
      ) : (
        <div className="space-y-2" role="list" aria-label="Recipients list">
          {filteredRecipients.map(recipient => (
            <div role="listitem" key={recipient.id}>
              <RecipientRow
                recipient={recipient}
                prizes={prizes}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { RecipientList };
