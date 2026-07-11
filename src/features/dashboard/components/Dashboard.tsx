import type { Recipient, Prize } from '@/shared/types';
import { TYPE_BADGE_CONFIG } from '@/shared/utils';
import { EmptyState } from '@/shared/components';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardCard } from './DashboardCard';
import { FinancialSummaryCards } from './FinancialSummaryCards';

export interface DashboardProps {
  recipients: Recipient[];
  prizes: Prize[];
}

function Dashboard({ recipients, prizes }: DashboardProps) {
  const { totalRecipients, totalPrizes, claimedCount, unclaimedCount, claimRate, typeBreakdown } =
    useDashboardStats(recipients, prizes);

  // Show empty state when there's no data at all
  if (recipients.length === 0 && prizes.length === 0) {
    return (
      <section className="space-y-6">
        <h1 className="text-h2 text-neutral-900">Dashboard</h1>
        <EmptyState
          heading="Welcome to PrizeFlow"
          description="Your dashboard will populate automatically once you add prizes and recipients. Head to the Prizes or Recipients tab to get started."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-h2 text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard label="Total Recipients" value={totalRecipients} />
        <DashboardCard label="Total Prizes" value={totalPrizes} />
        <DashboardCard label="Claimed" value={claimedCount} variant="success" />
        <DashboardCard label="Unclaimed" value={unclaimedCount} variant="warning" />
      </div>

      {/* Financial Summary Cards */}
      <FinancialSummaryCards prizes={prizes} />

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
