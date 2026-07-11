import type { Recipient, LegacyRecipient } from '@/shared/types';

/**
 * Detects if a record is in legacy format (has name + contact, no type field).
 */
export function isLegacyRecipient(record: unknown): record is LegacyRecipient {
  return (
    typeof record === 'object' &&
    record !== null &&
    'name' in record &&
    'contact' in record &&
    !('type' in record)
  );
}

/**
 * Migrates a single legacy recipient to the enhanced format.
 */
export function migrateRecipient(legacy: LegacyRecipient): Recipient {
  return {
    id: legacy.id,
    type: 'individual',
    displayName: legacy.name,
    contactPerson: '',
    contactInfo: legacy.contact,
    members: [],
    memberCount: 0,
    notes: '',
    customLabel: '',
  };
}

/**
 * Migrates an array of mixed-format records. Legacy records are transformed;
 * enhanced records are passed through unchanged.
 */
export function migrateRecipients(records: unknown[]): Recipient[] {
  return records.map(record =>
    isLegacyRecipient(record) ? migrateRecipient(record as LegacyRecipient) : record as Recipient
  );
}
