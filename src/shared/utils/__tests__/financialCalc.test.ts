import { describe, it, expect } from 'vitest';
import {
  validatePrizeValue,
  calculateBudgetSummary,
  calculateCurrencyTotals,
  getDominantCurrency,
} from '../financialCalc';
import type { Prize } from '../../types';

// Helper to create a minimal Prize object for testing
function makePrize(overrides: Partial<Prize> = {}): Prize {
  return {
    id: overrides.id ?? 'test-1',
    name: overrides.name ?? 'Test Prize',
    description: overrides.description ?? '',
    recipientId: overrides.recipientId ?? null,
    claimed: overrides.claimed ?? false,
    claimDate: overrides.claimDate ?? null,
    prizeValue: overrides.prizeValue ?? null,
    currency: overrides.currency ?? 'USD',
    prizeType: overrides.prizeType ?? 'physical',
    fundingSource: overrides.fundingSource ?? null,
    sponsor: overrides.sponsor ?? null,
    budgetCategory: overrides.budgetCategory ?? null,
    distributionStatus: overrides.distributionStatus ?? 'pending',
  };
}

describe('validatePrizeValue', () => {
  it('accepts empty string', () => {
    const result = validatePrizeValue('');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts whitespace-only string', () => {
    const result = validatePrizeValue('   ');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts minimum value 0.01', () => {
    const result = validatePrizeValue('0.01');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts maximum value 999999999.99', () => {
    const result = validatePrizeValue('999999999.99');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts value within range', () => {
    const result = validatePrizeValue('500.50');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects value below 0.01', () => {
    const result = validatePrizeValue('0.001');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('rejects value of 0', () => {
    const result = validatePrizeValue('0');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('rejects negative value', () => {
    const result = validatePrizeValue('-5');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('rejects value above 999999999.99', () => {
    const result = validatePrizeValue('1000000000');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('rejects non-numeric string', () => {
    const result = validatePrizeValue('abc');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('rejects strings with mixed content', () => {
    const result = validatePrizeValue('12abc');
    expect(result.valid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('accepts integer values', () => {
    const result = validatePrizeValue('100');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe('calculateBudgetSummary', () => {
  it('returns zeros for empty array', () => {
    const result = calculateBudgetSummary([]);
    expect(result).toEqual({
      totalBudget: 0,
      totalDistributed: 0,
      remainingBudget: 0,
      cashAwardsCount: 0,
      physicalAwardsCount: 0,
    });
  });

  it('excludes prizes with null prizeValue from totalBudget', () => {
    const prizes = [
      makePrize({ prizeValue: null }),
      makePrize({ prizeValue: 100 }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.totalBudget).toBe(100);
  });

  it('excludes prizes with zero prizeValue from totalBudget', () => {
    const prizes = [
      makePrize({ prizeValue: 0 }),
      makePrize({ prizeValue: 200 }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.totalBudget).toBe(200);
  });

  it('calculates totalDistributed correctly', () => {
    const prizes = [
      makePrize({ prizeValue: 100, distributionStatus: 'distributed' }),
      makePrize({ prizeValue: 200, distributionStatus: 'pending' }),
      makePrize({ prizeValue: 50, distributionStatus: 'distributed' }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.totalDistributed).toBe(150);
  });

  it('calculates remainingBudget as totalBudget - totalDistributed', () => {
    const prizes = [
      makePrize({ prizeValue: 100, distributionStatus: 'distributed' }),
      makePrize({ prizeValue: 200, distributionStatus: 'pending' }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.remainingBudget).toBe(200); // 300 - 100
  });

  it('counts cash and physical awards', () => {
    const prizes = [
      makePrize({ prizeType: 'cash' }),
      makePrize({ prizeType: 'cash' }),
      makePrize({ prizeType: 'physical' }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.cashAwardsCount).toBe(2);
    expect(result.physicalAwardsCount).toBe(1);
  });

  it('counts prizes by type regardless of prizeValue', () => {
    const prizes = [
      makePrize({ prizeType: 'cash', prizeValue: null }),
      makePrize({ prizeType: 'physical', prizeValue: 0 }),
    ];
    const result = calculateBudgetSummary(prizes);
    expect(result.cashAwardsCount).toBe(1);
    expect(result.physicalAwardsCount).toBe(1);
  });
});

describe('calculateCurrencyTotals', () => {
  it('returns empty array for empty input', () => {
    const result = calculateCurrencyTotals([]);
    expect(result).toEqual([]);
  });

  it('returns empty array when all prizes have null prizeValue', () => {
    const prizes = [
      makePrize({ prizeValue: null, currency: 'USD' }),
      makePrize({ prizeValue: null, currency: 'EUR' }),
    ];
    const result = calculateCurrencyTotals(prizes);
    expect(result).toEqual([]);
  });

  it('groups by currency correctly', () => {
    const prizes = [
      makePrize({ prizeValue: 100, currency: 'USD', distributionStatus: 'pending' }),
      makePrize({ prizeValue: 200, currency: 'EUR', distributionStatus: 'pending' }),
      makePrize({ prizeValue: 50, currency: 'USD', distributionStatus: 'distributed' }),
    ];
    const result = calculateCurrencyTotals(prizes);
    expect(result).toHaveLength(2);

    const usd = result.find(r => r.currency === 'USD');
    expect(usd).toEqual({
      currency: 'USD',
      total: 150,
      distributedTotal: 50,
      remaining: 100,
      count: 2,
    });

    const eur = result.find(r => r.currency === 'EUR');
    expect(eur).toEqual({
      currency: 'EUR',
      total: 200,
      distributedTotal: 0,
      remaining: 200,
      count: 1,
    });
  });

  it('excludes prizes with zero prizeValue', () => {
    const prizes = [
      makePrize({ prizeValue: 0, currency: 'USD' }),
      makePrize({ prizeValue: 100, currency: 'USD' }),
    ];
    const result = calculateCurrencyTotals(prizes);
    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(1);
    expect(result[0].total).toBe(100);
  });
});

describe('getDominantCurrency', () => {
  it('returns USD for empty array', () => {
    expect(getDominantCurrency([])).toBe('USD');
  });

  it('returns USD when all prizes have null prizeValue', () => {
    const prizes = [
      makePrize({ prizeValue: null, currency: 'EUR' }),
      makePrize({ prizeValue: null, currency: 'GBP' }),
    ];
    expect(getDominantCurrency(prizes)).toBe('USD');
  });

  it('returns the most frequent currency', () => {
    const prizes = [
      makePrize({ prizeValue: 10, currency: 'EUR' }),
      makePrize({ prizeValue: 20, currency: 'EUR' }),
      makePrize({ prizeValue: 30, currency: 'USD' }),
    ];
    expect(getDominantCurrency(prizes)).toBe('EUR');
  });

  it('on tie, returns currency of most recently created prize', () => {
    const prizes = [
      makePrize({ prizeValue: 10, currency: 'USD' }),
      makePrize({ prizeValue: 20, currency: 'EUR' }),
    ];
    // Both have frequency 1, EUR is at later index
    expect(getDominantCurrency(prizes)).toBe('EUR');
  });

  it('on tie with multiple currencies, returns most recent among tied', () => {
    const prizes = [
      makePrize({ prizeValue: 10, currency: 'USD' }),
      makePrize({ prizeValue: 10, currency: 'EUR' }),
      makePrize({ prizeValue: 10, currency: 'GBP' }),
      makePrize({ prizeValue: 10, currency: 'USD' }),
      makePrize({ prizeValue: 10, currency: 'EUR' }),
    ];
    // USD: 2 (last at index 3), EUR: 2 (last at index 4), GBP: 1
    // Tie between USD and EUR, EUR has higher last index
    expect(getDominantCurrency(prizes)).toBe('EUR');
  });

  it('ignores prizes with zero prizeValue', () => {
    const prizes = [
      makePrize({ prizeValue: 0, currency: 'EUR' }),
      makePrize({ prizeValue: 0, currency: 'EUR' }),
      makePrize({ prizeValue: 10, currency: 'USD' }),
    ];
    expect(getDominantCurrency(prizes)).toBe('USD');
  });
});
