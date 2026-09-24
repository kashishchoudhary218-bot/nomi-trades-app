import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Chart, type ChartMarker} from '../components/Chart';
import {Kicker, Panel} from '../components/Primitives';
import {QuoteCard} from '../components/QuoteCard';
import {SceneShell} from '../components/SceneShell';
import {maExample} from '../data/illustrative';
import {progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const RULE_LINES = ['IF  MA(20) crosses ABOVE MA(50)  →  BUY', 'IF  MA(20) crosses BELOW MA(50)  →  EXIT'];
const HIGHLIGHTS = [
	{text: 'MA(20)', color: colors.signal},
	{text: 'MA(50)', color: colors.cool},
	{text: 'BUY', color: colors.gain},
	{text: 'EXIT', color: colors.textMid},
];

const crossMarkers = (at: number): ChartMarker[] =>
	maExample.crosses.map((c) => ({
		series: 'ma20',
		index: c.index,
		shape: 'dot',
		color: c.direction === 'up' ? colors.gain : colors.textMid,
		label: c.direction === 'up' ? 'BUY' : 'EXIT',
		at,
	}));

/** S22 — "One Precise Rule": the PDF's example rule typed in sync with the VO, MAs drawing below. */
export const S22: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const typeFrom = b.on("I'll buy") - 4;
	const typeTo = b.voEnd;
	const chars = RULE_LINES.join('').length + 12;
	const speed = chars / Math.max(30, typeTo - typeFrom);
	return (
		<SceneShell camera={{from: 1, to: 1.03}}>
			<div style={{position: 'absolute', left: 120, top: 96, opacity: progress(frame, 0, 16)}}>
				<Kicker>No Renaissance-level math required</Kicker>
				<div style={{marginTop: 12, fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, letterSpacing: '0.1em', color: colors.textHi, opacity: progress(frame, b.on('one precise') - 4, 16)}}>
					STEP 1 · A PRECISE, TESTABLE RULE
				</div>
			</div>
			<div style={{position: 'absolute', left: 120, top: 230}}>
				<QuoteCard variant="code" lines={RULE_LINES} highlights={HIGHLIGHTS} at={typeFrom - 14} speed={speed} width={1100} title="rule.txt — example from the source guide" />
			</div>
			<AbsoluteFill style={{opacity: progress(frame, typeFrom, 20)}}>
				<div style={{position: 'absolute', left: 120, top: 560}}>
					<Chart
						width={1680}
						height={300}
						series={[
							{id: 'price', data: maExample.price, color: colors.textLo, width: 1.5, drawFrom: typeFrom, drawDuration: typeTo - typeFrom, head: false},
							{id: 'ma20', data: maExample.ma20, color: colors.signal, width: 3, glow: true, drawFrom: typeFrom + 6, drawDuration: typeTo - typeFrom, label: 'MA(20)'},
							{id: 'ma50', data: maExample.ma50, color: colors.cool, width: 3, drawFrom: typeFrom + 12, drawDuration: typeTo - typeFrom, label: 'MA(50)'},
						]}
						markers={crossMarkers(typeFrom)}
					/>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S23 — "Now Test It": backtest playhead + regime bands + metric tiles (placeholders — the PDF gives no results). */
export const S23: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const tiles: [string, string][] = [
		['WIN RATE', 'win rate'],
		['DRAWDOWN', 'drawdown'],
		['AVG R:R', 'risk-to-reward'],
		['MARKET CONDITIONS', 'market conditions'],
	];
	const n = maExample.price.length;
	return (
		<SceneShell camera={{from: 1.02, to: 1.06}}>
			<div style={{position: 'absolute', left: 120, top: 96}}>
				<Kicker>Backtest on historical data</Kicker>
			</div>
			<div style={{position: 'absolute', left: 120, top: 160}}>
				<Chart
					width={1680}
					height={500}
					series={[
						{id: 'price', data: maExample.price, color: colors.textLo, width: 1.5, drawDuration: 1, head: false},
						{id: 'ma20', data: maExample.ma20, color: colors.signal, width: 3, drawDuration: 1, head: false},
						{id: 'ma50', data: maExample.ma50, color: colors.cool, width: 3, drawDuration: 1, head: false},
					]}
					bands={[
						{axis: 'x', from: 0, to: Math.round(n * 0.2), label: 'RANGE-BOUND', color: colors.textLo, at: b.on('market conditions') - 10},
						{axis: 'x', from: Math.round(n * 0.2), to: Math.round(n * 0.55), label: 'TRENDING', color: colors.gain, at: b.on('market conditions') - 6},
						{axis: 'x', from: Math.round(n * 0.55), to: n - 1, label: 'TRENDING', color: colors.loss, at: b.on('market conditions') - 2},
					]}
					markers={crossMarkers(0).map((m) => ({...m, at: 6 + (m.index / n) * (b.voEnd - 6)}))}
					playhead={{from: 6, duration: b.voEnd - 6}}
				/>
			</div>
			<div style={{position: 'absolute', left: 120, top: 700, display: 'flex', gap: 24}}>
				{tiles.map(([label, phrase]) => {
					const at = b.on(phrase) - 4;
					const flip = progress(frame, at, 18);
					return (
						<Panel key={label} style={{width: 402, height: 130, padding: '20px 26px', transform: `perspective(800px) rotateX(${(1 - flip) * 90}deg)`, opacity: flip}}>
							<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.18em', color: colors.textLo}}>{label}</div>
							<div style={{fontFamily: fonts.mono, fontSize: 46, color: colors.textHi, marginTop: 10}}>— —</div>
						</Panel>
					);
				})}
			</div>
		</SceneShell>
	);
};
