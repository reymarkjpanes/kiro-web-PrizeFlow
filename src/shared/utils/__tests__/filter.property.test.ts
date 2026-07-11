// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { Recipient, RecipientType } from '@/shared/types';
import { filterRecipients } from '@/shared/utils';

// Feature: production-quality-mvp, Property 7: Filter Subset Correctness

/**
 * Property 7: Filter Subset Correctness
 *
 * For any list of recipients and any non-empty search query string,
 * the filtered result SHALL be a strict subset of the original list
 * where every item contains the query in at least one searchable field,
 * and no valid match is excluded.
 *
 * **Validates: Requirements 7.4**
 */

describe('Property 7: Filter Subset Correctness', () => {
  const recipientTypeArb: fc.Arbitrary<RecipientType> = fc.constantFrom(
    'individual', 'team', 'class', 'department', 'organization', 'club', 'other'
  );

  const recipientArb: fc.Arbitrary<Recipient> = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    type: recipientTypeArb,
    displayName: fc.string({ minLength: 1, maxLength: 50 }),
    contactPerson: fc.string({ maxLength: 50 }),
    contactInfo: fc.string({ maxLength: 50 }),
    members: fc.array(fc.string({ maxLength: 30 }), { maxLength: 5 }),
    memberCount: fc.nat({ max: 50 }),
    notes: fc.string({ maxLength: 50 }),
    customLabel: fc.string({ maxLength: 20 }),
  });

  test('filtered result is always a subset of the original list', () => {
    fc.assert(
      fc.property(
        fc.array(recipientArb, { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (recipients, query) => {
          const filtered = filterRecipients(recipients, [], query);

          // Every filtered item must exist in the original list
          for (const item of filtered) {
            expect(recipients).toContainEqual(item);
          }

          // Subset: filtered length <= original length
          expect(filtered.length).toBeLessThanOrEqual(recipients.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('every item in filtered result matches the query predicate', () => {
    fc.assert(
      fc.property(
        fc.array(recipientArb, { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (recipients, query) => {
          const filtered = filterRecipients(recipients, [], query);
          const normalizedQuery = query.toLowerCase().trim();

          if (!normalizedQuery) return; // Skip empty queries

          for (const item of filtered) {
            const matchesDisplayName = item.displayName.toLowerCase().includes(normalizedQuery);
            const matchesContactPerson = item.contactPerson.toLowerCase().includes(normalizedQuery);
            const matchesMembers = item.members.some(m => m.toLowerCase().includes(normalizedQuery));
            expect(matchesDisplayName || matchesContactPerson || matchesMembers).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('no valid match is excluded from the filtered result', () => {
    fc.assert(
      fc.property(
        fc.array(recipientArb, { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (recipients, query) => {
          const filtered = filterRecipients(recipients, [], query);
          const normalizedQuery = query.toLowerCase().trim();

          if (!normalizedQuery) return;

          // Every item in original that matches should be in filtered
          for (const item of recipients) {
            const matches =
              item.displayName.toLowerCase().includes(normalizedQuery) ||
              item.contactPerson.toLowerCase().includes(normalizedQuery) ||
              item.members.some(m => m.toLowerCase().includes(normalizedQuery));

            if (matches) {
              expect(filtered).toContainEqual(item);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('empty query returns full original list', () => {
    fc.assert(
      fc.property(
        fc.array(recipientArb, { maxLength: 50 }),
        fc.constantFrom('', '  ', '\t'),
        (recipients, query) => {
          const filtered = filterRecipients(recipients, [], query);
          expect(filtered).toEqual(recipients);
        }
      ),
      { numRuns: 50 }
    );
  });
});
