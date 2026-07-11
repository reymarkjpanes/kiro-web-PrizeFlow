import { useId } from 'react';
import type { SupportedCurrency } from '../types';

export interface CurrencySelectorProps {
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  disabled?: boolean;
}

const CURRENCY_OPTIONS: { value: SupportedCurrency; label: string }[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

function CurrencySelector({ value = 'USD', onChange, disabled = false }: CurrencySelectorProps) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-body-sm font-medium text-neutral-700">
        Currency
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedCurrency)}
        disabled={disabled}
        aria-label="Currency"
        className={`block w-full rounded-md border px-3 py-2.5 text-body-sm text-neutral-900 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 min-h-[44px] border-neutral-300 hover:border-neutral-400 ${
          disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''
        }`}
      >
        {CURRENCY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { CurrencySelector, CURRENCY_OPTIONS };
