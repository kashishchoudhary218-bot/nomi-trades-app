import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {Shake} from '../components/CameraMove';
import {Icon, Kicker, Panel} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {Timeline} from '../components/Timeline';
import {impactSeries} from '../data/illustrative';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors, EASE_IN_OUT} from '../theme/tokens';

const PillarHeader: React.FC<{n: string; title: string; at?: number}> = ({n, title, at = 0}) => (
	<div style={{position: 'absolute', left: 120, top: 96}}>
		<Kicker at={at}>{`Pillar ${n}`}</Kicker>
		<div style={{marginTop: 14}}>
			<BigText text={title} size={64} at={at + 4} />
		</div>
	</div>
);

const gearPath = (teeth: number, outer: number, inner: number): string => {
	const pts: string[] = [];
	const step = (Math.PI * 2) / teeth;
	for (let i = 0; i < teeth; i++) {
		const a = i * step;
		const r = [inner, outer, outer, inner];
		const angles = [a, a + step * 0.2, a + step * 0.5, a + step * 0.7];
		angles.forEach((ang, k) => pts.push(`${(Math.cos(ang) * r[k]).toFixed(1)},${(Math.sin(ang) * r[k]).toFixed(1)}`));
	}
	return `M${pts.join(' L')} Z`;
};

