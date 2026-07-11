import type { Recipient, RecipientType, Prize } from '@/shared/types';

/**
 * Parses bulk member input (comma or newline separated) into trimmed names.
 */
export function parseBulkMembers(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
}

/**
 * Groups recipients by their type. Only includes types with ≥1 recipient.
 */
export function groupRecipientsByType(recipients: Recipient[]): Map<RecipientType, Recipient[]> {
  const groups = new Map<RecipientType, Recipient[]>();
  for (const recipient of recipients) {
    const existing = groups.get(recipient.type) || [];
    existing.push(recipient);
    groups.set(recipient.type, existing);
  }
  return groups;
}

/**
 * Filters recipients by selected types and/or text search query.
 */
export function filterRecipients(
  recipients: Recipient[],
  selectedTypes: RecipientType[],
  searchQuery: string
): Recipient[] {
  let results = recipients;

  // Type filter (empty selectedTypes = no filter = show all)
  if (selectedTypes.length > 0) {
    results = results.filter(r => selectedTypes.includes(r.type));
  }

  // Text search (case-insensitive)
  const query = searchQuery.toLowerCase().trim();
  if (query) {
    results = results.filter(r =>
      r.displayName.toLowerCase().includes(query) ||
      r.contactPerson.toLowerCase().includes(query) ||
      r.members.some(m => m.toLowerCase().includes(query))
    );
  }

  return results;
}

/**
 * Computes type breakdown for dashboard display.
 */
export function computeTypeBreakdown(recipients: Recipient[]): { type: RecipientType; count: number }[] {
  const counts = new Map<RecipientType, number>();
  for (const r of recipients) {
    counts.set(r.type, (counts.get(r.type) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([type, count]) => ({ type, count }))
    .filter(entry => entry.count > 0);
}

/**
 * Computes quick stats for a single recipient.
 */
export function computeQuickStats(recipientId: string, prizes: Prize[]): { assigned: number; claimed: number } {
  const assigned = prizes.filter(p => p.recipientId === recipientId);
  return {
    assigned: assigned.length,
    claimed: assigned.filter(p => p.claimed).length,
  };
}

/**
 * Formats quick stats for display.
 */
export function formatQuickStat(assigned: number, claimed: number): string {
  if (assigned === 0) return 'No prizes';
  return `${claimed} / ${assigned} claimed`;
}

/**
 * Creates a duplicate of a recipient (without id — caller generates fresh id).
 */
export function duplicateRecipient(original: Recipient): Omit<Recipient, 'id'> {
  return {
    type: original.type,
    displayName: `${original.displayName} (Copy)`,
    contactPerson: original.contactPerson,
    contactInfo: original.contactInfo,
    members: [...original.members],
    memberCount: original.memberCount,
    notes: original.notes,
    customLabel: original.customLabel,
  };
}
