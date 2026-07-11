import type { Prize, SupportedCurrency, PrizeType, DistributionStatus } from '../types';

/**
 * Migrates an array of raw prize objects (from localStorage) into fully-typed Prize objects.
 * Preserves all existing fields and applies default values for missing financial fields.
 *
 * @param raw - An array of unknown objects representing stored prize data
 * @returns An array of fully-typed Prize objects with defaults applied for missing fields
 */
export function migratePrizes(raw: unknown[]): Prize[] {
  return raw.map((item) => {
    const prize = item as Record<string, unknown>;
    return {
      // Preserve existing fields exactly
      id: prize.id as string,
      name: prize.name as string,
      description: prize.description as string,
      recipientId: prize.recipientId as string | null,
      claimed: prize.claimed as boolean,
      claimDate: prize.claimDate as string | null,
      // Apply defaults for missing financial fields
      prizeValue: (prize.prizeValue as number) ?? null,
      currency: (prize.currency as SupportedCurrency) ?? 'USD',
      prizeType: (prize.prizeType as PrizeType) ?? 'physical',
      fundingSource: (prize.fundingSource as string) ?? null,
      sponsor: (prize.sponsor as string) ?? null,
      budgetCategory: (prize.budgetCategory as string) ?? null,
      distributionStatus: (prize.distributionStatus as DistributionStatus) ?? 'pending',
    };
  });
}

/**
 * Safely loads prizes from localStorage by parsing the stored JSON and applying migration.
 * If JSON.parse fails:
 * - Retains the unparseable data unmodified in localStorage
 * - Falls back to an empty array
 * - Returns an error message indicating stored data could not be loaded
 *
 * @param storageKey - The localStorage key to read prize data from
 * @returns An object with `prizes` (the loaded/migrated array) and `error` (null or error message)
 */
export function safeLoadPrizes(storageKey: string): { prizes: Prize[]; error: string | null } {
  try {
    const raw = localStorage.getItem(storageKey);

    if (raw === null) {
      return { prizes: [], error: null };
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      // Data exists but is not an array — treat as unparseable structure
      // Retain the data unmodified in localStorage (don't overwrite)
      return {
        prizes: [],
        error: `Stored data could not be loaded: expected an array but found ${typeof parsed}`,
      };
    }

    const prizes = migratePrizes(parsed);
    return { prizes, error: null };
  } catch {
    // JSON.parse failed — retain unparseable data in localStorage unmodified, fall back to empty array
    return {
      prizes: [],
      error: 'Stored data could not be loaded: invalid JSON in localStorage',
    };
  }
}