/** S08 — "Not Just Models": camera pulls back from MODELS to a five-gear machine. */
export const S08: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const pull = progress(frame, b.on('only about models') - 4, 50, EASE_IN_OUT);
	const spinAt = b.on('break down') - 10;
	const spin = Math.max(0, frame - spinAt) * progress(frame, spinAt, 30);
	const gears = [
		{label: 'MODELS', x: 960, y: 470, r: 150, teeth: 16, at: 0, dir: 1},
		{label: 'EXECUTION QUALITY', x: 640, y: 330, r: 105, teeth: 11, at: b.on('execution quality'), dir: -1},
		{label: 'SCIENTIFIC DISCIPLINE', x: 1280, y: 330, r: 105, teeth: 11, at: b.on('scientific discipline'), dir: -1},
		{label: 'DATA ANALYSIS', x: 660, y: 660, r: 100, teeth: 11, at: b.on('data analysis'), dir: -1},
		{label: 'CONTINUOUS RESEARCH', x: 1260, y: 660, r: 100, teeth: 11, at: b.on('continuous research'), dir: -1},
		{label: 'HIRING SCIENTISTS', x: 960, y: 800, r: 72, teeth: 9, at: b.on('scientists it hired'), dir: 1},
	];
	const scale = map(pull, [0, 1], [2.3, 1]);
	return (
		<SceneShell camera={false}>
			<AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '960px 470px'}}>
				<svg width={1920} height={1080}>
					{gears.map((g, i) => {
						const p = i === 0 ? 1 : progress(frame, g.at - 6, 18);
						const rot = (spin * 1.2 * g.dir * 150) / g.r;
						return (
							<g key={g.label} transform={`translate(${g.x} ${g.y}) scale(${p}) rotate(${rot})`} opacity={p}>
								<path d={gearPath(g.teeth, g.r, g.r * 0.84)} fill={colors.panelHi} stroke={i === 0 ? colors.signal : colors.textLo} strokeWidth={2} />
								<circle r={g.r * 0.32} fill={colors.ink} stroke={colors.hairline} />
							</g>
						);
					})}
				</svg>
				{gears.map((g, i) => {
					const p = i === 0 ? progress(frame, 0, 16) : progress(frame, g.at, 16);
					return (
						<div
							key={g.label}
							style={{
								position: 'absolute',
								left: g.x,
								top: g.y,
								transform: 'translate(-50%, -50%)',
								fontFamily: fonts.sans,
								fontWeight: 700,
								fontSize: i === 0 ? 30 : 17,
								letterSpacing: '0.12em',
								color: i === 0 ? colors.signal : colors.textHi,
								textAlign: 'center',
								width: g.r * 1.5,
								opacity: p,
								textShadow: '0 2px 10px rgba(0,0,0,0.9)',
							}}
						>
							{g.label}
						</div>
					);
				})}
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S09 — Pillar 1: four data streams → filter → one signal through three gates. */
export const S09: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const streams: [string, string][] = [
		['PRICE', 'price'],
		['VOLUME', 'volume'],
		['ORDER FLOW', 'order flow'],
		['OTHER DATA', 'other market data'],
	];
	const gates: [string, string][] = [
		['SIGNIFICANT', 'statistically significant'],
		['REPEATS OVER TIME', 'repeated over time'],
		['USEFUL AFTER COSTS', 'after trading costs'],
	];
	const gateX = [1180, 1420, 1660];
	const sigStart = b.on('The goal');
	const gateTimes = gates.map(([, p]) => b.on(p));
	const headX = frame < sigStart ? 960 : frame < gateTimes[0] ? map(frame, [sigStart, gateTimes[0]], [960, gateX[0]]) : frame < gateTimes[1] ? map(frame, [gateTimes[0], gateTimes[1]], [gateX[0], gateX[1]]) : map(frame, [gateTimes[1], gateTimes[2]], [gateX[1], gateX[2] + 120]);
	return (
		<SceneShell>
			<PillarHeader n="01" title="Statistical pattern recognition" />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				<defs>
					<filter id="s09-glow">
						<feGaussianBlur stdDeviation="5" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				{streams.map(([label, phrase], i) => {
					const y = 400 + i * 110;
					const p = progress(frame, b.on(phrase) - 6, 24);
					const pts = Array.from({length: 60}, (_, k) => {
						const x = 340 + k * 9;
						const t = k / 59;
						const yy = y + (560 - y) * t ** 2 + Math.sin(k / 3 + frame / 6 + i) * 10 * (1 - t);
						return `${k === 0 ? 'M' : 'L'}${x},${yy.toFixed(1)}`;
					}).join(' ');
					return (
						<g key={label} opacity={p}>
							<text x={120} y={y + 8} fill={colors.textMid} fontFamily={fonts.sans} fontWeight={700} fontSize={22} letterSpacing="0.14em">
								{label}
							</text>
							<path d={pts} fill="none" stroke={colors.textLo} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
						</g>
					);
				})}
				<path d="M880,420 L960,520 L960,600 L880,700 Z" fill={colors.panelHi} stroke={colors.hairline} strokeWidth={2} opacity={progress(frame, b.on('processed'), 16)} />
				<text x={870} y={400} textAnchor="middle" fill={colors.textLo} fontFamily={fonts.sans} fontWeight={600} fontSize={16} letterSpacing="0.18em" opacity={progress(frame, b.on('processed'), 16)}>
					FILTER
				</text>
				{frame >= sigStart ? <line x1={960} y1={560} x2={headX} y2={560} stroke={colors.signal} strokeWidth={4} filter="url(#s09-glow)" /> : null}
				{frame >= sigStart ? <circle cx={headX} cy={560} r={9} fill={colors.signal} filter="url(#s09-glow)" /> : null}
				{gates.map(([label], i) => {
					const on = frame >= gateTimes[i];
					const c = on ? colors.gain : colors.textLo;
					const p = progress(frame, sigStart, 20);
					return (
						<g key={label} opacity={p}>
							<rect x={gateX[i] - 5} y={470} width={10} height={180} rx={5} fill={c} opacity={on ? 1 : 0.4} filter={on ? 'url(#s09-glow)' : undefined} />
							<text x={gateX[i]} y={700} textAnchor="middle" fill={on ? colors.textHi : colors.textLo} fontFamily={fonts.sans} fontWeight={700} fontSize={17} letterSpacing="0.1em">
								{label}
							</text>
						</g>
					);
				})}
			</svg>
			{gates.map(([label], i) => (
				<div key={label} style={{position: 'absolute', left: gateX[i] - 22, top: 410, opacity: progress(frame, gateTimes[i], 10)}}>
					<Icon name="check" size={44} color={colors.gain} draw={progress(frame, gateTimes[i], 14)} />
				</div>
			))}
		</SceneShell>
	);
};

