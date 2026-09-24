import {random} from 'remotion';

/**
 * Deterministic, synthetic series for ILLUSTRATIVE charts only.
 * None of these represent real market or fund data.
 */

export const randomWalk = (seed: string, n: number, drift = 0, vol = 1, start = 100): number[] => {
	const out: number[] = [start];
	for (let i = 1; i < n; i++) {
		const shock = (random(`${seed}-${i}`) - 0.5) * 2 * vol;
		out.push(out[i - 1] + drift + shock);
	}
	return out;
};

/** Piecewise trend: each leg is [length, slope]. */
export const trendLegs = (seed: string, legs: [number, number][], vol = 0.8, start = 100): number[] => {
	const out: number[] = [start];
	let i = 0;
	for (const [len, slope] of legs) {
		for (let k = 0; k < len; k++) {
			i++;
			out.push(out[out.length - 1] + slope + (random(`${seed}-${i}`) - 0.5) * 2 * vol);
		}
	}
	return out;
};

/** Oscillation around a mean (for mean-reversion visuals). */
export const oscillate = (seed: string, n: number, mean = 100, amp = 6, period = 26, noise = 1): number[] =>
	Array.from({length: n}, (_, i) => mean + Math.sin((i / period) * Math.PI * 2) * amp + (random(`${seed}-${i}`) - 0.5) * noise * 2);

export const movingAverage = (data: number[], window: number): number[] =>
	data.map((_, i) => {
		const from = Math.max(0, i - window + 1);
		const slice = data.slice(from, i + 1);
		return slice.reduce((a, b) => a + b, 0) / slice.length;
	});

/** Indices where `a` crosses `b`. */
export const crossovers = (a: number[], b: number[], skip = 0): {index: number; direction: 'up' | 'down'}[] => {
	const out: {index: number; direction: 'up' | 'down'}[] = [];
	for (let i = Math.max(1, skip); i < a.length; i++) {
		const prev = a[i - 1] - b[i - 1];
		const cur = a[i] - b[i];
		if (prev <= 0 && cur > 0) out.push({index: i, direction: 'up'});
		if (prev >= 0 && cur < 0) out.push({index: i, direction: 'down'});
	}
	return out;
};

/** Running drawdown from peak, as a negative percentage. */
export const drawdown = (data: number[]): number[] => {
	let peak = -Infinity;
	return data.map((v) => {
		peak = Math.max(peak, v);
		return ((v - peak) / peak) * 100;
	});
};

export const cumulative = (steps: number[], start = 0): number[] => {
	const out: number[] = [];
	let acc = start;
	for (const s of steps) {
		acc += s;
		out.push(acc);
	}
	return out;
};
