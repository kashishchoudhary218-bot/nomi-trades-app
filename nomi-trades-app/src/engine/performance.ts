import { Account, ClosedTrade, PerfPeriod, PerfTab, Position } from '../types';
import { colors } from '../theme/colors';
import { fmt, fmt0 } from './format';
import { equityForAccount, openPlForAccount } from './selectors';
import { series } from './math';

const PERIOD_DAYS: Record<PerfPeriod, number> = {
  '7 days': 7,
  '30 days': 30,
  '90 days': 90,
  '365 days': 365,
};

export interface SummaryCard {
  label: string;
  value: string;
  note: string;
  color: string;
}

export interface SummaryRow {
  label: string;
  value: string;
  color: string;
}

export interface WinRate {
  sym: string;
  pct: string;
  color: string;
}

export interface ChartBar {
  x: string;
  y: string;
  w: number;
  h: string;
  fill: string;
}

export interface PerformanceResult {
  chartLabel: string;
  chartValue: string;
  chartColor: string;
  chartFill: string;
  chartSub: string;
  chartIsBars: boolean;
  chartIsLine: boolean;
  chartBars: ChartBar[];
  chartLine: string;
  chartArea: string;
  summaryCards: SummaryCard[];
  summaryRows: SummaryRow[];
  winRates: WinRate[];
}

