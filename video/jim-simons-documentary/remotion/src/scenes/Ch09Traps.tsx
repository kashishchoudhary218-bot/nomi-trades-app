import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {DataVisualization} from '../components/DataVisualization';
import {Icon, IllustrativeTag, Kicker, Panel} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {impactSeries} from '../data/illustrative';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const TrapHeader: React.FC<{kicker: string; title: string; at?: number}> = ({kicker, title, at = 0}) => (
	<div style={{position: 'absolute', left: 120, top: 96}}>
		<Kicker at={at}>{kicker}</Kicker>
		<div style={{marginTop: 14}}>
			<BigText text={title} size={64} at={at + 4} />
		</div>
	</div>
);

// Overfitting points: gentle true pattern + noise. In-sample = first 60%.
const OF_N = 40;
const ofPoints = Array.from({length: OF_N}, (_, i) => {
	const x = i / (OF_N - 1);
	const truth = Math.sin(x * Math.PI * 2) * 0.25;
	return {x, y: truth + (random(`of-${i}`) - 0.5) * 0.5, truth};
});
const SPLIT = 0.6;

/** S28 — Overfitting: a curve that hits every in-sample point fails past the LIVE MARKET divider. */
export const S28: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const W = 1680;
	const H = 520;
	const px = (x: number) => 40 + x * (W - 80);
	const py = (y: number) => H / 2 - y * (H * 0.75);
	const inS = ofPoints.filter((p) => p.x <= SPLIT);
	const outS = ofPoints.filter((p) => p.x > SPLIT);
	const fitAt = b.on('optimizing') - 6;
	const liveAt = b.on('but it fails') - 10;
	const fit = progress(frame, fitAt, 50);
	// Overfit path: exact through in-sample points, then wild extrapolation.
	const wild = outS.map((p, i) => ({x: p.x, y: inS[inS.length - 1].y + Math.sin(i * 1.9) * 0.55 + i * 0.05}));
	const toPath = (pts: {x: number; y: number}[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(' ');
	const inPath = toPath(inS);
	const livePath = toPath([inS[inS.length - 1], ...wild]);
	const truthPath = Array.from({length: 101}, (_, i) => {
		const x = i / 100;
		return `${i === 0 ? 'M' : 'L'}${px(x).toFixed(1)},${py(Math.sin(x * Math.PI * 2) * 0.25).toFixed(1)}`;
	}).join(' ');
	const fail = progress(frame, liveAt + 12, 16);
	return (
		<SceneShell>
			<TrapHeader kicker="The biggest trap" title="Overfitting" />
			<div style={{position: 'absolute', left: 120, top: 270}}>
				<Panel style={{width: W, height: H, overflow: 'hidden'}}>
					<svg width={W} height={H}>
						<rect x={px(SPLIT)} y={0} width={W - px(SPLIT)} height={H} fill={colors.loss} opacity={0.07 * fail} />
						{inS.map((p, i) => (
							<circle key={i} cx={px(p.x)} cy={py(p.y)} r={7} fill={colors.textMid} opacity={progress(frame, i * 1.5, 10)} />
						))}
						{outS.map((p, i) => (
							<circle key={i} cx={px(p.x)} cy={py(p.y)} r={7} fill={colors.cool} opacity={progress(frame, liveAt + i * 2, 10)} />
						))}
						<path d={inPath} fill="none" stroke={colors.signal} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fit} style={{filter: `drop-shadow(0 0 8px ${colors.signal})`}} />
						<path d={livePath} fill="none" stroke={colors.loss} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress(frame, liveAt + 6, 30)} />
						<line x1={px(SPLIT)} x2={px(SPLIT)} y1={0} y2={H} stroke={colors.textHi} strokeWidth={2} strokeDasharray="8 8" opacity={progress(frame, liveAt, 12)} />
						<text x={px(SPLIT) + 16} y={34} fill={colors.textHi} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.16em" opacity={progress(frame, liveAt, 12)}>
							LIVE MARKET →
						</text>
						<text x={24} y={34} fill={colors.textLo} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.16em">
							HISTORICAL DATA
						</text>
						<path d={truthPath} fill="none" stroke={colors.cool} strokeWidth={2.5} strokeDasharray="10 10" opacity={progress(frame, b.on('real market pattern') - 6, 20)} />
					</svg>
					<IllustrativeTag />
				</Panel>
			</div>
			<div style={{position: 'absolute', left: 120, top: 810, display: 'flex', gap: 60}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: progress(frame, b.on('backtest looks strong') - 4, 14)}}>
					<Icon name="check" size={34} color={colors.gain} draw={progress(frame, b.on('backtest looks strong'), 14)} />
					<span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: colors.textHi}}>BACKTEST: LOOKS STRONG</span>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: progress(frame, liveAt + 12, 14)}}>
					<Icon name="cross" size={34} color={colors.loss} draw={progress(frame, liveAt + 16, 14)} />
					<span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: colors.textHi}}>LIVE: FAILS</span>
				</div>
				<div style={{opacity: progress(frame, b.on('learning historical noise') - 4, 14), fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color: colors.amber}}>
					LEARNED NOISE ≠ PATTERN
				</div>
			</div>
		</SceneShell>
	);
};

