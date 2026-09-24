import React from 'react';
import {Composition, Folder, Still, type CalculateMetadataFunction} from 'remotion';
import {findAudio, hasAsset} from './assets/assets';
import {measureAll} from './assets/measure';
import {BROLL} from './data/broll';
import {voPath} from './audio/library';
import {Documentary, documentarySchema, type DocumentaryProps} from './compositions/Documentary';
import {ScenePreview, type ScenePreviewProps} from './compositions/ScenePreview';
import {Showcase, SHOWCASE_FRAMES} from './compositions/Showcase';
import {Thumbnail} from './compositions/Thumbnail';
import {DEFAULT_LANGUAGE, localizeScenes, type Language} from './data/language';
import {buildTimeline} from './timeline/build';
import {VIDEO} from './theme/tokens';
import './theme/fonts';

/**
 * Measures recorded VO (so scene lengths, subtitles, beats and SFX re-time to the real read)
 * and B-roll clips (so clips shorter than their slot loop instead of freezing).
 */
const measureMedia = async (language: Language) => {
	const voPaths = localizeScenes(language).map((s) => [s.id, findAudio(voPath(s.id, language))] as const).filter((e): e is [string, string] => e[1] !== null);
	const videoPaths = Object.values(BROLL)
		.map((b) => b.src)
		.filter((src) => /\.(mp4|mov|webm)$/i.test(src) && hasAsset(src));
	const measured = await measureAll([...voPaths.map(([, p]) => p), ...videoPaths]);
	const voDurations: Record<string, number> = {};
	for (const [id, p] of voPaths) if (measured[p]) voDurations[id] = measured[p];
	const mediaDurations: Record<string, number> = {};
	for (const p of videoPaths) if (measured[p]) mediaDurations[p] = measured[p];
	return {voDurations, mediaDurations};
};

const calculateDocumentary: CalculateMetadataFunction<DocumentaryProps> = async ({props}) => {
	const measured = await measureMedia(props.language);
	const voDurations = {...measured.voDurations, ...props.voDurations};
	const mediaDurations = {...measured.mediaDurations, ...props.mediaDurations};
	const timeline = buildTimeline(localizeScenes(props.language), voDurations, props.language);
	return {durationInFrames: timeline.totalFrames, props: {...props, voDurations, mediaDurations}};
};

const calculateScene: CalculateMetadataFunction<ScenePreviewProps> = async ({props}) => {
	const {voDurations, mediaDurations} = await measureMedia(props.language);
	const scene = buildTimeline(localizeScenes(props.language), voDurations, props.language).scenes.find((s) => s.def.id === props.sceneId);
	if (!scene) throw new Error(`Unknown scene ${props.sceneId}`);
	return {durationInFrames: scene.durationInFrames, props: {...props, voDurations, mediaDurations}};
};

export const RemotionRoot: React.FC = () => {
	const estimate = buildTimeline(localizeScenes(DEFAULT_LANGUAGE));
	return (
		<>
			<Composition
				id="Documentary"
				component={Documentary}
				schema={documentarySchema}
				durationInFrames={estimate.totalFrames}
				fps={VIDEO.fps}
				width={VIDEO.width}
				height={VIDEO.height}
				defaultProps={{language: DEFAULT_LANGUAGE, voDurations: {}, mediaDurations: {}, showSubtitles: true, showGuides: false}}
				calculateMetadata={calculateDocumentary}
			/>
			<Folder name="Scenes">
				{estimate.scenes.map((s) => (
					<Composition
						key={s.def.id}
						id={`Scene-${s.def.id}`}
						component={ScenePreview}
						durationInFrames={s.durationInFrames}
						fps={VIDEO.fps}
						width={VIDEO.width}
						height={VIDEO.height}
						defaultProps={{sceneId: s.def.id, language: DEFAULT_LANGUAGE, voDurations: {}, mediaDurations: {}, showSubtitles: true, showGuides: true}}
						calculateMetadata={calculateScene}
					/>
				))}
			</Folder>
			<Folder name="Extras">
				<Composition id="Showcase" component={Showcase} durationInFrames={SHOWCASE_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
				<Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
			</Folder>
		</>
	);
};
