import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../lib/anim';
import {fonts, type FontName} from '../theme/fonts';
import {colors} from '../theme/tokens';

export type BigTextProps = {
	/** Use "\n" for manual line breaks. */
	text: string;
	font?: FontName;
	size?: number;
	weight?: number;
	color?: string;
	/** Words (case-insensitive, punctuation ignored) rendered in `highlightColor`. */
	highlight?: string[];
	highlightColor?: string;
	/** Frame the first word starts animating. */
	at?: number;
	/** Frames between words. */
	stagger?: number;
	/** Per-word entrance style. */
	effect?: 'rise' | 'blur' | 'mask';
	align?: 'left' | 'center' | 'right';
	caps?: boolean;
	tracking?: string;
	lineHeight?: number;
	maxWidth?: number;
	/** Draw a signal underline after the text is in. */
	underline?: {at: number; color?: string};
	/** Strike the text through (e.g. "GUT FEELING" → crossed out). */
	strike?: {at: number; color?: string};
	/** Frame to start fading out. */
	exitAt?: number;
	style?: React.CSSProperties;
};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9%+~]/g, '');

/** Headline typography with per-word staggered entrances. */
export const BigText: React.FC<BigTextProps> = ({
	text,
	font = 'serif',
	size = 96,
	weight,
	color = colors.textHi,
	highlight = [],
	highlightColor = colors.signal,
	at = 0,
	stagger = 3,
	effect = 'rise',
	align = 'left',
	caps = false,
	tracking,
	lineHeight = 1.08,
	maxWidth,
	underline,
	strike,
	exitAt,
	style,
}) => {
	const frame = useCurrentFrame();
	const hl = new Set(highlight.map(clean));
	const lines = text.split('\n').map((l) => l.split(' ').filter(Boolean));
	const exit = exitAt === undefined ? 1 : 1 - progress(frame, exitAt, 14);
	let index = 0;

	const underlineP = underline ? progress(frame, underline.at, 22) : 0;
	const strikeP = strike ? progress(frame, strike.at, 12) : 0;

	return (
		<div
			style={{
				position: 'relative',
				display: 'inline-block',
				fontFamily: fonts[font],
				fontWeight: weight ?? (font === 'serif' ? 300 : 600),
				fontSize: size,
				lineHeight,
				letterSpacing: tracking ?? (font === 'serif' ? '-0.02em' : caps ? '0.06em' : '-0.01em'),
				textTransform: caps ? 'uppercase' : undefined,
				color,
				textAlign: align,
				maxWidth,
				opacity: exit,
				...style,
			}}
		>
			{lines.map((words, li) => (
				<div key={li} style={{display: 'block', whiteSpace: 'nowrap'}}>
					{words.map((word, wi) => {
						const p = progress(frame, at + index++ * stagger, 20);
						const isHl = hl.has(clean(word));
						const inner: React.CSSProperties = {
							display: 'inline-block',
							color: isHl ? highlightColor : undefined,
							textShadow: isHl ? `0 0 28px ${highlightColor}55` : undefined,
						};
						if (effect === 'mask') {
							return (
								<span key={wi} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em'}}>
									<span style={{...inner, transform: `translateY(${(1 - p) * 105}%)`}}>{word}</span>
									{wi < words.length - 1 ? ' ' : ''}
								</span>
							);
						}
						return (
							<span
								key={wi}
								style={{
									...inner,
									opacity: p,
									transform: `translateY(${(1 - p) * 0.35}em)`,
									filter: effect === 'blur' ? `blur(${(1 - p) * 12}px)` : undefined,
								}}
							>
								{word}
								{wi < words.length - 1 ? ' ' : ''}
							</span>
						);
					})}
				</div>
			))}
			{underline ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: '-0.12em',
						height: Math.max(3, size * 0.04),
						background: underline.color ?? colors.signal,
						boxShadow: `0 0 18px ${underline.color ?? colors.signal}`,
						transform: `scaleX(${underlineP})`,
						transformOrigin: align === 'right' ? 'right' : 'left',
					}}
				/>
			) : null}
			{strike ? (
				<div
					style={{
						position: 'absolute',
						left: '-2%',
						width: '104%',
						top: '52%',
						height: Math.max(4, size * 0.07),
						background: strike.color ?? colors.loss,
						boxShadow: `0 0 16px ${strike.color ?? colors.loss}`,
						transform: `scaleX(${strikeP})`,
						transformOrigin: 'left',
					}}
				/>
			) : null}
		</div>
	);
};