// Ported 1:1 from the Claude Design prototype's renderVals() performance block.
export function computePerformance(
  account: Account,
  positions: Position[],
  closed: ClosedTrade[],
  perfTab: PerfTab,
  perfPeriod: PerfPeriod,
  px: Record<string, number>
): PerformanceResult {
  const curr = account.curr;
  const openPl = openPlForAccount(positions, px, account.id);
  const equity = equityForAccount(account, positions, px);

  const periodDays = PERIOD_DAYS[perfPeriod] ?? 365;
  const cutoff = Date.now() - periodDays * 86400000;
  const hist = closed
    .filter((c) => c.acc === account.id && c.ts >= cutoff)
    .slice()
    .sort((a, b) => a.ts - b.ts);
  const wins = hist.filter((c) => c.pnl > 0);
  const losses = hist.filter((c) => c.pnl <= 0);
  const gross = hist.reduce((t, c) => t + c.pnl, 0);
  const profitSum = wins.reduce((t, c) => t + c.pnl, 0);
  const lossSum = losses.reduce((t, c) => t + c.pnl, 0);
  const costs = hist.reduce((t, c) => t + (c.cost || 0), 0);
  const vol = hist.reduce((t, c) => t + c.lots, 0);
  const lifetime = closed.filter((c) => c.acc === account.id).reduce((t, c) => t + c.pnl, 0);

  const buckets = 12;
  const bStart = cutoff;
  const bSpan = (Date.now() - cutoff) / buckets;
  const bucketed = (fn: (c: ClosedTrade) => number) => {
    const out = new Array(buckets).fill(0);
    hist.forEach((c) => {
      const k = Math.min(buckets - 1, Math.max(0, Math.floor((c.ts - bStart) / bSpan)));
      out[k] += fn(c);
    });
    return out;
  };
  const netB = bucketed((c) => c.pnl);
  const ordB = bucketed(() => 1);
  const volB = bucketed((c) => c.lots);
  let run = 0;
  const cum = netB.map((v) => (run += v));
  const eqSeries = cum.map((v) => account.bal - gross + v);

  const isBars = perfTab === 'Closed Orders' || perfTab === 'Trading Volume';
  const barVals = perfTab === 'Closed Orders' ? ordB : volB;
  const barMax = Math.max(...barVals, 1);
  const chartBars: ChartBar[] = barVals.map((v, i) => {
    const h = Math.max(2, (v / barMax) * 100);
    return {
      x: (8 + i * 26).toFixed(1),
      y: (112 - h).toFixed(1),
      w: 17,
      h: h.toFixed(1),
      fill: i === buckets - 1 ? colors.accent : 'rgba(200,255,77,.35)',
    };
  });
  const lineVals = perfTab === 'Equity' ? eqSeries : cum;
  const lineColor = perfTab === 'Equity' ? colors.accent : gross >= 0 ? colors.up : colors.down;
  const ls = series(lineVals.length > 1 ? lineVals : [0, 0], 320, 130);

  const chartValue =
    perfTab === 'Net Profit'
      ? (gross >= 0 ? '+' : '') + fmt0(gross) + ' ' + curr
      : perfTab === 'Closed Orders'
        ? String(hist.length)
        : perfTab === 'Trading Volume'
          ? vol.toFixed(2) + ' lots'
          : fmt0(equity) + ' ' + curr;

  const summaryCards: SummaryCard[] = [
    { label: 'NET PROFIT', value: (gross >= 0 ? '+' : '') + fmt0(gross), note: periodDays + ' day window', color: gross >= 0 ? colors.up : colors.down },
    { label: 'CLOSED ORDERS', value: String(hist.length), note: wins.length + ' profitable', color: '#fff' },
    { label: 'TRADING VOLUME', value: vol.toFixed(2), note: 'lots traded', color: '#fff' },
    { label: 'EQUITY', value: fmt0(equity), note: 'balance + open P/L', color: '#fff' },
  ];

  const summaryRows: SummaryRow[] = [
    { label: 'Profit', value: '+' + fmt(profitSum) + ' ' + curr, color: colors.up },
    { label: 'Loss', value: fmt(lossSum) + ' ' + curr, color: colors.down },
    { label: 'Profitable trades', value: wins.length + ' · ' + (hist.length ? Math.round((wins.length / hist.length) * 100) : 0) + '%', color: colors.textHigh },
    { label: 'Unprofitable trades', value: losses.length + ' · ' + (hist.length ? Math.round((losses.length / hist.length) * 100) : 0) + '%', color: colors.textHigh },
    { label: 'Trading costs', value: '-' + fmt(costs) + ' ' + curr, color: colors.textHigh },
    { label: 'Unrealised P/L', value: (openPl >= 0 ? '+' : '') + fmt(openPl) + ' ' + curr, color: openPl >= 0 ? colors.up : colors.down },
    { label: 'Current P/L', value: (gross + openPl >= 0 ? '+' : '') + fmt(gross + openPl) + ' ' + curr, color: gross + openPl >= 0 ? colors.up : colors.down },
    { label: 'Lifetime P/L', value: (lifetime >= 0 ? '+' : '') + fmt(lifetime) + ' ' + curr, color: lifetime >= 0 ? colors.up : colors.down },
  ];

  const wr: Record<string, { w: number; n: number }> = {};
  closed
    .filter((c) => c.acc === account.id)
    .forEach((c) => {
      wr[c.sym] = wr[c.sym] || { w: 0, n: 0 };
      wr[c.sym].n++;
      if (c.pnl > 0) wr[c.sym].w++;
    });
  const winRates: WinRate[] = Object.keys(wr)
    .slice(0, 5)
    .map((k) => {
      const p = Math.round((wr[k].w / wr[k].n) * 100);
      return { sym: k, pct: p + '%', color: p >= 60 ? colors.up : p >= 45 ? colors.accent : colors.down };
    });

  return {
    chartLabel: perfTab.toUpperCase() + ' · LAST ' + perfPeriod.toUpperCase(),
    chartValue,
    chartColor: lineColor,
    chartFill: perfTab === 'Equity' ? 'rgba(200,255,77,.12)' : gross >= 0 ? 'rgba(53,209,154,.13)' : 'rgba(255,95,86,.12)',
    chartSub: account.label + ' · #' + account.num,
    chartIsBars: isBars,
    chartIsLine: !isBars,
    chartBars,
    chartLine: ls.line,
    chartArea: ls.area,
    summaryCards,
    summaryRows,
    winRates,
  };
}
