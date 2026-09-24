import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries} from '@remotion/transitions';
import {z} from 'zod';
import {AudioLayer} from '../audio/AudioLayer';
import {Guides} from '../components/Guides';
import {Background} from '../components/Background';
import {SectionTitle} from '../components/SectionTitle';
import {CHAPTER_CARD_FRAMES, CHAPTER_CONTENT_OFFSET} from '../components/SceneShell';
import {CHAPTERS} from '../data/chapters';
import {Subtitle} from '../components/Subtitle';
import {getTransition} from '../components/Transition';
import {SCENES} from '../data/scenes';
import {SCENE_COMPONENTS} from '../scenes';
import {buildCues} from '../subtitles/buildCues';
import {buildTimeline, type BuiltScene} from '../timeline/build';
import {SceneProvider} from '../timeline/SceneContext';
import {colors} from '../theme/tokens';

export const documentarySchema = z.object({
	/** Measured VO lengths in seconds, filled automatically by calculateMetadata. */
	voDurations: z.record(z.string(), z.number()),
	showSubtitles: z.boolean(),
	showGuides: z.boolean(),
});

export type DocumentaryProps = z.infer<typeof documentarySchema>;

/** One scene: optional chapter card, then the scene component mounted at its content offset. */
export const RenderScene: React.FC<{scene: BuiltScene}> = ({scene}) => {
	const Comp = SCENE_COMPONENTS[scene.def.id];
	if (!Comp) throw new Error(`Scene ${scene.def.id} is not registered in src/scenes/index.ts`);
	const chapter = CHAPTERS[scene.def.chapter];
	const offset = scene.def.chapterCard ? CHAPTER_CONTENT_OFFSET : 0;
	if (scene.def.chapterCard && !chapter.number) throw new Error(`${scene.def.id}: chapterCard set on a chapter without a number`);
	return (
		<SceneProvider
			value={{
				id: scene.def.id,
				durationInFrames: scene.durationInFrames,
				narration: scene.def.narration,
				voFrom: scene.voFrom,
				voFrames: scene.voFrames,
				contentOffset: offset,
			}}
		>
			{offset > 0 ? (
				<Sequence durationInFrames={CHAPTER_CARD_FRAMES} name="Chapter card">
					<Background>
						<SectionTitle number={chapter.number ?? ''} title={chapter.title} durationInFrames={CHAPTER_CARD_FRAMES} />
					</Background>
				</Sequence>
			) : null}
			<Sequence from={offset} name="Content">
				<Comp />
			</Sequence>
		</SceneProvider>
	);
};

/** The full film: 35 scenes with house transitions, audio layer, subtitles and editor guides. */
export const Documentary: React.FC<DocumentaryProps> = ({voDurations, showSubtitles, showGuides}) => {
	const timeline = useMemo(() => buildTimeline(SCENES, voDurations), [voDurations]);
	const cues = useMemo(() => buildCues(timeline), [timeline]);

	return (
		<AbsoluteFill style={{backgroundColor: colors.ink}}>
			<TransitionSeries>
				{timeline.scenes.map((scene) => (
					<React.Fragment key={scene.def.id}>
						<TransitionSeries.Sequence durationInFrames={scene.durationInFrames} name={`${scene.def.id} · ${scene.def.title}`}>
							<RenderScene scene={scene} />
						</TransitionSeries.Sequence>
						{scene.transitionOut.kind !== 'cut' ? (
							<TransitionSeries.Transition {...getTransition(scene.transitionOut.kind, scene.transitionOut.frames)} />
						) : null}
					</React.Fragment>
				))}
			</TransitionSeries>
			<AudioLayer timeline={timeline} />
			{showSubtitles ? <Subtitle cues={cues} /> : null}
			{showGuides ? <Guides timeline={timeline} /> : null}
		</AbsoluteFill>
	);
};
