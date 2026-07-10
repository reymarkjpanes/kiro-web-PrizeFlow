import { useState } from 'react';
import { Prize, Recipient } from '../types';
import { exportToCsv } from '../utils/csv';

interface ReportsProps {
  prizes: Prize[];
  recipients: Recipient[];
}

type ReportView = 'claimed' | 'unclaimed';

function Reports({ prizes, recipients }: ReportsProps) {
  const [activeView, setActiveView] = useState<ReportView>('claimed');
  const [filterQuery, setFilterQuery] = useState('');

  const getRecipientName = (recipientId: string | null) => {
    if (!recipientId) return '';
    const recipient = recipients.find((r) => r.id === recipientId);
    return recipient ? recipient.name : '';
  };

  const claimedPrizes = prizes.filter((p) => p.claimed);
  const unclaimedPrizes = prizes.filter((p) => !p.claimed);

  const filterPrizes = (list: Prize[]) => {
    if (!filterQuery) return list;
    const query = filterQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        getRecipientName(p.recipientId).toLowerCase().includes(query)
    );
  };

  const filteredClaimed = filterPrizes(claimedPrizes);
  const filteredUnclaimed = filterPrizes(unclaimedPrizes);

  const handleExportClaimed = () => {
    const rows = claimedPrizes.map((p) => ({
      'Prize Name': p.name,
      'Recipient Name': getRecipientName(p.recipientId),
      'Claim Date': p.claimDate || '',
    }));
    exportToCsv('claimed-prizes.csv', rows, ['Prize Name', 'Recipient Name', 'Claim Date']);
  };

  const handleExportUnclaimed = () => {
    const rows = unclaimedPrizes.map((p) => ({
      'Prize Name': p.name,
      'Recipient Name': getRecipientName(p.recipientId),
    }));
    exportToCsv('unclaimed-prizes.csv', rows, ['Prize Name', 'Recipient Name']);
  };

  return (
    <div id="panel-reports" role="tabpanel" aria-labelledby="tab-reports">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden" role="tablist">
          <button
            role="tab"
            aria-selected={activeView === 'claimed'}
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${
              activeView === 'claimed'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('claimed')}
          >
            Claimed ({claimedPrizes.length})
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'unclaimed'}
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${
              activeView === 'unclaimed'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('unclaimed')}
          >
            Unclaimed ({unclaimedPrizes.length})
          </button>
        </div>

        <button
          className="btn-primary"
          onClick={activeView === 'claimed' ? handleExportClaimed : handleExportUnclaimed}
          disabled={activeView === 'claimed' ? claimedPrizes.length === 0 : unclaimedPrizes.length === 0}
        >
          Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label htmlFor="report-filter" className="sr-only">
          Filter reports
        </label>
        <input
          id="report-filter"
          type="text"
          className="input max-w-md"
          placeholder="Filter by prize or recipient name..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          aria-label="Filter report results"
        />
      </div>

      {/* Claimed View */}
      {activeView === 'claimed' && (
        <>
          {filteredClaimed.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">
                {filterQuery ? 'No claimed prizes match your filter.' : 'No claimed prizes yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Prize Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Recipient Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Claim Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaimed.map((prize) => (
                    <tr key={prize.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{prize.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getRecipientName(prize.recipientId) || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{prize.claimDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Unclaimed View */}
      {activeView === 'unclaimed' && (
        <>
          {filteredUnclaimed.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">
                {filterQuery ? 'No unclaimed prizes match your filter.' : 'No unclaimed prizes.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Prize Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Recipient Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnclaimed.map((prize) => (
                    <tr key={prize.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{prize.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getRecipientName(prize.recipientId) || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
