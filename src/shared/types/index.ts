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

// --- Financial Type Definitions ---

// Supported currencies (ISO 4217)
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'INR';

// Prize type enum
export type PrizeType = 'cash' | 'physical';

// Distribution status enum
export type DistributionStatus = 'pending' | 'in_progress' | 'distributed' | 'returned';

// Extended Prize interface (backward-compatible)
export interface Prize {
  id: string;
  name: string;
  description: string;
  recipientId: string | null;
  claimed: boolean;
  claimDate: string | null;
  // Financial fields (all optional for backward compatibility)
  prizeValue: number | null;        // 0.01 - 999,999,999.99
  currency: SupportedCurrency;      // Default: 'USD'
  prizeType: PrizeType;             // Default: 'physical'
  fundingSource: string | null;     // Max 100 chars
  sponsor: string | null;           // Max 100 chars
  budgetCategory: string | null;    // Max 50 chars
  distributionStatus: DistributionStatus; // Default: 'pending'
}

// --- RBAC Type Definitions ---

export type RoleName =
  | 'Super Administrator'
  | 'Event Administrator'
  | 'Finance Officer'
  | 'Distribution Officer'
  | 'Staff'
  | 'Auditor'
  | 'Viewer';

export type FeatureCategory =
  | 'Dashboard'
  | 'Recipients'
  | 'Teams'
  | 'Prize Management'
  | 'Financial Management'
  | 'Reports'
  | 'Settings'
  | 'Event Management';

export type PermissionLevel =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Export'
  | 'Assign'
  | 'Approve';

// The permission matrix is a nested record
export type PermissionMatrixData = Record<RoleName, Record<FeatureCategory, PermissionLevel[]>>;

// Role permissions for a single role
export type RolePermissions = Record<FeatureCategory, PermissionLevel[]>;

// --- Financial Summary Types ---

export interface BudgetSummary {
  totalBudget: number;
  totalDistributed: number;
  remainingBudget: number;
  cashAwardsCount: number;
  physicalAwardsCount: number;
}

export interface CurrencyTotal {
  currency: SupportedCurrency;
  total: number;
  distributedTotal: number;
  remaining: number;
  count: number;
}

// --- Extended Tab Type ---

export type TabId = 'dashboard' | 'recipients' | 'prizes' | 'reports' | 'rbac';

export interface StorageResult<T> {
  data: T;
  error: string | null;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'default' | 'small';
export type BadgeVariant = 'success' | 'warning' | 'neutral';
