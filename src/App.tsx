import { useState, useEffect, useCallback } from 'react';
import { TabId, Recipient, Prize } from './types';
import { getRecipients, saveRecipients, getPrizes, savePrizes } from './utils/storage';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Recipients from './pages/Recipients';
import Prizes from './pages/Prizes';
import Reports from './pages/Reports';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    setRecipients(getRecipients());
    setPrizes(getPrizes());
  }, []);

  // Persist recipients to localStorage whenever they change
  const updateRecipients = useCallback((newRecipients: Recipient[]) => {
    setRecipients(newRecipients);
    saveRecipients(newRecipients);
  }, []);

  // Persist prizes to localStorage whenever they change
  const updatePrizes = useCallback((newPrizes: Prize[]) => {
    setPrizes(newPrizes);
    savePrizes(newPrizes);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard prizes={prizes} />;
      case 'recipients':
        return (
          <Recipients
            recipients={recipients}
            prizes={prizes}
            updateRecipients={updateRecipients}
            updatePrizes={updatePrizes}
          />
        );
      case 'prizes':
        return (
          <Prizes
            prizes={prizes}
            recipients={recipients}
            updatePrizes={updatePrizes}
          />
        );
      case 'reports':
        return <Reports prizes={prizes} recipients={recipients} />;
      default:
        return <Dashboard prizes={prizes} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-primary-700">PrizeFlow</h1>
          </div>
        </div>
      </header>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
