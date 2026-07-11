export interface Recipient {
  id: string;
  name: string;
  contact: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  recipientId: string | null;
  claimed: boolean;
  claimDate: string | null; // ISO 8601 format: YYYY-MM-DD
}

export type TabId = 'dashboard' | 'recipients' | 'prizes' | 'reports';

// Storage result for graceful degradation
export interface StorageResult<T> {
  data: T;
  error: string | null;
}

// Component variant types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'default' | 'small';
export type BadgeVariant = 'success' | 'warning' | 'neutral';
