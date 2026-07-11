import React, { useCallback, useId } from 'react';
import { Button, Badge } from '@/shared/components';
import type { Prize, Recipient } from '@/shared/types';

export interface PrizeRowProps {
  prize: Prize;
  recipientName?: string;
  recipients: Recipient[];
  onEdit: (prize: Prize) => void;
  onDelete: (prize: Prize) => void;
  onAssign: (prizeId: string, recipientId: string) => void;
  onClaim: (prizeId: string) => void;
  onUnclaim: (prizeId: string) => void;
}

function PrizeRow({
  prize,
  recipientName,
  recipients,
  onEdit,
  onDelete,
  onAssign,
  onClaim,
  onUnclaim,
}: PrizeRowProps) {
  const selectId = useId();

  const handleAssignChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onAssign(prize.id, value);
    },
    [prize.id, onAssign]
  );

  const handleClaimToggle = useCallback(() => {
    if (prize.claimed) {
      onUnclaim(prize.id);
    } else {
      onClaim(prize.id);
    }
  }, [prize.id, prize.claimed, onClaim, onUnclaim]);

  const handleEdit = useCallback(() => {
    onEdit(prize);
  }, [prize, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(prize);
  }, [prize, onDelete]);

  return (
    <div className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-fast">
      {/* Prize info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-medium text-neutral-900 truncate">
            {prize.name}
          </p>
          <Badge variant={prize.claimed ? 'success' : 'warning'}>
            {prize.claimed ? 'Claimed' : 'Unclaimed'}
          </Badge>
        </div>
        {prize.description && (
          <p className="text-body-sm text-neutral-500 truncate mt-0.5">
            {prize.description}
          </p>
        )}
        {recipientName && (
          <p className="text-caption text-neutral-400 mt-0.5">
            Assigned to: {recipientName}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast">
        {/* Recipient assignment dropdown */}
        <div className="flex items-center gap-1">
          <label htmlFor={selectId} className="sr-only">
            Assign recipient to {prize.name}
          </label>
          <select
            id={selectId}
            value={prize.recipientId ?? ''}
            onChange={handleAssignChange}
            className="text-caption border border-neutral-300 rounded-md px-2 py-1.5 bg-white text-neutral-700 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors duration-fast"
            aria-label={`Assign recipient to ${prize.name}`}
          >
            <option value="">Unassigned</option>
            {recipients.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Claim/Unclaim toggle (only if assigned) */}
        {prize.recipientId && (
          <Button
            variant={prize.claimed ? 'secondary' : 'success'}
            size="small"
            onClick={handleClaimToggle}
            aria-label={prize.claimed ? `Mark ${prize.name} as unclaimed` : `Mark ${prize.name} as claimed`}
          >
            {prize.claimed ? 'Unclaim' : 'Claim'}
          </Button>
        )}

        <Button
          variant="secondary"
          size="small"
          onClick={handleEdit}
          aria-label={`Edit ${prize.name}`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={handleDelete}
          aria-label={`Delete ${prize.name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export { PrizeRow };
