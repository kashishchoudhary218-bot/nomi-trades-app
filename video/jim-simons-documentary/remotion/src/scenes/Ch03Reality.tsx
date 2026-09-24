import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {Shake} from '../components/CameraMove';
import {DataVisualization} from '../components/DataVisualization';
import {Icon, Stamp} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/** S13 — "You Can't Copy This": locked vault + PROPRIETARY stamp, then ✕ copy / ✓ learn (pays off S03). */
export const S13: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const stampAt = b.on('proprietary');
	const finalAt = b.on('So treat') - 6;
	const partA = 1 - progress(frame, finalAt, 16);
	const dial = frame * 0.6;
	return (
		<SceneShell grid={false} camera={{from: 1, to: 1.03}}>
			<Shake at={stampAt} strength={8}>
				<AbsoluteFill style={{opacity: partA}}>
					<div style={{position: 'absolute', left: 170, top: 190, opacity: progress(frame, b.on('cannot replicate') - 10, 24)}}>
						<svg width={560} height={560}>
							<rect x={10} y={10} width={540} height={540} rx={40} fill={colors.panelHi} stroke={colors.hairline} strokeWidth={3} />
							<circle cx={280} cy={280} r={170} fill="none" stroke={colors.textLo} strokeWidth={3} />
							<g transform={`rotate(${dial} 280 280)`}>
								{Array.from({length: 24}, (_, i) => (
									<line key={i} x1={280} y1={120} x2={280} y2={i % 6 === 0 ? 146 : 134} stroke={colors.textLo} strokeWidth={2} transform={`rotate(${i * 15} 280 280)`} />
								))}
								<line x1={200} y1={280} x2={360} y2={280} stroke={colors.textMid} strokeWidth={10} strokeLinecap="round" />
								<line x1={280} y1={200} x2={280} y2={360} stroke={colors.textMid} strokeWidth={10} strokeLinecap="round" />
							</g>
							<circle cx={280} cy={280} r={34} fill={colors.ink} stroke={colors.textLo} strokeWidth={3} />
						</svg>
						<div style={{textAlign: 'center', marginTop: 20, fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.16em', color: colors.textHi}}>MEDALLION MODELS</div>
						<div style={{position: 'absolute', left: 90, top: 210}}>
							<Stamp text="PROPRIETARY" at={stampAt} size={54} />
						</div>
						<div style={{textAlign: 'center', marginTop: 10, fontFamily: fonts.sans, fontWeight: 600, fontSize: 18, letterSpacing: '0.2em', color: colors.loss, opacity: progress(frame, b.on('not publicly available'), 16)}}>
							NOT PUBLICLY AVAILABLE
						</div>
					</div>
					<div style={{position: 'absolute', left: 900, top: 330}}>
						<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.24em', color: colors.textLo, marginBottom: 30, opacity: progress(frame, b.on('Renaissance had'), 16)}}>
							WHAT RENAISSANCE HAD
						</div>
						<DataVisualization
							type="bars"
							width={860}
							height={300}
							items={[
								{label: 'TECHNOLOGY', value: 0.94, at: b.on('technology'), color: colors.cool},
								{label: 'SCALE', value: 0.96, at: b.on('scale'), color: colors.cool},
								{label: 'SKILLED RESEARCHERS', value: 0.92, at: b.on('highly skilled'), color: colors.cool},
							]}
						/>
					</div>
				</AbsoluteFill>
			</Shake>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: progress(frame, finalAt + 6, 16)}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 50, marginTop: -60}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 36}}>
						<Icon name="cross" size={80} color={colors.loss} draw={progress(frame, b.on('not a trading strategy'), 14)} />
						<BigText text="Copy the strategy" size={96} color={colors.textLo} at={finalAt + 8} strike={{at: b.on('not a trading strategy') + 4}} />
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 36}}>
						<Icon name="check" size={80} color={colors.gain} draw={progress(frame, b.on('learning framework'), 14)} />
						<BigText text="Learn the principles" size={96} at={b.on('learning framework') - 6} underline={{at: b.on('learning framework') + 10, color: colors.gain}} />
					</div>
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};
