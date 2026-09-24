import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme/tokens';
import {useSvgId} from '../lib/useSvgId';

type Props = {
	/** Dot grid behind the content. */
	grid?: boolean;
	/** Animated film grain. */
	grain?: boolean;
	vignette?: boolean;
	/** Optional soft color glow, e.g. colors.signal. */
	glow?: string;
	glowPosition?: string;
	children?: React.ReactNode;
};

/** Ink canvas with dot grid, glow, vignette and film grain. Every scene sits on this. */
export const Background: React.FC<Props> = ({
	grid = true,
	grain = true,
	vignette = true,
	glow,
	glowPosition = '70% 40%',
	children,
}) => {
	return (
		<AbsoluteFill style={{backgroundColor: colors.ink, overflow: 'hidden'}}>
			{grid ? (
				<AbsoluteFill
					style={{
						backgroundImage: `radial-gradient(${colors.grid} 1.2px, transparent 1.2px)`,
						backgroundSize: '36px 36px',
						opacity: 0.9,
					}}
				/>
			) : null}
			{glow ? (
				<AbsoluteFill
					style={{
						background: `radial-gradient(ellipse 55% 60% at ${glowPosition}, ${glow}14, transparent 70%)`,
					}}
				/>
			) : null}
			{children}
			{vignette ? (
				<AbsoluteFill
					style={{
						background: 'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)',
						pointerEvents: 'none',
					}}
				/>
			) : null}
			{grain ? <FilmGrain /> : null}
		</AbsoluteFill>
	);
};

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('grain')(String(frame % 6));
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
			<svg width="100%" height="100%">
				<filter id={id}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter={`url(#${id})`} />
			</svg>
		</AbsoluteFill>
	);
};
