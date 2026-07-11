const PERMISSION_DESCRIPTIONS: { level: string; description: string }[] = [
  { level: 'View', description: 'Can see data and navigate to the feature area.' },
  { level: 'Create', description: 'Can add new records or entries within the feature.' },
  { level: 'Edit', description: 'Can modify existing records or entries.' },
  { level: 'Delete', description: 'Can permanently remove records or entries.' },
  { level: 'Export', description: 'Can export data as CSV or other downloadable formats.' },
  { level: 'Assign', description: 'Can link or assign one entity to another (e.g., prize to recipient).' },
  { level: 'Approve', description: 'Can authorize or finalize pending actions or requests.' },
];

function PermissionLegend() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h3 className="text-body-sm font-semibold text-neutral-900 mb-3">Permission Levels</h3>
      <dl className="space-y-2">
        {PERMISSION_DESCRIPTIONS.map(({ level, description }) => (
          <div key={level} className="flex items-start gap-2">
            <dt className="text-caption font-medium text-neutral-700 min-w-[60px]">{level}</dt>
            <dd className="text-caption text-neutral-500">{description}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <p className="text-caption text-neutral-500">
          <span className="font-medium text-success-700">&#10003;</span> = Granted &nbsp;&nbsp;
          <span className="font-medium text-neutral-400">&mdash;</span> = Denied
        </p>
      </div>
    </div>
  );
}

export { PermissionLegend };
