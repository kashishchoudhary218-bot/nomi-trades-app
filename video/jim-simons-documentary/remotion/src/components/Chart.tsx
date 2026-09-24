import React from 'react';
import {useCurrentFrame} from 'remotion';
import {map, progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors, EASE_IN_OUT} from '../theme/tokens';
import {IllustrativeTag} from './Primitives';

export type ChartSeries = {
	id: string;
	data: number[];
	color?: string;
	width?: number;
	dashed?: boolean;
	opacity?: number;
	/** Frame the line starts drawing, and how long the draw takes. */
	drawFrom?: number;
	drawDuration?: number;
	glow?: boolean;
	/** Fill under the line: gradient to the floor, or red area below zero (drawdown). */
	area?: 'none' | 'gradient' | 'underwater';
	/** Glowing dot at the leading edge while drawing. */
	head?: boolean;
	/** Label drawn at the end of the line. */
	label?: string;
	/** Draw index range only (inclusive), e.g. to show "the future" separately. */
	range?: [number, number];
};

export type ChartMarker = {
	series: string;
	index: number;
	label?: string;
	color?: string;
	shape?: 'dot' | 'up' | 'down' | 'x';
	/** Earliest frame the marker may show; it also waits for the line to reach it. */
	at?: number;
};

export type ChartBand = {
	axis: 'x' | 'y';
	from: number;
	to: number;
	label?: string;
	color?: string;
	at?: number;
	dashed?: boolean;
};

export type ChartRule = {
	axis: 'x' | 'y';
	value: number;
	label?: string;
	color?: string;
	dashed?: boolean;
	at?: number;
};

export type ChartProps = {
	width: number;
	height: number;
	series: ChartSeries[];
	markers?: ChartMarker[];
	bands?: ChartBand[];
	rules?: ChartRule[];
	yDomain?: [number, number];
	/** Fixed x length (defaults to the longest series). */
	xLength?: number;
	padding?: {top: number; right: number; bottom: number; left: number};
	grid?: boolean;
	/** Adds the ILLUSTRATIVE · NOT REAL DATA tag. Keep true for anything not from the PDF. */
	illustrative?: boolean;
	/** Vertical scanning playhead (backtest sweep). */
	playhead?: {from: number; duration: number; color?: string};
	/** Panel chrome (background + border). */
	panel?: boolean;
	title?: string;
	style?: React.CSSProperties;
};

const DEFAULT_PAD = {top: 40, right: 60, bottom: 40, left: 40};
const LABELLED_PAD = {...DEFAULT_PAD, right: 130};

