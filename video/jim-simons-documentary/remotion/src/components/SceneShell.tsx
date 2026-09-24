import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {progress} from '../lib/anim';
import {useScene} from '../timeline/SceneContext';
import {Background} from './Background';
import {CameraMove} from './CameraMove';

export const CHAPTER_CARD_FRAMES = 66;
/** Content starts this many frames into a chapter-card scene (card and content overlap slightly). */
export const CHAPTER_CONTENT_OFFSET = CHAPTER_CARD_FRAMES - 6;

type Props = {
	/** Background glow color. */
	glow?: string;
	glowPosition?: string;
	grid?: boolean;
	/** Camera move for the content layer; false = locked off. */
	camera?: false | {from?: number; to?: number; driftX?: number; driftY?: number; rotate?: number};
	children: React.ReactNode;
};

/**
 * Standard scene wrapper: background + camera move. Chapter cards are rendered by
 * RenderScene (from `chapterCard` in data/scenes.ts) *before* the scene mounts, so every
 * frame inside a scene component — useCurrentFrame() and useBeats() alike — is content-relative.
 */
export const SceneShell: React.FC<Props> = ({glow, glowPosition, grid, camera = {}, children}) => {
	const frame = useCurrentFrame();
	const scene = useScene();
	const contentDuration = scene.durationInFrames - scene.contentOffset;
	const fadeIn = scene.contentOffset > 0 ? progress(frame, 0, 8) : 1;
	return (
		<AbsoluteFill style={{opacity: fadeIn}}>
			<Background glow={glow} glowPosition={glowPosition} grid={grid}>
				{camera === false ? children : <CameraMove {...camera} durationInFrames={contentDuration}>{children}</CameraMove>}
			</Background>
		</AbsoluteFill>
	);
};
