import { useCallback } from 'react';
import { Button } from '@/shared/components';
import type { Recipient, Prize } from '@/shared/types';
import { TYPE_BADGE_CONFIG, computeQuickStats, formatQuickStat } from '@/shared/utils';

export interface RecipientRowProps {
  recipient: Recipient;
  prizes: Prize[];
  onEdit: (recipient: Recipient) => void;
  onDelete: (recipient: Recipient) => void;
  onDuplicate: (recipientId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

function RecipientRow({ recipient, prizes, onEdit, onDelete, onDuplicate, canEdit = true, canDelete = true }: RecipientRowProps) {
  const badgeConfig = TYPE_BADGE_CONFIG[recipient.type];
  const { assigned, claimed } = computeQuickStats(recipient.id, prizes);
  const quickStatText = formatQuickStat(assigned, claimed);

  const handleEdit = useCallback(() => onEdit(recipient), [recipient, onEdit]);
  const handleDelete = useCallback(() => onDelete(recipient), [recipient, onDelete]);
  const handleDuplicate = useCallback(() => onDuplicate(recipient.id), [recipient.id, onDuplicate]);

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-fast">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-medium text-neutral-900 truncate">
            {recipient.displayName}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium ring-1 ring-inset ${badgeConfig.classes}`}
          >
            {badgeConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {recipient.contactPerson && (
            <p className="text-body-sm text-neutral-500 truncate">
              {recipient.contactPerson}
            </p>
          )}
          {recipient.contactInfo && (
            <p className="text-body-sm text-neutral-500 truncate">
              {recipient.contactInfo}
            </p>
          )}
        </div>
        {/* Quick stats — secondary info */}
        <p className="text-caption text-neutral-400 mt-0.5">
          {quickStatText}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast">
        <Button
          variant="secondary"
          size="small"
          onClick={handleDuplicate}
          aria-label={`Duplicate ${recipient.displayName}`}
        >
          Duplicate
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={handleEdit}
          aria-label={`Edit ${recipient.displayName}`}
          disabled={!canEdit}
          aria-disabled={!canEdit || undefined}
          title={!canEdit ? 'Action unavailable for current role' : undefined}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={handleDelete}
          aria-label={`Delete ${recipient.displayName}`}
          disabled={!canDelete}
          aria-disabled={!canDelete || undefined}
          title={!canDelete ? 'Action unavailable for current role' : undefined}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export { RecipientRow };
