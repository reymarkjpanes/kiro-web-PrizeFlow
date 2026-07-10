export interface Recipient {
  id: string;
  name: string;
  contact: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  recipientId: string | null;
  claimed: boolean;
  claimDate: string | null; // ISO 8601 format: YYYY-MM-DD
}

export type TabId = 'dashboard' | 'recipients' | 'prizes' | 'reports';
