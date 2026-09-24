import React from 'react';
import {Composition, Folder, staticFile, type CalculateMetadataFunction} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {findAudio} from './assets/assets';
import {voPath} from './audio/library';
import {Documentary, documentarySchema, type DocumentaryProps} from './compositions/Documentary';
import {ScenePreview, type ScenePreviewProps} from './compositions/ScenePreview';
import {Showcase, SHOWCASE_FRAMES} from './compositions/Showcase';
import {Thumbnail} from './compositions/Thumbnail';
import {SCENES} from './data/scenes';
import {buildTimeline} from './timeline/build';
import {VIDEO} from './theme/tokens';
import './theme/fonts';

/** Measures any recorded VO so scene lengths, subtitles and SFX re-time to the real read. */
const measureVo = async (): Promise<Record<string, number>> => {
	const out: Record<string, number> = {};
	await Promise.all(
		SCENES.map(async (s) => {
			const path = findAudio(voPath(s.id));
			if (path) out[s.id] = await getAudioDurationInSeconds(staticFile(path));
		}),
	);
	return out;
};

const calculateDocumentary: CalculateMetadataFunction<DocumentaryProps> = async ({props}) => {
	const voDurations = {...(await measureVo()), ...props.voDurations};
	return {durationInFrames: buildTimeline(SCENES, voDurations).totalFrames, props: {...props, voDurations}};
};

const calculateScene: CalculateMetadataFunction<ScenePreviewProps> = async ({props}) => {
	const voDurations = await measureVo();
	const scene = buildTimeline(SCENES, voDurations).scenes.find((s) => s.def.id === props.sceneId);
	return {durationInFrames: scene?.durationInFrames ?? 300, props: {...props, voDurations}};
};

export const RemotionRoot: React.FC = () => {
	const estimate = buildTimeline(SCENES);
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
				defaultProps={{voDurations: {}, showSubtitles: true, showGuides: false}}
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
						defaultProps={{sceneId: s.def.id, voDurations: {}, showSubtitles: true, showGuides: true}}
						calculateMetadata={calculateScene}
					/>
				))}
			</Folder>
			<Folder name="Extras">
				<Composition id="Showcase" component={Showcase} durationInFrames={SHOWCASE_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
				<Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
			</Folder>
		</>
	);
};
