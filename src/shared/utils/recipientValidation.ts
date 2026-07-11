import type { RecipientFormData, ValidationResult } from '@/shared/types';

/**
 * Validates recipient form data. Returns errors for invalid fields.
 */
export function validateRecipient(data: RecipientFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.displayName.trim()) {
    errors.displayName = 'Display name is required';
  }

  if (data.type === 'other' && !data.customLabel.trim()) {
    errors.customLabel = 'Custom label is required for "Other" type';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
