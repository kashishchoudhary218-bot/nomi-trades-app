import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {map, progress} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';
import {IllustrativeTag} from './Primitives';
import {useSvgId} from '../lib/useSvgId';

type Common = {width: number; height: number; at?: number; illustrative?: boolean; style?: React.CSSProperties};

export type BarsViz = Common & {
	type: 'bars';
	/** value is relative 0–1 (no fabricated numbers are ever printed). */
	items: {label: string; value: number; color?: string; at?: number}[];
	stagger?: number;
};

export type WaterfallViz = Common & {
	type: 'waterfall';
	/** First item is the starting total; following items are deltas (negative = cost); last total auto-computed. */
	start: {label: string; value: number};
	steps: {label: string; value: number}[];
	endLabel: string;
	stagger?: number;
	/** Explicit frame per step (overrides stagger) — use narration beats. The end bar follows the last step. */
	stepAts?: number[];
};

export type ScatterViz = Common & {
	type: 'scatter';
	count?: number;
	seed?: string;
	/** Frame at which the hidden periodic pattern lights up. */
	revealAt: number;
};

export type MosaicViz = Common & {
	type: 'mosaic';
	clusters: {label: string; color: string; count: number}[];
	/** Frame the cluster labels appear. */
	labelsAt?: number;
	dot?: number;
};

export type DataVisualizationProps = BarsViz | WaterfallViz | ScatterViz | MosaicViz;

/** Bars, cost waterfall, noise→pattern scatter and instrument mosaic — all animated. */
export const DataVisualization: React.FC<DataVisualizationProps> = (props) => {
	const {width, height, illustrative = true, style} = props;
	return (
		<div style={{position: 'relative', width, height, ...style}}>
			{props.type === 'bars' ? <Bars {...props} /> : null}
			{props.type === 'waterfall' ? <Waterfall {...props} /> : null}
			{props.type === 'scatter' ? <Scatter {...props} /> : null}
			{props.type === 'mosaic' ? <Mosaic {...props} /> : null}
			{illustrative ? <IllustrativeTag style={{bottom: -28, right: 0}} /> : null}
		</div>
	);
};

const labelStyle: React.CSSProperties = {
	fontFamily: fonts.sans,
	fontWeight: 600,
	fontSize: 22,
	letterSpacing: '0.12em',
	color: colors.textMid,
};

const Bars: React.FC<BarsViz> = ({items, width, height, at = 0, stagger = 8}) => {
	const frame = useCurrentFrame();
	const rowH = height / items.length;
	const labelW = 300;
	return (
		<>
			{items.map((item, i) => {
				const p = progress(frame, item.at ?? at + i * stagger, 30);
				const c = item.color ?? colors.signal;
				return (
					<div key={item.label} style={{position: 'absolute', top: i * rowH, left: 0, width, height: rowH, display: 'flex', alignItems: 'center'}}>
						<div style={{...labelStyle, width: labelW, opacity: p}}>{item.label}</div>
						<div style={{flex: 1, height: rowH * 0.34, background: colors.grid, borderRadius: 6, overflow: 'hidden'}}>
							<div
								style={{
									height: '100%',
									width: `${item.value * 100 * p}%`,
									background: `linear-gradient(90deg, ${c}66, ${c})`,
									boxShadow: `0 0 24px ${c}66`,
									borderRadius: 6,
								}}
							/>
						</div>
					</div>
				);
			})}
		</>
	);
};

const Waterfall: React.FC<WaterfallViz> = ({start, steps, endLabel, width, height, at = 0, stagger = 22, stepAts}) => {
	const frame = useCurrentFrame();
	const cols = steps.length + 2;
	const colW = width / cols;
	const barW = colW * 0.56;
	const top = 20;
	const base = height - 70;
	const scale = (base - top) / start.value;
	let level = start.value;
	const bars = [
		{label: start.label, from: 0, to: start.value, kind: 'total' as const, at},
		...steps.map((s, i) => {
			const b = {label: s.label, from: level + s.value, to: level, kind: 'delta' as const, at: stepAts?.[i] ?? at + (i + 1) * stagger};
			level += s.value;
			return b;
		}),
		{label: endLabel, from: 0, to: level, kind: 'end' as const, at: (stepAts ? stepAts[stepAts.length - 1] + stagger : at + (steps.length + 1) * stagger)},
	];
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<line x1={0} x2={width} y1={base} y2={base} stroke={colors.hairline} />
			{bars.map((b, i) => {
				const p = progress(frame, b.at, 24);
				const x = i * colW + (colW - barW) / 2;
				const y1 = base - b.to * scale;
				const h = (b.to - b.from) * scale;
				const c = b.kind === 'delta' ? colors.loss : b.kind === 'end' ? colors.gain : colors.signal;
				const drop = b.kind === 'delta' ? map(frame, [b.at, b.at + 24], [0, 40]) : 0;
				const grow = b.kind === 'delta' ? 1 : p;
				return (
					<g key={b.label} opacity={b.kind === 'delta' ? map(frame, [b.at, b.at + 8], [0, 1]) * (1 - 0.35 * p) : 1}>
						<rect
							x={x}
							y={b.kind === 'delta' ? y1 + drop : y1 + h * (1 - grow)}
							width={barW}
							height={h * grow}
							rx={6}
							fill={c}
							fillOpacity={b.kind === 'delta' ? 0.55 : 0.9}
						/>
						{i < bars.length - 1 ? (
							<line
								x1={x + barW}
								x2={x + colW}
								y1={base - (b.kind === 'delta' ? b.from : b.to) * scale}
								y2={base - (b.kind === 'delta' ? b.from : b.to) * scale}
								stroke={colors.textLo}
								strokeDasharray="4 6"
								opacity={p}
							/>
						) : null}
						<foreignObject x={i * colW} y={base + 14} width={colW} height={60}>
							<div style={{...labelStyle, fontSize: 16, textAlign: 'center', opacity: map(frame, [b.at, b.at + 10], [0, 1])}}>{b.label}</div>
						</foreignObject>
					</g>
				);
			})}
		</svg>
	);
};

