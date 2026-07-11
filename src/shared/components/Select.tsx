import { useId } from 'react';

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  className?: string;
}

function Select({ label, value, onChange, options, required, error, className = '' }: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-body-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`block w-full rounded-md border px-3 py-2.5 text-body-sm text-neutral-900 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 min-h-[44px] ${
          error ? 'border-danger-500' : 'border-neutral-300 hover:border-neutral-400'
        } ${className}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-body-sm text-danger-600" role="alert">{error}</p>
      )}
    </div>
  );
}

export { Select };
