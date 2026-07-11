// @vitest-environment node
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { serializeCsv, parseCsv } from '@/shared/utils/csv';

// Feature: production-quality-mvp, Property 2: CSV Round-Trip
// Feature: production-quality-mvp, Property 3: CSV Field Isolation

/**
 * **Validates: Requirements 10.10, 10.1, 10.2, 10.3, 10.8**
 */
describe('Property 2: CSV Round-Trip', () => {
  test('parseCsv(serializeCsv(fields)) produces identical field values', () => {
    // Use integer-based date generation to avoid Invalid Date edge cases
    const isoDateArb = fc.tuple(
      fc.integer({ min: 2020, max: 2030 }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 }), // Use 28 max to avoid month-length issues
    ).map(([y, m, d]) =>
      `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );

    fc.assert(
      fc.property(
        fc.record({
          'Prize Name': fc.string({ minLength: 1, maxLength: 100 }),
          'Recipient Name': fc.string({ minLength: 1, maxLength: 100 }),
          'Claim Date': isoDateArb,
        }),
        (fields) => {
          const columns = ['Prize Name', 'Recipient Name', 'Claim Date'];
          const serialized = serializeCsv([fields], { columns, bom: true, crlf: true });
          const parsed = parseCsv(serialized, { columns });

          expect(parsed).toHaveLength(1);
          expect(parsed[0]['Prize Name']).toBe(fields['Prize Name']);
          expect(parsed[0]['Recipient Name']).toBe(fields['Recipient Name']);
          expect(parsed[0]['Claim Date']).toBe(fields['Claim Date']);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('round-trip works without BOM and with LF line endings', () => {
    fc.assert(
      fc.property(
        fc.record({
          'Prize Name': fc.string({ minLength: 1, maxLength: 50 }),
          'Recipient Name': fc.string({ minLength: 1, maxLength: 50 }),
        }),
        (fields) => {
          const columns = ['Prize Name', 'Recipient Name'];
          const serialized = serializeCsv([fields], { columns, bom: false, crlf: false });
          const parsed = parseCsv(serialized, { columns });

          expect(parsed).toHaveLength(1);
          expect(parsed[0]['Prize Name']).toBe(fields['Prize Name']);
          expect(parsed[0]['Recipient Name']).toBe(fields['Recipient Name']);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 10.1, 10.2, 10.3**
 */
describe('Property 3: CSV Field Isolation', () => {
  test('adjacent fields with special characters do not corrupt each other', () => {
    // Generate strings that include dangerous CSV characters
    const specialChars = [',', '"', '\n', '\r', '\r\n', '""', '","'];
    const dangerousStringArb = fc
      .array(
        fc.oneof(
          fc.string({ minLength: 0, maxLength: 5 }),
          fc.constantFrom(...specialChars),
        ),
        { minLength: 1, maxLength: 8 }
      )
      .map(parts => parts.join(''))
      .filter(s => s.length > 0 && s.length <= 50);

    fc.assert(
      fc.property(
        dangerousStringArb,
        dangerousStringArb,
        (field1, field2) => {
          const columns = ['col1', 'col2'];
          const row = { col1: field1, col2: field2 };

          const serialized = serializeCsv([row], { columns, bom: false, crlf: true });
          const parsed = parseCsv(serialized, { columns });

          expect(parsed).toHaveLength(1);
          expect(parsed[0]['col1']).toBe(field1);
          expect(parsed[0]['col2']).toBe(field2);
        }
      ),
      { numRuns: 200 }  // More runs for this critical property
    );
  });

  test('multiple rows with special characters maintain isolation', () => {
    const fieldArb = fc.oneof(
      fc.string({ minLength: 0, maxLength: 20 }),
      fc.constant('hello, world'),
      fc.constant('she said "hi"'),
      fc.constant('line1\nline2'),
      fc.constant('a "b", c'),
    );

    fc.assert(
      fc.property(
        fc.array(
          fc.record({ col1: fieldArb, col2: fieldArb }),
          { minLength: 1, maxLength: 10 }
        ),
        (rows) => {
          const columns = ['col1', 'col2'];
          const serialized = serializeCsv(rows, { columns, bom: true, crlf: true });
          const parsed = parseCsv(serialized, { columns });

          expect(parsed).toHaveLength(rows.length);
          for (let i = 0; i < rows.length; i++) {
            expect(parsed[i]['col1']).toBe(rows[i]['col1']);
            expect(parsed[i]['col2']).toBe(rows[i]['col2']);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
