import type { RoleName, FeatureCategory, PermissionLevel } from '@/shared/types';
import { PERMISSION_MATRIX } from '@/shared/rbac/permissions';

export interface PermissionMatrixProps {
  selectedRole: RoleName | null;
  onRoleSelect: (role: RoleName) => void;
}

const ALL_ROLES: RoleName[] = [
  'Super Administrator',
  'Event Administrator',
  'Finance Officer',
  'Distribution Officer',
  'Staff',
  'Auditor',
  'Viewer',
];

const FEATURE_CATEGORIES: FeatureCategory[] = [
  'Dashboard',
  'Recipients',
  'Teams',
  'Prize Management',
  'Financial Management',
  'Reports',
  'Settings',
  'Event Management',
];

const PERMISSION_LEVELS: PermissionLevel[] = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Export',
  'Assign',
  'Approve',
];

function PermissionMatrix({ selectedRole, onRoleSelect }: PermissionMatrixProps) {
  // Build rows: each row is a feature category + permission level combination
  const rows: { category: FeatureCategory; level: PermissionLevel }[] = [];
  for (const category of FEATURE_CATEGORIES) {
    for (const level of PERMISSION_LEVELS) {
      rows.push({ category, level });
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-caption" role="grid" aria-label="Permission matrix">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="text-left px-3 py-2 font-semibold text-neutral-700 sticky left-0 bg-neutral-50 min-w-[180px]">
              Feature / Permission
            </th>
            {ALL_ROLES.map(role => (
              <th
                key={role}
                className={`px-2 py-2 font-medium text-neutral-700 text-center cursor-pointer hover:bg-primary-50 transition-colors duration-fast min-w-[90px] ${
                  selectedRole === role ? 'bg-primary-100 text-primary-800' : ''
                }`}
                onClick={() => onRoleSelect(role)}
                role="columnheader"
                aria-label={`Select role: ${role}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRoleSelect(role);
                  }
                }}
              >
                <span className="block text-caption leading-tight">{role}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURE_CATEGORIES.map((category, catIdx) => (
            PERMISSION_LEVELS.map((level, levelIdx) => {
              const isFirstInGroup = levelIdx === 0;
              const isLastInGroup = levelIdx === PERMISSION_LEVELS.length - 1;
              return (
                <tr
                  key={`${category}-${level}`}
                  className={`${isLastInGroup && catIdx < FEATURE_CATEGORIES.length - 1 ? 'border-b border-neutral-200' : ''} ${
                    isFirstInGroup ? '' : ''
                  }`}
                >
                  <td className="px-3 py-1.5 text-neutral-700 sticky left-0 bg-white">
                    {isFirstInGroup && (
                      <span className="font-semibold text-neutral-900 block">{category}</span>
                    )}
                    <span className="text-neutral-500 ml-2">{level}</span>
                  </td>
                  {ALL_ROLES.map(role => {
                    const rolePerms = PERMISSION_MATRIX[role]?.[category] ?? [];
                    const hasLevel = level === 'View'
                      ? rolePerms.length > 0 // Implicit View: any permission implies View
                      : rolePerms.includes(level);
                    return (
                      <td
                        key={role}
                        className={`px-2 py-1.5 text-center ${
                          selectedRole === role ? 'bg-primary-50' : ''
                        }`}
                        aria-label={`${role} ${hasLevel ? 'has' : 'does not have'} ${level} permission for ${category}`}
                      >
                        {hasLevel ? (
                          <span className="text-success-700 font-bold" aria-hidden="true">&#10003;</span>
                        ) : (
                          <span className="text-neutral-300" aria-hidden="true">&mdash;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { PermissionMatrix };
