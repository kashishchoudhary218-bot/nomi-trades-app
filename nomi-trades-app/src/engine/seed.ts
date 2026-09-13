import { ClosedTrade, Position } from '../types';
import { findInstrument } from '../data/instruments';

// Ported 1:1 from the Claude Design prototype's seedPositions()/seedClosed().

export function seedPositions(): Position[] {
  const d = Date.now();
  return [
    { id: 'p1', acc: 'a1', sym: 'XAU/USD', side: 'Buy', lots: 0.3, entry: 4318.2, ts: d - 5400000, tag: 'MARKET' },
    { id: 'p2', acc: 'a1', sym: 'BTC/USD', side: 'Sell', lots: 0.05, entry: 77940.0, ts: d - 9600000, tag: 'TP/SL' },
    { id: 'p3', acc: 'a1', sym: 'USOIL', side: 'Buy', lots: 1.0, entry: 99.412, ts: d - 172800000, tag: 'MARKET' },
    { id: 'p4', acc: 'a3', sym: 'NAS100', side: 'Buy', lots: 0.5, entry: 29180.4, ts: d - 43200000, tag: 'MARKET' },
    { id: 'p5', acc: 'a2', sym: 'EUR/USD', side: 'Sell', lots: 0.2, entry: 1.1624, ts: d - 21600000, tag: 'MARKET' },
  ];
}

export function seedClosed(): ClosedTrade[] {
  const out: ClosedTrade[] = [];
  let s = 7717;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const day = 86400000;
  const now = Date.now();
  const pool = ['XAU/USD', 'BTC/USD', 'EUR/USD', 'NAS100', 'USOIL', 'XAG/USD', 'ETH/USD'];
  for (let i = 0; i < 96; i++) {
    const sym = pool[Math.floor(rnd() * pool.length)];
    const win = rnd() < 0.6;
    const mag = 900 + rnd() * 11000;
    const acc = rnd() < 0.62 ? 'a1' : rnd() < 0.6 ? 'a3' : 'a2';
    const p0 = findInstrument(sym).p0;
    out.push({
      id: 'c' + i,
      acc,
      sym,
      side: rnd() < 0.55 ? 'Buy' : 'Sell',
      lots: +(0.05 + rnd() * 1.2).toFixed(2),
      entry: p0 * (0.98 + rnd() * 0.04),
      exit: p0 * (0.98 + rnd() * 0.04),
      pnl: win ? mag : -mag * 0.82,
      cost: 60 + rnd() * 340,
      ts: now - Math.floor(rnd() * 360 * day),
      tag: win ? 'TP HIT' : rnd() < 0.5 ? 'SL HIT' : 'MANUAL',
    });
  }
  return out.sort((a, b) => b.ts - a.ts);
}
