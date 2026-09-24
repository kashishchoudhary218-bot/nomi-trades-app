import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {SceneShell} from '../components/SceneShell';
import {Timeline} from '../components/Timeline';
import {progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/** S33 — "Copy the Discipline": minimal loop bookend collapses into the closing line. */
export const S33: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const steps: [string, string][] = [
		['Evidence', 'find evidence'],
		['Test', 'test it'],
		['Discipline', 'with discipline'],
		['Monitor', 'monitor it'],
		['Remove', 'remove what'],
	];
	const lineAt = b.on("You can't copy") - 10;
	const loopOut = 1 - progress(frame, lineAt - 6, 16);
	return (
		<SceneShell grid={false} glow={colors.signal} glowPosition="50% 50%" camera={{from: 1, to: 1.04}}>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: loopOut, transform: `scale(${0.6 + loopOut * 0.4})`}}>
				<Timeline layout="loop" minimal steps={steps.map(([s]) => s)} stepTimes={steps.map(([, p]) => b.on(p) - 4)} size={640} lapFrames={0} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 80}}>
				{frame >= lineAt ? (
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
						<BigText text="You can't copy Medallion." size={100} at={lineAt + 4} align="center" color={colors.textMid} />
						<BigText text="You can copy the discipline." size={100} at={b.on('But you can') - 4} align="center" highlight={['discipline.']} underline={{at: b.on('the discipline') + 6}} />
					</div>
				) : null}
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S34 — Disclaimer (from the PDF's closing note). */
export const S34: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = [
		'EDUCATIONAL CONTENT ONLY',
		'HISTORICAL PERFORMANCE IS NOT A GUARANTEE OF FUTURE RESULTS',
		"NO CLAIM IS MADE TO REPLICATE MEDALLION'S PROPRIETARY MODELS",
	];
	return (
		<SceneShell grid={false} camera={false}>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 26, paddingBottom: 120}}>
				{lines.map((l, i) => (
					<div
						key={l}
						style={{
							fontFamily: fonts.sans,
							fontWeight: i === 0 ? 700 : 500,
							fontSize: i === 0 ? 30 : 24,
							letterSpacing: '0.2em',
							color: i === 0 ? colors.textHi : colors.textLo,
							opacity: progress(frame, 8 + i * 12, 20),
						}}
					>
						{l}
					</div>
				))}
			</AbsoluteFill>
		</SceneShell>
	);
};

/** S35 — End card with YouTube end-screen safe slots (placeholders). */
export const S35: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = progress(frame, 6, 40);
	const slot = (x: number, label: string, delay: number) => (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: 250,
				width: 700,
				height: 394,
				borderRadius: 16,
				border: `2px dashed ${colors.textLo}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: fonts.mono,
				fontSize: 20,
				color: colors.amber,
				letterSpacing: '0.14em',
				opacity: progress(frame, delay, 20),
			}}
		>
			{label}
		</div>
	);
	return (
		<SceneShell grid={false} camera={false}>
			<div style={{position: 'absolute', left: 120, top: 150, fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.3em', color: colors.textLo, opacity: progress(frame, 10, 20)}}>
				WATCH NEXT
			</div>
			{slot(120, 'END SCREEN · VIDEO 1', 16)}
			{slot(1100, 'END SCREEN · VIDEO 2', 22)}
			<div style={{position: 'absolute', left: 120, right: 120, top: 720, height: 3, background: colors.signal, boxShadow: `0 0 20px ${colors.signal}`, transform: `scaleX(${draw})`, transformOrigin: 'left'}} />
			<div style={{position: 'absolute', left: 120, top: 760, display: 'flex', alignItems: 'center', gap: 28, opacity: progress(frame, 30, 20)}}>
				<div style={{width: 110, height: 110, borderRadius: 55, border: `2px dashed ${colors.textLo}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontSize: 14, color: colors.amber}}>
					SUBSCRIBE
				</div>
				<div style={{fontFamily: fonts.serif, fontWeight: 300, fontSize: 56, color: colors.textHi}}>The Mathematician's Edge</div>
			</div>
		</SceneShell>
	);
};
