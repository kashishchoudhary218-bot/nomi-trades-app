import { Account, ClosedTrade, Position } from '../types';
import { findInstrument } from '../data/instruments';

// Pure derived-value helpers, ported 1:1 from the Claude Design prototype's
// instance methods (instr/price/pnl/posFor/openPl/marginFor).

/** Flat simulated margin requirement per lot, regardless of instrument. */
export const MARGIN_PER_LOT = 41200;

export function priceOf(px: Record<string, number>, sym: string): string {
  const i = findInstrument(sym);
  return px[sym].toFixed(i.dec);
}

export function changePct(px: Record<string, number>, sym: string): number {
  const i = findInstrument(sym);
  return ((px[sym] - i.p0) / i.p0) * 100;
}

export function pnlOfPosition(px: Record<string, number>, p: Position): number {
  const i = findInstrument(p.sym);
  return ((px[p.sym] - p.entry) * (p.side === 'Buy' ? 1 : -1) * p.lots * i.mult) / 100;
}

export function positionsForAccount(positions: Position[], accId: string): Position[] {
  return positions.filter((p) => p.acc === accId);
}

export function openPlForAccount(positions: Position[], px: Record<string, number>, accId: string): number {
  return positionsForAccount(positions, accId).reduce((t, p) => t + pnlOfPosition(px, p), 0);
}

export function marginForAccount(positions: Position[], accId: string): number {
  return positionsForAccount(positions, accId).reduce((t, p) => t + p.lots * MARGIN_PER_LOT, 0);
}

export function equityForAccount(account: Account, positions: Position[], px: Record<string, number>): number {
  return account.bal + openPlForAccount(positions, px, account.id);
}

export function freeMarginForAccount(account: Account, positions: Position[], px: Record<string, number>): number {
  return equityForAccount(account, positions, px) - marginForAccount(positions, account.id);
}

export function spreadFor(sym: string): number {
  return findInstrument(sym).p0 * 0.00006;
}

export function bidAsk(px: Record<string, number>, sym: string): { bid: number; ask: number } {
  const spread = spreadFor(sym);
  return { bid: px[sym] - spread, ask: px[sym] + spread };
}

export function closedForAccount(closed: ClosedTrade[], accId: string): ClosedTrade[] {
  return closed.filter((c) => c.acc === accId);
}
