import type { SupportedCurrency } from '../types';

/**
 * Currencies that use 0 decimal places (per ISO 4217).
 */
const ZERO_DECIMAL_CURRENCIES: SupportedCurrency[] = ['JPY'];

/**
 * Locale mapping for currency formatting with appropriate thousand separators.
 */
const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CAD: 'en-CA',
  AUD: 'en-AU',
  CHF: 'de-CH',
  INR: 'en-IN',
};

/**
 * Formats a numeric value with the ISO 4217 currency code, locale-appropriate
 * thousand separators, and the correct number of decimal places.
 *
 * - All currencies use 2 decimal places except JPY which uses 0.
 * - Output format: "<CODE> <formatted_amount>" (e.g., "USD 100.00", "JPY 5000")
 *
 * @param value - The numeric amount to format
 * @param currency - The ISO 4217 currency code
 * @returns Formatted currency string
 */
export function formatCurrencyValue(
  value: number,
  currency: SupportedCurrency
): string {
  const decimals = ZERO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2;
  const locale = CURRENCY_LOCALE_MAP[currency];

  const formattedAmount = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  });

  return `${currency} ${formattedAmount}`;
}
