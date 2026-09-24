import {interpolate} from 'remotion';
import {EASE, VIDEO} from '../theme/tokens';

/** Seconds → frames at the project frame rate. */
export const sec = (seconds: number): number => Math.round(seconds * VIDEO.fps);

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 progress between `start` and `start + duration`, eased. */
export const progress = (
	frame: number,
	start: number,
	duration: number,
	easing: (t: number) => number = EASE,
): number => {
	if (duration <= 0) return frame >= start ? 1 : 0;
	return interpolate(frame, [start, start + duration], [0, 1], {...clampOpts, easing});
};

/** Opacity for an element that fades in at `start` and out before `end`. */
export const inOut = (frame: number, start: number, end: number, fade = 12): number => {
	const fadeIn = progress(frame, start, fade);
	const fadeOut = 1 - progress(frame, end - fade, fade);
	return Math.min(fadeIn, fadeOut);
};

/** Clamped interpolation (2+ keyframes), eased by default. */
export const map = (
	frame: number,
	input: readonly number[],
	output: readonly number[],
	easing: (t: number) => number = EASE,
): number => interpolate(frame, [...input], [...output], {...clampOpts, easing});

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
