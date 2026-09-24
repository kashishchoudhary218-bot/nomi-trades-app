import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Shake} from '../components/CameraMove';
import {Chart} from '../components/Chart';
import {Icon, Kicker, Panel, Stamp} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {ddSeries} from '../data/illustrative';
import {progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const ddMin = Math.min(...ddSeries);
const HIST_BAND = {from: ddMin * 0.95, to: 0};

/** S26 — Normal drawdown or broken edge? Underwater chart + four diagnostic questions. */
export const S26: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const qs: [string, string][] = [
		['HAS THE MARKET REGIME CHANGED?', 'market regime'],
		['ARE SIMILAR STRATEGIES ALSO UNDERPERFORMING?', 'similar strategies'],
		['ARE SIGNAL CONDITIONS STILL GENERATED?', 'signal conditions'],
		['HOW DIFFERENT IS TODAY vs HISTORY?', 'how different'],
	];
	const wobble = Math.sin(frame / 14) * 5 * (1 - progress(frame, b.on('Ask') - 10, 30));
	return (
		<SceneShell glow={colors.cool} glowPosition="30% 60%">
			<div style={{position: 'absolute', left: 120, top: 100, display: 'flex', alignItems: 'center', gap: 40}}>
				<BigText text="Normal drawdown?" size={60} at={b.on('normal historical drawdown') - 8} highlight={['normal']} highlightColor={colors.cool} />
				<div style={{transform: `rotate(${wobble}deg)`, opacity: progress(frame, b.on('or whether'), 16)}}>
					<svg width={120} height={50}>
						<line x1={10} y1={25} x2={110} y2={25} stroke={colors.textLo} strokeWidth={3} />
						<polygon points="60,25 50,45 70,45" fill={colors.textLo} />
					</svg>
				</div>
				<BigText text="Edge changed?" size={60} at={b.on('or whether') + 4} highlight={['changed?']} highlightColor={colors.loss} />
			</div>
			<div style={{position: 'absolute', left: 120, top: 280}}>
				<Chart
					width={960}
					height={500}
					title="DRAWDOWN FROM PEAK"
					yDomain={[ddMin * 1.35, 2]}
					series={[{id: 'dd', data: ddSeries, color: colors.loss, area: 'underwater', drawFrom: 0, drawDuration: Math.max(60, b.on('Ask') - 10), width: 2.5}]}
					bands={[{axis: 'y', from: HIST_BAND.from, to: HIST_BAND.to, label: 'HISTORICAL DRAWDOWN RANGE', color: colors.cool, dashed: true, at: b.on('normal historical drawdown')}]}
				/>
			</div>
			<div style={{position: 'absolute', left: 1140, top: 300, display: 'flex', flexDirection: 'column', gap: 22}}>
				<Kicker at={b.on('Ask') - 6}>Ask</Kicker>
				{qs.map(([q, phrase]) => {
					const at = b.on(phrase) - 6;
					const p = progress(frame, at, 16);
					const typing = frame >= at && frame < at + 40;
					return (
						<Panel key={q} style={{width: 660, padding: '18px 22px', opacity: p, transform: `translateX(${(1 - p) * 40}px)`, borderColor: typing ? colors.signal : colors.hairline}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<Icon name="question" size={30} color={typing ? colors.signal : colors.textLo} />
								<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 21, letterSpacing: '0.06em', color: colors.textHi}}>{q}</div>
							</div>
						</Panel>
					);
				})}
			</div>
		</SceneShell>
	);
};

/** S27 — Feeling vs evidence: shaky "FAILED" stamp settles into an objective panel. */
export const S27: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const calmAt = b.on('But if it was') - 6;
	const shakeAmt = 1 - progress(frame, calmAt, 30);
	const jitterX = Math.sin(frame * 1.7) * 8 * shakeAmt;
	const jitterY = Math.cos(frame * 2.3) * 6 * shakeAmt;
	return (
		<SceneShell camera={false}>
			<AbsoluteFill style={{transform: `translate(${jitterX}px, ${jitterY}px)`}}>
				<AbsoluteFill style={{opacity: 1 - progress(frame, calmAt + 10, 20)}}>
					<Shake at={b.on('failed permanently')} strength={12}>
						<div style={{position: 'absolute', left: 120, top: 180}}>
							<Kicker lineColor={colors.loss}>Feeling</Kicker>
							<div style={{marginTop: 16}}>
								<BigText text={'“It\'s broken.”'} size={110} at={4} color={colors.textMid} />
							</div>
						</div>
						<div style={{position: 'absolute', left: 1050, top: 380}}>
							<Stamp text="FAILED?" at={b.on('failed permanently')} size={96} />
						</div>
					</Shake>
				</AbsoluteFill>
				<AbsoluteFill style={{opacity: progress(frame, calmAt + 10, 20)}}>
					<div style={{position: 'absolute', left: 120, top: 150}}>
						<Kicker lineColor={colors.gain}>Evidence</Kicker>
						<div style={{marginTop: 16}}>
							<BigText text="Objective evaluation" size={80} at={calmAt + 14} highlight={['objective']} highlightColor={colors.gain} />
						</div>
						<div style={{marginTop: 14, fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.18em', color: colors.textLo, opacity: progress(frame, b.on('properly backtested'), 16)}}>
							(IF PROPERLY BACKTESTED & VALIDATED)
						</div>
					</div>
					<div style={{position: 'absolute', left: 120, top: 420}}>
						<Chart
							width={1680}
							height={380}
							yDomain={[ddMin * 1.35, 2]}
							series={[{id: 'dd', data: ddSeries, color: colors.cool, area: 'none', drawDuration: 1, head: false, width: 2.5}]}
							bands={[{axis: 'y', from: HIST_BAND.from, to: HIST_BAND.to, label: 'HISTORICAL DRAWDOWN RANGE', color: colors.gain, dashed: true, at: calmAt + 20}]}
						/>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</SceneShell>
	);
};
