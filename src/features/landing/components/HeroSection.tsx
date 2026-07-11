interface HeroSectionProps {
  onGetStarted: () => void;
}

function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="min-h-[600px] flex items-center py-16 md:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              PrizeFlow
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-lg mx-auto md:mx-0">
              Streamline prize distribution with automated tracking, real-time reporting, and effortless claim management.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[48px]"
            >
              Get Started
            </button>
          </div>

          {/* Dashboard preview illustration */}
          <div className="flex-1 w-full max-w-md md:max-w-lg">
            <div className="bg-white rounded-xl shadow-xl border border-neutral-200 p-4 md:p-6">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-danger-400" />
                <div className="w-3 h-3 rounded-full bg-warning-400" />
                <div className="w-3 h-3 rounded-full bg-success-400" />
                <div className="ml-2 h-4 w-24 bg-neutral-100 rounded" />
              </div>
              {/* Mock stat cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-primary-50 rounded-lg p-3">
                  <div className="h-3 w-8 bg-primary-200 rounded mb-2" />
                  <div className="h-5 w-12 bg-primary-300 rounded" />
                </div>
                <div className="bg-success-50 rounded-lg p-3">
                  <div className="h-3 w-10 bg-success-200 rounded mb-2" />
                  <div className="h-5 w-10 bg-success-300 rounded" />
                </div>
                <div className="bg-warning-50 rounded-lg p-3">
                  <div className="h-3 w-9 bg-warning-200 rounded mb-2" />
                  <div className="h-5 w-11 bg-warning-300 rounded" />
                </div>
              </div>
              {/* Mock table rows */}
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-neutral-50 rounded">
                    <div className="h-4 w-4 bg-neutral-200 rounded" />
                    <div className="h-3 flex-1 bg-neutral-200 rounded" />
                    <div className="h-3 w-16 bg-neutral-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
export type { HeroSectionProps };
