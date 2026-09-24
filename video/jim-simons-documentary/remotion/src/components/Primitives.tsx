import React from 'react';
import {useCurrentFrame} from 'remotion';
import {map, progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/** ALL-CAPS label with the signal hairline on the left (lower-third / kicker style). */
export const Kicker: React.FC<{
	children: React.ReactNode;
	at?: number;
	color?: string;
	lineColor?: string;
	size?: number;
	style?: React.CSSProperties;
}> = ({children, at = 0, color = colors.textLo, lineColor = colors.signal, size = 22, style}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, at, 18);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				fontFamily: fonts.sans,
				fontWeight: 600,
				fontSize: size,
				letterSpacing: '0.16em',
				textTransform: 'uppercase',
				color,
				opacity: p,
				transform: `translateX(${(1 - p) * -16}px)`,
				...style,
			}}
		>
			<div style={{width: 36 * p, height: 2, background: lineColor, boxShadow: `0 0 12px ${lineColor}`}} />
			<span>{children}</span>
		</div>
	);
};

/** Required corner tag on every conceptual chart (storyboard fidelity rule #3). */
export const IllustrativeTag: React.FC<{style?: React.CSSProperties}> = ({style}) => (
	<div
		style={{
			position: 'absolute',
			right: 16,
			bottom: 12,
			fontFamily: fonts.sans,
			fontWeight: 600,
			fontSize: 13,
			letterSpacing: '0.18em',
			color: colors.textLo,
			opacity: 0.85,
			...style,
		}}
	>
		ILLUSTRATIVE · NOT REAL DATA
	</div>
);

export const LowerThird: React.FC<{title: string; subtitle?: string; at?: number; out?: number}> = ({
	title,
	subtitle,
	at = 0,
	out = Infinity,
}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, at, 20);
	const o = Number.isFinite(out) ? Math.min(p, 1 - progress(frame, out - 12, 12)) : p;
	return (
		<div style={{position: 'absolute', left: 120, bottom: 230, opacity: o}}>
			<div style={{display: 'flex', alignItems: 'stretch', gap: 20}}>
				<div style={{width: 3, background: colors.signal, transform: `scaleY(${p})`, transformOrigin: 'top', boxShadow: `0 0 16px ${colors.signal}`}} />
				<div style={{transform: `translateX(${(1 - p) * -24}px)`}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: colors.textHi}}>{title}</div>
					{subtitle ? (
						<div style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 20, letterSpacing: '0.2em', color: colors.textLo, marginTop: 6}}>
							{subtitle}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

type IconName = 'check' | 'cross' | 'lock' | 'shield' | 'warning' | 'question' | 'arrowRight' | 'up' | 'down' | 'dot';

/** Minimal stroke icons drawn in SVG — no external icon assets. */
export const Icon: React.FC<{name: IconName; size?: number; color?: string; strokeWidth?: number; draw?: number}> = ({
	name,
	size = 32,
	color = colors.textHi,
	strokeWidth = 2.5,
	draw = 1,
}) => {
	const common = {
		fill: 'none',
		stroke: color,
		strokeWidth,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
		pathLength: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1 - draw,
	};
	const paths: Record<IconName, React.ReactNode> = {
		check: <path d="M5 12.5l4.5 4.5L19 7.5" {...common} />,
		cross: <path d="M6 6l12 12M18 6L6 18" {...common} />,
		lock: (
			<>
				<rect x="5" y="11" width="14" height="9" rx="2" {...common} />
				<path d="M8 11V8a4 4 0 018 0v3" {...common} />
			</>
		),
		shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" {...common} />,
		warning: <path d="M12 4l9 16H3L12 4zM12 10v4M12 17v.5" {...common} />,
		question: <path d="M9 9a3 3 0 115 2.2c-1 .7-2 1.3-2 2.8M12 18v.5" {...common} />,
		arrowRight: <path d="M4 12h15M13 6l6 6-6 6" {...common} />,
		up: <path d="M12 19V5M6 11l6-6 6 6" {...common} />,
		down: <path d="M12 5v14M6 13l6 6 6-6" {...common} />,
		dot: <circle cx="12" cy="12" r="4" fill={color} stroke="none" />,
	};
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', overflow: 'visible'}}>
			{paths[name]}
		</svg>
	);
};

export type ChecklistItem = {
	label: string;
	/** Frame the item appears. */
	at: number;
	state?: 'neutral' | 'check' | 'cross' | 'active';
	/** Frame at which the state mark (✓ / ✕) draws; defaults to `at + 8`. */
	markAt?: number;
};

/** Vertical list with animated ✓ / ✕ marks. */
export const Checklist: React.FC<{items: ChecklistItem[]; size?: number; gap?: number; numbered?: boolean; style?: React.CSSProperties}> = ({
	items,
	size = 34,
	gap = 22,
	numbered = false,
	style,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap, ...style}}>
			{items.map((item, i) => {
				const p = progress(frame, item.at, 18);
				const markP = progress(frame, item.markAt ?? item.at + 8, 14);
				const state = item.state ?? 'neutral';
				const color =
					state === 'check' ? colors.gain : state === 'cross' ? colors.loss : state === 'active' ? colors.signal : colors.textLo;
				return (
					<div
						key={item.label}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							opacity: p,
							transform: `translateY(${(1 - p) * 14}px)`,
						}}
					>
						<div
							style={{
								width: size * 1.2,
								height: size * 1.2,
								borderRadius: 8,
								border: `1.5px solid ${state === 'neutral' ? colors.hairline : color}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: fonts.mono,
								fontSize: size * 0.5,
								color: colors.textLo,
								flexShrink: 0,
							}}
						>
							{state === 'check' || state === 'cross' ? (
								<Icon name={state} size={size * 0.8} color={color} draw={markP} />
							) : numbered ? (
								String(i + 1).padStart(2, '0')
							) : (
								<Icon name="dot" size={size * 0.6} color={color} />
							)}
						</div>
						<div
							style={{
								fontFamily: fonts.sans,
								fontWeight: 600,
								fontSize: size,
								letterSpacing: '0.04em',
								color: state === 'active' ? colors.textHi : state === 'neutral' ? colors.textMid : colors.textHi,
							}}
						>
							{item.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

/** Rubber-stamp slam (e.g. PROPRIETARY, FAILED). */
export const Stamp: React.FC<{text: string; at: number; color?: string; rotate?: number; size?: number}> = ({
	text,
	at,
	color = colors.loss,
	rotate = -8,
	size = 64,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0) return null;
	const scale = map(frame, [at, at + 8], [1.8, 1]);
	const opacity = map(frame, [at, at + 5], [0, 1]);
	return (
		<div
			style={{
				display: 'inline-block',
				padding: '10px 28px',
				border: `5px solid ${color}`,
				borderRadius: 10,
				color,
				fontFamily: fonts.sans,
				fontWeight: 700,
				fontSize: size,
				letterSpacing: '0.14em',
				transform: `rotate(${rotate}deg) scale(${scale})`,
				opacity,
				boxShadow: `0 0 40px ${color}33, inset 0 0 20px ${color}22`,
			}}
		>
			{text}
		</div>
	);
};

/** Panel with the house card styling. */
export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties; glow?: string}> = ({children, style, glow}) => (
	<div
		style={{
			position: 'relative',
			background: `linear-gradient(180deg, ${colors.panelHi}, ${colors.panel})`,
			border: `1px solid ${colors.hairline}`,
			borderRadius: 18,
			boxShadow: `0 30px 80px rgba(0,0,0,0.5)${glow ? `, 0 0 60px ${glow}22` : ''}`,
			...style,
		}}
	>
		{children}
	</div>
);