/** Animated SVG line chart: draw-on lines, areas, markers, bands, rules and a playhead. */
export const Chart: React.FC<ChartProps> = ({
	width,
	height,
	series,
	markers = [],
	bands = [],
	rules = [],
	yDomain,
	xLength,
	padding: paddingProp,
	grid = true,
	illustrative = true,
	playhead,
	panel = true,
	title,
	style,
}) => {
	const frame = useCurrentFrame();
	const padding = paddingProp ?? (series.some((s) => s.label) ? LABELLED_PAD : DEFAULT_PAD);
	const n = xLength ?? Math.max(...series.map((s) => s.data.length));
	const all = series.flatMap((s) => s.data);
	const [yMin, yMax] = yDomain ?? padDomain(Math.min(...all), Math.max(...all));
	const iw = width - padding.left - padding.right;
	const ih = height - padding.top - padding.bottom;
	const x = (i: number) => padding.left + (i / Math.max(1, n - 1)) * iw;
	const y = (v: number) => padding.top + (1 - (v - yMin) / (yMax - yMin)) * ih;

	const drawState = new Map<string, number>();
	for (const s of series) {
		const p = progress(frame, s.drawFrom ?? 0, s.drawDuration ?? 60, EASE_IN_OUT);
		const [a, b] = s.range ?? [0, s.data.length - 1];
		drawState.set(s.id, a + (b - a) * p);
	}

	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				borderRadius: panel ? 18 : 0,
				background: panel ? `linear-gradient(180deg, ${colors.panelHi}, ${colors.panel})` : undefined,
				border: panel ? `1px solid ${colors.hairline}` : undefined,
				overflow: 'hidden',
				...style,
			}}
		>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					{series.map((s) => (
						<linearGradient key={s.id} id={`grad-${s.id}`} x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor={s.color ?? colors.signal} stopOpacity={0.28} />
							<stop offset="100%" stopColor={s.color ?? colors.signal} stopOpacity={0} />
						</linearGradient>
					))}
					<filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="5" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{grid
					? Array.from({length: 5}, (_, i) => {
							const gy = padding.top + (i / 4) * ih;
							return <line key={i} x1={padding.left} x2={padding.left + iw} y1={gy} y2={gy} stroke={colors.grid} strokeWidth={1} />;
						})
					: null}

				{bands.map((b, i) => {
					const o = progress(frame, b.at ?? 0, 20);
					const c = b.color ?? colors.cool;
					const rect =
						b.axis === 'x'
							? {x: x(b.from), y: padding.top, w: x(b.to) - x(b.from), h: ih}
							: {x: padding.left, y: y(Math.max(b.from, b.to)), w: iw, h: Math.abs(y(b.from) - y(b.to))};
					return (
						<g key={i} opacity={o}>
							<rect
								x={rect.x}
								y={rect.y}
								width={rect.w}
								height={rect.h}
								fill={c}
								fillOpacity={0.08}
								stroke={c}
								strokeOpacity={0.4}
								strokeDasharray={b.dashed ? '6 6' : undefined}
							/>
							{b.label ? (
								<text x={b.axis === 'y' ? rect.x + rect.w - 12 : rect.x + 12} y={b.axis === 'y' ? rect.y - 10 : rect.y + 26} textAnchor={b.axis === 'y' ? 'end' : 'start'} fill={c} fontFamily={fonts.sans} fontWeight={600} fontSize={16} letterSpacing="0.14em">
									{b.label}
								</text>
							) : null}
						</g>
					);
				})}

				{rules.map((r, i) => {
					const o = progress(frame, r.at ?? 0, 20);
					const c = r.color ?? colors.textLo;
					const p = progress(frame, r.at ?? 0, 30);
					if (r.axis === 'y') {
						const ry = y(r.value);
						return (
							<g key={i} opacity={o}>
								<line x1={padding.left} x2={padding.left + iw * p} y1={ry} y2={ry} stroke={c} strokeWidth={1.5} strokeDasharray={r.dashed ? '8 8' : undefined} />
								{r.label ? (
									<text x={padding.left + iw - 8} y={ry - 12} textAnchor="end" fill={c} fontFamily={fonts.sans} fontWeight={600} fontSize={16} letterSpacing="0.14em">
										{r.label}
									</text>
								) : null}
							</g>
						);
					}
					const rx = x(r.value);
					return (
						<g key={i} opacity={o}>
							<line x1={rx} x2={rx} y1={padding.top} y2={padding.top + ih * p} stroke={c} strokeWidth={2} strokeDasharray={r.dashed ? '8 8' : undefined} />
							{r.label ? (
								<text x={rx + 10} y={padding.top + 22} fill={c} fontFamily={fonts.sans} fontWeight={700} fontSize={16} letterSpacing="0.14em">
									{r.label}
								</text>
							) : null}
						</g>
					);
				})}

				{series.map((s) => {
					const head = drawState.get(s.id) ?? 0;
					const [a] = s.range ?? [0, s.data.length - 1];
					if (head <= a) return null;
					const pts = visiblePoints(s.data, a, head).map(([i, v]) => [x(i), y(v)] as const);
					const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
					const c = s.color ?? colors.signal;
					const last = pts[pts.length - 1];
					const floor = s.area === 'underwater' ? y(0) : padding.top + ih;
					const areaD = `${d} L${last[0].toFixed(1)},${floor} L${pts[0][0].toFixed(1)},${floor} Z`;
					return (
						<g key={s.id} opacity={s.opacity ?? 1}>
							{s.area === 'gradient' ? <path d={areaD} fill={`url(#grad-${s.id})`} /> : null}
							{s.area === 'underwater' ? <path d={areaD} fill={colors.loss} fillOpacity={0.22} /> : null}
							<path
								d={d}
								fill="none"
								stroke={c}
								strokeWidth={s.width ?? 3}
								strokeLinejoin="round"
								strokeLinecap="round"
								strokeDasharray={s.dashed ? '10 10' : undefined}
								filter={s.glow ? 'url(#chart-glow)' : undefined}
							/>
							{s.head !== false && head < (s.range?.[1] ?? s.data.length - 1) ? (
								<circle cx={last[0]} cy={last[1]} r={6} fill={c} filter="url(#chart-glow)" />
							) : null}
							{s.label ? (
								<text
									x={last[0] + 12}
									y={last[1] + 6}
									fill={c}
									fontFamily={fonts.mono}
									fontWeight={500}
									fontSize={18}
									opacity={map(head, [a + 1, a + 6], [0, 1])}
								>
									{s.label}
								</text>
							) : null}
						</g>
					);
				})}

				{markers.map((m, i) => {
					const s = series.find((ss) => ss.id === m.series);
					if (!s) return null;
					const head = drawState.get(s.id) ?? 0;
					if (head < m.index) return null;
					const appear = Math.max(m.at ?? 0, 0);
					if (frame < appear) return null;
					const pop = progress(frame, appear, 14);
					const mx = x(m.index);
					const my = y(s.data[m.index]);
					const c = m.color ?? colors.signal;
					return (
						<g key={i} transform={`translate(${mx} ${my}) scale(${pop})`}>
							<MarkerShape shape={m.shape ?? 'dot'} color={c} />
							{m.label ? (
								<g transform={`translate(0 ${m.shape === 'down' ? -34 : 44})`}>
									<text textAnchor="middle" fill={c} fontFamily={fonts.sans} fontWeight={700} fontSize={17} letterSpacing="0.12em">
										{m.label}
									</text>
								</g>
							) : null}
						</g>
					);
				})}

				{playhead
					? (() => {
							const p = progress(frame, playhead.from, playhead.duration, (t) => t);
							if (p <= 0 || p >= 1) return null;
							const px = padding.left + iw * p;
							const c = playhead.color ?? colors.signal;
							return (
								<g>
									<rect x={padding.left} y={padding.top} width={px - padding.left} height={ih} fill={c} fillOpacity={0.04} />
									<line x1={px} x2={px} y1={padding.top - 10} y2={padding.top + ih + 10} stroke={c} strokeWidth={2} filter="url(#chart-glow)" />
								</g>
							);
						})()
					: null}
			</svg>
			{title ? (
				<div
					style={{
						position: 'absolute',
						left: 24,
						top: 18,
						fontFamily: fonts.sans,
						fontWeight: 600,
						fontSize: 16,
						letterSpacing: '0.18em',
						color: colors.textLo,
					}}
				>
					{title}
				</div>
			) : null}
			{illustrative ? <IllustrativeTag /> : null}
		</div>
	);
};

