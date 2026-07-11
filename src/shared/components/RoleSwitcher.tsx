import { useRBAC } from '@/shared/hooks';
import type { RoleName } from '@/shared/types';

const ROLES: RoleName[] = [
  'Super Administrator',
  'Event Administrator',
  'Finance Officer',
  'Distribution Officer',
  'Staff',
  'Auditor',
  'Viewer',
];

function RoleSwitcher() {
  const { currentRole, setRole } = useRBAC();

  return (
    <select
      aria-label="Role Switcher"
      value={currentRole}
      onChange={(e) => setRole(e.target.value as RoleName)}
      className="px-2 py-1 text-body-sm font-medium rounded-md border border-neutral-300 bg-white text-neutral-700 hover:border-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 transition-colors duration-fast cursor-pointer"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}

export { RoleSwitcher };
