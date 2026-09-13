import { colors } from '../theme/colors';

export interface EconomicEvent {
  cc: string;
  name: string;
  when: string;
  tint: string;
  i1: string;
  i2: string;
  i3: string;
}

// Static editorial content ported 1:1 from the Claude Design prototype.
export const ECONOMIC_EVENTS: EconomicEvent[] = [
  { cc: 'US', name: 'Core CPI (MoM)', when: 'In 3 hours · 18:00 IST', tint: '#BFD4FF', i1: colors.accent, i2: colors.accent, i3: colors.accent },
  { cc: 'EU', name: 'ECB Rate Decision', when: 'Tomorrow · 17:15 IST', tint: '#FFD79A', i1: colors.accent, i2: colors.accent, i3: colors.whiteWash12 },
  { cc: 'IN', name: 'WPI Inflation', when: 'In 2 days', tint: '#9FE8C4', i1: colors.accent, i2: colors.whiteWash12, i3: colors.whiteWash12 },
];
