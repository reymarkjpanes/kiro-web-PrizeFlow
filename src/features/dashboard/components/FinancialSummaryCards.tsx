import type { Prize } from '@/shared/types';
import { Card } from '@/shared/components';
import { useFinancialSummary } from '@/shared/hooks/useFinancialSummary';
import { formatCurrencyValue } from '@/shared/utils/currency';

export interface FinancialSummaryCardsProps {
  prizes: Prize[];
}

/**
 * Renders financial summary cards for the dashboard.
 * Displays: Total Prize Budget, Total Distributed Value, Remaining Budget,
 * Cash Awards Count, and Physical Awards Count.
 * Groups by currency when multiple currencies exist.
 * Shows zero values with message when no prize financial data exists.
 */
function FinancialSummaryCards({ prizes }: FinancialSummaryCardsProps) {
  const { summary, currencyTotals, dominantCurrency } = useFinancialSummary(prizes);

  const hasFinancialData = summary.totalBudget > 0;
  const hasMultipleCurrencies = currencyTotals.length > 1;

  return (
    <div className="space-y-4">
      <h2 className="text-body-sm font-medium text-neutral-700">Financial Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Total Prize Budget */}
        <Card className="border-l-4 border-l-primary-500">
          <div className="flex flex-col gap-1">
            <span aria-live="polite" className="text-display text-neutral-900 text-lg font-semibold">
              {hasFinancialData
                ? formatCurrencyValue(summary.totalBudget, dominantCurrency)
                : formatCurrencyValue(0, dominantCurrency)}
            </span>
            <span className="text-body-sm text-neutral-500">Total Prize Budget</span>
            {!hasFinancialData && (
              <span className="text-caption text-neutral-400">No financial data entered</span>
            )}
          </div>
        </Card>

        {/* Total Distributed Value */}
        <Card className="border-l-4 border-l-success-500">
          <div className="flex flex-col gap-1">
            <span aria-live="polite" className="text-display text-neutral-900 text-lg font-semibold">
              {hasFinancialData
                ? formatCurrencyValue(summary.totalDistributed, dominantCurrency)
                : formatCurrencyValue(0, dominantCurrency)}
            </span>
            <span className="text-body-sm text-neutral-500">Total Distributed Value</span>
            {!hasFinancialData && (
              <span className="text-caption text-neutral-400">No financial data entered</span>
            )}
          </div>
        </Card>

        {/* Remaining Budget */}
        <Card className="border-l-4 border-l-warning-500">
          <div className="flex flex-col gap-1">
            <span aria-live="polite" className="text-display text-neutral-900 text-lg font-semibold">
              {hasFinancialData
                ? formatCurrencyValue(summary.remainingBudget, dominantCurrency)
                : formatCurrencyValue(0, dominantCurrency)}
            </span>
            <span className="text-body-sm text-neutral-500">Remaining Budget</span>
            {!hasFinancialData && (
              <span className="text-caption text-neutral-400">No financial data entered</span>
            )}
          </div>
        </Card>

        {/* Cash Awards Count */}
        <Card className="border-l-4 border-l-primary-500">
          <div className="flex flex-col gap-1">
            <span aria-live="polite" className="text-display text-neutral-900 text-lg font-semibold">
              {summary.cashAwardsCount}
            </span>
            <span className="text-body-sm text-neutral-500">Cash Awards</span>
          </div>
        </Card>

        {/* Physical Awards Count */}
        <Card className="border-l-4 border-l-primary-500">
          <div className="flex flex-col gap-1">
            <span aria-live="polite" className="text-display text-neutral-900 text-lg font-semibold">
              {summary.physicalAwardsCount}
            </span>
            <span className="text-body-sm text-neutral-500">Physical Awards</span>
          </div>
        </Card>
      </div>

      {/* Per-currency breakdowns when multiple currencies exist */}
      {hasMultipleCurrencies && (
        <div className="space-y-2">
          <h3 className="text-caption font-medium text-neutral-600">Breakdown by Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {currencyTotals.map((ct) => (
              <Card key={ct.currency} className="bg-neutral-50">
                <div className="flex flex-col gap-1">
                  <span className="text-body-sm font-semibold text-neutral-800">
                    {ct.currency}
                  </span>
                  <div className="flex flex-col gap-0.5 text-caption text-neutral-600">
                    <span>Budget: {formatCurrencyValue(ct.total, ct.currency)}</span>
                    <span>Distributed: {formatCurrencyValue(ct.distributedTotal, ct.currency)}</span>
                    <span>Remaining: {formatCurrencyValue(ct.remaining, ct.currency)}</span>
                    <span>{ct.count} prize{ct.count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { FinancialSummaryCards };
