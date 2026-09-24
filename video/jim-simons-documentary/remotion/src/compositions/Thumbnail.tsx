import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FilmGrain} from '../components/Background';
import {randomWalk} from '../lib/series';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

const noise = randomWalk('thumb', 120, 0, 3, 50);

/** YouTube thumbnail (STORYBOARD §10): gold ~66%, "before fees*", signal line through noise, ≤3 words. */
export const Thumbnail: React.FC = () => {
	const W = 1280;
	const H = 720;
	const pts = (arr: number[], amp: number, y0: number) =>
		arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (arr.length - 1)) * W).toFixed(1)},${(y0 + (v - 50) * amp).toFixed(1)}`).join(' ');
	const signal = noise.map((_, i) => 50 + Math.sin(i / 9) * 6);
	return (
		<AbsoluteFill style={{backgroundColor: colors.ink}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 50% 60% at 30% 45%, ${colors.gold}22, transparent 70%)`}} />
			<svg width={W} height={H} style={{position: 'absolute'}}>
				<path d={pts(noise, 4, 470)} fill="none" stroke={colors.textLo} strokeWidth={2} opacity={0.5} />
				<path d={pts(signal, 4, 470)} fill="none" stroke={colors.signal} strokeWidth={6} style={{filter: `drop-shadow(0 0 12px ${colors.signal})`}} />
			</svg>
			<div style={{position: 'absolute', right: 0, top: 0, width: 440, height: H, background: `repeating-linear-gradient(135deg, ${colors.panel} 0 16px, ${colors.panelHi} 16px 32px)`, opacity: 0.9}}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.mono, fontSize: 18, color: colors.amber, textAlign: 'center', padding: 40}}>
					PLACEHOLDER · SILHOUETTE AT CHALKBOARD
				</div>
				<div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${colors.ink}, transparent 50%)`}} />
			</div>
			<div style={{position: 'absolute', left: 64, top: 70}}>
				<div style={{fontFamily: fonts.serif, fontWeight: 400, fontSize: 250, lineHeight: 1, color: colors.gold, letterSpacing: '-0.04em', textShadow: `0 0 60px ${colors.gold}66`}}>~66%</div>
				<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: '0.24em', color: colors.textMid, marginTop: 6}}>BEFORE FEES*</div>
				<div style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 15, letterSpacing: '0.14em', color: colors.textLo, marginTop: 8}}>*REPORTEDLY · AVG. ANNUAL · 30+ YEARS</div>
			</div>
			<div style={{position: 'absolute', left: 64, bottom: 64, fontFamily: fonts.sans, fontWeight: 800, fontSize: 92, letterSpacing: '0.02em', color: colors.textHi}}>
				MATH <span style={{color: colors.signal}}>&gt;</span> INSTINCT
			</div>
			<FilmGrain opacity={0.05} />
		</AbsoluteFill>
	);
};
