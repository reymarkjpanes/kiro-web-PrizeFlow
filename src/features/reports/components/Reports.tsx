import { useState, useCallback, useMemo } from 'react';
import { Input, EmptyState } from '@/shared/components';
import type { Prize, Recipient } from '@/shared/types';
import { calculateBudgetSummary, formatCurrencyValue, getDominantCurrency } from '@/shared/utils';
import { useReportData } from '../hooks/useReportData';
import { ReportTable } from './ReportTable';
import { ExportButton } from './ExportButton';

export interface ReportsProps {
  prizes: Prize[];
  recipients: Recipient[];
}

function Reports({ prizes, recipients }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<'claimed' | 'unclaimed'>('claimed');
  const [search, setSearch] = useState('');

  const { filteredClaimed, filteredUnclaimed } = useReportData(prizes, recipients, search);

  const activePrizes = activeTab === 'claimed' ? filteredClaimed : filteredUnclaimed;

  // Calculate financial summary for the currently filtered view
  const financialSummary = useMemo(() => calculateBudgetSummary(activePrizes), [activePrizes]);
  const dominantCurrency = useMemo(() => getDominantCurrency(activePrizes), [activePrizes]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleTabClaimed = useCallback(() => {
    setActiveTab('claimed');
  }, []);

  const handleTabUnclaimed = useCallback(() => {
    setActiveTab('unclaimed');
  }, []);

  // Show empty state when no prizes exist
  if (prizes.length === 0) {
    return (
      <section className="space-y-6">
        <h1 className="text-h2 text-neutral-900">Reports</h1>
        <EmptyState
          heading="No reports available"
          description="Reports are generated automatically from your prize data. Add prizes and assign them to recipients to see reports here."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-neutral-900">Reports</h1>
        <ExportButton filteredPrizes={activePrizes} activeTab={activeTab} />
      </div>

      {/* Tab switcher — segmented control style */}
      <div className="inline-flex items-center rounded-lg bg-neutral-100 p-1" role="group" aria-label="Report view">
        <button
          type="button"
          role="tab"
          aria-pressed={activeTab === 'claimed'}
          onClick={handleTabClaimed}
          className={`px-4 py-2 text-body-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px] ${
            activeTab === 'claimed'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Claimed
        </button>
        <button
          type="button"
          role="tab"
          aria-pressed={activeTab === 'unclaimed'}
          onClick={handleTabUnclaimed}
          className={`px-4 py-2 text-body-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px] ${
            activeTab === 'unclaimed'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Unclaimed
        </button>
      </div>

      {/* Financial Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Financial summary">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-body-sm text-neutral-500">Total Budget</p>
          <p className="text-h4 font-semibold text-neutral-900">
            {formatCurrencyValue(financialSummary.totalBudget, dominantCurrency)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-body-sm text-neutral-500">Total Distributed</p>
          <p className="text-h4 font-semibold text-neutral-900">
            {formatCurrencyValue(financialSummary.totalDistributed, dominantCurrency)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-body-sm text-neutral-500">Remaining Budget</p>
          <p className="text-h4 font-semibold text-neutral-900">
            {formatCurrencyValue(financialSummary.remainingBudget, dominantCurrency)}
          </p>
        </div>
      </div>

      {/* Search/filter */}
      <Input
        label="Filter results"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by prize name or recipient..."
        aria-label={`Filter ${activeTab} prizes`}
      />

      {/* Report table */}
      <ReportTable filteredPrizes={activePrizes} activeTab={activeTab} />
    </section>
  );
}

export { Reports };
