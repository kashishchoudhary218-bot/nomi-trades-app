import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {MediaDurationsProvider} from '../assets/MediaContext';
import {AudioLayer} from '../audio/AudioLayer';
import {Guides} from '../components/Guides';
import {Subtitle} from '../components/Subtitle';
import {DEFAULT_LANGUAGE, localizeScenes, type Language} from '../data/language';
import {buildCues} from '../subtitles/buildCues';
import {buildTimeline} from '../timeline/build';
import {colors} from '../theme/tokens';
import {RenderScene} from './Documentary';

export type ScenePreviewProps = {
	sceneId: string;
	language: Language;
	voDurations: Record<string, number>;
	mediaDurations: Record<string, number>;
	showSubtitles: boolean;
	showGuides: boolean;
};

/** One scene in isolation (with its own VO, SFX and subtitles) for fast iteration in Studio. */
export const ScenePreview: React.FC<ScenePreviewProps> = ({sceneId, language = DEFAULT_LANGUAGE, voDurations, mediaDurations, showSubtitles, showGuides}) => {
	const timeline = useMemo(() => buildTimeline(localizeScenes(language), voDurations, language), [language, voDurations]);
	const scene = timeline.scenes.find((s) => s.def.id === sceneId);
	const cues = useMemo(() => buildCues(timeline), [timeline]);
	if (!scene) throw new Error(`Unknown scene ${sceneId}`);
	return (
		<MediaDurationsProvider value={mediaDurations}>
		<AbsoluteFill style={{backgroundColor: colors.ink}}>
			{/* Shift the whole film so this scene starts at frame 0; audio/subs stay in sync. */}
			<Sequence from={-scene.from} name="Film offset">
				<Sequence from={scene.from} durationInFrames={scene.durationInFrames} name={scene.def.id}>
					<RenderScene scene={scene} />
				</Sequence>
				<AudioLayer timeline={{...timeline, scenes: [scene]}} />
				{showSubtitles ? <Subtitle cues={cues.filter((c) => c.from >= scene.from && c.from < scene.from + scene.durationInFrames)} /> : null}
				{showGuides ? <Guides timeline={timeline} /> : null}
			</Sequence>
		</AbsoluteFill>
		</MediaDurationsProvider>
	);
};
