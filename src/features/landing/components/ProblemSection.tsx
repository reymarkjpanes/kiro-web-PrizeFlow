const PAIN_POINTS = [
  {
    emoji: '\u26A0\uFE0F',
    title: 'Manual Distribution Errors',
    description: 'Handing out prizes manually leads to mix-ups and missed recipients.',
  },
  {
    emoji: '\uD83D\uDCCA',
    title: 'Spreadsheet Limitations',
    description: 'Complex spreadsheets become unmanageable as events scale up.',
  },
  {
    emoji: '\uD83D\uDCDD',
    title: 'Paper-Based Claiming',
    description: 'Paper sign-off sheets get lost, damaged, or filled incorrectly.',
  },
  {
    emoji: '\uD83D\uDD04',
    title: 'Duplicate Claims',
    description: 'Without a digital system, duplicate claims go undetected.',
  },
  {
    emoji: '\uD83D\uDCC1',
    title: 'Missing Records',
    description: 'Critical distribution data is lost without centralized tracking.',
  },
  {
    emoji: '\uD83D\uDCC9',
    title: 'Poor Reporting',
    description: 'Generating reports from scattered data is slow and error-prone.',
  },
];

function ProblemSection() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-4">
          The Problem
        </h2>
        <p className="text-lg text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
          Manual prize distribution is riddled with inefficiencies that waste time and create risk.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAIN_POINTS.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm"
            >
              <div className="text-2xl mb-3" aria-hidden="true">
                {point.emoji}
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {point.title}
              </h3>
              <p className="text-body-sm text-neutral-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProblemSection };
