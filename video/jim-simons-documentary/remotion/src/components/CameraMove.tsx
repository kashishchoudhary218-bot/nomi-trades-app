import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {map} from '../lib/anim';
import {EASE_IN_OUT} from '../theme/tokens';
import {useScene} from '../timeline/SceneContext';

type Props = {
	/** Start / end scale. Default is the house slow push-in (1 → 1.06). */
	from?: number;
	to?: number;
	/** Pixel drift over the move. */
	driftX?: number;
	driftY?: number;
	/** Subtle rotation in degrees at the end of the move. */
	rotate?: number;
	/** Defaults to the whole scene. */
	durationInFrames?: number;
	startFrame?: number;
	children: React.ReactNode;
};

/** Virtual camera: slow push-in / drift so no frame is ever static. */
export const CameraMove: React.FC<Props> = ({
	from = 1,
	to = 1.06,
	driftX = 0,
	driftY = 0,
	rotate = 0,
	durationInFrames,
	startFrame = 0,
	children,
}) => {
	const frame = useCurrentFrame();
	const scene = useScene();
	const dur = durationInFrames ?? scene.durationInFrames - scene.contentOffset;
	const range = [startFrame, startFrame + dur];
	const s = map(frame, range, [from, to], EASE_IN_OUT);
	const x = map(frame, range, [0, driftX], EASE_IN_OUT);
	const y = map(frame, range, [0, driftY], EASE_IN_OUT);
	const r = map(frame, range, [0, rotate], EASE_IN_OUT);
	return (
		<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`, transformOrigin: '50% 50%'}}>
			{children}
		</AbsoluteFill>
	);
};

/** Short positional shake that decays — for impacts and "stamp" moments. */
export const Shake: React.FC<{at: number; strength?: number; duration?: number; children: React.ReactNode}> = ({
	at,
	strength = 10,
	duration = 14,
	children,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	const active = t >= 0 && t < duration;
	const decay = active ? 1 - t / duration : 0;
	const x = active ? Math.sin(t * 2.7) * strength * decay : 0;
	const y = active ? Math.cos(t * 3.3) * strength * 0.6 * decay : 0;
	return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>{children}</AbsoluteFill>;
};
