import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';
import {BigText} from './BigText';
import {Panel} from './Primitives';

type Highlight = {text: string; color: string};

export type QuoteCardProps =
	| {
			variant: 'statement';
			quote: string;
			/** Source line under the quote. Only cite the PDF — never invent a speaker. */
			attribution?: string;
			at?: number;
			size?: number;
			highlight?: string[];
			width?: number;
	  }
	| {
			variant: 'code';
			/** One entry per line; typed out character by character. */
			lines: string[];
			attribution?: string;
			at?: number;
			/** Characters per frame. */
			speed?: number;
			highlights?: Highlight[];
			width?: number;
			title?: string;
	  };

/** Pull-quote card: big serif statement, or a typed "rule" in a code panel. */
export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
	const frame = useCurrentFrame();
	const at = props.at ?? 0;
	const p = progress(frame, at, 24);

	if (props.variant === 'statement') {
		return (
			<div style={{position: 'relative', width: props.width ?? 1400, opacity: p}}>
				<div
					style={{
						position: 'absolute',
						left: -18,
						top: -110,
						fontFamily: fonts.serif,
						fontSize: 260,
						lineHeight: 1,
						color: colors.signal,
						opacity: 0.9,
						textShadow: `0 0 40px ${colors.signal}55`,
					}}
				>
					“
				</div>
				<div style={{borderLeft: `3px solid ${colors.signal}`, paddingLeft: 48}}>
					<BigText text={props.quote} size={props.size ?? 64} at={at + 6} stagger={2} highlight={props.highlight} lineHeight={1.2} />
					{props.attribution ? (
						<div
							style={{
								marginTop: 36,
								fontFamily: fonts.sans,
								fontWeight: 600,
								fontSize: 20,
								letterSpacing: '0.2em',
								textTransform: 'uppercase',
								color: colors.textLo,
								opacity: progress(frame, at + 30, 20),
							}}
						>
							— {props.attribution}
						</div>
					) : null}
				</div>
			</div>
		);
	}

	const speed = props.speed ?? 1.6;
	let budget = Math.max(0, (frame - at - 10) * speed);
	const cursorOn = Math.floor(frame / 15) % 2 === 0;
	let cursorPlaced = false;

	return (
		<Panel style={{width: props.width ?? 1300, padding: 0, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}} glow={colors.signal}>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '18px 26px', borderBottom: `1px solid ${colors.hairline}`}}>
				{[colors.loss, colors.amber, colors.gain].map((c) => (
					<div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.7}} />
				))}
				<div style={{marginLeft: 18, fontFamily: fonts.mono, fontSize: 18, color: colors.textLo}}>{props.title ?? 'rule.txt'}</div>
			</div>
			<div style={{padding: '34px 40px 40px'}}>
				{props.lines.map((line, li) => {
					const shown = line.slice(0, Math.max(0, Math.floor(budget)));
					budget -= line.length + 6; // brief pause at each line end
					const typing = !cursorPlaced && shown.length < line.length;
					if (typing) cursorPlaced = true;
					return (
						<div key={li} style={{display: 'flex', gap: 28, fontFamily: fonts.mono, fontSize: 38, lineHeight: 1.7, color: colors.textHi}}>
							<span style={{color: colors.textLo, opacity: 0.5, width: 30, textAlign: 'right'}}>{li + 1}</span>
							<span>
								{colorize(shown, props.highlights ?? [])}
								{typing || (li === props.lines.length - 1 && !cursorPlaced) ? (
									<span style={{display: 'inline-block', width: 18, height: 38, marginLeft: 2, verticalAlign: 'middle', background: colors.signal, opacity: cursorOn ? 1 : 0}} />
								) : null}
							</span>
						</div>
					);
				})}
				{props.attribution ? (
					<div
						style={{
							marginTop: 26,
							fontFamily: fonts.sans,
							fontWeight: 600,
							fontSize: 18,
							letterSpacing: '0.2em',
							textTransform: 'uppercase',
							color: colors.textLo,
						}}
					>
						{props.attribution}
					</div>
				) : null}
			</div>
		</Panel>
	);
};

/** Colors every occurrence of each highlight token inside the (partially typed) text. */
const colorize = (text: string, highlights: Highlight[]): React.ReactNode[] => {
	if (!highlights.length) return [text];
	const pattern = new RegExp(`(${highlights.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
	return text.split(pattern).map((part, i) => {
		const h = highlights.find((hh) => hh.text === part);
		return h ? (
			<span key={i} style={{color: h.color, textShadow: `0 0 16px ${h.color}66`}}>
				{part}
			</span>
		) : (
			<span key={i}>{part}</span>
		);
	});
};
