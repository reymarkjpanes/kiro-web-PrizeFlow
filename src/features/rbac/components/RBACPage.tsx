import { useState } from 'react';
import type { RoleName } from '@/shared/types';
import { PermissionMatrix } from './PermissionMatrix';
import { RoleDetailPanel } from './RoleDetailPanel';
import { PermissionLegend } from './PermissionLegend';

function RBACPage() {
  const [selectedRole, setSelectedRole] = useState<RoleName | null>(null);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h2 text-neutral-900">Role-Based Access Control</h1>
        <p className="text-body-sm text-neutral-500 mt-1">
          View the permission matrix showing which actions each role can perform across all feature areas.
        </p>
      </div>

      {/* Permission Legend */}
      <PermissionLegend />

      {/* Permission Matrix Table */}
      <PermissionMatrix
        selectedRole={selectedRole}
        onRoleSelect={setSelectedRole}
      />

      {/* Role Detail Panel (shown when a role is selected) */}
      {selectedRole && (
        <RoleDetailPanel role={selectedRole} />
      )}
    </section>
  );
}

export { RBACPage };
