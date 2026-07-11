interface CtaSectionProps {
  onGetStarted: () => void;
}

function CtaSection({ onGetStarted }: CtaSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
          Transform your prize distribution process today. No signup required.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-primary-600 bg-white hover:bg-primary-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 min-h-[48px]"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export { CtaSection };
export type { CtaSectionProps };
