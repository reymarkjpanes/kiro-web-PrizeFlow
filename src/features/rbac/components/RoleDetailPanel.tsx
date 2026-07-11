import type { RoleName, FeatureCategory, PermissionLevel } from '@/shared/types';
import { getRolePermissions } from '@/shared/rbac/engine';

export interface RoleDetailPanelProps {
  role: RoleName;
}

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

const PERMISSION_DESCRIPTIONS: Record<PermissionLevel, string> = {
  View: 'Can see data and navigate to this area.',
  Create: 'Can add new records.',
  Edit: 'Can modify existing records.',
  Delete: 'Can permanently remove records.',
  Export: 'Can export data as CSV.',
  Assign: 'Can link entities together.',
  Approve: 'Can authorize pending actions.',
};

function RoleDetailPanel({ role }: RoleDetailPanelProps) {
  const permissions = getRolePermissions(role);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="text-body-sm font-semibold text-neutral-900 mb-4">
        Role: {role}
      </h3>
      <div className="space-y-3">
        {FEATURE_CATEGORIES.map(category => {
          const levels = permissions[category] ?? [];
          if (levels.length === 0) {
            return (
              <div key={category} className="flex items-start justify-between py-1.5 border-b border-neutral-100 last:border-0">
                <span className="text-caption font-medium text-neutral-700">{category}</span>
                <span className="text-caption text-neutral-400 italic">No access</span>
              </div>
            );
          }
          return (
            <div key={category} className="py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-caption font-medium text-neutral-700">{category}</span>
              <ul className="mt-1 space-y-0.5">
                {levels.map(level => (
                  <li key={level} className="flex items-start gap-2 ml-3">
                    <span className="text-success-700 text-caption font-bold">&#10003;</span>
                    <span className="text-caption text-neutral-600">
                      <span className="font-medium">{level}</span>
                      {' — '}
                      {PERMISSION_DESCRIPTIONS[level]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { RoleDetailPanel };
