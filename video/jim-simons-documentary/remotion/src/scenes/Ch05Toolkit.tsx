import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {DataVisualization} from '../components/DataVisualization';
import {Icon, Kicker} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {meanRevertFuture, meanSeries, meanTrendFuture, pairA, pairB, pairSpread, trendSeries} from '../data/illustrative';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const CARDS = ['Statistical Arbitrage', 'Momentum & Trend', 'Mean Reversion', 'Factor Models'];
const INTRO = 30;

/** The 2×2 strategy grid: shows all four cards, then zooms into the active one. */
const ToolkitGrid: React.FC<{active: number}> = ({active}) => {
	const frame = useCurrentFrame();
	const zoom = progress(frame, 10, INTRO - 6);
	const out = 1 - progress(frame, INTRO - 8, 10);
	const col = active % 2;
	const row = Math.floor(active / 2);
	const originX = col === 0 ? '28%' : '72%';
	const originY = row === 0 ? '32%' : '68%';
	return (
		<AbsoluteFill style={{opacity: out, transform: `scale(${map(zoom, [0, 1], [1, 2.2])})`, transformOrigin: `${originX} ${originY}`}}>
			<div style={{position: 'absolute', left: 240, top: 180, width: 1440, height: 720, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40}}>
				{CARDS.map((c, i) => (
					<div
						key={c}
						style={{
							borderRadius: 20,
							border: `2px solid ${i === active ? colors.signal : colors.hairline}`,
							background: colors.panelHi,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: fonts.sans,
							fontWeight: 700,
							fontSize: 34,
							letterSpacing: '0.1em',
							color: i === active ? colors.signal : colors.textLo,
							boxShadow: i === active ? `0 0 50px ${colors.signal}33` : undefined,
						}}
					>
						{c.toUpperCase()}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const ToolHeader: React.FC<{n: number; title: string}> = ({n, title}) => (
	<div style={{position: 'absolute', left: 120, top: 96}}>
		<Kicker at={INTRO - 6}>{`Strategy type ${String(n).padStart(2, '0')} / 04`}</Kicker>
		<div style={{marginTop: 14}}>
			<BigText text={title} size={64} at={INTRO - 2} />
		</div>
	</div>
);

const Reveal: React.FC<{children: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{opacity: progress(frame, INTRO - 6, 14)}}>{children}</AbsoluteFill>;
};

/** S18 — Statistical arbitrage: pair diverges, spread leaves its normal band, "?" — the strategy tests reversion. */
export const S18: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const drawFrom = b.on('price relationship') - 10;
	const drawDur = Math.max(60, b.on('normal range') - drawFrom);
	return (
		<SceneShell>
			<ToolkitGrid active={0} />
			<Reveal>
				<ToolHeader n={1} title="Statistical arbitrage" />
				<div style={{position: 'absolute', left: 120, top: 260}}>
					<Chart
						width={1250}
						height={380}
						title="HISTORICALLY RELATED ASSETS"
						series={[
							{id: 'a', data: pairA, color: colors.signal, drawFrom, drawDuration: drawDur, label: 'A'},
							{id: 'b', data: pairB, color: colors.cool, drawFrom, drawDuration: drawDur, label: 'B'},
						]}
						bands={[{axis: 'x', from: 58, to: 88, label: 'TEMPORARILY WIDENS', color: colors.amber, at: b.on('widens') - 4}]}
					/>
					<div style={{height: 18}} />
					<Chart
						width={1250}
						height={230}
						title="SPREAD"
						series={[{id: 'spread', data: pairSpread, color: colors.textHi, drawFrom, drawDuration: drawDur, width: 2.5}]}
						bands={[{axis: 'y', from: 2.5, to: 5.5, label: 'NORMAL RANGE', color: colors.gain, at: b.on('normal range') - 30, dashed: true}]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1440, top: 400, width: 380}}>
					<div style={{fontFamily: fonts.serif, fontSize: 200, lineHeight: 1, color: colors.signal, opacity: progress(frame, b.on('revert'), 16), textShadow: `0 0 40px ${colors.signal}66`}}>?</div>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em', color: colors.textHi, marginTop: 10, opacity: progress(frame, b.on('revert'), 16)}}>
						WILL THE SPREAD REVERT?
						<div style={{color: colors.textLo, fontWeight: 500, fontSize: 20, marginTop: 8}}>The strategy tests it — it doesn't assume it.</div>
					</div>
				</div>
			</Reveal>
		</SceneShell>
	);
};

/** S19 — Momentum & trend following: ▲ long in the up-leg, ▼ short in the down-leg. */
export const S19: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const drawFrom = INTRO;
	const drawDur = Math.max(60, b.on('downtrend') - drawFrom + 10);
	return (
		<SceneShell>
			<ToolkitGrid active={1} />
			<Reveal>
				<ToolHeader n={2} title="Momentum & trend following" />
				<div style={{position: 'absolute', left: 120, top: 270}}>
					<Chart
						width={1680}
						height={520}
						series={[{id: 'p', data: trendSeries, color: colors.textHi, drawFrom, drawDuration: drawDur, width: 3}]}
						bands={[
							{axis: 'x', from: 8, to: 63, label: 'UPTREND', color: colors.gain, at: b.on('uptrend') - 20},
							{axis: 'x', from: 71, to: 121, label: 'DOWNTREND', color: colors.loss, at: b.on('downtrend') - 20},
						]}
						markers={[
							{series: 'p', index: 16, shape: 'up', color: colors.gain, label: 'LONG', at: b.on('long')},
							{series: 'p', index: 80, shape: 'down', color: colors.loss, label: 'SHORT', at: b.on('short')},
						]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1180, top: 110, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end'}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.12em', color: colors.gain, opacity: progress(frame, b.on('uptrend'), 14)}}>UPTREND → LONG</div>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.12em', color: colors.loss, opacity: progress(frame, b.on('downtrend'), 14)}}>DOWNTREND → SHORT</div>
				</div>
			</Reveal>
		</SceneShell>
	);
};

