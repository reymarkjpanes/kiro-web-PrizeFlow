import { useCallback } from 'react';
import { Button } from '@/shared/components';
import { useRBAC } from '@/shared/hooks';
import { serializeCsv, downloadCsv, TYPE_BADGE_CONFIG, formatCurrencyValue } from '@/shared/utils';
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

function formatDistributionStatus(status: string): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'distributed': return 'Distributed';
    case 'returned': return 'Returned';
    default: return status;
  }
}

function formatPrizeType(type: string): string {
  switch (type) {
    case 'cash': return 'Cash';
    case 'physical': return 'Physical';
    default: return type;
  }
}

function ExportButton({ filteredPrizes, activeTab }: ExportButtonProps) {
  const { isActionEnabled } = useRBAC();
  const canExport = isActionEnabled('Reports', 'Export');

  const handleExport = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const filename = `prizeflow-${activeTab}-${today}.csv`;

    // Financial columns appended after existing columns
    const financialColumns = ['Prize Value', 'Currency', 'Prize Type', 'Funding Source', 'Sponsor', 'Budget Category', 'Distribution Status'];

    let csvContent: string;

    if (activeTab === 'claimed') {
      const columns = ['Prize Name', 'Recipient Type', 'Recipient Name', 'Claim Date', ...financialColumns];
      const rows = filteredPrizes.map(prize => ({
        'Prize Name': prize.name,
        'Recipient Type': capitalizeType(prize.recipientType),
        'Recipient Name': prize.recipientName,
        'Claim Date': prize.claimDate ?? '',
        'Prize Value': prize.prizeValue != null ? formatCurrencyValue(prize.prizeValue, prize.currency) : '',
        'Currency': prize.currency,
        'Prize Type': formatPrizeType(prize.prizeType),
        'Funding Source': prize.fundingSource ?? '',
        'Sponsor': prize.sponsor ?? '',
        'Budget Category': prize.budgetCategory ?? '',
        'Distribution Status': formatDistributionStatus(prize.distributionStatus),
      }));
      csvContent = serializeCsv(rows, { columns });
    } else {
      const columns = ['Prize Name', 'Recipient Type', 'Recipient Name', ...financialColumns];
      const rows = filteredPrizes.map(prize => ({
        'Prize Name': prize.name,
        'Recipient Type': capitalizeType(prize.recipientType),
        'Recipient Name': prize.recipientName,
        'Prize Value': prize.prizeValue != null ? formatCurrencyValue(prize.prizeValue, prize.currency) : '',
        'Currency': prize.currency,
        'Prize Type': formatPrizeType(prize.prizeType),
        'Funding Source': prize.fundingSource ?? '',
        'Sponsor': prize.sponsor ?? '',
        'Budget Category': prize.budgetCategory ?? '',
        'Distribution Status': formatDistributionStatus(prize.distributionStatus),
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
      disabled={filteredPrizes.length === 0 || !canExport}
      aria-label={`Export ${activeTab} prizes as CSV`}
      aria-disabled={!canExport || undefined}
      title={!canExport ? 'Action unavailable for current role' : undefined}
    >
      Export CSV
    </Button>
  );
}

export { ExportButton };
