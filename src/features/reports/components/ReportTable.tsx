import { Table, EmptyState } from '@/shared/components';
import { TYPE_BADGE_CONFIG, formatCurrencyValue } from '@/shared/utils';
import type { EnrichedPrize } from '../hooks/useReportData';

export interface ReportTableProps {
  filteredPrizes: EnrichedPrize[];
  activeTab: 'claimed' | 'unclaimed';
}

function capitalizeType(type: string): string {
  if (!type) return '—';
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

function ReportTable({ filteredPrizes, activeTab }: ReportTableProps) {
  if (filteredPrizes.length === 0) {
    const emptyMessage =
      activeTab === 'claimed'
        ? { heading: 'No claimed prizes', description: 'Prizes will appear here once they are claimed.' }
        : { heading: 'No unclaimed prizes', description: 'All prizes have been claimed.' };

    return (
      <EmptyState
        heading={emptyMessage.heading}
        description={emptyMessage.description}
      />
    );
  }

  return (
    <Table aria-label={`${activeTab === 'claimed' ? 'Claimed' : 'Unclaimed'} prizes report`}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Prize Name</Table.HeaderCell>
          <Table.HeaderCell>Recipient Type</Table.HeaderCell>
          <Table.HeaderCell>Recipient</Table.HeaderCell>
          {activeTab === 'claimed' && (
            <Table.HeaderCell>Claim Date</Table.HeaderCell>
          )}
          <Table.HeaderCell>Prize Value</Table.HeaderCell>
          <Table.HeaderCell>Currency</Table.HeaderCell>
          <Table.HeaderCell>Prize Type</Table.HeaderCell>
          <Table.HeaderCell>Funding Source</Table.HeaderCell>
          <Table.HeaderCell>Sponsor</Table.HeaderCell>
          <Table.HeaderCell>Budget Category</Table.HeaderCell>
          <Table.HeaderCell>Distribution Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {filteredPrizes.map(prize => (
          <Table.Row key={prize.id}>
            <Table.Cell className="font-medium text-neutral-900">
              {prize.name}
            </Table.Cell>
            <Table.Cell>
              {capitalizeType(prize.recipientType)}
            </Table.Cell>
            <Table.Cell>
              {prize.recipientName || 'Unassigned'}
            </Table.Cell>
            {activeTab === 'claimed' && (
              <Table.Cell>{prize.claimDate ?? '—'}</Table.Cell>
            )}
            <Table.Cell>
              {prize.prizeValue != null ? formatCurrencyValue(prize.prizeValue, prize.currency) : ''}
            </Table.Cell>
            <Table.Cell>{prize.currency}</Table.Cell>
            <Table.Cell>{formatPrizeType(prize.prizeType)}</Table.Cell>
            <Table.Cell>{prize.fundingSource ?? ''}</Table.Cell>
            <Table.Cell>{prize.sponsor ?? ''}</Table.Cell>
            <Table.Cell>{prize.budgetCategory ?? ''}</Table.Cell>
            <Table.Cell>{formatDistributionStatus(prize.distributionStatus)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export { ReportTable };
