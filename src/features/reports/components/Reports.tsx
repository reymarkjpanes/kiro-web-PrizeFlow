import { useState, useCallback } from 'react';
import { Input } from '@/shared/components';
import type { Prize, Recipient } from '@/shared/types';
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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleTabClaimed = useCallback(() => {
    setActiveTab('claimed');
  }, []);

  const handleTabUnclaimed = useCallback(() => {
    setActiveTab('unclaimed');
  }, []);

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
          className={`px-4 py-2 text-body-sm font-medium rounded-md transition-all duration-200 ${
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
          className={`px-4 py-2 text-body-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'unclaimed'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Unclaimed
        </button>
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
