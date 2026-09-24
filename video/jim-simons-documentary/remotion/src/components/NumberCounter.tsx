import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../lib/anim';
import {fonts, type FontName} from '../theme/fonts';
import {colors, EASE_IN_OUT} from '../theme/tokens';

type Props = {
	to: number;
	from?: number;
	/** Frame the count starts. */
	at?: number;
	duration?: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	/** "slot" = mechanical rolling digits; "count" = plain number tick-up. */
	mode?: 'slot' | 'count';
	/** Extra full spins per digit in slot mode (lowest digit spins most). */
	spins?: number;
	size?: number;
	font?: FontName;
	weight?: number;
	color?: string;
	/** Glow color; set to null to disable. */
	glow?: string | null;
	thousandsSeparator?: boolean;
	style?: React.CSSProperties;
};

/** Animated number — slot-machine digit roll or smooth count. */
export const NumberCounter: React.FC<Props> = ({
	to,
	from = 0,
	at = 0,
	duration = 45,
	prefix = '',
	suffix = '',
	decimals = 0,
	mode = 'slot',
	spins = 1,
	size = 200,
	font = 'serif',
	weight = 300,
	color = colors.gold,
	glow = colors.gold,
	thousandsSeparator = false,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, at, duration, EASE_IN_OUT);
	const base: React.CSSProperties = {
		fontFamily: fonts[font],
		fontWeight: weight,
		fontSize: size,
		lineHeight: 1,
		color,
		fontVariantNumeric: 'tabular-nums',
		letterSpacing: '-0.03em',
		// drop-shadow on the wrapper (not text-shadow) so clipped digit columns don't show glow boxes
		filter: glow ? `drop-shadow(0 0 ${Math.round(size * 0.12)}px ${glow}66)` : undefined,
		display: 'inline-flex',
		alignItems: 'baseline',
		...style,
	};

	if (mode === 'count') {
		const value = from + (to - from) * p;
		const txt = value.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: thousandsSeparator,
		});
		return (
			<span style={base}>
				{prefix}
				{txt}
				{suffix}
			</span>
		);
	}

	const digits = Math.round(to).toString().split('');
	const h = size;
	return (
		<span style={base}>
			{prefix}
			{digits.map((d, i) => {
				const target = Number(d);
				const extra = (digits.length - i) * spins;
				// Each column rolls with a small stagger so digits land left→right.
				const local = progress(frame, at + i * 4, duration, EASE_IN_OUT);
				const pos = (extra * 10 + target) * local;
				const offset = pos % 10;
				return (
					<span key={i} style={{display: 'inline-block', height: h, overflow: 'hidden', position: 'relative', width: '0.62em'}}>
						<span style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', transform: `translateY(${-offset * h}px)`}}>
							{Array.from({length: 11}, (_, k) => (
								<span key={k} style={{display: 'block', height: h}}>
									{k % 10}
								</span>
							))}
						</span>
					</span>
				);
			})}
			{suffix}
		</span>
	);
};
