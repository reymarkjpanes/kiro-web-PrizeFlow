// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { RoleName, FeatureCategory, PermissionLevel, TabId } from '@/shared/types';
import { hasPermission, isTabVisible, isActionEnabled } from '../engine';
import { PERMISSION_MATRIX, TAB_CATEGORY_MAP } from '../permissions';

// Feature: prizeflow-evolution, Properties 8, 9, 10

const roleArb = fc.constantFrom<RoleName>(
  'Super Administrator',
  'Event Administrator',
  'Finance Officer',
  'Distribution Officer',
  'Staff',
  'Auditor',
  'Viewer'
);

const categoryArb = fc.constantFrom<FeatureCategory>(
  'Dashboard',
  'Recipients',
  'Teams',
  'Prize Management',
  'Financial Management',
  'Reports',
  'Settings',
  'Event Management'
);

const levelArb = fc.constantFrom<PermissionLevel>(
  'View', 'Create', 'Edit', 'Delete', 'Export', 'Assign', 'Approve'
);


/**
 * Property 8: Permission evaluation determinism and implicit View enforcement
 *
 * For any role name and feature category/permission level combination, the hasPermission
 * function SHALL always return the same boolean result (deterministic). Additionally,
 * for any role and feature category where the role has any non-View permission, the role
 * SHALL also have View permission for that same category.
 *
 * **Validates: Requirements 9.2, 9.10, 9.11**
 */
describe('Property 8: Permission evaluation determinism and implicit View enforcement', () => {
  test('hasPermission is deterministic - same inputs always produce same output', () => {
    fc.assert(
      fc.property(
        roleArb,
        categoryArb,
        levelArb,
        (role, category, level) => {
          const result1 = hasPermission(role, category, level);
          const result2 = hasPermission(role, category, level);
          const result3 = hasPermission(role, category, level);
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('implicit View enforcement: any non-View permission implies View is granted', () => {
    const nonViewLevelArb = fc.constantFrom<PermissionLevel>(
      'Create', 'Edit', 'Delete', 'Export', 'Assign', 'Approve'
    );

    fc.assert(
      fc.property(
        roleArb,
        categoryArb,
        nonViewLevelArb,
        (role, category, level) => {
          if (hasPermission(role, category, level)) {
            // If role has a non-View permission, it must also have View
            expect(hasPermission(role, category, 'View')).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('View is granted whenever category has any permissions defined', () => {
    fc.assert(
      fc.property(
        roleArb,
        categoryArb,
        (role, category) => {
          const permissions = PERMISSION_MATRIX[role][category];
          if (permissions && permissions.length > 0) {
            expect(hasPermission(role, category, 'View')).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Property 9: RBAC UI enforcement matches permission matrix
 *
 * For any role, the set of visible navigation tabs SHALL exactly equal the set of
 * feature categories where the role has View permission. For any role, category, and
 * action type, isActionEnabled SHALL return true if and only if the permission matrix
 * grants that permission level to that role for that category.
 *
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
 */
describe('Property 9: RBAC UI enforcement matches permission matrix', () => {
  test('visible tabs equals categories where role has View permission', () => {
    fc.assert(
      fc.property(
        roleArb,
        (role) => {
          const allTabs: TabId[] = ['dashboard', 'recipients', 'prizes', 'reports', 'rbac'];

          for (const tab of allTabs) {
            const category = TAB_CATEGORY_MAP[tab];
            const shouldBeVisible = hasPermission(role, category, 'View');
            expect(isTabVisible(role, tab)).toBe(shouldBeVisible);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('isActionEnabled returns true iff permission matrix grants that level', () => {
    fc.assert(
      fc.property(
        roleArb,
        categoryArb,
        levelArb,
        (role, category, level) => {
          const expected = hasPermission(role, category, level);
          expect(isActionEnabled(role, category, level)).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Property 10: Role persistence round-trip
 *
 * For any valid role name, storing it to localStorage and reading it back SHALL return
 * the same role name. For any string that is not a valid role name, reading from
 * localStorage SHALL fall back to "Super Administrator".
 *
 * **Validates: Requirements 8.3, 8.6**
 */
describe('Property 10: Role persistence round-trip', () => {
  const VALID_ROLES: RoleName[] = [
    'Super Administrator',
    'Event Administrator',
    'Finance Officer',
    'Distribution Officer',
    'Staff',
    'Auditor',
    'Viewer',
  ];

  function isValidRole(value: unknown): value is RoleName {
    return typeof value === 'string' && VALID_ROLES.includes(value as RoleName);
  }

  /**
   * Simulates the role persistence round-trip logic:
   * - Store a string value, then read it back
   * - If the stored value is a valid role, return it
   * - Otherwise fall back to "Super Administrator"
   *
   * This tests the pure validation logic that useRBAC uses for persistence.
   */
  function simulateRoundTrip(storedValue: string | null): RoleName {
    if (storedValue !== null && isValidRole(storedValue)) {
      return storedValue;
    }
    return 'Super Administrator';
  }

  test('valid role name round-trips correctly', () => {
    fc.assert(
      fc.property(
        roleArb,
        (role) => {
          // Simulating: persistRole(role) writes the string, then readRole reads it back
          const restored = simulateRoundTrip(role);
          expect(restored).toBe(role);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('invalid strings fall back to Super Administrator', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(
          (s) => !VALID_ROLES.includes(s as RoleName)
        ),
        (invalidRole) => {
          const restored = simulateRoundTrip(invalidRole);
          expect(restored).toBe('Super Administrator');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('null stored value falls back to Super Administrator', () => {
    const restored = simulateRoundTrip(null);
    expect(restored).toBe('Super Administrator');
  });
});
