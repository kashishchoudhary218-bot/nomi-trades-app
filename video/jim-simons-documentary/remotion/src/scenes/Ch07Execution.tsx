import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {Checklist, Kicker, Panel} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {backtestCurve, liveCurve} from '../data/illustrative';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const Vignette: React.FC<{n: number; label: string; at: number; children: React.ReactNode}> = ({n, label, at, children}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, at, 18);
	return (
		<div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
			<Panel style={{width: 400, height: 280, overflow: 'hidden'}} glow={p > 0.5 ? colors.loss : undefined}>
				<svg width={400} height={280}>{children}</svg>
				<IllustrativeMini />
			</Panel>
			<div style={{marginTop: 18, display: 'flex', gap: 14, alignItems: 'baseline'}}>
				<span style={{fontFamily: fonts.mono, fontSize: 22, color: colors.loss}}>{String(n).padStart(2, '0')}</span>
				<span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: colors.textHi}}>{label}</span>
			</div>
		</div>
	);
};

const IllustrativeMini = () => (
	<div style={{position: 'absolute', right: 12, bottom: 8, fontFamily: fonts.sans, fontSize: 10, letterSpacing: '0.16em', color: colors.textLo}}>ILLUSTRATIVE</div>
);

/** S24 — Four ways traders break their own systems, as mini vignettes. */
export const S24: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const t = [b.on('taking some signals'), b.on('Moving the stop loss'), b.on('Holding a losing trade'), b.on('abandoning')];
	const local = (i: number) => Math.max(0, frame - t[i]);
	return (
		<SceneShell glow={colors.loss} glowPosition="50% 70%">
			<div style={{position: 'absolute', left: 120, top: 110, display: 'flex', gap: 80, alignItems: 'baseline'}}>
				<BigText text="Strategy = hard." size={72} at={b.on('Building a strategy') - 4} color={colors.textMid} />
				<BigText text="Execution = harder." size={72} at={b.on('Executing it') - 4} highlight={['harder.']} highlightColor={colors.loss} />
			</div>
			<div style={{position: 'absolute', left: 120, top: 340, display: 'flex', gap: 26}}>
				<Vignette n={1} label="SKIPPING SIGNALS" at={t[0] - 6}>
					{Array.from({length: 6}, (_, i) => {
						const skipped = i % 2 === 1;
						const mark = progress(local(0), 8 + i * 6, 10);
						return (
							<g key={i} transform={`translate(${50 + i * 60} 140)`}>
								<circle r={16} fill={skipped ? 'none' : colors.gain} stroke={skipped ? colors.textLo : colors.gain} strokeWidth={2} opacity={0.9} />
								{skipped ? <path d="M-12,-12 L12,12 M12,-12 L-12,12" stroke={colors.loss} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - mark} /> : null}
							</g>
						);
					})}
				</Vignette>
				<Vignette n={2} label="MOVING THE STOP" at={t[1] - 6}>
					<path d="M20,90 L90,110 L150,100 L210,150 L270,180 L330,215 L380,240" fill="none" stroke={colors.textHi} strokeWidth={3} />
					{(() => {
						const y = map(local(1), [10, 50], [160, 250]);
						return (
							<g>
								<line x1={20} x2={380} y1={y} y2={y} stroke={colors.loss} strokeWidth={2.5} strokeDasharray="10 8" />
								<text x={24} y={y - 10} fill={colors.loss} fontFamily={fonts.sans} fontWeight={700} fontSize={14} letterSpacing="0.14em">STOP LOSS</text>
								<path d={`M300,${y - 6} l10,26 l6,-10 l12,0 z`} fill={colors.textHi} />
							</g>
						);
					})()}
				</Vignette>
				<Vignette n={3} label="HOPING IT RECOVERS" at={t[2] - 6}>
					<rect x={40} y={110} width={map(local(2), [0, 60], [60, 220])} height={50} rx={8} fill={colors.loss} opacity={0.75} />
					<text x={48} y={95} fill={colors.loss} fontFamily={fonts.sans} fontWeight={700} fontSize={14} letterSpacing="0.14em">LOSING POSITION</text>
					<g transform="translate(320 135)">
						<circle r={40} fill="none" stroke={colors.textLo} strokeWidth={3} />
						<line x1={0} y1={0} x2={0} y2={-28} stroke={colors.textHi} strokeWidth={3} transform={`rotate(${local(2) * 12})`} strokeLinecap="round" />
						<line x1={0} y1={0} x2={18} y2={0} stroke={colors.textHi} strokeWidth={3} transform={`rotate(${local(2) * 1})`} strokeLinecap="round" />
					</g>
				</Vignette>
				<Vignette n={4} label="ABANDONING AFTER DRAWDOWN" at={t[3] - 6}>
					<path d="M20,80 L80,70 L130,90 L170,150 L210,170 L240,160" fill="none" stroke={colors.loss} strokeWidth={3} />
					{(() => {
						const press = progress(local(3), 20, 6);
						return (
							<g transform={`translate(260 200) scale(${1 - press * 0.08})`}>
								<rect x={-70} y={-24} width={160} height={48} rx={10} fill={press > 0.5 ? colors.loss : 'none'} stroke={colors.loss} strokeWidth={2} />
								<text x={10} y={6} textAnchor="middle" fill={press > 0.5 ? colors.ink : colors.loss} fontFamily={fonts.sans} fontWeight={800} fontSize={14} letterSpacing="0.1em">DELETE STRATEGY</text>
							</g>
						);
					})()}
				</Vignette>
			</div>
		</SceneShell>
	);
};

