import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button } from '@/shared/components';

export interface RecipientFormProps {
  onSubmit: (name: string, contact: string) => void;
  onCancel: () => void;
  initialData?: { name: string; contact: string };
  triggerRef?: React.RefObject<HTMLElement | null>;
}

function RecipientForm({ onSubmit, onCancel, initialData, triggerRef }: RecipientFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [contact, setContact] = useState(initialData?.contact ?? '');
  const [nameError, setNameError] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Escape key closes form and restores focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        triggerRef?.current?.focus();
      }
    },
    [onCancel, triggerRef]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedName = name.trim();
      if (!trimmedName) {
        setNameError('Name is required');
        return;
      }

      onSubmit(trimmedName, contact.trim());
    },
    [name, contact, onSubmit]
  );

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  }, []);

  const handleContactChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="animate-slide-down space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
      aria-label={initialData ? 'Edit recipient' : 'Add recipient'}
    >
      <Input
        ref={nameInputRef}
        label="Name"
        required
        value={name}
        onChange={handleNameChange}
        error={nameError}
        placeholder="Recipient name"
      />
      <Input
        label="Contact"
        value={contact}
        onChange={handleContactChange}
        placeholder="Email or phone (optional)"
      />
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" size="small">
          {initialData ? 'Save Changes' : 'Add Recipient'}
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export { RecipientForm };