const Scatter: React.FC<ScatterViz> = ({width, height, count = 420, seed = 'scatter', revealAt, at = 0}) => {
	const frame = useCurrentFrame();
	const id = useSvgId('scatter');
	const reveal = progress(frame, revealAt, 40);
	const pts = Array.from({length: count}, (_, i) => {
		const px = random(`${seed}-x-${i}`) * width;
		const onPattern = i % 4 === 0;
		const wave = height / 2 + Math.sin((px / width) * Math.PI * 6) * height * 0.22;
		const py = onPattern ? wave + (random(`${seed}-j-${i}`) - 0.5) * 16 : random(`${seed}-y-${i}`) * height;
		const appear = progress(frame, at + random(`${seed}-a-${i}`) * 30, 16);
		return {px, py, onPattern, appear};
	});
	const curve = Array.from({length: 121}, (_, k) => {
		const px = (k / 120) * width;
		return `${k === 0 ? 'M' : 'L'}${px.toFixed(1)},${(height / 2 + Math.sin((px / width) * Math.PI * 6) * height * 0.22).toFixed(1)}`;
	}).join(' ');
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<defs>
				<filter id={id('glow')}>
					<feGaussianBlur stdDeviation="4" result="b" />
					<feMerge>
						<feMergeNode in="b" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{pts.map((p, i) => (
				<circle
					key={i}
					cx={p.px}
					cy={p.py}
					r={p.onPattern ? 3 + reveal * 1.5 : 2.6}
					fill={p.onPattern ? mix(colors.textLo, colors.signal, reveal) : colors.textLo}
					opacity={p.appear * (p.onPattern ? 0.5 + reveal * 0.5 : 0.5 - reveal * 0.25)}
					filter={p.onPattern && reveal > 0.5 ? `url(#${id('glow')})` : undefined}
				/>
			))}
			<path
				d={curve}
				fill="none"
				stroke={colors.signal}
				strokeWidth={2}
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - progress(frame, revealAt + 20, 50)}
				opacity={0.7}
				filter={`url(#${id('glow')})`}
			/>
		</svg>
	);
};

const Mosaic: React.FC<MosaicViz> = ({clusters, width, height, at = 0, labelsAt, dot = 12}) => {
	const frame = useCurrentFrame();
	const gap = 36;
	const clusterW = (width - gap * (clusters.length - 1)) / clusters.length;
	const pitch = dot + 6;
	const perRow = Math.max(1, Math.floor(clusterW / pitch));
	const cx = width / 2;
	const cy = (height - 60) / 2;
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			{clusters.map((c, ci) => {
				const ox = ci * (clusterW + gap);
				const rows = Math.ceil(c.count / perRow);
				const oy = (height - 60 - rows * pitch) / 2;
				const lp = progress(frame, labelsAt ?? at + 40, 20);
				return (
					<g key={c.label}>
						{Array.from({length: c.count}, (_, i) => {
							const x = ox + (i % perRow) * pitch;
							const y = oy + Math.floor(i / perRow) * pitch;
							const dist = Math.hypot(x - cx, y - cy) / Math.hypot(cx, cy);
							const p = progress(frame, at + dist * 36, 14);
							return <rect key={i} x={x} y={y} width={dot * p} height={dot * p} rx={2} fill={c.color} opacity={0.35 + 0.55 * p * random(`m-${ci}-${i}`)} />;
						})}
						<foreignObject x={ox} y={height - 50} width={clusterW} height={50}>
							<div style={{...labelStyle, fontSize: 19, textAlign: 'center', color: c.color, opacity: lp}}>{c.label}</div>
						</foreignObject>
					</g>
				);
			})}
		</svg>
	);
};

const mix = (a: string, b: string, t: number): string => {
	const pa = hex(a);
	const pb = hex(b);
	const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
	return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};
const hex = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