/** S10 — Pillar 2: physics + signal processing → finance; generic HMM schematic, "(reportedly)" kept visible. */
export const S10: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const hmmAt = b.on('Hidden Markov Models') - 8;
	const phaseA = 1 - progress(frame, hmmAt - 6, 16);
	const phaseB = progress(frame, hmmAt, 20);
	const boxes: [string, number, string][] = [
		['PHYSICS', 180, 'physics'],
		['SIGNAL PROCESSING', 560, 'signal processing'],
	];
	const merge = progress(frame, b.on('signal processing') + 16, 30);
	const states = [
		{x: 700, y: 400},
		{x: 960, y: 330},
		{x: 1220, y: 400},
	];
	return (
		<SceneShell>
			<PillarHeader n="02" title="Borrowed from other sciences" />
			<AbsoluteFill style={{opacity: phaseA}}>
				{boxes.map(([label, y, phrase], i) => {
					const p = progress(frame, b.on(phrase) - 6, 20);
					const x = map(merge, [0, 1], [180, 560]);
					return (
						<div key={label} style={{position: 'absolute', left: x, top: 280 + y * 0.6, opacity: p * (1 - merge * 0.4)}}>
							<Panel style={{width: 480, height: 190, padding: 24}}>
								<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: colors.textHi}}>{label}</div>
								<svg width={430} height={110}>
									{i === 0
										? Array.from({length: 5}, (_, k) => (
												<path
													key={k}
													d={`M10,${60 + k * 6} C120,${-10 + k * 30} 260,${140 - k * 20} 420,${50 + k * 8}`}
													fill="none"
													stroke={colors.cool}
													strokeOpacity={0.3 + k * 0.12}
													strokeWidth={2}
													pathLength={1}
													strokeDasharray={1}
													strokeDashoffset={1 - p}
												/>
											))
										: (
												<path
													d={Array.from({length: 120}, (_, k) => `${k === 0 ? 'M' : 'L'}${k * 3.5},${(55 + Math.sin(k / 4 + frame / 4) * 30 * Math.sin(k / 40)).toFixed(1)}`).join(' ')}
													fill="none"
													stroke={colors.signal}
													strokeWidth={2.5}
												/>
											)}
								</svg>
							</Panel>
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 1180, top: 450, display: 'flex', alignItems: 'center', gap: 30, opacity: merge}}>
					<Icon name="arrowRight" size={70} color={colors.signal} draw={merge} />
					<Panel glow={colors.signal} style={{padding: '30px 44px'}}>
						<div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, letterSpacing: '0.14em', color: colors.signal}}>FINANCE</div>
					</Panel>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: phaseB}}>
				<svg width={1920} height={1080}>
					<defs>
						<marker id="hmm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
							<path d="M0,0 L10,5 L0,10 z" fill={colors.textMid} />
						</marker>
					</defs>
					{states.map((s, i) => {
						const next = states[(i + 1) % states.length];
						const p = progress(frame, hmmAt + 10 + i * 8, 24);
						return (
							<g key={i}>
								<path
									d={`M${s.x + 40},${s.y - 20} Q${(s.x + next.x) / 2},${Math.min(s.y, next.y) - 120} ${next.x - 40},${next.y - 20}`}
									fill="none"
									stroke={colors.textMid}
									strokeWidth={2}
									markerEnd="url(#hmm-arrow)"
									pathLength={1}
									strokeDasharray={1}
									strokeDashoffset={1 - p}
									opacity={i === 2 ? 0 : 1}
								/>
								<path d={`M${s.x - 20},${s.y - 44} a28,28 0 1,1 40,0`} fill="none" stroke={colors.textLo} strokeWidth={2} markerEnd="url(#hmm-arrow)" opacity={p} />
								<line x1={s.x} y1={s.y + 46} x2={s.x} y2={s.y + 190} stroke={colors.textLo} strokeDasharray="6 6" strokeWidth={2} opacity={p} markerEnd="url(#hmm-arrow)" />
								<circle cx={s.x} cy={s.y} r={44} fill={colors.panelHi} stroke={colors.signal} strokeWidth={2.5} opacity={p} />
								<text x={s.x} y={s.y + 8} textAnchor="middle" fill={colors.signal} fontFamily={fonts.mono} fontSize={24} opacity={p}>
									{['A', 'B', 'C'][i]}
								</text>
								<rect x={s.x - 34} y={s.y + 200} width={68} height={50} rx={8} fill="none" stroke={colors.cool} strokeWidth={2} opacity={p} />
							</g>
						);
					})}
					<path d={`M${states[2].x - 40},${states[2].y + 20} Q960,560 ${states[0].x + 40},${states[0].y + 20}`} fill="none" stroke={colors.textMid} strokeWidth={2} markerEnd="url(#hmm-arrow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress(frame, hmmAt + 34, 24)} />
					<text x={1340} y={420} fill={colors.textLo} fontFamily={fonts.sans} fontWeight={600} fontSize={17} letterSpacing="0.16em" opacity={phaseB}>
						HIDDEN STATES
					</text>
					<text x={1340} y={630} fill={colors.textLo} fontFamily={fonts.sans} fontWeight={600} fontSize={17} letterSpacing="0.16em" opacity={phaseB}>
						OBSERVED DATA
					</text>
				</svg>
				<div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center'}}>
					<span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 38, letterSpacing: '0.12em', color: colors.textHi}}>HIDDEN MARKOV MODELS </span>
					<span style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 30, letterSpacing: '0.12em', color: colors.textLo}}>(REPORTEDLY)</span>
					<div style={{marginTop: 22, fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, letterSpacing: '0.12em', color: colors.signal, opacity: progress(frame, b.on('The logic'), 20)}}>
						WORKS IN COMPLEX SYSTEMS? → TEST IT IN MARKETS
					</div>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S11 — Pillar 3: speed / consistency / scale, then capacity intentionally limited + market-impact concept. */
