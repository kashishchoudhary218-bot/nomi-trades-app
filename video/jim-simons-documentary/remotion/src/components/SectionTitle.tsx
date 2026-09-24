import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {map, progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors, SAFE} from '../theme/tokens';
import {BigText} from './BigText';

type Props = {
	/** Chapter number, e.g. "01". */
	number: string;
	title: string;
	kicker?: string;
	/** Total on-screen frames (card exits during the last 14). */
	durationInFrames?: number;
	accent?: string;
};

/** Chapter card: outlined chapter number, serif title, signal underline. */
export const SectionTitle: React.FC<Props> = ({number, title, kicker = 'Chapter', durationInFrames = 66, accent = colors.signal}) => {
	const frame = useCurrentFrame();
	const exit = 1 - progress(frame, durationInFrames - 14, 14);
	const numP = progress(frame, 0, 30);
	const lineP = progress(frame, 10, 34);
	return (
		<AbsoluteFill style={{justifyContent: 'center', paddingLeft: SAFE.x, opacity: exit}}>
			<div style={{display: 'flex', alignItems: 'flex-end', gap: 48, transform: `translateX(${map(frame, [0, durationInFrames], [0, -30])}px)`}}>
				<div
					style={{
						fontFamily: fonts.serif,
						fontWeight: 300,
						fontSize: 300,
						lineHeight: 0.8,
						color: 'transparent',
						WebkitTextStroke: `2px ${accent}`,
						letterSpacing: '-0.04em',
						opacity: numP,
						clipPath: `inset(${(1 - numP) * 100}% 0 0 0)`,
						filter: `drop-shadow(0 0 24px ${accent}55)`,
					}}
				>
					{number}
				</div>
				<div style={{paddingBottom: 12}}>
					<div
						style={{
							fontFamily: fonts.sans,
							fontWeight: 600,
							fontSize: 22,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
							color: colors.textLo,
							marginBottom: 18,
							opacity: progress(frame, 6, 20),
						}}
					>
						{kicker} {number}
					</div>
					<BigText text={title} size={92} at={8} stagger={3} effect="mask" />
					<div
						style={{
							marginTop: 26,
							height: 3,
							width: 520,
							background: `linear-gradient(90deg, ${accent}, transparent)`,
							boxShadow: `0 0 18px ${accent}`,
							transform: `scaleX(${lineP})`,
							transformOrigin: 'left',
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
