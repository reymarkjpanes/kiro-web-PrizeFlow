import type { PermissionMatrixData, PermissionLevel, TabId, FeatureCategory } from './types';

/** All permission levels — used to represent "All" access */
const ALL: PermissionLevel[] = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Assign', 'Approve'];

/** No access — empty permission array */
const NONE: PermissionLevel[] = [];

/**
 * Static permission matrix mapping all 7 roles to their feature categories and permission levels.
 *
 * Legend:
 * - ALL = View, Create, Edit, Delete, Export, Assign, Approve
 * - NONE = no access
 * - V = View, E = Export (or Edit where noted), A = Assign
 */
export const PERMISSION_MATRIX: PermissionMatrixData = {
  'Super Administrator': {
    Dashboard: ALL,
    Recipients: ALL,
    Teams: ALL,
    'Prize Management': ALL,
    'Financial Management': ALL,
    Reports: ALL,
    Settings: ALL,
    'Event Management': ALL,
  },
  'Event Administrator': {
    Dashboard: ALL,
    Recipients: ALL,
    Teams: ALL,
    'Prize Management': ALL,
    'Financial Management': NONE,
    Reports: ['View', 'Export'],
    Settings: NONE,
    'Event Management': ALL,
  },
  'Finance Officer': {
    Dashboard: ['View'],
    Recipients: ['View'],
    Teams: NONE,
    'Prize Management': ['View'],
    'Financial Management': ALL,
    Reports: ALL,
    Settings: NONE,
    'Event Management': NONE,
  },
  'Distribution Officer': {
    Dashboard: ['View'],
    Recipients: ['View', 'Edit', 'Assign'],
    Teams: NONE,
    'Prize Management': ['View', 'Edit', 'Assign'],
    'Financial Management': NONE,
    Reports: ['View'],
    Settings: NONE,
    'Event Management': NONE,
  },
  Staff: {
    Dashboard: ['View'],
    Recipients: ['View'],
    Teams: NONE,
    'Prize Management': ['View'],
    'Financial Management': NONE,
    Reports: NONE,
    Settings: NONE,
    'Event Management': NONE,
  },
  Auditor: {
    Dashboard: ['View', 'Export'],
    Recipients: ['View', 'Export'],
    Teams: ['View', 'Export'],
    'Prize Management': ['View', 'Export'],
    'Financial Management': ['View', 'Export'],
    Reports: ['View', 'Export'],
    Settings: ['View', 'Export'],
    'Event Management': ['View', 'Export'],
  },
  Viewer: {
    Dashboard: ['View'],
    Recipients: ['View'],
    Teams: NONE,
    'Prize Management': ['View'],
    'Financial Management': NONE,
    Reports: ['View'],
    Settings: NONE,
    'Event Management': NONE,
  },
};

/**
 * Maps navigation TabIds to their corresponding FeatureCategories.
 * Used by the RBAC engine to determine tab visibility based on role permissions.
 */
export const TAB_CATEGORY_MAP: Record<TabId, FeatureCategory> = {
  dashboard: 'Dashboard',
  recipients: 'Recipients',
  prizes: 'Prize Management',
  reports: 'Reports',
  rbac: 'Settings',
};
