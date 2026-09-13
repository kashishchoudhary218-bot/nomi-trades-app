import { ClosedTrade, Position } from '../types';
import { findInstrument } from '../data/instruments';
import { colors } from '../theme/colors';
import { fmt } from './format';
import { pnlOfPosition, positionsForAccount } from './selectors';

export interface PositionRowVM {
  id: string;
  sym: string;
  mark: string;
  tint: string;
  tag: string;
  pnl: string;
  pnlColor: string;
  side: string;
  detail: string;
  now: string;
  sideColor: string;
  live: boolean;
}

// Ported 1:1 from the Claude Design prototype's accOpen/accClosed row builders.
export function openPositionRows(positions: Position[], px: Record<string, number>, accId: string, currency: string): PositionRowVM[] {
  return positionsForAccount(positions, accId).map((p) => {
    const g = pnlOfPosition(px, p);
    const i = findInstrument(p.sym);
    return {
      id: p.id,
      sym: p.sym,
      mark: i.mark,
      tint: i.tint,
      tag: p.tag,
      pnl: (g >= 0 ? '+' : '') + fmt(g) + ' ' + currency,
      pnlColor: g >= 0 ? colors.up : colors.down,
      side: p.side + ' ' + p.lots.toFixed(2) + ' lot',
      detail: 'at ' + p.entry.toFixed(i.dec),
      now: px[p.sym].toFixed(i.dec),
      sideColor: p.side === 'Buy' ? colors.blue : colors.downText,
      live: true,
    };
  });
}

export function closedPositionRows(closed: ClosedTrade[], accId: string, currency: string, limit = 12): PositionRowVM[] {
  return closed
    .filter((c) => c.acc === accId)
    .slice(0, limit)
    .map((c) => {
      const i = findInstrument(c.sym);
      return {
        id: c.id,
        sym: c.sym,
        mark: i.mark,
        tint: i.tint,
        tag: c.tag,
        pnl: (c.pnl >= 0 ? '+' : '') + fmt(c.pnl) + ' ' + currency,
        pnlColor: c.pnl >= 0 ? colors.up : colors.down,
        side: c.side + ' ' + c.lots.toFixed(2) + ' lot',
        detail: 'at ' + c.entry.toFixed(i.dec),
        now: c.exit.toFixed(i.dec),
        sideColor: c.side === 'Buy' ? colors.blue : colors.downText,
        live: false,
      };
    });
}
