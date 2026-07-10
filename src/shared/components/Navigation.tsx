import { useRef } from 'react';
import { useArrowNavigation } from '@/shared/hooks';
import type { TabId } from '@/shared/types';

export interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'recipients', label: 'Recipients' },
  { id: 'prizes', label: 'Prizes' },
  { id: 'reports', label: 'Reports' },
];

function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  useArrowNavigation(tabListRef, { orientation: 'horizontal', loop: true });

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo/Title */}
          <h1 className="text-h4 font-bold text-primary-600">PrizeFlow</h1>

          {/* Tab navigation */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Main navigation"
            className="flex items-center gap-1"
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 text-body-sm font-medium rounded-md transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Navigation };