/** S20 — Mean reversion: oscillation around the mean, then a fork into two equally weighted futures. */
export const S20: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const forkAt = b.on('but the challenge') - 6;
	return (
		<SceneShell>
			<ToolkitGrid active={2} />
			<Reveal>
				<ToolHeader n={3} title="Mean reversion" />
				<div style={{position: 'absolute', left: 120, top: 270}}>
					<Chart
						width={1680}
						height={520}
						xLength={meanRevertFuture.length}
						series={[
							{id: 'p', data: meanSeries, color: colors.textHi, drawFrom: INTRO, drawDuration: Math.max(60, forkAt - INTRO), width: 3},
							{id: 'rev', data: meanRevertFuture, range: [meanSeries.length - 1, meanRevertFuture.length - 1], color: colors.gain, dashed: true, drawFrom: b.on('temporary overextension') - 6, drawDuration: 40, opacity: 0.8},
							{id: 'trend', data: meanTrendFuture, range: [meanSeries.length - 1, meanTrendFuture.length - 1], color: colors.amber, dashed: true, drawFrom: b.on('new trend') - 6, drawDuration: 40, opacity: 0.8},
						]}
						rules={[{axis: 'y', value: 100, label: 'AVERAGE / EQUILIBRIUM', color: colors.cool, dashed: true, at: b.on('average')}]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1400, top: 340, fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', color: colors.amber, opacity: progress(frame, b.on('new trend'), 14)}}>
					NEW TREND?
				</div>
				<div style={{position: 'absolute', left: 1360, top: 720, fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', color: colors.gain, opacity: progress(frame, b.on('temporary overextension'), 14)}}>
					TEMPORARY OVEREXTENSION?
				</div>
			</Reveal>
		</SceneShell>
	);
};

/** S21 — Factor models: four factor bars, then "predict one stock ✕ → tilt the portfolio ✓". */
export const S21: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const factors: [string, string, number][] = [
		['VALUE', 'value', 0.62],
		['MOMENTUM', 'momentum', 0.8],
		['QUALITY', 'quality', 0.55],
		['LOW VOLATILITY', 'low volatility', 0.7],
	];
	const tilt = progress(frame, b.on('tilted') - 4, 30);
	return (
		<SceneShell>
			<ToolkitGrid active={3} />
			<Reveal>
				<ToolHeader n={4} title="Factor-based models" />
				<div style={{position: 'absolute', left: 120, top: 300}}>
					<DataVisualization type="bars" width={900} height={420} items={factors.map(([label, phrase, value]) => ({label, value, at: b.on(phrase) - 4}))} />
				</div>
				<div style={{position: 'absolute', left: 1150, top: 300, width: 650}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: progress(frame, b.on('predicting') - 4, 14)}}>
						<Icon name="cross" size={52} color={colors.loss} draw={progress(frame, b.on('predicting') + 6, 14)} />
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, letterSpacing: '0.08em', color: colors.textMid}}>PREDICT ONE STOCK</div>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, opacity: progress(frame, b.on('tilted') - 4, 14)}}>
						<Icon name="check" size={52} color={colors.gain} draw={progress(frame, b.on('tilted'), 14)} />
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, letterSpacing: '0.08em', color: colors.textHi}}>TILT THE PORTFOLIO</div>
					</div>
					<svg width={620} height={260} style={{marginTop: 40, opacity: progress(frame, b.on('portfolio') - 6, 16)}}>
						<polygon points="310,220 280,260 340,260" fill={colors.textLo} />
						<g transform={`rotate(${tilt * -9} 310 214)`}>
							<rect x={40} y={206} width={540} height={10} rx={5} fill={colors.signal} />
							{factors.map(([label], i) => (
								<g key={label}>
									<rect x={60 + i * 130} y={206 - (40 + factors[i][2] * 60)} width={90} height={40 + factors[i][2] * 60} rx={8} fill={colors.panelHi} stroke={colors.signal} strokeOpacity={0.6} />
								</g>
							))}
						</g>
						<text x={310} y={40} textAnchor="middle" fill={colors.textLo} fontFamily={fonts.sans} fontWeight={600} fontSize={18} letterSpacing="0.2em">
							PORTFOLIO · FACTOR EXPOSURE
						</text>
					</svg>
				</div>
			</Reveal>
		</SceneShell>
	);
};
