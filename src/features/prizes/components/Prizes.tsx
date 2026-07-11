import { useState, useCallback, useRef } from 'react';
import { Button, Badge, Dialog } from '@/shared/components';
import type { Prize, Recipient } from '@/shared/types';
import { useRBAC } from '@/shared/hooks';
import { PrizeForm } from './PrizeForm';
import type { PrizeFormData } from './PrizeForm';
import { PrizeList } from './PrizeList';

export interface PrizesProps {
  prizes: Prize[];
  recipients: Recipient[];
  addPrize: (name: string, description: string) => void;
  updatePrize: (id: string, updates: Partial<Omit<Prize, 'id'>>) => void;
  deletePrize: (id: string) => void;
  assignRecipient: (prizeId: string, recipientId: string) => void;
  unassignRecipient: (prizeId: string) => void;
  claimPrize: (prizeId: string) => void;
  unclaimPrize: (prizeId: string) => void;
}

function Prizes({
  prizes,
  recipients,
  addPrize,
  updatePrize,
  deletePrize,
  assignRecipient,
  unassignRecipient,
  claimPrize,
  unclaimPrize,
}: PrizesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [deletingPrize, setDeletingPrize] = useState<Prize | null>(null);

  const { isActionEnabled } = useRBAC();
  const canCreate = isActionEnabled('Prize Management', 'Create');
  const canEdit = isActionEnabled('Prize Management', 'Edit');
  const canDelete = isActionEnabled('Prize Management', 'Delete');

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleAdd = useCallback(() => {
    setEditingPrize(null);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: PrizeFormData) => {
      if (editingPrize) {
        updatePrize(editingPrize.id, {
          name: data.name,
          description: data.description,
          prizeValue: data.prizeValue,
          currency: data.currency,
          prizeType: data.prizeType,
          fundingSource: data.fundingSource,
          sponsor: data.sponsor,
          budgetCategory: data.budgetCategory,
          distributionStatus: data.distributionStatus,
        });
      } else {
        // For new prizes, first create with basic fields (which sets defaults)
        addPrize(data.name, data.description);
        // Then immediately update with financial data if any non-default values provided
        const hasFinancialData =
          data.prizeValue !== null ||
          data.currency !== 'USD' ||
          data.prizeType !== 'physical' ||
          data.fundingSource !== null ||
          data.sponsor !== null ||
          data.budgetCategory !== null;

        if (hasFinancialData) {
          // Find the newly created prize (last one in the list with matching name)
          // Use a microtask to ensure state has settled from addPrize
          queueMicrotask(() => {
            const currentPrizes = JSON.parse(localStorage.getItem('prizeflow_prizes') || '[]');
            const newPrize = currentPrizes[currentPrizes.length - 1];
            if (newPrize && newPrize.name === data.name) {
              updatePrize(newPrize.id, {
                prizeValue: data.prizeValue,
                currency: data.currency,
                prizeType: data.prizeType,
                fundingSource: data.fundingSource,
                sponsor: data.sponsor,
                budgetCategory: data.budgetCategory,
              });
            }
          });
        }
      }
      setShowForm(false);
      setEditingPrize(null);
    },
    [editingPrize, addPrize, updatePrize]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingPrize(null);
  }, []);

  const handleEdit = useCallback((prize: Prize) => {
    setEditingPrize(prize);
    setShowForm(true);
  }, []);

  const handleDeleteRequest = useCallback((prize: Prize) => {
    setDeletingPrize(prize);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingPrize) {
      deletePrize(deletingPrize.id);
      setDeletingPrize(null);
    }
  }, [deletingPrize, deletePrize]);

  const handleDeleteCancel = useCallback(() => {
    setDeletingPrize(null);
  }, []);

  const handleAssign = useCallback(
    (prizeId: string, recipientId: string) => {
      if (recipientId === '') {
        unassignRecipient(prizeId);
      } else {
        assignRecipient(prizeId, recipientId);
      }
    },
    [assignRecipient, unassignRecipient]
  );

  const handleClaim = useCallback(
    (prizeId: string) => {
      claimPrize(prizeId);
    },
    [claimPrize]
  );

  const handleUnclaim = useCallback(
    (prizeId: string) => {
      unclaimPrize(prizeId);
    },
    [unclaimPrize]
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-h2 text-neutral-900">Prizes</h1>
          <Badge variant="neutral">{prizes.length}</Badge>
        </div>
        <Button
          ref={addButtonRef}
          variant="primary"
          size="small"
          onClick={handleAdd}
          aria-label="Add Prize"
          disabled={!canCreate}
          aria-disabled={!canCreate || undefined}
          title={!canCreate ? 'Action unavailable for current role' : undefined}
        >
          Add Prize
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <PrizeForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingPrize ?? undefined}
          isEditMode={!!editingPrize}
          triggerRef={addButtonRef}
        />
      )}

      {/* List */}
      <PrizeList
        prizes={prizes}
        recipients={recipients}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onAssign={handleAssign}
        onClaim={handleClaim}
        onUnclaim={handleUnclaim}
        onAdd={handleAdd}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deletingPrize}
        onClose={handleDeleteCancel}
        title="Delete Prize"
        triggerRef={deleteButtonRef}
      >
        <p className="text-body-sm text-neutral-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-neutral-900">
            {deletingPrize?.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="small" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="small" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </div>
      </Dialog>
    </section>
  );
}

export { Prizes };
