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
  canEdit?: boolean;
  canDelete?: boolean;
}

// Build filter pill options from TYPE_BADGE_CONFIG
const TYPE_FILTER_OPTIONS = (Object.entries(TYPE_BADGE_CONFIG) as [RecipientType, { label: string; classes: string }][]).map(
  ([value, config]) => ({
    value,
    label: config.label,
  })
);

function RecipientList({ recipients, prizes, onEdit, onDelete, onDuplicate, onAdd, canEdit = true, canDelete = true }: RecipientListProps) {
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
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        }
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

export { RecipientList };
