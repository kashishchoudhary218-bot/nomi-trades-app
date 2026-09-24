import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps, type TransitionTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {colors, EASE_IN_OUT} from '../theme/tokens';

/** House transition set from the storyboard style bible. */
export type TransitionKind = 'signal-wipe' | 'data-dissolve' | 'dip-to-black' | 'crossfade' | 'cut';

type Empty = Record<string, never>;

/* 1. Signal-line wipe: a glowing lime line sweeps left→right revealing the next scene. */
const SignalWipe: React.FC<TransitionPresentationComponentProps<Empty>> = ({children, presentationDirection, presentationProgress}) => {
	if (presentationDirection === 'exiting') {
		return <AbsoluteFill style={{filter: `brightness(${1 - presentationProgress * 0.5})`}}>{children}</AbsoluteFill>;
	}
	const edge = presentationProgress * 110 - 5;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `polygon(0 0, ${edge + 4}% 0, ${edge}% 100%, 0 100%)`}}>{children}</AbsoluteFill>
			<AbsoluteFill style={{pointerEvents: 'none'}}>
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<line x1={edge + 4} y1={0} x2={edge} y2={100} stroke={colors.signal} strokeWidth={4} vectorEffect="non-scaling-stroke" style={{filter: `drop-shadow(0 0 8px ${colors.signal})`}} />
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/* 2. Data dissolve: the frame breaks into a dot matrix and re-forms. */
const DataDissolve: React.FC<TransitionPresentationComponentProps<Empty>> = ({children, presentationDirection, presentationProgress}) => {
	const p = presentationDirection === 'entering' ? presentationProgress : 1 - presentationProgress;
	const radius = Math.max(0.01, p * 9); // dot radius in px on a 12px pitch
	const mask = `radial-gradient(circle, #000 ${radius}px, transparent ${radius + 0.8}px)`;
	return (
		<AbsoluteFill
			style={{
				opacity: Math.min(1, p * 1.4),
				filter: `blur(${(1 - p) * 4}px)`,
				transform: `scale(${presentationDirection === 'entering' ? 1.04 - p * 0.04 : 1 + (1 - p) * 0.05})`,
				WebkitMaskImage: p >= 0.98 ? undefined : mask,
				WebkitMaskSize: '12px 12px',
				maskImage: p >= 0.98 ? undefined : mask,
				maskSize: '12px 12px',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/* 3. Dip to black: out, beat of black, in. */
const DipToBlack: React.FC<TransitionPresentationComponentProps<Empty>> = ({children, presentationDirection, presentationProgress}) => {
	const o =
		presentationDirection === 'exiting'
			? Math.max(0, 1 - presentationProgress * 2.2)
			: Math.max(0, (presentationProgress - 0.55) / 0.45);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};

const make = (component: React.FC<TransitionPresentationComponentProps<Empty>>): TransitionPresentation<Empty> => ({component, props: {}});

export const signalWipe = () => make(SignalWipe);
export const dataDissolve = () => make(DataDissolve);
export const dipToBlack = () => make(DipToBlack);

export const DEFAULT_TRANSITION_FRAMES: Record<Exclude<TransitionKind, 'cut'>, number> = {
	'signal-wipe': 24,
	'data-dissolve': 20,
	'dip-to-black': 30,
	crossfade: 18,
};

/** Resolve a transition kind to a presentation + timing for <TransitionSeries.Transition>. */
export const getTransition = (
	kind: Exclude<TransitionKind, 'cut'>,
	durationInFrames = DEFAULT_TRANSITION_FRAMES[kind],
): {presentation: TransitionPresentation<Record<string, unknown>>; timing: TransitionTiming} => {
	const timing = linearTiming({durationInFrames, easing: EASE_IN_OUT});
	const presentation =
		kind === 'signal-wipe' ? signalWipe() : kind === 'data-dissolve' ? dataDissolve() : kind === 'dip-to-black' ? dipToBlack() : fade();
	return {presentation: presentation as TransitionPresentation<Record<string, unknown>>, timing};
};

/** Standalone signal-line sweep overlay (for in-scene accents, not between scenes). */
export const SignalSweep: React.FC<{progress: number; color?: string}> = ({progress, color = colors.signal}) => {
	if (progress <= 0 || progress >= 1) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: `${progress * 100}%`,
					width: 3,
					background: color,
					boxShadow: `0 0 24px ${color}, 0 0 60px ${color}`,
				}}
			/>
		</AbsoluteFill>
	);
};
