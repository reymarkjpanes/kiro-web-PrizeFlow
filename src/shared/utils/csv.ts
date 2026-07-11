/**
 * CSV Serializer — RFC 4180 compliant with BOM and CRLF support.
 * Pure functions separated from download side effect.
 */

export interface CsvOptions {
  columns: string[];
  bom?: boolean;
  crlf?: boolean;
}

const BOM = '\uFEFF';
const CRLF = '\r\n';
const LF = '\n';

/**
 * Escape a single field value per RFC 4180.
 * - Wraps in double quotes if contains comma, double quote, or newline
 * - Doubles any internal double quotes
 */
function escapeField(value: string): string {
  if (value === '') return value;

  const needsQuoting = value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r');

  if (!needsQuoting) return value;

  // Double any existing double quotes, then wrap in double quotes
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Serialize an array of row objects into a CSV string.
 * Pure function — no DOM side effects.
 *
 * @param rows - Array of objects with string values
 * @param options - Column order, BOM prefix, line terminator
 * @returns CSV string ready for download
 */
export function serializeCsv(
  rows: Record<string, string>[],
  options: CsvOptions
): string {
  const { columns, bom = true, crlf = true } = options;
  const lineTerminator = crlf ? CRLF : LF;

  // Header row (apply same escaping rules to headers)
  const headerRow = columns.map(escapeField).join(',');

  // Data rows
  const dataRows = rows.map(row =>
    columns.map(col => escapeField(row[col] ?? '')).join(',')
  );

  // Combine
  const csvContent = [headerRow, ...dataRows].join(lineTerminator);

  // Add trailing line terminator
  const finalContent = csvContent + lineTerminator;

  return bom ? BOM + finalContent : finalContent;
}

/**
 * Parse a CSV string back into row objects.
 * Pure function — handles BOM, CRLF, quoted fields.
 *
 * @param csv - CSV string to parse
 * @param options - Expected column names
 * @returns Array of row objects
 */
export function parseCsv(
  csv: string,
  options: { columns: string[] }
): Record<string, string>[] {
  const { columns } = options;

  // Strip BOM if present
  const content = csv.startsWith(BOM) ? csv.slice(1) : csv;

  // Parse rows respecting quoted fields
  const rows = parseRows(content);

  // Skip header row, map remaining to objects
  return rows.slice(1).filter(row => row.length > 0 && row.some(f => f !== '')).map(fields => {
    const obj: Record<string, string> = {};
    columns.forEach((col, i) => {
      obj[col] = fields[i] ?? '';
    });
    return obj;
  });
}

/**
 * Parse CSV content into a 2D array of fields, handling quoted fields correctly.
 */
function parseRows(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote (doubled)
        if (i + 1 < content.length && content[i + 1] === '"') {
          currentField += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        currentField += char;
        i++;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
      } else if (char === '\r') {
        // Handle CRLF or standalone CR
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
        if (i < content.length && content[i] === '\n') {
          i++; // Skip \n after \r
        }
      } else if (char === '\n') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else {
        currentField += char;
        i++;
      }
    }
  }

  // Handle last field/row
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Trigger a CSV file download in the browser.
 * Side-effect function — separated from pure serialization.
 */
export function downloadCsv(filename: string, content: string): void {
  try {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('[CSV] Download failed:', e);
  }
}
