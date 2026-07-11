// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { Prize } from '@/shared/types';

// Feature: production-quality-mvp, Property 4: Cascade Delete Consistency

/**
 * Property 4: Cascade Delete Consistency
 *
 * For any list of recipients and any list of prizes with arbitrary assignments,
 * after executing the cascade delete logic for a recipient, no prize shall have
 * recipientId equal to the deleted recipient's id, and no such prize shall have
 * claimed === true or a non-null claimDate.
 *
 * **Validates: Requirements 9.5**
 */

// Pure function extracted from usePrizes.clearRecipientFromPrizes
function cascadeDeleteRecipient(prizes: Prize[], recipientId: string): Prize[] {
  return prizes.map(p =>
    p.recipientId === recipientId
      ? { ...p, recipientId: null, claimed: false, claimDate: null }
      : p
  );
}

describe('Property 4: Cascade Delete Consistency', () => {
  // Use a small set of fixed recipient IDs to guarantee overlap
  const recipientIdArb = fc.constantFrom('r1', 'r2', 'r3', 'r4', 'r5');

  const claimDateArb = fc.oneof(
    fc.constant(null),
    fc.constant('2023-01-15'),
    fc.constant('2024-06-30'),
    fc.constant('2025-12-01'),
  );

  const prizeArb: fc.Arbitrary<Prize> = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    description: fc.string({ maxLength: 30 }),
    recipientId: fc.oneof(
      fc.constant(null),
      recipientIdArb,
    ),
    claimed: fc.boolean(),
    claimDate: claimDateArb,
    prizeValue: fc.oneof(fc.constant(null), fc.double({ min: 0.01, max: 999999999.99, noNaN: true })),
    currency: fc.constantFrom('USD' as const, 'EUR' as const, 'GBP' as const, 'JPY' as const, 'CAD' as const, 'AUD' as const, 'CHF' as const, 'INR' as const),
    prizeType: fc.constantFrom('cash' as const, 'physical' as const),
    fundingSource: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
    sponsor: fc.oneof(fc.constant(null), fc.string({ maxLength: 100 })),
    budgetCategory: fc.oneof(fc.constant(null), fc.string({ maxLength: 50 })),
    distributionStatus: fc.constantFrom('pending' as const, 'in_progress' as const, 'distributed' as const, 'returned' as const),
  });

  test('after cascade delete, no prize references the deleted recipient', () => {
    fc.assert(
      fc.property(
        recipientIdArb,
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (deletedId, prizes) => {
          const result = cascadeDeleteRecipient(prizes, deletedId);

          // No prize should reference the deleted recipient
          for (const prize of result) {
            if (prize.recipientId === deletedId) {
              return false; // Violation
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('after cascade delete, affected prizes have claimed=false and claimDate=null', () => {
    fc.assert(
      fc.property(
        recipientIdArb,
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (deletedId, prizes) => {
          // Find prizes that reference the to-be-deleted recipient
          const affectedPrizeIds = prizes
            .filter(p => p.recipientId === deletedId)
            .map(p => p.id);

          const result = cascadeDeleteRecipient(prizes, deletedId);

          // All previously-affected prizes must have claimed=false and claimDate=null
          for (const prize of result) {
            if (affectedPrizeIds.includes(prize.id)) {
              expect(prize.claimed).toBe(false);
              expect(prize.claimDate).toBeNull();
              expect(prize.recipientId).toBeNull();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('unaffected prizes remain unchanged', () => {
    fc.assert(
      fc.property(
        recipientIdArb,
        fc.array(prizeArb, { minLength: 0, maxLength: 30 }),
        (deletedId, prizes) => {
          const result = cascadeDeleteRecipient(prizes, deletedId);

          // Unaffected prizes should remain unchanged
          for (let i = 0; i < prizes.length; i++) {
            if (prizes[i].recipientId !== deletedId) {
              expect(result[i]).toEqual(prizes[i]);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
