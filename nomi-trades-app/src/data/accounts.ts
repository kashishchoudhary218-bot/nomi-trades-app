import { Account } from '../types';

// Ported 1:1 from the Claude Design prototype's ACCS seed data.
export const SEED_ACCOUNTS: Account[] = [
  { id: 'a1', label: 'NOMI ZERO', num: '40369642', type: 'Zero', mode: 'Real', bal: 271147.56, curr: 'INR', archived: false },
  { id: 'a2', label: 'NOMI PRO', num: '40412890', type: 'Pro', mode: 'Real', bal: 58420.14, curr: 'INR', archived: false },
  { id: 'a3', label: 'NOMI DEMO', num: '40501773', type: 'Standard', mode: 'Demo', bal: 1000000, curr: 'INR', archived: false },
  { id: 'a4', label: 'NOMI RAW', num: '40133905', type: 'Raw spread', mode: 'Demo', bal: 24880.9, curr: 'INR', archived: false },
  { id: 'a5', label: 'NOMI CENT', num: '39887120', type: 'Cent', mode: 'Real', bal: 1284.35, curr: 'INR', archived: true },
];
