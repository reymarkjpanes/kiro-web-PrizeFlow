import { Table, EmptyState } from '@/shared/components';
import { TYPE_BADGE_CONFIG } from '@/shared/utils';
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
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export { ReportTable };