/** S29 — Out-of-sample testing: build on one block, unseal the other only to test. */
export const S29: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const unseal = progress(frame, b.on('separate data'), 16);
	const build = progress(frame, 10, Math.max(20, b.on('separate data') - 16));
	return (
		<SceneShell>
			<TrapHeader kicker="One defence" title="Out-of-sample testing" />
			<div style={{position: 'absolute', left: 120, top: 380, width: 1680, height: 160, display: 'flex', gap: 12}}>
				<div style={{flex: 6, borderRadius: 14, border: `2px solid ${colors.cool}`, position: 'relative', overflow: 'hidden'}}>
					<div style={{position: 'absolute', inset: 0, width: `${build * 100}%`, background: `${colors.cool}33`}} />
					<div style={{position: 'absolute', left: 28, top: 52, fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: colors.cool}}>IN-SAMPLE · BUILD</div>
				</div>
				<div style={{flex: 4, borderRadius: 14, border: `2px solid ${unseal > 0 ? colors.signal : colors.hairline}`, position: 'relative', overflow: 'hidden', background: `${colors.signal}${unseal > 0.5 ? '22' : '00'}`}}>
					<div style={{position: 'absolute', left: 28, top: 52, fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: unseal > 0.5 ? colors.signal : colors.textLo}}>OUT-OF-SAMPLE · TEST</div>
					<div style={{position: 'absolute', right: 28, top: 46, transform: `translateY(${-unseal * 20}px) rotate(${unseal * -18}deg)`, opacity: 1 - unseal * 0.6}}>
						<Icon name="lock" size={60} color={unseal > 0 ? colors.signal : colors.textLo} />
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 120, top: 600, opacity: progress(frame, b.on("wasn't used"), 16)}}>
				<BigText text="Data not used in development → reduces overfitting risk" font="sans" size={36} weight={600} tracking="0.06em" at={b.on("wasn't used")} highlight={['reduces']} />
			</div>
		</SceneShell>
	);
};

