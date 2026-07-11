import { RECIPIENT_TYPES } from '@/shared/types';
import type { RecipientType, RecipientFormData } from '@/shared/types';

// --- Form field configuration (drives conditional rendering) ---

export interface FieldConfig {
  fieldName: keyof RecipientFormData;
  label: string;
  required: boolean;
  placeholder: string;
  type: 'text' | 'textarea' | 'tag-input';
}

export const FORM_FIELDS_BY_TYPE: Record<RecipientType, FieldConfig[]> = {
  individual: [
    { fieldName: 'displayName', label: 'Name', required: true, placeholder: 'Recipient name', type: 'text' },
    { fieldName: 'contactInfo', label: 'Contact', required: false, placeholder: 'Email or phone', type: 'text' },
  ],
  team: [
    { fieldName: 'displayName', label: 'Team Name', required: true, placeholder: 'Team name', type: 'text' },
    { fieldName: 'contactPerson', label: 'Captain', required: false, placeholder: 'Team captain', type: 'text' },
    { fieldName: 'members', label: 'Members', required: false, placeholder: 'Add team members', type: 'tag-input' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
  class: [
    { fieldName: 'displayName', label: 'Class Name', required: true, placeholder: 'Class name', type: 'text' },
    { fieldName: 'contactPerson', label: 'Teacher/Advisor', required: false, placeholder: 'Teacher or advisor name', type: 'text' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
  department: [
    { fieldName: 'displayName', label: 'Department Name', required: true, placeholder: 'Department name', type: 'text' },
    { fieldName: 'contactPerson', label: 'Department Head', required: false, placeholder: 'Department head name', type: 'text' },
    { fieldName: 'contactInfo', label: 'Contact', required: false, placeholder: 'Department contact', type: 'text' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
  organization: [
    { fieldName: 'displayName', label: 'Organization Name', required: true, placeholder: 'Organization name', type: 'text' },
    { fieldName: 'contactPerson', label: 'Representative', required: false, placeholder: 'Organization representative', type: 'text' },
    { fieldName: 'contactInfo', label: 'Contact', required: false, placeholder: 'Organization contact', type: 'text' },
    { fieldName: 'members', label: 'Members', required: false, placeholder: 'Add members', type: 'tag-input' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
  club: [
    { fieldName: 'displayName', label: 'Club Name', required: true, placeholder: 'Club name', type: 'text' },
    { fieldName: 'contactPerson', label: 'President', required: false, placeholder: 'Club president', type: 'text' },
    { fieldName: 'members', label: 'Members', required: false, placeholder: 'Add club members', type: 'tag-input' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
  other: [
    { fieldName: 'displayName', label: 'Name', required: true, placeholder: 'Recipient name', type: 'text' },
    { fieldName: 'customLabel', label: 'Type Label', required: true, placeholder: 'e.g., "Squad", "House"', type: 'text' },
    { fieldName: 'contactPerson', label: 'Contact Person', required: false, placeholder: 'Primary contact', type: 'text' },
    { fieldName: 'contactInfo', label: 'Contact Info', required: false, placeholder: 'Email or phone', type: 'text' },
    { fieldName: 'notes', label: 'Notes', required: false, placeholder: 'Additional notes', type: 'textarea' },
  ],
};

// --- Type badge configuration (color coding) ---

export interface TypeBadgeConfig {
  label: string;
  classes: string;
}

export const TYPE_BADGE_CONFIG: Record<RecipientType, TypeBadgeConfig> = {
  individual: { label: 'Individual', classes: 'bg-neutral-100 text-neutral-700 ring-neutral-600/20' },
  team: { label: 'Team', classes: 'bg-primary-100 text-primary-700 ring-primary-600/20' },
  class: { label: 'Class', classes: 'bg-success-100 text-success-700 ring-success-600/20' },
  department: { label: 'Department', classes: 'bg-warning-100 text-warning-700 ring-warning-600/20' },
  organization: { label: 'Organization', classes: 'bg-danger-100 text-danger-700 ring-danger-600/20' },
  club: { label: 'Club', classes: 'bg-primary-50 text-primary-600 ring-primary-400/20' },
  other: { label: 'Other', classes: 'bg-neutral-200 text-neutral-600 ring-neutral-500/20' },
};

// --- Type selector options ---

export const TYPE_SELECT_OPTIONS = RECIPIENT_TYPES.map(type => ({
  value: type,
  label: TYPE_BADGE_CONFIG[type].label,
}));
