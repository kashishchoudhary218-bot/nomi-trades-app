import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {DataVisualization} from '../components/DataVisualization';
import {Checklist, Icon, Kicker, Panel} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {divA, divB, divC, equityCurve, equityDrawdown} from '../data/illustrative';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const PrincipleHeader: React.FC<{n: string; title: string; at?: number; highlight?: string[]}> = ({n, title, at = 0, highlight}) => (
	<div style={{position: 'absolute', left: 120, top: 96}}>
		<Kicker at={at}>{`Principle ${n}`}</Kicker>
		<div style={{marginTop: 14}}>
			<BigText text={title} size={60} at={at + 4} highlight={highlight} />
		</div>
	</div>
);

/** S14 — Principle 1: the rulebook card locks four fields; three biases deflate. */
export const S14: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const fields: [string, string][] = [
		['ENTRY', 'entry'],
		['EXIT', 'exit'],
		['STOP LOSS', 'stop loss'],
		['POSITION SIZE', 'position size'],
	];
	const biases: [string, string, number, number][] = [
		['OVERCONFIDENCE', 'overconfidence', 1340, 380],
		['HESITATION', 'hesitation', 1560, 560],
		['CONFIRMATION BIAS', 'confirmation bias', 1300, 700],
	];
	const deflate = progress(frame, b.on('confirmation bias') + 24, 30);
	return (
		<SceneShell>
			<PrincipleHeader n="01" title="Systematic rules > discretionary judgement" at={b.on('Principle one') - 6} highlight={['rules']} />
			<div style={{position: 'absolute', left: 120, top: 320}}>
				<Panel style={{width: 860, padding: '28px 36px'}}>
					<div style={{fontFamily: fonts.mono, fontSize: 18, color: colors.textLo, letterSpacing: '0.1em', marginBottom: 14}}>RULEBOOK · DEFINED IN ADVANCE</div>
					{fields.map(([label, phrase]) => {
						const at = b.on(phrase) - 4;
						const typed = Math.floor(map(frame, [at, at + 20], [0, 17]));
						return (
							<div key={label} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderTop: `1px solid ${colors.hairline}`, opacity: map(frame, [at - 10, at], [0.35, 1])}}>
								<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: colors.textHi, width: 300}}>{label}</div>
								<div style={{flex: 1, fontFamily: fonts.mono, fontSize: 24, color: colors.textMid}}>{'Measurable rule ▸ '.slice(0, typed)}</div>
								<div style={{opacity: progress(frame, at + 18, 10)}}>
									<Icon name="lock" size={36} color={colors.signal} draw={progress(frame, at + 18, 14)} />
								</div>
							</div>
						);
					})}
				</Panel>
			</div>
			{biases.map(([label, phrase, x, y]) => {
				const p = progress(frame, b.on(phrase) - 4, 20);
				const r = 120 * p * (1 - deflate * 0.75);
				return (
					<div key={label} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', opacity: p * (1 - deflate * 0.8)}}>
						<div style={{width: r * 2, height: r * 2, borderRadius: '50%', border: `2px solid ${colors.loss}`, background: `${colors.loss}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 20 * (1 - deflate * 0.4), letterSpacing: '0.1em', color: colors.loss, textAlign: 'center', whiteSpace: 'nowrap'}}>{label}</div>
						</div>
					</div>
				);
			})}
		</SceneShell>
	);
};

/** S15 — Principle 2: a narrative bubble is shoved aside by a backtest report (placeholders, no invented results). */
export const S15: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const shove = progress(frame, b.on('Backtest your') - 6, 20);
	const rows: [string, string][] = [
		['PERFORMS IN…', 'performs'],
		['FAILS IN…', 'fails'],
		['MAX DRAWDOWN', 'drawdown'],
		['WIN RATE', 'win rate'],
		['AVG RISK : REWARD', 'risk-to-reward'],
	];
	return (
		<SceneShell>
			<PrincipleHeader n="02" title="Data & evidence > narrative" highlight={['evidence', 'data']} />
			<div
				style={{
					position: 'absolute',
					left: map(shove, [0, 1], [640, -900]),
					top: 420,
					opacity: 1 - shove,
					transform: `rotate(${shove * -8}deg)`,
				}}
			>
				<Panel style={{padding: '36px 48px', borderRadius: 40}}>
					<div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 52, color: colors.textMid}}>“I feel the market will go up.”</div>
					<div style={{fontFamily: fonts.sans, fontSize: 16, letterSpacing: '0.2em', color: colors.textLo, marginTop: 10}}>NARRATIVE · GENERIC EXAMPLE</div>
				</Panel>
			</div>
			<AbsoluteFill style={{opacity: shove}}>
				<div style={{position: 'absolute', left: 120, top: 290}}>
					<Chart width={860} height={300} title="EQUITY CURVE" series={[{id: 'eq', data: equityCurve, color: colors.signal, area: 'gradient', drawFrom: b.on('Backtest your'), drawDuration: 70}]} />
					<div style={{height: 20}} />
					<Chart
						width={860}
						height={230}
						title="DRAWDOWN"
						yDomain={[Math.min(...equityDrawdown) * 1.15, 1]}
						series={[{id: 'dd', data: equityDrawdown, color: colors.loss, area: 'underwater', drawFrom: b.on('drawdown') - 10, drawDuration: 60, width: 2}]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1040, top: 290}}>
					<Panel style={{width: 760, padding: '26px 34px'}}>
						<div style={{fontFamily: fonts.mono, fontSize: 18, color: colors.textLo, letterSpacing: '0.1em', marginBottom: 8}}>BACKTEST REPORT</div>
						{rows.map(([label, phrase]) => {
							const at = b.on(phrase) - 4;
							const p = progress(frame, at, 16);
							return (
								<div key={label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '17px 0', borderTop: `1px solid ${colors.hairline}`, opacity: 0.25 + p * 0.75}}>
									<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: p > 0.5 ? colors.textHi : colors.textLo}}>{label}</div>
									<div style={{width: 160 * p, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${colors.signal}55, ${colors.signal})`}} />
								</div>
							);
						})}
					</Panel>
				</div>
				<div style={{position: 'absolute', left: 1040, top: 760, opacity: progress(frame, b.on("doesn't guarantee") - 4, 16)}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.12em', color: colors.amber}}>BACKTEST ≠ GUARANTEE · IT'S A BASELINE</div>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S16 — Principle 3: a four-segment shield locks in; losing candles bounce off. */
export const S16: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const rules: [string, string][] = [
		['CONSISTENT POSITION SIZING', 'consistent'],
		['MAX LOSS PER TRADE', 'per trade'],
		['MAX LOSS PER DAY · WEEK', 'weekly maximum loss'],
		['NO EXTRA RISK AFTER A WINNING STREAK', 'winning streak'],
	];
	const segAt = rules.map(([, p]) => b.on(p) - 4);
	const goal = b.on('The goal');
	const shield = 'M300,60 L520,140 V330 C520,480 420,580 300,630 C180,580 80,480 80,330 V140 Z';
	const quads = [
		{x: 0, y: 0},
		{x: 300, y: 0},
		{x: 0, y: 345},
		{x: 300, y: 345},
	];
	return (
		<SceneShell glow={colors.gain} glowPosition="25% 55%">
			<PrincipleHeader n="03" title="Risk management is non-negotiable" />
			<div style={{position: 'absolute', left: 150, top: 290}}>
				<svg width={600} height={680}>
					<defs>
						{quads.map((q, i) => (
							<clipPath key={i} id={`q${i}`}>
								<rect x={q.x + 4} y={q.y + 4} width={292} height={337} />
							</clipPath>
						))}
					</defs>
					<path d={shield} fill="none" stroke={colors.hairline} strokeWidth={2} />
					{quads.map((_, i) => {
						const p = progress(frame, segAt[i], 16);
						return (
							<g key={i} clipPath={`url(#q${i})`} opacity={p}>
								<path d={shield} fill={colors.gain} fillOpacity={0.16 + p * 0.1} stroke={colors.gain} strokeWidth={4} />
							</g>
						);
					})}
					<g transform="translate(262 300)" opacity={progress(frame, segAt[3] + 10, 16)}>
						<path d="M8 36l20 20L70 12" fill="none" stroke={colors.gain} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
					</g>
				</svg>
				{Array.from({length: 5}, (_, i) => {
					const t0 = goal + i * 9;
					const t = frame - t0;
					if (t < 0 || t > 40) return null;
					const x = t < 18 ? map(t, [0, 18], [1100, 560]) : map(t, [18, 40], [560, 760 + i * 30]);
					const y = 260 + i * 60 + (t >= 18 ? (t - 18) * (i - 2) * 3 : 0);
					return (
						<div key={i} style={{position: 'absolute', left: x, top: y, opacity: t < 18 ? 1 : 1 - (t - 18) / 22}}>
							<div style={{width: 3, height: 90, background: colors.loss, margin: '0 auto', position: 'absolute', left: 14, top: -20}} />
							<div style={{width: 30, height: 56, background: colors.loss, borderRadius: 3, position: 'relative', boxShadow: `0 0 20px ${colors.loss}88`}} />
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 900, top: 330}}>
				<Checklist items={rules.map(([label], i) => ({label, at: segAt[i], state: 'check' as const}))} size={30} gap={30} />
			</div>
			<div style={{position: 'absolute', left: 900, top: 740, opacity: progress(frame, goal, 20)}}>
				<BigText text="No single trade — or streak — breaks the account." size={44} at={goal} stagger={2} highlight={['breaks']} highlightColor={colors.gain} />
			</div>
		</SceneShell>
	);
};

/** S17 — Principle 4: instrument mosaic → one cracked tile → less-correlated lines. */
export const S17: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const tileAt = b.on('At retail level') - 6;
	const crackAt = b.on('one instrument');
	const divAt = b.on('Diversifying') - 10;
	const mosaicO = 1 - progress(frame, tileAt, 16);
	const tileO = progress(frame, tileAt + 8, 16) * (1 - progress(frame, divAt, 16));
	const crack = progress(frame, crackAt, 20);
	return (
		<SceneShell>
			<PrincipleHeader n="04" title="Diversify across markets & signals" />
			<AbsoluteFill style={{opacity: mosaicO}}>
				<div style={{position: 'absolute', left: 120, top: 280}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: colors.textHi, opacity: progress(frame, b.on('hundreds of instruments') - 4, 16)}}>
						HUNDREDS OF INSTRUMENTS <span style={{color: colors.textLo, fontWeight: 500}}>(REPORTEDLY)</span>
					</div>
				</div>
				<div style={{position: 'absolute', left: 120, top: 360}}>
					<DataVisualization
						type="mosaic"
						width={1680}
						height={440}
						at={b.on('hundreds of instruments') - 8}
						labelsAt={b.on('equities')}
						clusters={[
							{label: 'EQUITIES', color: colors.signal, count: 72},
							{label: 'BONDS', color: colors.cool, count: 60},
							{label: 'CURRENCIES', color: colors.gold, count: 64},
							{label: 'COMMODITIES', color: colors.gain, count: 56},
							{label: 'DERIVATIVES', color: colors.amber, count: 60},
						]}
					/>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: tileO}}>
				<div style={{position: 'relative', width: 360, height: 360, marginTop: 60}}>
					<div style={{position: 'absolute', inset: 0, borderRadius: 24, background: colors.panelHi, border: `2px solid ${crack > 0 ? colors.loss : colors.signal}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: colors.textHi, textAlign: 'center'}}>
							ONE INSTRUMENT
							<br />
							ONE STRATEGY
						</div>
					</div>
					<svg width={360} height={360} style={{position: 'absolute', inset: 0}}>
						<path d="M180,0 L165,90 L200,150 L150,230 L190,300 L170,360" fill="none" stroke={colors.loss} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
						<path d="M200,150 L290,170 L360,150" fill="none" stroke={colors.loss} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
					</svg>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: progress(frame, divAt + 6, 16)}}>
				<div style={{position: 'absolute', left: 120, top: 290}}>
					<Chart
						width={1100}
						height={500}
						title="LESS-CORRELATED MARKETS / STRATEGIES"
						series={[
							{id: 'a', data: divA, color: colors.signal, drawFrom: divAt + 6, drawDuration: 70, label: 'A'},
							{id: 'b', data: divB, color: colors.cool, drawFrom: divAt + 12, drawDuration: 70, label: 'B'},
							{id: 'c', data: divC, color: colors.gold, drawFrom: divAt + 18, drawDuration: 70, label: 'C'},
						]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1300, top: 430, width: 500}}>
					<BigText text={'Less-correlated\n→ less dependence\non one edge'} size={52} at={b.on('reduce your dependence') - 6} highlight={['less-correlated']} />
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};
