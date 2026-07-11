// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { Prize, SupportedCurrency } from '@/shared/types';
import { calculateBudgetSummary, getDominantCurrency, calculateCurrencyTotals } from '../financialCalc';

// Feature: prizeflow-evolution, Properties 4, 5, 7

const prizeArb: fc.Arbitrary<Prize> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 30 }),
  recipientId: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 10 })),
  claimed: fc.boolean(),
  claimDate: fc.oneof(fc.constant(null), fc.string({ minLength: 1 })),
  prizeValue: fc.oneof(fc.constant(null), fc.double({ min: 0.01, max: 999999999.99, noNaN: true })),
  currency: fc.constantFrom('USD' as const, 'EUR' as const, 'GBP' as const, 'JPY' as const, 'CAD' as const, 'AUD' as const, 'CHF' as const, 'INR' as const),
  prizeType: fc.constantFrom('cash' as const, 'physical' as const),
  fundingSource: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
  sponsor: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
  budgetCategory: fc.oneof(fc.constant(null), fc.string({ maxLength: 50 })),
  distributionStatus: fc.constantFrom('pending' as const, 'in_progress' as const, 'distributed' as const, 'returned' as const),
});

/**
 * Property 4: Budget summary calculation correctness
 *
 * For any array of Prize objects, the budget summary SHALL satisfy:
 * - totalBudget equals the sum of prizeValue for all prizes where prizeValue > 0
 * - totalDistributed equals the sum of prizeValue for prizes where distributionStatus is "distributed" and prizeValue > 0
 * - remainingBudget equals totalBudget minus totalDistributed
 * - cashAwardsCount equals the count of prizes where prizeType is "cash"
 * - physicalAwardsCount equals the count of prizes where prizeType is "physical"
 *
 * **Validates: Requirements 5.1, 4.5, 6.3, 6.4, 6.5**
 */
