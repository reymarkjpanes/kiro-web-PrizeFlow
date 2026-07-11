import type { Prize, BudgetSummary, CurrencyTotal, SupportedCurrency } from '../types';

/**
 * Validates a prize value input string.
 *
 * Rules:
 * - Empty/null input is valid (prizeValue is optional)
 * - Numeric values in range [0.01, 999999999.99] are valid
 * - Non-numeric strings are rejected
 * - Values outside the range are rejected
 *
 * @param input - The string input to validate
 * @returns Object with valid boolean and error message (or null)
 */
export function validatePrizeValue(input: string): { valid: boolean; error: string | null } {
  // Empty/null input is valid (prizeValue is optional)
  if (input === '' || input === null || input === undefined) {
    return { valid: true, error: null };
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return { valid: true, error: null };
  }

  // Check if it's a valid number
  const num = Number(trimmed);
  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, error: 'Prize value must be a valid number' };
  }

  // Check range
  if (num < 0.01) {
    return { valid: false, error: 'Prize value must be at least 0.01' };
  }

  if (num > 999999999.99) {
    return { valid: false, error: 'Prize value must not exceed 999,999,999.99' };
  }

  return { valid: true, error: null };
}

/**
 * Calculates a budget summary from an array of prizes.
 *
 * - totalBudget: sum of prizeValues where prizeValue > 0 (excludes null/zero)
 * - totalDistributed: sum of prizeValues where distributionStatus === "distributed" and prizeValue > 0
 * - remainingBudget: totalBudget - totalDistributed
 * - cashAwardsCount: count of prizes where prizeType === "cash"
 * - physicalAwardsCount: count of prizes where prizeType === "physical"
 *
 * @param prizes - Array of Prize objects
 * @returns BudgetSummary
 */
export function calculateBudgetSummary(prizes: Prize[]): BudgetSummary {
  let totalBudget = 0;
  let totalDistributed = 0;
  let cashAwardsCount = 0;
  let physicalAwardsCount = 0;

  for (const prize of prizes) {
    // Count by type regardless of prizeValue
    if (prize.prizeType === 'cash') {
      cashAwardsCount++;
    } else if (prize.prizeType === 'physical') {
      physicalAwardsCount++;
    }

    // Only include prizes with prizeValue > 0 in monetary sums
    if (prize.prizeValue != null && prize.prizeValue > 0) {
      totalBudget += prize.prizeValue;

      if (prize.distributionStatus === 'distributed') {
        totalDistributed += prize.prizeValue;
      }
    }
  }

  return {
    totalBudget,
    totalDistributed,
    remainingBudget: totalBudget - totalDistributed,
    cashAwardsCount,
    physicalAwardsCount,
  };
}

/**
 * Calculates per-currency totals from an array of prizes.
 * Only prizes with prizeValue > 0 are included.
 * Returns one entry per distinct currency.
 *
 * @param prizes - Array of Prize objects
 * @returns Array of CurrencyTotal objects
 */
export function calculateCurrencyTotals(prizes: Prize[]): CurrencyTotal[] {
  const currencyMap = new Map<SupportedCurrency, CurrencyTotal>();

  for (const prize of prizes) {
    // Only include prizes with prizeValue > 0
    if (prize.prizeValue == null || prize.prizeValue <= 0) {
      continue;
    }

    const existing = currencyMap.get(prize.currency);
    if (existing) {
      existing.total += prize.prizeValue;
      existing.count++;
      if (prize.distributionStatus === 'distributed') {
        existing.distributedTotal += prize.prizeValue;
      }
      existing.remaining = existing.total - existing.distributedTotal;
    } else {
      const distributedTotal = prize.distributionStatus === 'distributed' ? prize.prizeValue : 0;
      currencyMap.set(prize.currency, {
        currency: prize.currency,
        total: prize.prizeValue,
        distributedTotal,
        remaining: prize.prizeValue - distributedTotal,
        count: 1,
      });
    }
  }

  return Array.from(currencyMap.values());
}

/**
 * Determines the dominant currency among prizes with prizeValue > 0.
 *
 * Rules:
 * - Returns the currency with the highest frequency among prizes with prizeValue > 0
 * - On tie, returns the currency that appears on the most recently created prize among tied currencies
 * - Defaults to "USD" if no prizes have prizeValue > 0
 *
 * Note: Since Prize doesn't have a createdAt field, we use array index as a proxy
 * for creation order (later index = more recently created).
 *
 * @param prizes - Array of Prize objects
 * @returns The dominant SupportedCurrency
 */
export function getDominantCurrency(prizes: Prize[]): SupportedCurrency {
  // Filter to prizes with prizeValue > 0
  const validPrizes = prizes.filter(p => p.prizeValue != null && p.prizeValue > 0);

  if (validPrizes.length === 0) {
    return 'USD';
  }

  // Count frequency and track last index for each currency
  const frequencyMap = new Map<SupportedCurrency, number>();
  const lastIndexMap = new Map<SupportedCurrency, number>();

  for (let i = 0; i < validPrizes.length; i++) {
    const currency = validPrizes[i].currency;
    frequencyMap.set(currency, (frequencyMap.get(currency) ?? 0) + 1);
    lastIndexMap.set(currency, i);
  }

  // Find the maximum frequency
  let maxFrequency = 0;
  for (const count of frequencyMap.values()) {
    if (count > maxFrequency) {
      maxFrequency = count;
    }
  }

  // Get all currencies with the maximum frequency
  const tiedCurrencies: SupportedCurrency[] = [];
  for (const [currency, count] of frequencyMap.entries()) {
    if (count === maxFrequency) {
      tiedCurrencies.push(currency);
    }
  }

  // If only one, return it
  if (tiedCurrencies.length === 1) {
    return tiedCurrencies[0];
  }

  // On tie, return the currency with the highest last index (most recently created)
  let dominantCurrency = tiedCurrencies[0];
  let highestIndex = lastIndexMap.get(dominantCurrency) ?? -1;

  for (const currency of tiedCurrencies) {
    const idx = lastIndexMap.get(currency) ?? -1;
    if (idx > highestIndex) {
      highestIndex = idx;
      dominantCurrency = currency;
    }
  }

  return dominantCurrency;
}
