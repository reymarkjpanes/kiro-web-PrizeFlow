// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { validatePrizeValue } from '../financialCalc';

// Feature: prizeflow-evolution, Property 3: Prize value validation correctness

/**
 * Property 3: Prize value validation correctness
 *
 * For any numeric input value, the validation function SHALL accept values in the range
 * [0.01, 999,999,999.99] and reject values less than 0.01 or greater than 999,999,999.99.
 * For any non-numeric string input, the validation function SHALL reject it.
 * For any empty/null input, the validation function SHALL accept it (as prizeValue is optional).
 *
 * **Validates: Requirements 4.6**
 */
describe('Property 3: Prize value validation correctness', () => {
  test('accepts values in range [0.01, 999999999.99]', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 999999999.99, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const result = validatePrizeValue(value.toString());
          expect(result.valid).toBe(true);
          expect(result.error).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('rejects values less than 0.01', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -999999999, max: 0.009999, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          // Ensure the value is actually < 0.01 (double precision might generate 0.01)
          if (value >= 0.01) return; // skip this generated value
          const result = validatePrizeValue(value.toString());
          expect(result.valid).toBe(false);
          expect(result.error).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('rejects values greater than 999999999.99', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 999999999.991, max: 9999999999, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          // Ensure the value is actually > 999999999.99
          if (value <= 999999999.99) return; // skip
          const result = validatePrizeValue(value.toString());
          expect(result.valid).toBe(false);
          expect(result.error).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('rejects non-numeric strings', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => {
          const trimmed = s.trim();
          if (trimmed === '') return false;
          const n = Number(trimmed);
          return isNaN(n) || !isFinite(n);
        }),
        (value) => {
          const result = validatePrizeValue(value);
          expect(result.valid).toBe(false);
          expect(result.error).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('accepts empty string', () => {
    const result = validatePrizeValue('');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('accepts whitespace-only strings', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }).map(n => ' '.repeat(n)),
        (value) => {
          const result = validatePrizeValue(value);
          expect(result.valid).toBe(true);
          expect(result.error).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
