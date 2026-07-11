import type { RoleName, FeatureCategory, PermissionLevel, RolePermissions, TabId } from './types';
import { PERMISSION_MATRIX, TAB_CATEGORY_MAP } from './permissions';

/**
 * Check if a role has a specific permission level for a feature category.
 *
 * - Unknown roles fall back to Super Administrator permissions.
 * - Unknown categories deny all permissions.
 * - Implicit View: any non-View permission implies View is also granted.
 */
export function hasPermission(
  role: RoleName,
  category: FeatureCategory,
  level: PermissionLevel
): boolean {
  // Fall back to Super Administrator for unknown roles
  const rolePermissions = PERMISSION_MATRIX[role] ?? PERMISSION_MATRIX['Super Administrator'];

  // Deny all for unknown categories
  const categoryPermissions = rolePermissions[category];
  if (!categoryPermissions) {
    return false;
  }

  // If checking View permission, also grant it if any non-View permission exists
  if (level === 'View') {
    return categoryPermissions.length > 0;
  }

  return categoryPermissions.includes(level);
}

/**
 * Get the entire permissions object for a role.
 * Falls back to Super Administrator for unknown roles.
 */
export function getRolePermissions(role: RoleName): RolePermissions {
  return PERMISSION_MATRIX[role] ?? PERMISSION_MATRIX['Super Administrator'];
}

/**
 * Check if a navigation tab should be visible for a role.
 * A tab is visible only if the role has View permission for the tab's mapped category.
 */
export function isTabVisible(role: RoleName, tabId: TabId): boolean {
  const category = TAB_CATEGORY_MAP[tabId];
  if (!category) {
    return false;
  }
  return hasPermission(role, category, 'View');
}

/**
 * Check if a specific action is enabled for a role in a category.
 * Returns true only if the role has that permission level.
 */
export function isActionEnabled(
  role: RoleName,
  category: FeatureCategory,
  action: PermissionLevel
): boolean {
  return hasPermission(role, category, action);
}