/** S30 — Transaction costs as a waterfall; high turnover spins the dial. */
export const S30: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const turnAt = b.on('High-turnover') - 6;
	const needle = map(frame, [turnAt, turnAt + 30], [-110, 70]);
	return (
		<SceneShell glow={colors.loss} glowPosition="35% 60%">
			<TrapHeader kicker="The hidden tax" title="Transaction costs" />
			<div style={{position: 'absolute', left: 120, top: 300}}>
				<DataVisualization
					type="waterfall"
					width={1100}
					height={520}
					at={b.on('Your real cost') - 6}
					start={{label: 'GROSS EDGE', value: 100}}
					steps={[
						{label: 'SPREAD', value: -14},
						{label: 'COMMISSION', value: -10},
						{label: 'SLIPPAGE / IMPACT', value: -16},
						{label: 'OVERNIGHT FINANCING', value: -9},
					]}
					stepAts={[b.on('spread'), b.on('commission'), b.on('slippage'), b.on('overnight financing')]}
					endLabel="NET EDGE"
				/>
			</div>
			<div style={{position: 'absolute', left: 1340, top: 330, opacity: progress(frame, turnAt, 16)}}>
				<svg width={440} height={280}>
					<path d="M40,240 A180,180 0 0,1 400,240" fill="none" stroke={colors.hairline} strokeWidth={16} strokeLinecap="round" />
					<path d="M40,240 A180,180 0 0,1 400,240" fill="none" stroke={colors.loss} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${progress(frame, turnAt, 30)} 1`} />
					<line x1={220} y1={240} x2={220} y2={90} stroke={colors.textHi} strokeWidth={6} strokeLinecap="round" transform={`rotate(${needle} 220 240)`} />
					<circle cx={220} cy={240} r={14} fill={colors.textHi} />
				</svg>
				<div style={{textAlign: 'center', fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.16em', color: colors.textHi}}>TURNOVER</div>
				<div style={{textAlign: 'center', marginTop: 12, fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.12em', color: colors.loss, opacity: progress(frame, b.on('especially sensitive') - 4, 14)}}>
					HIGH TURNOVER = HIGH SENSITIVITY
				</div>
			</div>
		</SceneShell>
	);
};

/** S31 — Capacity limits (left) and signal degradation (right). */
export const S31: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const hit = b.on('large orders');
	const retail = b.on('small retail accounts') - 4;
	const degAt = b.on('signal degradation') - 6;
	const crowdAt = b.on('many traders') - 20;
	const crowd = progress(frame, crowdAt, 60);
	const strength = 1 - crowd * 0.8;
	return (
		<SceneShell grid={false}>
			<div style={{position: 'absolute', left: 959, top: 80, width: 2, height: 800, background: colors.hairline}} />
			<div style={{position: 'absolute', left: 120, top: 96}}>
				<Kicker>Capacity limits</Kicker>
			</div>
			<div style={{position: 'absolute', left: 1040, top: 96, opacity: progress(frame, degAt, 16)}}>
				<Kicker>Signal degradation</Kicker>
			</div>
			<div style={{position: 'absolute', left: 120, top: 190}}>
				<Chart
					width={760}
					height={420}
					series={[{id: 'p', data: impactSeries, color: colors.cool, drawFrom: 0, drawDuration: Math.max(30, hit + 20)}]}
					rules={[{axis: 'x', value: 60, label: 'TOO MUCH CAPITAL', color: colors.loss, dashed: true, at: hit}]}
				/>
				<div style={{marginTop: 26, display: 'flex', gap: 30, alignItems: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, hit, 14)}}>
						<div style={{width: 64, height: 64, borderRadius: 8, background: colors.loss, boxShadow: `0 0 30px ${colors.loss}88`}} />
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', color: colors.textHi}}>
							LARGE ORDERS
							<br />→ LOWER RETURNS
						</div>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, retail, 14)}}>
						<div style={{width: 20, height: 20, borderRadius: 4, background: colors.gain}} />
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', color: colors.textHi}}>
							SMALL RETAIL ACCOUNT
							<br />
							<span style={{color: colors.gain}}>USUALLY LESS RELEVANT</span>
						</div>
					</div>
				</div>
			</div>
			<AbsoluteFill style={{opacity: progress(frame, degAt, 16)}}>
				<div style={{position: 'absolute', left: 1040, top: 190, width: 760, height: 420}}>
					<Panel style={{width: 760, height: 420, overflow: 'hidden'}}>
						<svg width={760} height={420}>
							<path
								d={Array.from({length: 120}, (_, i) => `${i === 0 ? 'M' : 'L'}${(i * 6.4).toFixed(1)},${(210 + Math.sin(i / 6) * 70 * strength + (random(`deg-${i}`) - 0.5) * 60 * crowd).toFixed(1)}`).join(' ')}
								fill="none"
								stroke={colors.signal}
								strokeWidth={3}
								opacity={0.35 + strength * 0.65}
								style={{filter: `drop-shadow(0 0 ${10 * strength}px ${colors.signal})`}}
							/>
							{Array.from({length: 36}, (_, i) => {
								const appear = progress(frame, crowdAt + i * 2, 10);
								const x = 30 + random(`cx-${i}`) * 700;
								const y = 30 + random(`cy-${i}`) * 360;
								return (
									<g key={i} opacity={appear * 0.8} transform={`translate(${x} ${y})`}>
										<circle r={7} cy={-10} fill={colors.textLo} />
										<path d="M-10,12 Q0,-4 10,12 Z" fill={colors.textLo} />
									</g>
								);
							})}
						</svg>
						<IllustrativeTag />
					</Panel>
					<div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 20}}>
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: colors.textLo}}>SIGNAL STRENGTH</div>
						<div style={{width: 400, height: 12, borderRadius: 6, background: colors.grid}}>
							<div style={{width: `${strength * 100}%`, height: '100%', borderRadius: 6, background: colors.signal, boxShadow: `0 0 16px ${colors.signal}`}} />
						</div>
					</div>
					<div style={{marginTop: 14, fontFamily: fonts.sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em', color: colors.textHi, opacity: progress(frame, b.on('many traders'), 14)}}>
						MORE TRADERS USING IT → LESS EFFECTIVE
					</div>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

const MISTAKES: [string, string][] = [
	['OVER-COMPLICATING THE MODEL', 'One: over-complicating'],
	['NO CLEAR RATIONALE', 'Two: using signals'],
	['TOO LITTLE DATA', 'Three: testing'],
	['IGNORING REGIME CHANGE', 'Four: ignoring'],
	['NOT MONITORING LIVE CONDITIONS', 'And five'],
];

/** S32 — Five common mistakes: left-rail checklist + one mini-visual per item. */
export const S32: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const starts = MISTAKES.map(([, p]) => b.on(p) - 6);
	const active = starts.filter((s) => frame >= s).length - 1;
	const endAt = b.on('performed best') + 12;
	return (
		<SceneShell>
			<div style={{position: 'absolute', left: 120, top: 96}}>
				<Kicker>Systematic trading</Kicker>
				<div style={{marginTop: 14}}>
					<BigText text="Five common mistakes" size={64} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 120, top: 300, display: 'flex', flexDirection: 'column', gap: 34}}>
				{MISTAKES.map(([label], i) => {
					const done = i < active || frame >= endAt;
					const isActive = i === active && !done;
					const p = progress(frame, starts[i], 14);
					return (
						<div key={label} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: 0.3 + p * 0.7}}>
							<div style={{width: 44, fontFamily: fonts.mono, fontSize: 24, color: isActive ? colors.signal : colors.textLo}}>{String(i + 1).padStart(2, '0')}</div>
							<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.08em', color: isActive ? colors.textHi : colors.textLo, textShadow: isActive ? `0 0 24px ${colors.signal}44` : undefined}}>{label}</div>
							{done ? <Icon name="check" size={30} color={colors.gain} draw={progress(frame, i < active ? starts[i + 1] : endAt, 12)} /> : null}
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 1000, top: 270, width: 800, height: 560}}>
				{MISTAKES.map((_, i) => {
					const o = progress(frame, starts[i], 14) * (i < MISTAKES.length - 1 ? 1 - progress(frame, starts[i + 1] - 8, 12) : 1);
					if (o <= 0) return null;
					const local = frame - starts[i];
					return (
						<AbsoluteFill key={i} style={{opacity: o}}>
							<Panel style={{width: 800, height: 560, overflow: 'hidden'}}>
								{i === 0 ? <MiniSimplify t={local} /> : null}
								{i === 1 ? <MiniWhy t={local} /> : null}
								{i === 2 ? <MiniRegimes t={local} /> : null}
								{i === 3 ? <MiniDials t={local} /> : null}
								{i === 4 ? <MiniRadar t={local} /> : null}
								<IllustrativeTag />
							</Panel>
						</AbsoluteFill>
					);
				})}
			</div>
		</SceneShell>
	);
};

const MiniSimplify: React.FC<{t: number}> = ({t}) => {
	const s = progress(t, 60, 60);
	return (
		<svg width={800} height={560}>
			{Array.from({length: 14}, (_, k) => {
				const d = Array.from({length: 40}, (_, i) => {
					const x = 60 + i * 17;
					const y = 280 + (Math.sin(i / 2 + k) * 120 + (random(`sp-${k}-${i}`) - 0.5) * 120) * (1 - s);
					return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
				}).join(' ');
				return <path key={k} d={d} fill="none" stroke={k === 0 ? colors.signal : colors.textLo} strokeWidth={k === 0 ? 4 : 1.5} opacity={k === 0 ? 1 : 0.5 * (1 - s)} />;
			})}
			<text x={400} y={500} textAnchor="middle" fill={colors.gain} fontFamily={fonts.sans} fontWeight={700} fontSize={22} letterSpacing="0.14em" opacity={s}>
				SIMPLE & ROBUST
			</text>
		</svg>
	);
};

const MiniWhy: React.FC<{t: number}> = ({t}) => (
	<svg width={800} height={560}>
		{Array.from({length: 30}, (_, i) => (
			<circle key={i} cx={80 + i * 22} cy={300 + Math.sin(i / 2.2) * 80} r={6} fill={colors.signal} opacity={progress(t, i, 8)} />
		))}
		<text x={400} y={200} textAnchor="middle" fill={colors.textHi} fontFamily={fonts.serif} fontSize={150} opacity={progress(t, 40, 20)}>
			WHY?
		</text>
		<text x={400} y={500} textAnchor="middle" fill={colors.textLo} fontFamily={fonts.sans} fontWeight={600} fontSize={20} letterSpacing="0.12em" opacity={progress(t, 60, 20)}>
			A PATTERN ALONE ISN'T ENOUGH
		</text>
	</svg>
);

const MiniRegimes: React.FC<{t: number}> = ({t}) => {
	const stretch = progress(t, 30, 40);
	const regimes = [
		['HIGH VOL', colors.loss],
		['LOW VOL', colors.cool],
		['TRENDING', colors.gain],
		['RANGE-BOUND', colors.gold],
	] as const;
	return (
		<svg width={800} height={560}>
			<text x={60} y={110} fill={colors.textLo} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.14em">
				SHORT BACKTEST
			</text>
			<rect x={60} y={130} width={map(stretch, [0, 1], [140, 680])} height={40} rx={8} fill={colors.panel} stroke={colors.textLo} />
			{regimes.map(([label, c], i) => {
				const p = progress(t, 60 + i * 12, 14);
				return (
					<g key={label} opacity={p}>
						<rect x={60 + i * 172} y={230} width={160} height={120} rx={10} fill={c} fillOpacity={0.15} stroke={c} />
						<text x={140 + i * 172} y={298} textAnchor="middle" fill={c} fontFamily={fonts.sans} fontWeight={700} fontSize={17} letterSpacing="0.1em">
							{label}
						</text>
					</g>
				);
			})}
			<text x={400} y={440} textAnchor="middle" fill={colors.textHi} fontFamily={fonts.sans} fontWeight={700} fontSize={20} letterSpacing="0.14em" opacity={progress(t, 120, 14)}>
				+ DIFFERENT MACRO ENVIRONMENTS
			</text>
		</svg>
	);
};

const MiniDials: React.FC<{t: number}> = ({t}) => (
	<svg width={800} height={560}>
		{['POLICY', 'VOLATILITY', 'LIQUIDITY', 'TRADER BEHAVIOUR'].map((label, i) => {
			const cx = 200 + (i % 2) * 400;
			const cy = 170 + Math.floor(i / 2) * 230;
			const a = Math.sin(t / (18 + i * 5) + i) * 70;
			return (
				<g key={label} opacity={progress(t, i * 10, 12)}>
					<circle cx={cx} cy={cy} r={70} fill="none" stroke={colors.hairline} strokeWidth={4} />
					<line x1={cx} y1={cy} x2={cx} y2={cy - 56} stroke={colors.signal} strokeWidth={5} strokeLinecap="round" transform={`rotate(${a} ${cx} ${cy})`} />
					<circle cx={cx} cy={cy} r={8} fill={colors.textHi} />
					<text x={cx} y={cy + 105} textAnchor="middle" fill={colors.textHi} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.12em">
						{label}
					</text>
				</g>
			);
		})}
	</svg>
);

const MiniRadar: React.FC<{t: number}> = ({t}) => {
	const axes = 6;
	const cx = 400;
	const cy = 270;
	const R = 190;
	const poly = (vals: number[]) =>
		vals.map((v, i) => {
			const a = -Math.PI / 2 + (i / axes) * Math.PI * 2;
			return `${(cx + Math.cos(a) * R * v).toFixed(1)},${(cy + Math.sin(a) * R * v).toFixed(1)}`;
		}).join(' ');
	const best = [0.8, 0.7, 0.9, 0.6, 0.75, 0.85];
	const now = [0.5, 0.85, 0.55, 0.8, 0.4, 0.7];
	const p = progress(t, 20, 40);
	const sweep = (t * 4) % 360;
	return (
		<svg width={800} height={560}>
			{[0.33, 0.66, 1].map((r) => (
				<polygon key={r} points={poly(Array(axes).fill(r))} fill="none" stroke={colors.hairline} />
			))}
			<polygon points={poly(best)} fill={colors.gain} fillOpacity={0.12} stroke={colors.gain} strokeWidth={2.5} strokeDasharray="8 6" />
			<polygon points={poly(now.map((v) => v * p))} fill={colors.signal} fillOpacity={0.15} stroke={colors.signal} strokeWidth={3} />
			<line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke={colors.signal} strokeOpacity={0.5} strokeWidth={2} transform={`rotate(${sweep} ${cx} ${cy})`} />
			<text x={60} y={520} fill={colors.signal} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.12em">
				■ NOW
			</text>
			<text x={200} y={520} fill={colors.gain} fontFamily={fonts.sans} fontWeight={700} fontSize={18} letterSpacing="0.12em">
				■ WHERE THE STRATEGY HISTORICALLY PERFORMED BEST
			</text>
		</svg>
	);
};
