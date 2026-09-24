import {crossovers, drawdown, movingAverage, oscillate, randomWalk, trendLegs} from '../lib/series';

/**
 * Synthetic series for concept visuals. None of this is real market or fund data —
 * every chart using it carries the ILLUSTRATIVE · NOT REAL DATA tag.
 */

// S22–S23: 20/50 moving-average crossover example (the PDF's example rule; no results implied).
const MA_WARMUP = 50;
const maPrice = trendLegs('ma-price', [[40, 0.05], [45, 0.75], [40, -0.8], [45, 0.6], [40, -0.55], [30, 0.5]], 1.1);
const ma20Full = movingAverage(maPrice, 20);
const ma50Full = movingAverage(maPrice, 50);
export const maExample = {
	price: maPrice.slice(MA_WARMUP),
	ma20: ma20Full.slice(MA_WARMUP),
	ma50: ma50Full.slice(MA_WARMUP),
	crosses: crossovers(ma20Full, ma50Full, MA_WARMUP).map((c) => ({...c, index: c.index - MA_WARMUP})),
};

// S15: equity curve + underwater drawdown.
export const equityCurve = trendLegs('equity', [[30, 0.6], [18, -0.9], [30, 0.7], [14, -0.6], [28, 0.55]], 1.2, 100);
export const equityDrawdown = drawdown(equityCurve);

// S18: statistical arbitrage pair — spread widens then reverts.
const base = randomWalk('pair-base', 120, 0.05, 1.1, 100);
const bump = (i: number) => 9 * Math.exp(-((i - 72) ** 2) / (2 * 9 ** 2));
export const pairA = base.map((v, i) => v + 4 + bump(i) * 0.5);
export const pairB = base.map((v, i) => v - bump(i) * 0.5 + Math.sin(i / 5) * 0.4);
export const pairSpread = pairA.map((a, i) => a - pairB[i]);

// S19: trend legs.
export const trendSeries = trendLegs('trend', [[8, 0], [55, 0.8], [8, 0], [50, -0.85]], 0.9);

// S20: mean reversion with an overextension at the end, then two possible futures.
const osc = oscillate('mean', 90, 100, 5, 28, 0.9);
export const meanSeries = [...osc.slice(0, 80), ...Array.from({length: 10}, (_, k) => osc[80 + k] + k * 1.2)];
const last = meanSeries[meanSeries.length - 1];
export const meanRevertFuture = [...meanSeries, ...Array.from({length: 40}, (_, k) => last + (100 - last) * (1 - Math.exp(-k / 9)) + Math.sin(k / 3))];
export const meanTrendFuture = [...meanSeries, ...Array.from({length: 40}, (_, k) => last + k * 0.55 + Math.sin(k / 2.5) * 0.8)];

// S11 / S31: market impact — calm price, then a jump when a large order hits.
export const impactSeries = [...randomWalk('impact', 60, 0, 0.35, 100), ...Array.from({length: 40}, (_, k) => 100 + 7 * (1 - Math.exp(-k / 3)) + Math.sin(k) * 0.3)];

// S17: less-correlated series.
export const divA = randomWalk('div-a', 100, 0.12, 1.2, 100);
export const divB = randomWalk('div-b', 100, 0.05, 1.4, 92);
export const divC = randomWalk('div-c', 100, 0.08, 1.0, 84);

// S25: backtest vs live divergence.
export const backtestCurve = trendLegs('bt', [[100, 0.35]], 0.8, 100);
export const liveCurve = backtestCurve.map((v, i) => v - (i > 35 ? (i - 35) * 0.22 : 0) + Math.sin(i / 4) * 0.8);

// S26–S27: drawdown with a historical range band.
export const ddSeries = drawdown(trendLegs('dd', [[25, 0.5], [12, -0.8], [25, 0.6], [15, -0.7], [18, 0.4], [20, -0.75]], 0.9, 100));
