import { useMemo } from 'react';
import type { Recipient, Prize, RecipientType } from '@/shared/types';
import { computeTypeBreakdown } from '@/shared/utils';

export interface DashboardStats {
  totalRecipients: number;
  totalPrizes: number;
  claimedCount: number;
  unclaimedCount: number;
  claimRate: number;
  typeBreakdown: { type: RecipientType; count: number }[];
}

/**
 * Computes memoized dashboard statistics from recipients and prizes arrays.
 */
export function useDashboardStats(recipients: Recipient[], prizes: Prize[]): DashboardStats {
  return useMemo(() => {
    const totalRecipients = recipients.length;
    const totalPrizes = prizes.length;
    const claimedCount = prizes.filter(p => p.claimed).length;
    const unclaimedCount = totalPrizes - claimedCount;
    const claimRate = totalPrizes > 0 ? (claimedCount / totalPrizes) * 100 : 0;
    const typeBreakdown = computeTypeBreakdown(recipients);

    return { totalRecipients, totalPrizes, claimedCount, unclaimedCount, claimRate, typeBreakdown };
  }, [recipients, prizes]);
}
