import { useCallback } from 'react';
import { Button } from '@/shared/components';
import { serializeCsv, downloadCsv, TYPE_BADGE_CONFIG } from '@/shared/utils';
import type { EnrichedPrize } from '../hooks/useReportData';

export interface ExportButtonProps {
  filteredPrizes: EnrichedPrize[];
  activeTab: 'claimed' | 'unclaimed';
}

function capitalizeType(type: string): string {
  if (!type) return '';
  const config = TYPE_BADGE_CONFIG[type as keyof typeof TYPE_BADGE_CONFIG];
  return config ? config.label : type.charAt(0).toUpperCase() + type.slice(1);
}

function ExportButton({ filteredPrizes, activeTab }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const filename = `prizeflow-${activeTab}-${today}.csv`;

    let csvContent: string;

    if (activeTab === 'claimed') {
      const columns = ['Prize Name', 'Recipient Type', 'Recipient Name', 'Claim Date'];
      const rows = filteredPrizes.map(prize => ({
        'Prize Name': prize.name,
        'Recipient Type': capitalizeType(prize.recipientType),
        'Recipient Name': prize.recipientName,
        'Claim Date': prize.claimDate ?? '',
      }));
      csvContent = serializeCsv(rows, { columns });
    } else {
      const columns = ['Prize Name', 'Recipient Type', 'Recipient Name'];
      const rows = filteredPrizes.map(prize => ({
        'Prize Name': prize.name,
        'Recipient Type': capitalizeType(prize.recipientType),
        'Recipient Name': prize.recipientName,
      }));
      csvContent = serializeCsv(rows, { columns });
    }

    downloadCsv(filename, csvContent);
  }, [filteredPrizes, activeTab]);

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={handleExport}
      disabled={filteredPrizes.length === 0}
      aria-label={`Export ${activeTab} prizes as CSV`}
    >
      Export CSV
    </Button>
  );
}

export { ExportButton };
