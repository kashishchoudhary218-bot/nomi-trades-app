import { Instrument } from '../types';

// Ported 1:1 from the Claude Design prototype's INSTR catalog.
export const INSTRUMENTS: Instrument[] = [
  { sym: 'XAU/USD', desc: 'Gold vs US Dollar', mark: 'AU', tint: '#F0C75E', cat: 'Metals', p0: 4349.407, dec: 3, mult: 8800 },
  { sym: 'BTC/USD', desc: 'Bitcoin vs US Dollar', mark: 'BT', tint: '#F7931A', cat: 'Crypto', p0: 77391.53, dec: 2, mult: 88 },
  { sym: 'EUR/USD', desc: 'Euro vs US Dollar', mark: 'EU', tint: '#7FA8FF', cat: 'Majors', p0: 1.15981, dec: 5, mult: 8800000 },
  { sym: 'USOIL', desc: 'Crude Oil WTI', mark: 'OI', tint: '#C9CED6', cat: 'Energies', p0: 96.574, dec: 3, mult: 88000 },
  { sym: 'ETH/USD', desc: 'Ethereum vs US Dollar', mark: 'ET', tint: '#A9B4F5', cat: 'Crypto', p0: 2535.37, dec: 2, mult: 880 },
  { sym: 'USD/JPY', desc: 'US Dollar vs Japanese Yen', mark: 'JP', tint: '#FF9C9C', cat: 'Majors', p0: 153.516, dec: 3, mult: 57500 },
  { sym: 'XAG/USD', desc: 'Silver vs US Dollar', mark: 'AG', tint: '#D8DEE8', cat: 'Metals', p0: 64.491, dec: 3, mult: 44000 },
  { sym: 'NAS100', desc: 'US Tech 100 Index', mark: 'NQ', tint: '#8FE3C6', cat: 'Indices', p0: 29401.25, dec: 2, mult: 880 },
  { sym: 'GBP/USD', desc: 'Pound vs US Dollar', mark: 'GB', tint: '#9FB6FF', cat: 'Majors', p0: 1.32418, dec: 5, mult: 8800000 },
  { sym: 'NATGAS', desc: 'Natural Gas', mark: 'NG', tint: '#BFE0FF', cat: 'Energies', p0: 3.482, dec: 3, mult: 88000 },
];

export function findInstrument(sym: string): Instrument {
  return INSTRUMENTS.find((i) => i.sym === sym) ?? INSTRUMENTS[0];
}

export const MARKET_CATEGORIES = ['Favourites', 'Majors', 'Metals', 'Crypto', 'Indices', 'Energies'] as const;
