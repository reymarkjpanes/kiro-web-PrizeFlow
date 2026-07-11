// --- Recipient Type System ---
export type RecipientType = 'individual' | 'team' | 'class' | 'department' | 'organization' | 'club' | 'other';

export const RECIPIENT_TYPES: RecipientType[] = [
  'individual', 'team', 'class', 'department', 'organization', 'club', 'other'
];

// Enhanced Recipient (replaces old simple model)
export interface Recipient {
  id: string;
  type: RecipientType;
  displayName: string;
  contactPerson: string;
  contactInfo: string;
  members: string[];
  memberCount: number;
  notes: string;
  customLabel: string; // Required only when type === 'other'
}

// Legacy format for migration detection
export interface LegacyRecipient {
  id: string;
  name: string;
  contact: string;
}

// Form data shape for creating/editing recipients
export interface RecipientFormData {
  type: RecipientType;
  displayName: string;
  contactPerson: string;
  contactInfo: string;
  members: string[];
  notes: string;
  customLabel: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Keep existing types unchanged
export interface Prize {
  id: string;
  name: string;
  description: string;
  recipientId: string | null;
  claimed: boolean;
  claimDate: string | null;
}

export type TabId = 'dashboard' | 'recipients' | 'prizes' | 'reports';

export interface StorageResult<T> {
  data: T;
  error: string | null;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'default' | 'small';
export type BadgeVariant = 'success' | 'warning' | 'neutral';
