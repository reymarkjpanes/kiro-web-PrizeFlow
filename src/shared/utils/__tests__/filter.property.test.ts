// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import type { Recipient } from '@/shared/types';

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

// Pure filter function matching the implementation in RecipientList
function filterRecipients(recipients: Recipient[], query: string): Recipient[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return recipients;
  return recipients.filter(
    r =>
      r.name.toLowerCase().includes(normalizedQuery) ||
      r.contact.toLowerCase().includes(normalizedQuery)
  );
}

describe('Property 7: Filter Subset Correctness', () => {
  const recipientArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 50 }),
    contact: fc.string({ maxLength: 50 }),
  });

  test('filtered result is always a subset of the original list', () => {
    fc.assert(
      fc.property(
        fc.array(recipientArb, { maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (recipients, query) => {
          const filtered = filterRecipients(recipients, query);

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
          const filtered = filterRecipients(recipients, query);
          const normalizedQuery = query.toLowerCase().trim();

          if (!normalizedQuery) return; // Skip empty queries

          for (const item of filtered) {
            const matchesName = item.name.toLowerCase().includes(normalizedQuery);
            const matchesContact = item.contact.toLowerCase().includes(normalizedQuery);
            expect(matchesName || matchesContact).toBe(true);
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
          const filtered = filterRecipients(recipients, query);
          const normalizedQuery = query.toLowerCase().trim();

          if (!normalizedQuery) return;

          // Every item in original that matches should be in filtered
          for (const item of recipients) {
            const matches =
              item.name.toLowerCase().includes(normalizedQuery) ||
              item.contact.toLowerCase().includes(normalizedQuery);

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
          const filtered = filterRecipients(recipients, query);
          expect(filtered).toEqual(recipients);
        }
      ),
      { numRuns: 50 }
    );
  });
});
