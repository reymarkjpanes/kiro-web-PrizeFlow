import { useCallback } from 'react';

export interface FilterPillOption {
  value: string;
  label: string;
  classes?: string;
}

export interface FilterPillsProps {
  options: FilterPillOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  'aria-label'?: string;
}

function FilterPills({ options, selected, onChange, 'aria-label': ariaLabel = 'Filter options' }: FilterPillsProps) {
  const handleToggle = useCallback((value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }, [selected, onChange]);

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map(opt => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleToggle(opt.value)}
            aria-pressed={isActive}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-caption font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
              isActive
                ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-600/30'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export { FilterPills };
