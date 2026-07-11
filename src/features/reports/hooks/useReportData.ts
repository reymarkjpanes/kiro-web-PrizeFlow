import { useMemo } from 'react';
import type { Prize, Recipient } from '@/shared/types';

export interface EnrichedPrize extends Prize {
  recipientName: string;
}

export interface UseReportDataReturn {
  claimedPrizes: EnrichedPrize[];
  unclaimedPrizes: EnrichedPrize[];
  filteredClaimed: EnrichedPrize[];
  filteredUnclaimed: EnrichedPrize[];
}

/**
 * Processes prizes and recipients into report-ready data.
 * Enriches prizes with recipient names and provides filtered views.
 */
export function useReportData(
  prizes: Prize[],
  recipients: Recipient[],
  search?: string
): UseReportDataReturn {
  const recipientMap = useMemo(() => {
    const map = new Map<string, string>();
    recipients.forEach(r => map.set(r.id, r.name));
    return map;
  }, [recipients]);

  const { claimedPrizes, unclaimedPrizes } = useMemo(() => {
    const claimed: EnrichedPrize[] = [];
    const unclaimed: EnrichedPrize[] = [];

    prizes.forEach(prize => {
      const enriched: EnrichedPrize = {
        ...prize,
        recipientName: prize.recipientId ? recipientMap.get(prize.recipientId) ?? '' : '',
      };

      if (prize.claimed) {
        claimed.push(enriched);
      } else {
        unclaimed.push(enriched);
      }
    });

    return { claimedPrizes: claimed, unclaimedPrizes: unclaimed };
  }, [prizes, recipientMap]);

  const filteredClaimed = useMemo(() => {
    const query = (search ?? '').toLowerCase().trim();
    if (!query) return claimedPrizes;
    return claimedPrizes.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.recipientName.toLowerCase().includes(query)
    );
  }, [claimedPrizes, search]);

  const filteredUnclaimed = useMemo(() => {
    const query = (search ?? '').toLowerCase().trim();
    if (!query) return unclaimedPrizes;
    return unclaimedPrizes.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.recipientName.toLowerCase().includes(query)
    );
  }, [unclaimedPrizes, search]);

  return { claimedPrizes, unclaimedPrizes, filteredClaimed, filteredUnclaimed };
}
