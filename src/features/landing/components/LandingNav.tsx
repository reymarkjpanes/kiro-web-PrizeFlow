interface LandingNavProps {
  onEnterApp: () => void;
}

function LandingNav({ onEnterApp }: LandingNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a
            href="#"
            className="text-h4 font-bold text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md px-1"
            aria-label="PrizeFlow home"
            onClick={(e) => e.preventDefault()}
          >
            PrizeFlow
          </a>

          <button
            onClick={onEnterApp}
            className="inline-flex items-center px-4 py-2 text-body-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px]"
          >
            Enter App
          </button>
        </div>
      </div>
    </nav>
  );
}

export { LandingNav };
export type { LandingNavProps };
