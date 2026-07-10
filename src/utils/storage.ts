import { Recipient, Prize } from '../types';

const RECIPIENTS_KEY = 'prizeflow_recipients';
const PRIZES_KEY = 'prizeflow_prizes';

export function getRecipients(): Recipient[] {
  const data = localStorage.getItem(RECIPIENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecipients(recipients: Recipient[]): void {
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
}

export function getPrizes(): Prize[] {
  const data = localStorage.getItem(PRIZES_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePrizes(prizes: Prize[]): void {
  localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes));
}

export function generateId(): string {
  return crypto.randomUUID();
}
