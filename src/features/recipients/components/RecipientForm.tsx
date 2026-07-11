import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Select, Input, TagInput, Button } from '@/shared/components';
import { FORM_FIELDS_BY_TYPE, TYPE_SELECT_OPTIONS } from '@/shared/utils';
import { validateRecipient, parseBulkMembers } from '@/shared/utils';
import type { Recipient, RecipientType, RecipientFormData } from '@/shared/types';

export interface RecipientFormProps {
  onSubmit: (data: RecipientFormData) => void;
  onCancel: () => void;
  initialData?: Partial<Recipient>;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const EMPTY_FORM: RecipientFormData = {
  type: 'individual',
  displayName: '',
  contactPerson: '',
  contactInfo: '',
  members: [],
  notes: '',
  customLabel: '',
};

function RecipientForm({ onSubmit, onCancel, initialData, triggerRef }: RecipientFormProps) {
  const [formData, setFormData] = useState<RecipientFormData>(() => {
    if (initialData) {
      return {
        type: initialData.type ?? 'individual',
        displayName: initialData.displayName ?? '',
        contactPerson: initialData.contactPerson ?? '',
        contactInfo: initialData.contactInfo ?? '',
        members: initialData.members ?? [],
        notes: initialData.notes ?? '',
        customLabel: initialData.customLabel ?? '',
      };
    }
    return { ...EMPTY_FORM };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    // Slight delay to allow animation
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
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

  const handleTypeChange = useCallback((value: string) => {
    const newType = value as RecipientType;
    setFormData(prev => {
      // Get fields for new type
      const newFields = FORM_FIELDS_BY_TYPE[newType];
      const newFieldNames = new Set(newFields.map(f => f.fieldName));

      // Build new form data preserving shared fields, clearing removed ones
      const updated: RecipientFormData = {
        ...EMPTY_FORM,
        type: newType,
      };

      // Keep field values that exist in the new type
      if (newFieldNames.has('displayName')) updated.displayName = prev.displayName;
      if (newFieldNames.has('contactPerson')) updated.contactPerson = prev.contactPerson;
      if (newFieldNames.has('contactInfo')) updated.contactInfo = prev.contactInfo;
      if (newFieldNames.has('members')) updated.members = prev.members;
      if (newFieldNames.has('notes')) updated.notes = prev.notes;
      if (newFieldNames.has('customLabel')) updated.customLabel = prev.customLabel;

      return updated;
    });
    setErrors({});
  }, []);

  const handleFieldChange = useCallback((fieldName: keyof RecipientFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => {
      if (prev[fieldName]) {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      }
      return prev;
    });
  }, []);

  const handleMemberAdd = useCallback((name: string) => {
    setFormData(prev => ({ ...prev, members: [...prev.members, name] }));
  }, []);

  const handleMemberRemove = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, members: prev.members.filter((_, i) => i !== index) }));
  }, []);

  const handleBulkImport = useCallback((text: string) => {
    const newMembers = parseBulkMembers(text);
    setFormData(prev => ({ ...prev, members: [...prev.members, ...newMembers] }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const result = validateRecipient(formData);
      if (!result.valid) {
        setErrors(result.errors);
        return;
      }

      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const fields = FORM_FIELDS_BY_TYPE[formData.type];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="animate-slide-down space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
      aria-label={initialData ? 'Edit recipient' : 'Add recipient'}
    >
      {/* Type selector — purposeful first choice */}
      <Select
        label="Recipient Type"
        value={formData.type}
        onChange={handleTypeChange}
        options={TYPE_SELECT_OPTIONS}
        required
      />

      {/* Conditional fields based on type */}
      <div className="animate-slide-down space-y-4">
        {fields.map((field, index) => {
          if (field.type === 'text') {
            return (
              <Input
                key={field.fieldName}
                ref={index === 0 ? firstInputRef : undefined}
                label={field.label}
                required={field.required}
                value={formData[field.fieldName] as string}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(field.fieldName, e.target.value)
                }
                placeholder={field.placeholder}
                error={errors[field.fieldName]}
              />
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.fieldName} className="space-y-1.5">
                <label className="block text-body-sm font-medium text-neutral-700">
                  {field.label}
                  {field.required && <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
                <textarea
                  value={formData[field.fieldName] as string}
                  onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  aria-invalid={errors[field.fieldName] ? 'true' : undefined}
                  className={`block w-full rounded-md border px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 min-h-[80px] resize-y ${
                    errors[field.fieldName] ? 'border-danger-500' : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                />
                {errors[field.fieldName] && (
                  <p className="text-body-sm text-danger-600" role="alert">
                    {errors[field.fieldName]}
                  </p>
                )}
              </div>
            );
          }

          if (field.type === 'tag-input') {
            return (
              <TagInput
                key={field.fieldName}
                label={field.label}
                tags={formData.members}
                onAdd={handleMemberAdd}
                onRemove={handleMemberRemove}
                onBulkImport={handleBulkImport}
                placeholder={field.placeholder}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Actions */}
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
