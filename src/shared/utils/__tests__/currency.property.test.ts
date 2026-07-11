// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { SupportedCurrency } from '@/shared/types';
import { formatCurrencyValue } from '../currency';

// Feature: prizeflow-evolution, Property 6: Currency formatting

/**
 * Property 6: Currency formatting
 *
 * For any valid numeric amount and supported currency, the formatting function SHALL
 * produce a string containing the ISO 4217 currency code and the correct number of
 * decimal places (2 for all currencies except JPY which uses 0 decimal places).
 *
 * **Validates: Requirements 5.5, 7.2**
 */
describe('Property 6: Currency formatting', () => {
  const currencyArb = fc.constantFrom<SupportedCurrency>(
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'INR'
  );

  const amountArb = fc.double({ min: 0.01, max: 999999999.99, noNaN: true, noDefaultInfinity: true });

  test('output contains ISO 4217 currency code', () => {
    fc.assert(
      fc.property(
        amountArb,
        currencyArb,
        (amount, currency) => {
          const result = formatCurrencyValue(amount, currency);
          expect(result).toContain(currency);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('output starts with the ISO 4217 currency code followed by a space', () => {
    fc.assert(
      fc.property(
        amountArb,
        currencyArb,
        (amount, currency) => {
          const result = formatCurrencyValue(amount, currency);
          expect(result.startsWith(`${currency} `)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('JPY uses 0 decimal places', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 999999999 }),
        (amount) => {
          const result = formatCurrencyValue(amount, 'JPY');
          // Remove the currency prefix
          const numericPart = result.replace('JPY ', '');
          // Remove locale thousand separators (various characters)
          const cleanedNumeric = numericPart.replace(/[^0-9\-.]/g, '');
          // Should NOT contain a decimal point
          expect(cleanedNumeric).not.toContain('.');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('non-JPY currencies use exactly 2 decimal places', () => {
    const nonJpyCurrencyArb = fc.constantFrom<SupportedCurrency>(
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'INR'
    );

    fc.assert(
      fc.property(
        amountArb,
        nonJpyCurrencyArb,
        (amount, currency) => {
          const result = formatCurrencyValue(amount, currency);
          // Remove the currency prefix
          const numericPart = result.replace(`${currency} `, '');
          // Find the decimal separator - could be '.' or ',' depending on locale
          // For currencies like EUR (de-DE locale), comma is the decimal separator
          // For USD (en-US locale), period is the decimal separator

          // The formatted string should contain a decimal separator with exactly 2 digits after it
          // Depending on locale: either '.' or ',' is the decimal separator
          // We check that the last 3 chars match pattern [.,]\d\d
          const lastThreeChars = numericPart.slice(-3);
          const hasCorrectDecimal = /^[.,]\d{2}$/.test(lastThreeChars);
          expect(hasCorrectDecimal).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
