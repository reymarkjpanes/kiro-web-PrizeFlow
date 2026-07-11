// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { migratePrizes } from '../migration';

// Feature: prizeflow-evolution, Property 1: Migration preserves existing fields and applies correct defaults

/**
 * Property 1: Migration preserves existing fields and applies correct defaults
 *
 * For any legacy prize object (containing id, name, description, recipientId, claimed,
 * claimDate but missing some or all financial fields), applying the migration function
 * SHALL produce a prize object where all original field values are identical to the input
 * AND all missing financial fields are populated with their specified defaults
 * (currency: "USD", prizeType: "physical", distributionStatus: "pending", all nullable fields: null).
 *
 * **Validates: Requirements 4.1, 16.5**
 */

describe('Property 1: Migration preserves existing fields and applies correct defaults', () => {
  const legacyPrizeArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    description: fc.string({ maxLength: 30 }),
    recipientId: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 10 })),
    claimed: fc.boolean(),
    claimDate: fc.oneof(fc.constant(null), fc.string({ minLength: 1 })),
  });

  test('migration preserves original fields and applies correct defaults for missing financial fields', () => {
    fc.assert(
      fc.property(
        fc.array(legacyPrizeArb, { minLength: 1, maxLength: 20 }),
        (legacyPrizes) => {
          const migrated = migratePrizes(legacyPrizes);

          expect(migrated.length).toBe(legacyPrizes.length);

          for (let i = 0; i < legacyPrizes.length; i++) {
            const original = legacyPrizes[i];
            const result = migrated[i];

            // Original fields are preserved exactly
            expect(result.id).toBe(original.id);
            expect(result.name).toBe(original.name);
            expect(result.description).toBe(original.description);
            expect(result.recipientId).toBe(original.recipientId);
            expect(result.claimed).toBe(original.claimed);
            expect(result.claimDate).toBe(original.claimDate);

            // Missing financial fields have correct defaults
            expect(result.prizeValue).toBeNull();
            expect(result.currency).toBe('USD');
            expect(result.prizeType).toBe('physical');
            expect(result.fundingSource).toBeNull();
            expect(result.sponsor).toBeNull();
            expect(result.budgetCategory).toBeNull();
            expect(result.distributionStatus).toBe('pending');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('migration preserves existing financial fields when present', () => {
    const fullPrizeArb = fc.record({
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

    fc.assert(
      fc.property(
        fc.array(fullPrizeArb, { minLength: 1, maxLength: 20 }),
        (prizes) => {
          const migrated = migratePrizes(prizes);

          for (let i = 0; i < prizes.length; i++) {
            const original = prizes[i];
            const result = migrated[i];

            // All fields (including financial) should be preserved when present
            expect(result.id).toBe(original.id);
            expect(result.name).toBe(original.name);
            expect(result.description).toBe(original.description);
            expect(result.recipientId).toBe(original.recipientId);
            expect(result.claimed).toBe(original.claimed);
            expect(result.claimDate).toBe(original.claimDate);
            expect(result.currency).toBe(original.currency);
            expect(result.prizeType).toBe(original.prizeType);
            expect(result.distributionStatus).toBe(original.distributionStatus);

            // Nullable fields: migratePrizes uses ?? null, so provided values are kept
            if (original.prizeValue !== undefined) {
              expect(result.prizeValue).toBe(original.prizeValue);
            }
            if (original.fundingSource !== undefined) {
              expect(result.fundingSource).toBe(original.fundingSource);
            }
            if (original.sponsor !== undefined) {
              expect(result.sponsor).toBe(original.sponsor);
            }
            if (original.budgetCategory !== undefined) {
              expect(result.budgetCategory).toBe(original.budgetCategory);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
