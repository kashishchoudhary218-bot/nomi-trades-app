import {Easing} from 'remotion';

export const VIDEO = {width: 1920, height: 1080, fps: 30} as const;

/** Palette from the storyboard style bible (matches the NOMI TRADES app). */
export const colors = {
	ink: '#0B0F14',
	panel: '#0E141B',
	panelHi: '#141C26',
	textHi: '#DBE3EA',
	textMid: '#A3B0BC',
	textLo: '#7D8B98',
	grid: 'rgba(92, 106, 119, 0.16)',
	hairline: 'rgba(92, 106, 119, 0.4)',
	signal: '#C8FF4D',
	gain: '#35D19A',
	loss: '#FF5A5F',
	gold: '#F0C75E',
	cool: '#7FA8FF',
	amber: '#FFB547',
} as const;

export type ColorName = keyof typeof colors;

/** Horizontal / vertical safe margins at 1080p. */
export const SAFE = {x: 120, top: 96, bottom: 200} as const;

/** House easing: expo-out for everything that enters. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
