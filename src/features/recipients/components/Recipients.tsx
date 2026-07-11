import { useState, useCallback, useRef } from 'react';
import { Button, Badge, Dialog } from '@/shared/components';
import type { Recipient } from '@/shared/types';
import { RecipientForm } from './RecipientForm';
import { RecipientList } from './RecipientList';

export interface RecipientsProps {
  recipients: Recipient[];
  addRecipient: (name: string, contact: string) => void;
  updateRecipient: (id: string, updates: Partial<Omit<Recipient, 'id'>>) => void;
  deleteRecipient: (id: string) => void;
  clearRecipientFromPrizes: (recipientId: string) => void;
}

function Recipients({
  recipients,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  clearRecipientFromPrizes,
}: RecipientsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [deletingRecipient, setDeletingRecipient] = useState<Recipient | null>(null);

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const handleAdd = useCallback(() => {
    setEditingRecipient(null);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (name: string, contact: string) => {
      if (editingRecipient) {
        updateRecipient(editingRecipient.id, { name, contact });
      } else {
        addRecipient(name, contact);
      }
      setShowForm(false);
      setEditingRecipient(null);
    },
    [editingRecipient, addRecipient, updateRecipient]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingRecipient(null);
  }, []);

  const handleEdit = useCallback((recipient: Recipient) => {
    setEditingRecipient(recipient);
    setShowForm(true);
  }, []);

  const handleDeleteRequest = useCallback((recipient: Recipient) => {
    setDeletingRecipient(recipient);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingRecipient) {
      deleteRecipient(deletingRecipient.id);
      clearRecipientFromPrizes(deletingRecipient.id);
      setDeletingRecipient(null);
    }
  }, [deletingRecipient, deleteRecipient, clearRecipientFromPrizes]);

  const handleDeleteCancel = useCallback(() => {
    setDeletingRecipient(null);
  }, []);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-h2 text-neutral-900">Recipients</h1>
          <Badge variant="neutral">{recipients.length}</Badge>
        </div>
        <Button
          ref={addButtonRef}
          variant="primary"
          size="small"
          onClick={handleAdd}
          aria-label="Add Recipient"
        >
          Add Recipient
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <RecipientForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={
            editingRecipient
              ? { name: editingRecipient.name, contact: editingRecipient.contact }
              : undefined
          }
          triggerRef={addButtonRef}
        />
      )}

      {/* List */}
      <RecipientList
        recipients={recipients}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onAdd={handleAdd}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deletingRecipient}
        onClose={handleDeleteCancel}
        title="Delete Recipient"
        triggerRef={deleteButtonRef}
      >
        <p className="text-body-sm text-neutral-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-neutral-900">
            {deletingRecipient?.name}
          </span>
          ? This will also clear their prize assignments.
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

export { Recipients };
