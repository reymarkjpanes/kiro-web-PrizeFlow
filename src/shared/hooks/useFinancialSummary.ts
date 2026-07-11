import { useMemo } from 'react';
import type { Prize, BudgetSummary, CurrencyTotal, SupportedCurrency } from '../types';
import {
  calculateBudgetSummary,
  calculateCurrencyTotals,
  getDominantCurrency,
} from '../utils/financialCalc';

export interface UseFinancialSummaryReturn {
  summary: BudgetSummary;
  currencyTotals: CurrencyTotal[];
  dominantCurrency: SupportedCurrency;
}

/**
 * Hook that computes financial summary data from an array of prizes.
 * Uses useMemo to avoid recalculation on every render.
 *
 * @param prizes - Array of Prize objects
 * @returns Financial summary including budget summary, per-currency totals, and dominant currency
 */
export function useFinancialSummary(prizes: Prize[]): UseFinancialSummaryReturn {
  const summary = useMemo(() => calculateBudgetSummary(prizes), [prizes]);
  const currencyTotals = useMemo(() => calculateCurrencyTotals(prizes), [prizes]);
  const dominantCurrency = useMemo(() => getDominantCurrency(prizes), [prizes]);

  return { summary, currencyTotals, dominantCurrency };
}
