import { Button } from '@/shared/components';
import type { Recipient } from '@/shared/types';

export interface RecipientRowProps {
  recipient: Recipient;
  onEdit: (recipient: Recipient) => void;
  onDelete: (recipient: Recipient) => void;
}

function RecipientRow({ recipient, onEdit, onDelete }: RecipientRowProps) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors duration-fast">
      <div className="min-w-0">
        <p className="text-body-sm font-medium text-neutral-900 truncate">
          {recipient.name}
        </p>
        {recipient.contact && (
          <p className="text-body-sm text-neutral-500 truncate">
            {recipient.contact}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast">
        <Button
          variant="secondary"
          size="small"
          onClick={() => onEdit(recipient)}
          aria-label={`Edit ${recipient.name}`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(recipient)}
          aria-label={`Delete ${recipient.name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export { RecipientRow };
