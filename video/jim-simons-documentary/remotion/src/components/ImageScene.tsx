import React from 'react';
import {AbsoluteFill, Img, Loop, OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {assetUrl} from '../assets/assets';
import {useMediaDuration} from '../assets/MediaContext';
import {map} from '../lib/anim';
import {fonts} from '../theme/fonts';
import {colors, EASE_IN_OUT} from '../theme/tokens';
import {useScene} from '../timeline/SceneContext';

type Grade = 'none' | 'cool' | 'duotone' | 'desaturate';

export type ImageSceneProps = {
	/** Path inside public/, e.g. "broll/B03-chalkboard.mp4". Missing files render a placeholder. */
	src: string;
	/** Shot ID from the storyboard B-roll list, e.g. "B03". */
	shotId: string;
	/** What should be in the shot — printed on the placeholder. */
	description: string;
	/** Licensing / sourcing note printed on the placeholder. */
	sourceNote?: string;
	/** Ken Burns move. */
	kenBurns?: {fromScale?: number; toScale?: number; fromX?: number; toX?: number; fromY?: number; toY?: number};
	grade?: Grade;
	/** 0–1 darkening overlay so type stays legible. */
	dim?: number;
	durationInFrames?: number;
	/** Placeholder shows only a small corner tag — use when type sits on top of the B-roll. */
	quietPlaceholder?: boolean;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

const GRADE: Record<Grade, string> = {
	none: 'none',
	cool: 'saturate(0.6) contrast(1.1) brightness(0.8) hue-rotate(-8deg)',
	duotone: 'grayscale(1) contrast(1.15) brightness(0.75) sepia(0.35) hue-rotate(10deg)',
	desaturate: 'saturate(0.2) contrast(1.1) brightness(0.7)',
};

/** Full-bleed image / video with Ken Burns and grade — or a labelled placeholder until the asset exists. */
export const ImageScene: React.FC<ImageSceneProps> = ({
	src,
	shotId,
	description,
	sourceNote = 'Royalty-free stock or original footage',
	kenBurns = {},
	grade = 'cool',
	dim = 0.35,
	durationInFrames,
	quietPlaceholder = false,
	style,
	children,
}) => {
	const frame = useCurrentFrame();
	const scene = useScene();
	const dur = durationInFrames ?? scene.durationInFrames - scene.contentOffset;
	const {fromScale = 1.04, toScale = 1.14, fromX = 0, toX = -30, fromY = 0, toY = -10} = kenBurns;
	const s = map(frame, [0, dur], [fromScale, toScale], EASE_IN_OUT);
	const x = map(frame, [0, dur], [fromX, toX], EASE_IN_OUT);
	const y = map(frame, [0, dur], [fromY, toY], EASE_IN_OUT);
	const {fps} = useVideoConfig();
	const url = assetUrl(src);
	const isVideo = /\.(mp4|mov|webm)$/i.test(src);
	const clipSec = useMediaDuration(src);
	// Clips shorter than the slot loop instead of freezing on their last frame.
	const loopFrames = clipSec !== undefined && clipSec * fps < dur ? Math.max(1, Math.floor(clipSec * fps)) : null;
	const media: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', filter: GRADE[grade]};

	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: colors.ink, ...style}}>
			<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s})`}}>
				{url ? (
					isVideo ? (
						loopFrames ? (
							<Loop durationInFrames={loopFrames} name={`${shotId} loop`}>
								<OffthreadVideo src={url} muted style={media} />
							</Loop>
						) : (
							<OffthreadVideo src={url} muted style={media} />
						)
					) : (
						<Img src={url} style={media} />
					)
				) : (
					<Placeholder shotId={shotId} description={description} sourceNote={sourceNote} path={src} quiet={quietPlaceholder} />
				)}
			</AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,15,20,${dim * 0.6}), rgba(11,15,20,${dim}) 70%, ${colors.ink})`}} />
			{children}
		</AbsoluteFill>
	);
};

const Placeholder: React.FC<{shotId: string; description: string; sourceNote: string; path: string; quiet: boolean}> = ({
	shotId,
	description,
	sourceNote,
	path,
	quiet,
}) =>
	quiet ? (
		<AbsoluteFill style={{background: `repeating-linear-gradient(135deg, ${colors.panel} 0 22px, ${colors.panelHi} 22px 44px)`}}>
			<div style={{position: 'absolute', right: 150, top: 120, fontFamily: fonts.mono, fontSize: 18, color: colors.amber, letterSpacing: '0.14em', textAlign: 'right'}}>
				B-ROLL {shotId} · PLACEHOLDER
				<div style={{color: colors.textLo, letterSpacing: '0.04em', marginTop: 6}}>{description}</div>
			</div>
		</AbsoluteFill>
	) : (
	<AbsoluteFill
		style={{
			background: `repeating-linear-gradient(135deg, ${colors.panel} 0 22px, ${colors.panelHi} 22px 44px)`,
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{[
			{top: 60, left: 60, bt: true, bl: true},
			{top: 60, right: 60, bt: true, br: true},
			{bottom: 60, left: 60, bb: true, bl: true},
			{bottom: 60, right: 60, bb: true, br: true},
		].map((c, i) => (
			<div
				key={i}
				style={{
					position: 'absolute',
					width: 60,
					height: 60,
					top: c.top,
					left: c.left,
					right: c.right,
					bottom: c.bottom,
					borderTop: c.bt ? `2px solid ${colors.textLo}` : undefined,
					borderBottom: c.bb ? `2px solid ${colors.textLo}` : undefined,
					borderLeft: c.bl ? `2px solid ${colors.textLo}` : undefined,
					borderRight: c.br ? `2px solid ${colors.textLo}` : undefined,
				}}
			/>
		))}
		<div style={{textAlign: 'center', maxWidth: 1100}}>
			<div style={{fontFamily: fonts.mono, fontSize: 22, color: colors.amber, letterSpacing: '0.2em'}}>
				PLACEHOLDER · B-ROLL {shotId}
			</div>
			<div style={{fontFamily: fonts.serif, fontWeight: 300, fontSize: 56, color: colors.textMid, marginTop: 18, lineHeight: 1.15}}>
				{description}
			</div>
			<div style={{fontFamily: fonts.sans, fontSize: 20, color: colors.textLo, marginTop: 22, letterSpacing: '0.06em'}}>
				{sourceNote} → <span style={{fontFamily: fonts.mono}}>public/{path}</span>
			</div>
		</div>
	</AbsoluteFill>
	);