const MarkerShape: React.FC<{shape: NonNullable<ChartMarker['shape']>; color: string}> = ({shape, color}) => {
	if (shape === 'up') return <path d="M0,-4 L12,18 L-12,18 Z" transform="translate(0 8)" fill={color} filter="url(#chart-glow)" />;
	if (shape === 'down') return <path d="M0,4 L12,-18 L-12,-18 Z" transform="translate(0 -8)" fill={color} filter="url(#chart-glow)" />;
	if (shape === 'x')
		return <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke={color} strokeWidth={4} strokeLinecap="round" filter="url(#chart-glow)" />;
	return (
		<>
			<circle r={16} fill={color} fillOpacity={0.15} />
			<circle r={8} fill={color} filter="url(#chart-glow)" />
		</>
	);
};

const padDomain = (min: number, max: number): [number, number] => {
	const pad = (max - min) * 0.12 || 1;
	return [min - pad, max + pad];
};

/** Points from index `a` up to fractional index `head` (interpolating the last point). */
const visiblePoints = (data: number[], a: number, head: number): [number, number][] => {
	const out: [number, number][] = [];
	const whole = Math.floor(head);
	for (let i = a; i <= Math.min(whole, data.length - 1); i++) out.push([i, data[i]]);
	const frac = head - whole;
	if (frac > 0 && whole + 1 < data.length) out.push([head, data[whole] + (data[whole + 1] - data[whole]) * frac]);
	if (out.length === 1) out.push(out[0]);
	return out;
};