describe('Property 4: Budget summary calculation correctness', () => {
  test('budget summary matches manual calculation for any array of prizes', () => {
    fc.assert(
      fc.property(
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (prizes) => {
          const summary = calculateBudgetSummary(prizes);

          // Manual calculation
          let expectedTotalBudget = 0;
          let expectedTotalDistributed = 0;
          let expectedCashCount = 0;
          let expectedPhysicalCount = 0;

          for (const prize of prizes) {
            if (prize.prizeType === 'cash') expectedCashCount++;
            if (prize.prizeType === 'physical') expectedPhysicalCount++;

            if (prize.prizeValue != null && prize.prizeValue > 0) {
              expectedTotalBudget += prize.prizeValue;
              if (prize.distributionStatus === 'distributed') {
                expectedTotalDistributed += prize.prizeValue;
              }
            }
          }

          const expectedRemaining = expectedTotalBudget - expectedTotalDistributed;

          // Use approximate comparison for floating point
          expect(summary.totalBudget).toBeCloseTo(expectedTotalBudget, 5);
          expect(summary.totalDistributed).toBeCloseTo(expectedTotalDistributed, 5);
          expect(summary.remainingBudget).toBeCloseTo(expectedRemaining, 5);
          expect(summary.cashAwardsCount).toBe(expectedCashCount);
          expect(summary.physicalAwardsCount).toBe(expectedPhysicalCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('remainingBudget always equals totalBudget minus totalDistributed', () => {
    fc.assert(
      fc.property(
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (prizes) => {
          const summary = calculateBudgetSummary(prizes);
          expect(summary.remainingBudget).toBeCloseTo(
            summary.totalBudget - summary.totalDistributed,
            5
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 5: Dominant currency determination
 *
 * For any array of Prize objects, getDominantCurrency returns the currency with
 * highest frequency among prizes with prizeValue > 0; on tie returns most recently
 * created (last in array); empty array returns "USD".
 *
 * **Validates: Requirements 5.3**
 */
describe('Property 5: Dominant currency determination', () => {
  test('returns USD for empty array', () => {
    expect(getDominantCurrency([])).toBe('USD');
  });

  test('returns USD when all prizes have null prizeValue', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 20 }),
            description: fc.string({ maxLength: 30 }),
            recipientId: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 10 })),
            claimed: fc.boolean(),
            claimDate: fc.oneof(fc.constant(null), fc.string({ minLength: 1 })),
            prizeValue: fc.constant(null),
            currency: fc.constantFrom('USD' as const, 'EUR' as const, 'GBP' as const, 'JPY' as const, 'CAD' as const, 'AUD' as const, 'CHF' as const, 'INR' as const),
            prizeType: fc.constantFrom('cash' as const, 'physical' as const),
            fundingSource: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
            sponsor: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
            budgetCategory: fc.oneof(fc.constant(null), fc.string({ maxLength: 50 })),
            distributionStatus: fc.constantFrom('pending' as const, 'in_progress' as const, 'distributed' as const, 'returned' as const),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (prizes) => {
          expect(getDominantCurrency(prizes)).toBe('USD');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('returns the currency with highest frequency among prizes with prizeValue > 0', () => {
    fc.assert(
      fc.property(
        fc.array(prizeArb, { minLength: 1, maxLength: 30 }),
        (prizes) => {
          const result = getDominantCurrency(prizes);

          // Filter to valid prizes
          const validPrizes = prizes.filter(p => p.prizeValue != null && p.prizeValue > 0);

          if (validPrizes.length === 0) {
            expect(result).toBe('USD');
            return;
          }

          // Count frequencies
          const frequencyMap = new Map<SupportedCurrency, number>();
          const lastIndexMap = new Map<SupportedCurrency, number>();

          for (let i = 0; i < validPrizes.length; i++) {
            const currency = validPrizes[i].currency;
            frequencyMap.set(currency, (frequencyMap.get(currency) ?? 0) + 1);
            lastIndexMap.set(currency, i);
          }

          // Find max frequency
          let maxFrequency = 0;
          for (const count of frequencyMap.values()) {
            if (count > maxFrequency) maxFrequency = count;
          }

          // The result must have max frequency
          expect(frequencyMap.get(result)).toBe(maxFrequency);

          // If there's a tie, result should be the one with highest last index
          const tiedCurrencies: SupportedCurrency[] = [];
          for (const [currency, count] of frequencyMap.entries()) {
            if (count === maxFrequency) tiedCurrencies.push(currency);
          }

          if (tiedCurrencies.length > 1) {
            let highestIdx = -1;
            let expectedCurrency = tiedCurrencies[0];
            for (const currency of tiedCurrencies) {
              const idx = lastIndexMap.get(currency) ?? -1;
              if (idx > highestIdx) {
                highestIdx = idx;
                expectedCurrency = currency;
              }
            }
            expect(result).toBe(expectedCurrency);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 7: Per-currency budget grouping
 *
 * For any array of prizes with multiple currencies, calculateCurrencyTotals produces
 * exactly one entry per distinct currency with prizeValue > 0, and sum of each group
 * equals sum of prizes in that currency.
 *
 * **Validates: Requirements 7.4**
 */
describe('Property 7: Per-currency budget grouping', () => {
  test('produces exactly one entry per distinct currency with prizeValue > 0', () => {
    fc.assert(
      fc.property(
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (prizes) => {
          const totals = calculateCurrencyTotals(prizes);

          // Get distinct currencies with prizeValue > 0
          const validPrizes = prizes.filter(p => p.prizeValue != null && p.prizeValue > 0);
          const expectedCurrencies = new Set(validPrizes.map(p => p.currency));

          // Exactly one entry per distinct currency
          expect(totals.length).toBe(expectedCurrencies.size);

          // Each entry's currency should be unique
          const resultCurrencies = new Set(totals.map(t => t.currency));
          expect(resultCurrencies.size).toBe(totals.length);

          // All expected currencies are present
          for (const currency of expectedCurrencies) {
            expect(resultCurrencies.has(currency)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('sum of each group equals sum of prizes in that currency', () => {
    fc.assert(
      fc.property(
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (prizes) => {
          const totals = calculateCurrencyTotals(prizes);

          for (const entry of totals) {
            const prizesInCurrency = prizes.filter(
              p => p.currency === entry.currency && p.prizeValue != null && p.prizeValue > 0
            );

            const expectedTotal = prizesInCurrency.reduce((sum, p) => sum + (p.prizeValue ?? 0), 0);
            expect(entry.total).toBeCloseTo(expectedTotal, 5);
            expect(entry.count).toBe(prizesInCurrency.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
