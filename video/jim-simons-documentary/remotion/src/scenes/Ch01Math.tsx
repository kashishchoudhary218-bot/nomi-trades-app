import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BigText} from '../components/BigText';
import {DataVisualization} from '../components/DataVisualization';
import {ImageScene} from '../components/ImageScene';
import {NumberCounter} from '../components/NumberCounter';
import {Icon, Kicker, LowerThird} from '../components/Primitives';
import {SceneShell} from '../components/SceneShell';
import {BROLL} from '../data/broll';
import {map, progress} from '../lib/anim';
import {useBeats} from '../timeline/SceneContext';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/** S05 — "1982": year counter, company typography (no logo), portrait slot, lower-third. */
export const S05: React.FC = () => {
	const b = useBeats();
	return (
		<SceneShell glow={colors.gold} glowPosition="30% 40%">
			<div style={{position: 'absolute', right: 120, top: 110, width: 640, height: 760, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.hairline}`}}>
				<ImageScene
					{...BROLL.B04}
					grade="duotone"
					dim={0.2}
					kenBurns={{fromScale: 1.02, toScale: 1.12, toX: -10, toY: -16}}
				/>
			</div>
			<div style={{position: 'absolute', left: 120, top: 250}}>
				<NumberCounter mode="count" from={1970} to={1982} at={b.on('1982') - 12} duration={30} size={230} />
				<div style={{marginTop: 30}}>
					<BigText text="RENAISSANCE TECHNOLOGIES" font="sans" size={50} weight={600} tracking="0.12em" at={b.on('founded')} stagger={4} />
				</div>
				<div style={{marginTop: 18}}>
					<Kicker at={b.on('founded') + 10}>Founded by Jim Simons</Kicker>
				</div>
			</div>
			<LowerThird title="JIM SIMONS" subtitle="MATHEMATICIAN · FORMER SIGNALS ANALYST" at={b.on('mathematician') - 6} />
		</SceneShell>
	);
};

/** S06 — "The Core Idea": noise → pattern, then People × Data × Technology. */
export const S06: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const vennAt = b.on('Combine');
	const scatterOut = 1 - progress(frame, vennAt - 10, 16);
	const words: [string, string][] = [
		['PERSISTENT', 'persistent'],
		['PREDICTABLE', 'predictable'],
		['PATTERNS', 'patterns'],
	];
	return (
		<SceneShell glow={colors.signal}>
			<AbsoluteFill style={{opacity: scatterOut}}>
				<div style={{position: 'absolute', left: 120, top: 110, display: 'flex', gap: 40}}>
					{words.map(([w, phrase]) => (
						<BigText key={w} text={w} font="sans" size={54} weight={700} tracking="0.1em" at={b.on(phrase) - 4} highlight={w === 'PATTERNS' ? ['patterns'] : []} />
					))}
				</div>
				<div style={{position: 'absolute', left: 210, top: 260}}>
					<DataVisualization type="scatter" width={1500} height={520} at={0} revealAt={b.on('patterns') - 4} seed="s06" />
				</div>
			</AbsoluteFill>
			{frame >= vennAt - 10 ? <Venn at={vennAt} centerAt={b.on('traded systematically') - 6} beats={[b.on('people'), b.on('data', 1), b.on('technology')]} /> : null}
		</SceneShell>
	);
};

const Venn: React.FC<{at: number; centerAt: number; beats: number[]}> = ({centerAt, beats}) => {
	const frame = useCurrentFrame();
	const R = 230;
	const circles = [
		{label: 'PEOPLE', cx: 960, cy: 380, from: [960, -300], color: colors.cool},
		{label: 'DATA', cx: 840, cy: 590, from: [-300, 900], color: colors.gold},
		{label: 'TECHNOLOGY', cx: 1080, cy: 590, from: [2200, 900], color: colors.gain},
	];
	const glow = progress(frame, centerAt, 24);
	return (
		<AbsoluteFill>
			<svg width={1920} height={1080}>
				<defs>
					<filter id="venn-glow">
						<feGaussianBlur stdDeviation="14" />
					</filter>
				</defs>
				{circles.map((c, i) => {
					const p = progress(frame, beats[i] - 4, 26);
					const x = map(p, [0, 1], [c.from[0], c.cx]);
					const y = map(p, [0, 1], [c.from[1], c.cy]);
					return <circle key={c.label} cx={x} cy={y} r={R} fill={c.color} fillOpacity={0.07} stroke={c.color} strokeWidth={2} opacity={p} />;
				})}
				<circle cx={960} cy={520} r={70 * glow} fill={colors.signal} opacity={0.5 * glow} filter="url(#venn-glow)" />
			</svg>
			{circles.map((c, i) => {
				const p = progress(frame, beats[i] + 6, 18);
				const off = i === 0 ? [0, -140] : i === 1 ? [-120, 110] : [120, 110];
				return (
					<div
						key={c.label}
						style={{
							position: 'absolute',
							left: c.cx + off[0],
							top: c.cy + off[1],
							transform: 'translate(-50%, -50%)',
							fontFamily: fonts.sans,
							fontWeight: 700,
							fontSize: 30,
							letterSpacing: '0.16em',
							color: c.color,
							opacity: p,
						}}
					>
						{c.label}
					</div>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 960,
					top: 520,
					transform: `translate(-50%, -50%) scale(${map(glow, [0, 1], [0.8, 1])})`,
					fontFamily: fonts.sans,
					fontWeight: 800,
					fontSize: 24,
					letterSpacing: '0.12em',
					color: colors.ink,
					background: colors.signal,
					padding: '10px 18px',
					borderRadius: 8,
					opacity: glow,
					boxShadow: `0 0 40px ${colors.signal}88`,
					whiteSpace: 'nowrap',
				}}
			>
				SYSTEMATIC TRADING
			</div>
		</AbsoluteFill>
	);
};

const RoleGlyph: React.FC<{kind: 'math' | 'physics' | 'cs'; draw: number}> = ({kind, draw}) => {
	const stroke = {fill: 'none', stroke: colors.signal, strokeWidth: 2.5, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
	return (
		<svg width={120} height={120} viewBox="0 0 120 120">
			<circle cx={60} cy={60} r={56} fill="none" stroke={colors.hairline} />
			{kind === 'math' ? <path d="M82 36H40l24 24-24 24h42" {...stroke} strokeLinejoin="round" /> : null}
			{kind === 'physics' ? (
				<>
					<ellipse cx={60} cy={60} rx={34} ry={13} {...stroke} />
					<ellipse cx={60} cy={60} rx={34} ry={13} transform="rotate(60 60 60)" {...stroke} />
					<ellipse cx={60} cy={60} rx={34} ry={13} transform="rotate(-60 60 60)" {...stroke} />
					<circle cx={60} cy={60} r={4} fill={colors.signal} opacity={draw} />
				</>
			) : null}
			{kind === 'cs' ? <path d="M46 42L28 60l18 18M74 42l18 18-18 18M66 36L54 84" {...stroke} strokeLinecap="round" strokeLinejoin="round" /> : null}
		</svg>
	);
};

/** S07 — "Scientists, Not Storytellers": qualitative ✕ vs statistical ✓, three roles, "markets = a mathematical system". */
export const S07: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const collapse = progress(frame, b.on('It built it') - 6, 26);
	const rolesAt = b.on('mathematicians') - 10;
	const splitOut = 1 - progress(frame, rolesAt - 8, 16);
	const roles: ['math' | 'physics' | 'cs', string, string][] = [
		['math', 'MATHEMATICIANS', 'mathematicians'],
		['physics', 'PHYSICISTS', 'physicists'],
		['cs', 'COMPUTER SCIENTISTS', 'computer scientists'],
	];
	const leftW = map(collapse, [0, 1], [960, 0]);
	return (
		<SceneShell grid={false} camera={{from: 1, to: 1.04}}>
			<AbsoluteFill style={{opacity: splitOut}}>
				<div style={{position: 'absolute', left: 0, top: 0, width: leftW, height: 1080, overflow: 'hidden', borderRight: `1px solid ${colors.hairline}`}}>
					<div style={{position: 'absolute', inset: 0, width: 960}}>
						<ImageScene {...BROLL.B07} grade="desaturate" dim={0.55} quietPlaceholder />
						<div style={{position: 'absolute', left: 120, top: 420}}>
							<Kicker color={colors.textMid} lineColor={colors.loss}>Traditional</Kicker>
							<div style={{marginTop: 18}}>
								<BigText text={'Qualitative\nanalysis'} size={96} color={colors.textMid} at={0} strike={{at: b.on('qualitative') + 8}} />
							</div>
						</div>
					</div>
				</div>
				<div style={{position: 'absolute', left: leftW, top: 0, right: 0, height: 1080, backgroundImage: `radial-gradient(${colors.signal}22 1.2px, transparent 1.2px)`, backgroundSize: '28px 28px'}}>
					<div style={{position: 'absolute', left: map(collapse, [0, 1], [120, 440]), top: 400}}>
						<Kicker at={b.on('statistical') - 30}>Quantitative</Kicker>
						<div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 28}}>
							<BigText text={'Statistical pattern\nrecognition'} size={96} at={b.on('statistical') - 20} highlight={['statistical']} />
							<div style={{opacity: progress(frame, b.on('pattern recognition'), 10)}}>
								<Icon name="check" size={90} color={colors.gain} draw={progress(frame, b.on('pattern recognition'), 16)} />
							</div>
						</div>
					</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{opacity: 1 - splitOut}}>
				<div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 140}}>
					{roles.map(([kind, label, phrase]) => {
						const at = b.on(phrase) - 6;
						const p = progress(frame, at, 20);
						return (
							<div key={label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
								<RoleGlyph kind={kind} draw={progress(frame, at, 30)} />
								<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.16em', color: colors.textHi}}>{label}</div>
							</div>
						);
					})}
				</div>
				<div style={{position: 'absolute', top: 620, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
					<BigText text="Markets = a mathematical system" size={84} at={b.on('mathematical system') - 14} align="center" highlight={['=']} underline={{at: b.on('hidden patterns')}} />
				</div>
			</AbsoluteFill>
		</SceneShell>
	);
};