export const S11: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const phase2 = b.on('Renaissance intentionally') - 10;
	const words: [string, string][] = [
		['SPEED', 'speed'],
		['CONSISTENCY', 'consistency'],
		['SCALE', 'and scale'],
	];
	const lidAt = b.on('capacity limited');
	const fill = progress(frame, phase2 + 10, 50);
	const lid = progress(frame, lidAt, 12);
	const hit = b.on('large orders');
	return (
		<SceneShell>
			<PillarHeader n="03" title="Speed, consistency & scale" />
			<AbsoluteFill style={{opacity: 1 - progress(frame, phase2 - 8, 14)}}>
				{words.map(([w, phrase], i) => {
					const at = b.on(phrase) - 4;
					const p = progress(frame, at, 22);
					return (
						<div key={w} style={{position: 'absolute', left: 120, top: 320 + i * 130, display: 'flex', alignItems: 'center', gap: 40, opacity: p}}>
							<div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 88, letterSpacing: '0.06em', color: colors.textHi, transform: `translateX(${(1 - p) * -80}px)`}}>{w}</div>
							<div style={{height: 3, width: 900 * p, background: `linear-gradient(90deg, ${colors.signal}, transparent)`, boxShadow: `0 0 16px ${colors.signal}`}} />
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 120, top: 740, opacity: progress(frame, b.on('Finding a profitable'), 20)}}>
					<BigText text="SIGNAL ≠ PROFIT — EXECUTION MATTERS" font="sans" size={40} weight={700} tracking="0.12em" at={b.on('Finding a profitable')} highlight={['execution', 'matters']} />
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: progress(frame, phase2, 16)}}>
				<Shake at={lidAt} strength={6}>
					<div style={{position: 'absolute', left: 150, top: 330}}>
						<div style={{position: 'relative', width: 480, height: 420}}>
							<div
								style={{
									position: 'absolute',
									left: -20,
									width: 520,
									height: 26,
									borderRadius: 8,
									background: colors.signal,
									boxShadow: `0 0 30px ${colors.signal}88`,
									top: map(lid, [0, 1], [-140, -14]),
									opacity: lid,
								}}
							/>
							<div style={{position: 'absolute', left: 206, top: -84, opacity: lid}}>
								<Icon name="lock" size={68} color={colors.signal} />
							</div>
							<div style={{position: 'absolute', inset: 0, border: `3px solid ${colors.textLo}`, borderTop: 'none', borderRadius: '0 0 16px 16px', overflow: 'hidden'}}>
								<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 72}%`, background: `linear-gradient(180deg, ${colors.gold}55, ${colors.gold}22)`}} />
							</div>
						</div>
						<div style={{marginTop: 30, fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', color: colors.textHi, width: 480, textAlign: 'center'}}>
							MEDALLION FUND CAPACITY
						</div>
						<div style={{marginTop: 8, fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.18em', color: colors.signal, width: 480, textAlign: 'center', opacity: lid}}>
							INTENTIONALLY LIMITED
						</div>
					</div>
				</Shake>
				<div style={{position: 'absolute', left: 800, top: 300}}>
					<Chart
						width={1000}
						height={480}
						title="LARGE ORDERS MOVE PRICES"
						series={[{id: 'impact', data: impactSeries, color: colors.cool, drawFrom: phase2 + 10, drawDuration: Math.max(20, hit - phase2), width: 3}]}
						rules={[{axis: 'x', value: 60, label: 'LARGE ORDER', color: colors.loss, at: hit, dashed: true}]}
					/>
					<div
						style={{
							position: 'absolute',
							top: 330,
							left: map(frame, [hit - 16, hit], [-200, 560]),
							width: 90,
							height: 90,
							borderRadius: 10,
							background: colors.loss,
							opacity: map(frame, [hit - 16, hit - 10, hit + 10, hit + 30], [0, 1, 1, 0]),
							boxShadow: `0 0 40px ${colors.loss}`,
						}}
					/>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S12 — Pillar 4: the discipline loop (hero graphic), with a failing signal ejected. */
export const S12: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const steps: [string, string][] = [
		['Research', 'research'],
		['Test', 'test'],
		['Live Trade', 'trade live'],
		['Monitor', 'monitor'],
		['Improve / Remove', 'then improve'],
	];
	return (
		<SceneShell>
			<PillarHeader n="04" title="Model discipline" />
			<div style={{position: 'absolute', left: 120, top: 380, display: 'flex', flexDirection: 'column', gap: 44}}>
				{[
					{text: 'EVIDENCE → TRADE', at: b.on('A signal was traded'), icon: 'check' as const, c: colors.gain},
					{text: 'STOPS WORKING → REMOVE', at: b.on('If a signal stopped'), icon: 'cross' as const, c: colors.loss},
				].map((r) => (
					<div key={r.text} style={{display: 'flex', alignItems: 'center', gap: 22, opacity: progress(frame, r.at, 18)}}>
						<Icon name={r.icon} size={46} color={r.c} draw={progress(frame, r.at + 4, 16)} />
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, letterSpacing: '0.1em', color: colors.textHi}}>{r.text}</div>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', right: 150, top: 200}}>
				<Timeline
					layout="loop"
					steps={steps.map(([s]) => s)}
					stepTimes={steps.map(([, p]) => b.on(p) - 4)}
					size={700}
					lapFrames={75}
					ejectAt={b.on('or remove')}
				/>
			</div>
		</SceneShell>
	);
};
