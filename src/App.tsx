import { useState, useCallback, useEffect } from 'react';
import { Navigation } from '@/shared/components';
import { RoleSwitcher } from '@/shared/components';
import { useRecipients, usePrizes, useRBAC, RBACProvider } from '@/shared/hooks';
import type { TabId } from '@/shared/types';
import { Dashboard } from '@/features/dashboard';
import { Recipients } from '@/features/recipients';
import { Prizes } from '@/features/prizes';
import { Reports } from '@/features/reports';
import { Landing } from '@/features/landing';
import { RBACPage } from '@/features/rbac';
import { ErrorBoundary } from './ErrorBoundary';

const VIEW_STORAGE_KEY = 'prizeflow_view';

function getInitialView(): 'landing' | 'app' {
  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === 'app') {
      return 'app';
    }
  } catch {
    // localStorage unavailable — default to landing
  }
  return 'landing';
}

function App() {
  const [view, setView] = useState<'landing' | 'app'>(getInitialView);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const { recipients, addRecipient, updateRecipient, deleteRecipient, duplicateRecipient, error: recipientError } = useRecipients();
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

  const handleEnterApp = useCallback(() => {
    try {
      setView('app');
      setActiveTab('dashboard');
      try {
        localStorage.setItem(VIEW_STORAGE_KEY, 'app');
      } catch {
        // localStorage write failed — continue in app view anyway
      }
    } catch {
      // If navigation fails, remain on landing page (Req 2.7)
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setView('landing');
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, 'landing');
    } catch {
      // localStorage write failed — continue on landing view anyway
    }
  }, []);

  // Render Landing Page
  if (view === 'landing') {
    return (
      <ErrorBoundary>
        <Landing onEnterApp={handleEnterApp} />
      </ErrorBoundary>
    );
  }

  // Render App Shell wrapped in RBACProvider
  return (
    <RBACProvider>
      <AppShellContent
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackToHome={handleBackToHome}
        recipients={recipients}
        prizes={prizes}
        addRecipient={addRecipient}
        updateRecipient={updateRecipient}
        deleteRecipient={deleteRecipient}
        duplicateRecipient={duplicateRecipient}
        clearRecipientFromPrizes={clearRecipientFromPrizes}
        addPrize={addPrize}
        updatePrize={updatePrize}
        deletePrize={deletePrize}
        assignRecipient={assignRecipient}
        unassignRecipient={unassignRecipient}
        claimPrize={claimPrize}
        unclaimPrize={unclaimPrize}
        recipientError={recipientError}
        prizeError={prizeError}
      />
    </RBACProvider>
  );
}

interface AppShellContentProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onBackToHome: () => void;
  recipients: ReturnType<typeof useRecipients>['recipients'];
  prizes: ReturnType<typeof usePrizes>['prizes'];
  addRecipient: ReturnType<typeof useRecipients>['addRecipient'];
  updateRecipient: ReturnType<typeof useRecipients>['updateRecipient'];
  deleteRecipient: ReturnType<typeof useRecipients>['deleteRecipient'];
  duplicateRecipient: ReturnType<typeof useRecipients>['duplicateRecipient'];
  clearRecipientFromPrizes: ReturnType<typeof usePrizes>['clearRecipientFromPrizes'];
  addPrize: ReturnType<typeof usePrizes>['addPrize'];
  updatePrize: ReturnType<typeof usePrizes>['updatePrize'];
  deletePrize: ReturnType<typeof usePrizes>['deletePrize'];
  assignRecipient: ReturnType<typeof usePrizes>['assignRecipient'];
  unassignRecipient: ReturnType<typeof usePrizes>['unassignRecipient'];
  claimPrize: ReturnType<typeof usePrizes>['claimPrize'];
  unclaimPrize: ReturnType<typeof usePrizes>['unclaimPrize'];
  recipientError: string | null;
  prizeError: string | null;
}

function AppShellContent({
  activeTab,
  onTabChange,
  onBackToHome,
  recipients,
  prizes,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  duplicateRecipient,
  clearRecipientFromPrizes,
  addPrize,
  updatePrize,
  deletePrize,
  assignRecipient,
  unassignRecipient,
  claimPrize,
  unclaimPrize,
  recipientError,
  prizeError,
}: AppShellContentProps) {
  const { isTabVisible, isDegraded } = useRBAC();
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Redirect to dashboard if current tab is not visible for the active role
  useEffect(() => {
    if (!isTabVisible(activeTab)) {
      onTabChange('dashboard');
      setAccessDeniedMessage(`Access denied: You do not have permission to view the "${activeTab}" tab with the current role.`);
    }
  }, [activeTab, isTabVisible, onTabChange]);

  const handleTabChange = useCallback((tab: TabId) => {
    if (!isTabVisible(tab)) {
      onTabChange('dashboard');
      setAccessDeniedMessage(`Access denied: You do not have permission to view the "${tab}" tab with the current role.`);
      return;
    }
    setAccessDeniedMessage(null);
    onTabChange(tab);
  }, [isTabVisible, onTabChange]);

  const dismissNotification = useCallback(() => {
    setAccessDeniedMessage(null);
  }, []);

  // Storage error banner
  const storageError = recipientError || prizeError;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} isTabVisible={isTabVisible} />

      {/* Role Switcher + Degraded Warning + Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="text-body-sm text-primary-600 hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-sm transition-colors duration-fast"
          aria-label="Back to Home"
        >
          &larr; Back to Home
        </button>

        <div className="flex items-center gap-2">
          {isDegraded && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-800 border border-warning-300"
              title="RBAC is running in degraded mode — permissions may not be enforced correctly"
              role="status"
            >
              ⚠ Degraded
            </span>
          )}
          <RoleSwitcher />
        </div>
      </div>

      {/* Access denied notification */}
      {accessDeniedMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="bg-danger-50 border border-danger-200 rounded-md px-4 py-2 flex items-center justify-between" role="alert">
            <p className="text-body-sm text-danger-700">
              {accessDeniedMessage}
            </p>
            <button
              onClick={dismissNotification}
              className="ml-4 text-danger-500 hover:text-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 rounded"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
          key={activeTab}
          className="tab-content-enter"
        >
          <ErrorBoundary>
            {activeTab === 'dashboard' && (
              <Dashboard recipients={recipients} prizes={prizes} />
            )}
            {activeTab === 'recipients' && (
              <Recipients
                recipients={recipients}
                prizes={prizes}
                addRecipient={addRecipient}
                updateRecipient={updateRecipient}
                deleteRecipient={deleteRecipient}
                duplicateRecipient={duplicateRecipient}
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
            {activeTab === 'rbac' && (
              <RBACPage />
            )}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;
