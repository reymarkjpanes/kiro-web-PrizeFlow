import type { Recipient, Prize } from '@/shared/types';
import { TYPE_BADGE_CONFIG } from '@/shared/utils';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardCard } from './DashboardCard';

export interface DashboardProps {
  recipients: Recipient[];
  prizes: Prize[];
}

function Dashboard({ recipients, prizes }: DashboardProps) {
  const { totalRecipients, totalPrizes, claimedCount, unclaimedCount, claimRate, typeBreakdown } =
    useDashboardStats(recipients, prizes);

  return (
    <section className="space-y-6">
      <h1 className="text-h2 text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard label="Total Recipients" value={totalRecipients} />
        <DashboardCard label="Total Prizes" value={totalPrizes} />
        <DashboardCard label="Claimed" value={claimedCount} variant="success" />
        <DashboardCard label="Unclaimed" value={unclaimedCount} variant="warning" />
      </div>

      {/* Recipients by Type breakdown */}
      {typeBreakdown.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-body-sm font-medium text-neutral-700">Recipients by Type</h2>
          <div className="flex flex-wrap gap-2">
            {typeBreakdown.map(({ type, count }) => {
              const config = TYPE_BADGE_CONFIG[type];
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium ring-1 ring-inset ${config.classes}`}
                >
                  {config.label}
                  <span className="font-semibold">{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-600">Claim Progress</span>
          <span className="text-body-sm font-medium text-neutral-900">
            {Math.round(claimRate)}%
          </span>
        </div>
        <div
          className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(claimRate)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Prize claim completion"
        >
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-slow"
            style={{ width: `${claimRate}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export { Dashboard };
