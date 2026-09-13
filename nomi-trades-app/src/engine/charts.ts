import { findInstrument } from '../data/instruments';
import { colors } from '../theme/colors';
import { changePct } from './selectors';
import { Candle, candles as genCandles, curve, spark } from './math';
import { Timeframe } from '../types';

export interface TerminalCandle {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  hy: number;
  ly: number;
  color: string;
}

export interface TerminalChartData {
  candles: TerminalCandle[];
  gridLines: { y: number }[];
  priceAxis: { y: number; label: string }[];
  emaPath: string;
  lastY: number;
  spread: number;
}

const CH = 210;
const CW = 326;
const PAD = 12;

// Ported 1:1 from the Claude Design prototype's terminal chart block in renderVals().
export function terminalChartData(sym: string, tf: Timeframe, px: Record<string, number>): TerminalChartData {
  const inst = findInstrument(sym);
  const kd: Candle[] = genCandles(sym, tf, inst.p0, px[sym]);
  const lo = Math.min(...kd.map((k) => k.l));
  const hi = Math.max(...kd.map((k) => k.h));
  const span = hi - lo || 1;
  const yOf = (v: number) => PAD + (1 - (v - lo) / span) * (CH - PAD * 2);
  const step = (CW - 30) / kd.length;

  const candles: TerminalCandle[] = kd.map((k, i) => {
    const up = k.c >= k.o;
    const x = 6 + i * step;
    const w = Math.max(2.5, step * 0.62);
    const yTop = yOf(Math.max(k.o, k.c));
    const yBot = yOf(Math.min(k.o, k.c));
    return {
      x,
      w,
      y: yTop,
      h: Math.max(1.2, yBot - yTop),
      cx: x + w / 2,
      hy: yOf(k.h),
      ly: yOf(k.l),
      color: up ? colors.up : colors.down,
    };
  });

  let emaPrev = kd[0].c;
  const emaPts = kd.map((k, i): [number, number] => {
    emaPrev = i === 0 ? k.c : k.c * 0.2 + emaPrev * 0.8;
    return [6 + i * step + step * 0.3, yOf(emaPrev)];
  });
  const emaPath = 'M' + emaPts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

  const priceAxis = [0, 1, 2, 3].map((i) => {
    const v = hi - (span / 3) * i;
    return { y: yOf(v) + 3, label: v.toFixed(inst.dec) };
  });
  const gridLines = [0, 1, 2, 3].map((i) => ({ y: PAD + (i * (CH - PAD * 2)) / 3 }));

  return { candles, gridLines, priceAxis, emaPath, lastY: yOf(px[sym]), spread: inst.p0 * 0.00006 };
}

export interface AreaLine {
  line: string;
  area: string;
}

/** Instrument-detail-sheet chart — the prototype seeds every symbol's curve identically. */
export function detailChartData(sym: string, px: Record<string, number>): AreaLine {
  const up = changePct(px, sym) >= 0;
  return curve(3311, 320, 170, up, 0.45);
}

export function instrumentSparkPath(index: number, sym: string, px: Record<string, number>): { path: string; stroke: string } {
  const up = changePct(px, sym) >= 0;
  return { path: spark(index * 977 + 131, up), stroke: up ? colors.up : colors.down };
}

export function moverSparkPath(index: number, sym: string, px: Record<string, number>): { path: string; stroke: string } {
  const up = changePct(px, sym) >= 0;
  return { path: spark(index * 613 + 77, up), stroke: up ? colors.up : colors.down };
}

export interface DeskSignal {
  sym: string;
  tf: string;
  head: string;
  bias: string;
  up: boolean;
  time: string;
  line: string;
  band: string;
  bandFill: string;
  stroke: string;
  pillBg: string;
  tpY: number;
  slY: number;
}

/** Static desk-signal content from the prototype, with generated band/line paths. */
export function deskSignals(): DeskSignal[] {
  const raw = [
    { sym: 'Gold / Dollar', tf: '30 MIN', head: 'XAU: breakout retest holding above 4,340', bias: '↑ Intraday long', up: true, time: '11:15 AM' },
    { sym: 'Ethereum / Dollar', tf: '30 MIN', head: 'ETH: momentum fading into resistance', bias: '↓ Intraday short', up: false, time: '10:40 AM' },
  ];
  return raw.map((s, k) => {
    const c = curve(k * 431 + 29, 260, 106, s.up, 0.5);
    return {
      ...s,
      line: c.line,
      band: c.area,
      bandFill: s.up ? 'rgba(53,209,154,.09)' : 'rgba(255,95,86,.09)',
      stroke: s.up ? colors.up : colors.down,
      pillBg: s.up ? colors.upSofter : colors.downSoftest,
      tpY: s.up ? 22 : 84,
      slY: s.up ? 88 : 20,
    };
  });
}
