import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

export type SubtitleCue = {
	/** Absolute frames within the composition. */
	from: number;
	to: number;
	text: string;
};

type Props = {
	cues: SubtitleCue[];
	/** "boxed" = broadcast-style plate; "clean" = text with shadow only. */
	variant?: 'boxed' | 'clean';
	/** Distance from the bottom of the frame. */
	bottom?: number;
	fontSize?: number;
	/** Words in the active cue to emphasise in the signal color. */
	emphasis?: string[];
};

/** Professional burned-in subtitles: max ~2 lines, balanced wrap, soft fades. */
export const Subtitle: React.FC<Props> = ({cues, variant = 'boxed', bottom = 64, fontSize = 40, emphasis = []}) => {
	const frame = useCurrentFrame();
	const cue = cues.find((c) => frame >= c.from && frame < c.to);
	if (!cue) return null;
	const fade = Math.min(progress(frame, cue.from, 5), 1 - progress(frame, cue.to - 5, 5));
	const em = new Set(emphasis.map((e) => e.toLowerCase()));

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
			<div
				style={{
					marginBottom: bottom,
					maxWidth: 1380,
					padding: variant === 'boxed' ? '14px 30px 16px' : 0,
					borderRadius: 12,
					background: variant === 'boxed' ? 'rgba(8, 11, 15, 0.72)' : undefined,
					backdropFilter: variant === 'boxed' ? 'blur(10px)' : undefined,
					border: variant === 'boxed' ? `1px solid rgba(92,106,119,0.25)` : undefined,
					opacity: fade,
					transform: `translateY(${(1 - fade) * 6}px)`,
				}}
			>
				<div
					style={{
						fontFamily: fonts.sans,
						fontWeight: 500,
						fontSize,
						lineHeight: 1.3,
						color: colors.textHi,
						textAlign: 'center',
						whiteSpace: 'nowrap',
						textShadow: variant === 'clean' ? '0 2px 12px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)' : undefined,
					}}
				>
					{balanceLines(cue.text).map((line, li) => (
						<div key={li}>
							{line.split(' ').map((w, i) => (
								<span key={i} style={{color: em.has(w.toLowerCase().replace(/[^a-z0-9%]/g, '')) ? colors.signal : undefined}}>
									{i > 0 ? ' ' : ''}
									{w}
								</span>
							))}
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const LINE_CHARS = 44;

/** Splits a cue into at most two lines of similar length (the plate then hugs the text). */
export const balanceLines = (text: string): string[] => {
	if (text.length <= LINE_CHARS) return [text];
	const words = text.split(' ');
	let best = 1;
	let bestDiff = Infinity;
	for (let i = 1; i < words.length; i++) {
		const a = words.slice(0, i).join(' ').length;
		const b = words.slice(i).join(' ').length;
		const diff = Math.abs(a - b);
		if (diff < bestDiff) {
			bestDiff = diff;
			best = i;
		}
	}
	return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
};
