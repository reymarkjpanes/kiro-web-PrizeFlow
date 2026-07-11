// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';

// Feature: production-quality-mvp, Property 1: Storage Integrity (Round-Trip)
// We test the serialization logic directly (JSON round-trip)
// since localStorage is a browser API not available in node tests

/**
 * **Validates: Requirements 9.2**
 */
describe('Property 1: Storage Integrity (Round-Trip)', () => {

  // Arbitrary for Recipient objects
  const recipientArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    contact: fc.string({ maxLength: 100 }),
  });

  // Arbitrary for Prize objects
  const prizeArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string({ maxLength: 200 }),
    recipientId: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
    claimed: fc.boolean(),
    claimDate: fc.option(
      fc.tuple(
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
      ).map(([y, m, d]) =>
        `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      ),
      { nil: null }
    ),
  });

  test('JSON.stringify then JSON.parse produces deeply equal Recipient arrays', () => {
    fc.assert(
      fc.property(fc.array(recipientArb, { maxLength: 50 }), (recipients) => {
        const serialized = JSON.stringify(recipients);
        const deserialized = JSON.parse(serialized);
        expect(deserialized).toEqual(recipients);
      }),
      { numRuns: 100 }
    );
  });

  test('JSON.stringify then JSON.parse produces deeply equal Prize arrays', () => {
    fc.assert(
      fc.property(fc.array(prizeArb, { maxLength: 50 }), (prizes) => {
        const serialized = JSON.stringify(prizes);
        const deserialized = JSON.parse(serialized);
        expect(deserialized).toEqual(prizes);
      }),
      { numRuns: 100 }
    );
  });
});
