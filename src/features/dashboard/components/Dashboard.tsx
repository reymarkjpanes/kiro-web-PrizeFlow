import type { Recipient, Prize } from '@/shared/types';
import { TYPE_BADGE_CONFIG } from '@/shared/utils';
import { EmptyState, Card, SectionHeading } from '@/shared/components';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardCard } from './DashboardCard';
import { FinancialSummaryCards } from './FinancialSummaryCards';
import { ClaimProgressBar } from './ClaimProgressBar';

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
      <section className="space-y-10">
        <h1 className="text-h1 text-neutral-900">Dashboard</h1>
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
    <section className="space-y-10">
      {/* Page Title */}
      <h1 className="text-h1 text-neutral-900">Dashboard</h1>

      {/* Zone 1: Primary KPIs + Claim Progress */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard label="Total Prizes" value={totalPrizes} size="large" />
          <DashboardCard label="Claimed" value={claimedCount} variant="success" size="large" />
          <DashboardCard label="Unclaimed" value={unclaimedCount} variant="warning" size="large" />
        </div>

        {totalPrizes > 0 && (
          <ClaimProgressBar
            claimed={claimedCount}
            unclaimed={unclaimedCount}
            claimRate={claimRate}
          />
        )}
      </div>

      {/* Zone 2: Financial Overview */}
      <div className="space-y-4">
        <SectionHeading>Financial Summary</SectionHeading>
        <FinancialSummaryCards prizes={prizes} />
      </div>

      {/* Zone 3: Secondary Data */}
      <div className="space-y-4">
        <SectionHeading>Overview</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard label="Total Recipients" value={totalRecipients} />
          
          {typeBreakdown.length > 0 && (
            <Card className="p-4">
              <div className="space-y-2">
                <span className="text-body-sm font-medium text-neutral-600">Recipients by Type</span>
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
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

export { Dashboard };
