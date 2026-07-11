import { useState, useCallback } from 'react';
import { Navigation } from '@/shared/components';
import { useRecipients, usePrizes } from '@/shared/hooks';
import type { TabId } from '@/shared/types';
import { Dashboard } from '@/features/dashboard';
import { Recipients } from '@/features/recipients';
import { Prizes } from '@/features/prizes';
import { Reports } from '@/features/reports';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const { recipients, addRecipient, updateRecipient, deleteRecipient, error: recipientError } = useRecipients();
  const {
    prizes,
    addPrize,
    updatePrize,
    deletePrize,
    assignRecipient,
    unassignRecipient,
    claimPrize,
    unclaimPrize,
    clearRecipientFromPrizes,
    error: prizeError,
  } = usePrizes();

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  // Storage error banner
  const storageError = recipientError || prizeError;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Storage error warning */}
      {storageError && (
        <div className="bg-warning-50 border-b border-warning-200 px-4 py-2" role="alert">
          <p className="text-body-sm text-warning-700 text-center">
            {storageError}
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab panels */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <ErrorBoundary>
            {activeTab === 'dashboard' && (
              <Dashboard recipients={recipients} prizes={prizes} />
            )}
            {activeTab === 'recipients' && (
              <Recipients
                recipients={recipients}
                addRecipient={addRecipient}
                updateRecipient={updateRecipient}
                deleteRecipient={deleteRecipient}
                clearRecipientFromPrizes={clearRecipientFromPrizes}
              />
            )}
            {activeTab === 'prizes' && (
              <Prizes
                prizes={prizes}
                recipients={recipients}
                addPrize={addPrize}
                updatePrize={updatePrize}
                deletePrize={deletePrize}
                assignRecipient={assignRecipient}
                unassignRecipient={unassignRecipient}
                claimPrize={claimPrize}
                unclaimPrize={unclaimPrize}
              />
            )}
            {activeTab === 'reports' && (
              <Reports prizes={prizes} recipients={recipients} />
            )}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;
