const WORKFLOW_STEPS = [
  {
    number: 1,
    title: 'Event Created',
    description: 'Set up your event with all the details in one place.',
  },
  {
    number: 2,
    title: 'Recipients Registered',
    description: 'Add individuals, teams, or organizations as prize recipients.',
  },
  {
    number: 3,
    title: 'Prizes Assigned',
    description: 'Assign prizes to recipients with full financial tracking.',
  },
  {
    number: 4,
    title: 'Claims Recorded',
    description: 'Record prize claims digitally to prevent duplicates.',
  },
  {
    number: 5,
    title: 'Reports Generated',
    description: 'Export comprehensive reports for stakeholders instantly.',
  },
];

function SolutionSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-4">
          The Solution
        </h2>
        <p className="text-lg text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
          PrizeFlow replaces manual processes with a streamlined digital workflow.
        </p>

        <div className="relative max-w-3xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-6 md:left-8 top-6 bottom-6 w-0.5 bg-primary-200 hidden sm:block" aria-hidden="true" />

          <div className="space-y-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.number} className="flex items-start gap-4 md:gap-6">
                {/* Step number circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-md">
                  {step.number}
                </div>

                {/* Step content */}
                <div className="pt-1 md:pt-3">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { SolutionSection };
