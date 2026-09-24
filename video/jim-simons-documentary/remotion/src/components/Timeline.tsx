import React from 'react';
import {useCurrentFrame} from 'remotion';
import {map, progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';
import {useSvgId} from '../lib/useSvgId';

type Common = {
	steps: string[];
	/** Frame the first step appears. */
	at?: number;
	/** Frames between step reveals. */
	stepFrames?: number;
	/** Explicit reveal frame per step (overrides at/stepFrames) — use narration beats. */
	stepTimes?: number[];
	accent?: string;
	style?: React.CSSProperties;
};

export type TimelineProps =
	| (Common & {
			layout: 'loop';
			size?: number;
			/** Frames for the token to complete one lap (0 disables the token). */
			lapFrames?: number;
			/** Frame at which a failing signal is ejected from the last node. */
			ejectAt?: number;
			ejectLabel?: string;
			/** Replace nodes with a thin line-only drawing (closing bookend). */
			minimal?: boolean;
	  })
	| (Common & {layout: 'linear'; width?: number})
	| (Common & {layout: 'vertical'; highlightLast?: string; fontSize?: number});

/** Process diagrams: circular discipline loop, horizontal pipeline, vertical agenda. */
export const Timeline: React.FC<TimelineProps> = (props) => {
	if (props.layout === 'loop') return <LoopTimeline {...props} />;
	if (props.layout === 'linear') return <LinearTimeline {...props} />;
	return <VerticalTimeline {...props} />;
};

const stepTime = (i: number, at: number, stepFrames: number, stepTimes?: number[]) => stepTimes?.[i] ?? at + i * stepFrames;

const labelCss: React.CSSProperties = {
	fontFamily: fonts.sans,
	fontWeight: 700,
	fontSize: 22,
	letterSpacing: '0.14em',
	textTransform: 'uppercase',
	whiteSpace: 'nowrap',
};

const LoopTimeline: React.FC<Extract<TimelineProps, {layout: 'loop'}>> = ({
	steps,
	at = 0,
	stepFrames = 18,
	accent = colors.signal,
	size = 620,
	lapFrames = 150,
	ejectAt,
	ejectLabel = 'REMOVED',
	minimal = false,
	stepTimes,
	style,
}) => {
	const frame = useCurrentFrame();
	const n = steps.length;
	const r = size * 0.36;
	const id = useSvgId('loop');
	const c = size / 2;
	const angle = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
	const pos = (a: number, rad = r) => [c + Math.cos(a) * rad, c + Math.sin(a) * rad] as const;
	const t0 = stepTime(0, at, stepFrames, stepTimes);
	const tLast = stepTime(n - 1, at, stepFrames, stepTimes);
	const drawnAt = tLast + stepFrames;
	const ringP = progress(frame, t0, drawnAt - t0, (t) => t);
	const circ = 2 * Math.PI * r;

	const lapT = lapFrames > 0 && frame > drawnAt ? ((frame - drawnAt) / lapFrames) % 1 : -1;
	const tokenA = -Math.PI / 2 + lapT * Math.PI * 2;
	const revealed = steps.filter((_, i) => frame >= stepTime(i, at, stepFrames, stepTimes)).length;
	const activeIdx = lapT >= 0 ? Math.round(lapT * n) % n : revealed - 1;

	return (
		<div style={{position: 'relative', width: size, height: size, ...style}}>
			<svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<filter id={id('glow')}>
						<feGaussianBlur stdDeviation="6" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<circle cx={c} cy={c} r={r} fill="none" stroke={colors.grid} strokeWidth={2} />
				<circle
					cx={c}
					cy={c}
					r={r}
					fill="none"
					stroke={accent}
					strokeWidth={minimal ? 3 : 2.5}
					strokeDasharray={`${circ * ringP} ${circ}`}
					transform={`rotate(-90 ${c} ${c})`}
					filter={`url(#${id('glow')})`}
				/>
				{steps.map((_, i) => {
					const p = progress(frame, stepTime(i, at, stepFrames, stepTimes), 16);
					const [x, y] = pos(angle(i));
					const isActive = i === activeIdx;
					return (
						<g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
							<circle r={minimal ? 6 : 16} fill={colors.ink} stroke={isActive ? accent : colors.textLo} strokeWidth={3} />
							{!minimal ? <circle r={6} fill={isActive ? accent : colors.textLo} filter={isActive ? `url(#${id('glow')})` : undefined} /> : null}
						</g>
					);
				})}
				{lapT >= 0 ? (
					<circle cx={pos(tokenA)[0]} cy={pos(tokenA)[1]} r={10} fill={accent} filter={`url(#${id('glow')})`} />
				) : null}
				{ejectAt !== undefined && frame >= ejectAt
					? (() => {
							const t = progress(frame, ejectAt, 36);
							const a = angle(n - 1);
							const [ex, ey] = pos(a, r + t * r * 0.9);
							return (
								<g opacity={1 - progress(frame, ejectAt + 40, 20)}>
									<circle cx={ex} cy={ey} r={11} fill={colors.loss} filter={`url(#${id('glow')})`} />
									<text x={ex - 20} y={ey - 22} textAnchor="end" fill={colors.loss} fontFamily={fonts.sans} fontWeight={700} fontSize={20} letterSpacing="0.16em">
										{ejectLabel}
									</text>
								</g>
							);
						})()
					: null}
			</svg>
			{steps.map((s, i) => {
				const a = angle(i);
				const [x, y] = pos(a, r + (minimal ? 42 : 58));
				const p = progress(frame, stepTime(i, at, stepFrames, stepTimes) + 4, 16);
				const cos = Math.cos(a);
				const isActive = i === activeIdx;
				return (
					<div
						key={s}
						style={{
							...labelCss,
							fontSize: minimal ? 20 : 22,
							position: 'absolute',
							left: x,
							top: y,
							transform: `translate(${cos > 0.3 ? '0%' : cos < -0.3 ? '-100%' : '-50%'}, -50%)`,
							color: isActive ? colors.textHi : colors.textLo,
							opacity: p,
						}}
					>
						{s}
					</div>
				);
			})}
		</div>
	);
};

const LinearTimeline: React.FC<Extract<TimelineProps, {layout: 'linear'}>> = ({
	steps,
	at = 0,
	stepFrames = 18,
	accent = colors.signal,
	width = 1500,
	stepTimes,
	style,
}) => {
	const frame = useCurrentFrame();
	const n = steps.length;
	const gap = width / (n - 1);
	const t0 = stepTime(0, at, stepFrames, stepTimes);
	const lineP = progress(frame, t0, stepTime(n - 1, at, stepFrames, stepTimes) - t0, (t) => t);
	return (
		<div style={{position: 'relative', width, height: 140, ...style}}>
			<div style={{position: 'absolute', top: 30, left: 0, width, height: 2, background: colors.grid}} />
			<div
				style={{
					position: 'absolute',
					top: 30,
					left: 0,
					width: width * lineP,
					height: 2,
					background: accent,
					boxShadow: `0 0 14px ${accent}`,
				}}
			/>
			{steps.map((s, i) => {
				const p = progress(frame, stepTime(i, at, stepFrames, stepTimes), 16);
				return (
					<div key={s} style={{position: 'absolute', left: i * gap, top: 0, transform: 'translateX(-50%)', textAlign: 'center', opacity: p}}>
						<div
							style={{
								width: 60,
								height: 60,
								margin: '0 auto',
								borderRadius: 30,
								border: `2px solid ${accent}`,
								background: colors.ink,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: fonts.mono,
								fontSize: 20,
								color: accent,
								transform: `scale(${map(p, [0, 1], [0.4, 1])})`,
								boxShadow: `0 0 24px ${accent}44`,
							}}
						>
							{String(i + 1).padStart(2, '0')}
						</div>
						<div style={{...labelCss, fontSize: 20, marginTop: 18, color: colors.textHi}}>{s}</div>
					</div>
				);
			})}
		</div>
	);
};

const VerticalTimeline: React.FC<Extract<TimelineProps, {layout: 'vertical'}>> = ({
	steps,
	at = 0,
	stepFrames = 20,
	accent = colors.signal,
	highlightLast,
	fontSize = 40,
	stepTimes,
	style,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: fontSize * 0.7, ...style}}>
			{steps.map((s, i) => {
				const start = stepTime(i, at, stepFrames, stepTimes);
				const next = i < steps.length - 1 ? stepTime(i + 1, at, stepFrames, stepTimes) : start + stepFrames + 8;
				const p = progress(frame, start, 18);
				const active = frame >= start && frame < next;
				const isWarn = highlightLast && i === steps.length - 1;
				const c = isWarn ? highlightLast : active ? accent : colors.textMid;
				return (
					<div key={s} style={{display: 'flex', alignItems: 'baseline', gap: 28, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
						<span style={{fontFamily: fonts.mono, fontSize: fontSize * 0.6, color: c}}>{String(i + 1).padStart(2, '0')}</span>
						<span
							style={{
								...labelCss,
								fontSize,
								letterSpacing: '0.08em',
								color: c,
								textShadow: active || isWarn ? `0 0 24px ${c}55` : undefined,
							}}
						>
							{s}
						</span>
					</div>
				);
			})}
		</div>
	);
};
