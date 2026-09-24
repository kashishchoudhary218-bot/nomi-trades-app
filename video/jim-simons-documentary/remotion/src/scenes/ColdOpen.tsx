import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {ImageScene} from '../components/ImageScene';
import {NumberCounter} from '../components/NumberCounter';
import {SceneShell} from '../components/SceneShell';
import {BROLL, type BrollSlot} from '../data/broll';
import {Timeline} from '../components/Timeline';
import {inOut, progress} from '../lib/anim';
import {randomWalk} from '../lib/series';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/** S01 — "The Number": ~66% counter. The "~" and "before fees" appear WITH the number (fidelity rule #2). */
export const S01: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	return (
		<SceneShell glow={colors.gold} glowPosition="50% 45%" camera={{from: 1, to: 1.08}}>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - progress(frame, b.duration - 16, 16)}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -60}}>
					<NumberCounter to={66} at={9} duration={48} prefix="~" suffix="%" size={300} spins={1} />
					<div style={{marginTop: 36}}>
						<BigText
							text="Average annual return · before fees · reportedly"
							font="sans"
							caps
							size={30}
							color={colors.textMid}
							at={22}
							stagger={2}
							align="center"
							tracking="0.2em"
						/>
					</div>
					<div style={{marginTop: 44}}>
						<BigText text="30+ YEARS" font="sans" size={64} weight={600} tracking="0.12em" at={b.on('more than thirty years')} underline={{at: b.on('more than thirty years') + 12}} />
					</div>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};

const noisy = randomWalk('s02-noise', 140, 0, 3.2, 100);
const clean = noisy.map((_, i) => 100 + Math.sin(i / 12) * 8);

/** S02 — "Not Instinct": three words struck out, replaced by the three pillars. */
export const S02: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const words: [string, string, BrollSlot][] = [
		['GUT FEELING', 'gut feelings', BROLL.B02a],
		['MARKET STORIES', 'market stories', BROLL.B02b],
		['INSTINCT', 'instinct', BROLL.B02c],
	];
	const swap = b.on('mathematics') - 10;
	return (
		<SceneShell>
			{words.map(([, phrase, shot], i) => {
				const start = b.on(phrase) - 6;
				const end = i < 2 ? b.on(words[i + 1][1]) - 6 : swap;
				return (
					<AbsoluteFill key={shot.shotId} style={{opacity: inOut(frame, start, end + 4, 5) * 0.55}}>
						<ImageScene
							{...shot}
							grade="desaturate"
							dim={0.7}
							quietPlaceholder
						/>
					</AbsoluteFill>
				);
			})}
			<AbsoluteFill style={{opacity: 0.35, alignItems: 'center', justifyContent: 'center'}}>
				<Chart
					width={1800}
					height={700}
					panel={false}
					grid={false}
					illustrative={false}
					series={[
						{id: 'noise', data: noisy, color: colors.textLo, width: 2, drawFrom: 0, drawDuration: 90, head: false},
						{id: 'clean', data: clean, color: colors.signal, width: 3, glow: true, drawFrom: swap, drawDuration: 60},
					]}
				/>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: 1 - progress(frame, swap, 12)}}>
					{words.map(([label, phrase]) => (
						<BigText key={label} text={label} font="sans" size={86} weight={700} tracking="0.08em" at={b.on(phrase) - 4} strike={{at: b.on(phrase) + 10}} color={colors.textMid} />
					))}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				{frame >= swap ? (
					<BigText
						text={'MATHEMATICS · DATA\nSCIENTIFIC DISCIPLINE'}
						font="sans"
						size={96}
						weight={700}
						tracking="0.06em"
						align="center"
						at={b.on('mathematics')}
						stagger={Math.max(3, Math.round((b.on('scientific discipline') - b.on('mathematics')) / 3))}
						effect="blur"
						highlight={['mathematics', 'data', 'scientific', 'discipline']}
					/>
				) : null}
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S03 — "The Promise": agenda stack + terminal B-roll; the 4th line plants the open loop paid off in S13. */
export const S03: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const last = b.on('which ones');
	const glitch = frame >= last && frame < last + 5;
	return (
		<SceneShell grid={false}>
			<div style={{position: 'absolute', right: 0, top: 0, width: 900, height: 1080}}>
				<ImageScene {...BROLL.B01} grade="cool" dim={0.45} />
				<AbsoluteFill style={{background: `linear-gradient(90deg, ${colors.ink}, transparent 45%)`}} />
			</div>
			<div style={{position: 'absolute', left: 120, top: 250, transform: glitch ? `translateX(${(frame % 2 ? 6 : -6)}px)` : undefined}}>
				<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: '0.3em', color: colors.textLo, marginBottom: 40, opacity: progress(frame, 0, 20)}}>
					IN THIS VIDEO
				</div>
				<Timeline
					layout="vertical"
					steps={['The approach', 'The edge', 'What you can use', "…and what you can't"]}
					stepTimes={[b.on('approached') - 8, b.on('drove his edge') - 8, b.on('realistically use') - 10, last - 4]}
					highlightLast={colors.loss}
					fontSize={50}
				/>
			</div>
			{glitch ? (
				<AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4, background: `linear-gradient(90deg, ${colors.loss}33, transparent, ${colors.cool}33)`}} />
			) : null}
		</SceneShell>
	);
};

/** S04 — Title sequence: the Signal Line draws, bends into a waveform, and reveals the title. */
export const S04: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = progress(frame, 4, 36);
	const bend = progress(frame, 30, 50);
	const W = 1920;
	const pts = Array.from({length: 241}, (_, i) => {
		const x = (i / 240) * W;
		const env = Math.exp(-(((x - W / 2) / 360) ** 2));
		const y = 690 + Math.sin(i / 3.2 + frame / 10) * 38 * env * bend + Math.sin(i / 1.3) * 6 * env * bend;
		return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
	}).join(' ');
	return (
		<SceneShell grid={false} glow={colors.signal} glowPosition="50% 60%" camera={{from: 1.02, to: 1.08}}>
			<AbsoluteFill>
				<svg width={1920} height={1080}>
					<defs>
						<filter id="title-glow">
							<feGaussianBlur stdDeviation="6" result="b" />
							<feMerge>
								<feMergeNode in="b" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<path d={pts} fill="none" stroke={colors.signal} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} filter="url(#title-glow)" />
				</svg>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140}}>
				<BigText text="THE MATHEMATICIAN'S EDGE" size={128} weight={300} tracking="0.02em" at={30} stagger={5} effect="mask" align="center" />
				<div style={{marginTop: 28, opacity: progress(frame, 60, 24), fontFamily: fonts.sans, fontWeight: 500, fontSize: 30, letterSpacing: '0.34em', color: colors.textMid}}>
					HOW JIM SIMONS APPROACHED TRADING
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [40, 42, 52], [0, 0.08, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), pointerEvents: 'none'}} />
		</SceneShell>
	);
};
