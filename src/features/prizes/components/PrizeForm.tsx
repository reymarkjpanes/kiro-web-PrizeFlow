import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button } from '@/shared/components';

export interface PrizeFormProps {
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
  initialData?: { name: string; description: string };
  triggerRef?: React.RefObject<HTMLElement | null>;
}

function PrizeForm({ onSubmit, onCancel, initialData, triggerRef }: PrizeFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
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

      onSubmit(trimmedName, description.trim());
    },
    [name, description, onSubmit]
  );

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="animate-slide-down space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
      aria-label={initialData ? 'Edit prize' : 'Add prize'}
    >
      <Input
        ref={nameInputRef}
        label="Name"
        required
        value={name}
        onChange={handleNameChange}
        error={nameError}
        placeholder="Prize name"
      />
      <Input
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Prize description (optional)"
      />
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" size="small">
          {initialData ? 'Save Changes' : 'Add Prize'}
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export { PrizeForm };
