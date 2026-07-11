import { useMemo } from 'react';
import type { Recipient, Prize } from '@/shared/types';

export interface DashboardStats {
  totalRecipients: number;
  totalPrizes: number;
  claimedCount: number;
  unclaimedCount: number;
  claimRate: number;
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

    return { totalRecipients, totalPrizes, claimedCount, unclaimedCount, claimRate };
  }, [recipients, prizes]);
}