/** S25 — The trade journal (fields from the PDF), then live vs backtest and four possible reasons. */
export const S25: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const cols: [string, string][] = [
		['ENTRY CONDITION', 'entry condition'],
		['ENTRY PRICE', 'entry price'],
		['EXIT PRICE', 'exit price'],
		['STOP LOSS', 'stop loss'],
		['TAKE PROFIT', 'take profit'],
		['MARKET CONDITION', 'market condition'],
		['RESULT', 'the result'],
	];
	const compareAt = b.on('Then compare') - 6;
	const tableOut = 1 - progress(frame, compareAt, 16);
	const reasons: [string, string][] = [
		['OVERFITTING', 'overfitting'],
		['MARKET CONDITIONS CHANGED', 'changed market conditions'],
		['EXECUTION PROBLEMS', 'execution problems'],
		['EDGE DEGRADING', 'degrading'],
	];
	return (
		<SceneShell>
			<div style={{position: 'absolute', left: 120, top: 96}}>
				<Kicker at={b.on('trade journal') - 10}>The fix</Kicker>
				<div style={{marginTop: 12}}>
					<BigText text="Keep a trade journal" size={64} at={b.on('trade journal') - 6} />
				</div>
			</div>
			<AbsoluteFill style={{opacity: tableOut}}>
				<div style={{position: 'absolute', left: 120, top: 300}}>
					<Panel style={{width: 1680, padding: '10px 0'}}>
						<div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)'}}>
							{cols.map(([label, phrase]) => {
								const p = progress(frame, b.on(phrase) - 4, 14);
								return (
									<div key={label} style={{padding: '22px 18px', borderRight: `1px solid ${colors.hairline}`, fontFamily: fonts.sans, fontWeight: 700, fontSize: 17, letterSpacing: '0.1em', color: colors.signal, opacity: p, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
										{label}
									</div>
								);
							})}
							{Array.from({length: 21}, (_, i) => (
								<div key={i} style={{padding: '24px 18px', borderTop: `1px solid ${colors.hairline}`, borderRight: `1px solid ${colors.hairline}`, fontFamily: fonts.mono, fontSize: 20, color: colors.textLo, opacity: progress(frame, b.on(cols[i % 7][1]), 14)}}>
									—
								</div>
							))}
						</div>
					</Panel>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: progress(frame, compareAt + 6, 16)}}>
				<div style={{position: 'absolute', left: 120, top: 290}}>
					<Chart
						width={1040}
						height={500}
						title="LIVE vs BACKTEST"
						series={[
							{id: 'bt', data: backtestCurve, color: colors.cool, dashed: true, drawFrom: compareAt + 6, drawDuration: 60, label: 'BACKTEST'},
							{id: 'live', data: liveCurve, color: colors.signal, drawFrom: compareAt + 12, drawDuration: 70, label: 'LIVE'},
						]}
						bands={[{axis: 'x', from: 40, to: 99, label: 'SIGNIFICANTLY WORSE?', color: colors.amber, at: b.on('significantly worse') - 4}]}
					/>
				</div>
				<div style={{position: 'absolute', left: 1240, top: 330}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.2em', color: colors.textLo, marginBottom: 28, opacity: progress(frame, b.on('possible reasons'), 14)}}>POSSIBLE REASONS</div>
					<Checklist items={reasons.map(([label, phrase]) => ({label, at: b.on(phrase) - 4, state: 'active' as const}))} size={28} gap={26} />
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};
