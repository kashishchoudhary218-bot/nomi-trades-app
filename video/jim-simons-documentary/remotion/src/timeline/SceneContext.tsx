import React, {createContext, useContext} from 'react';
import {phraseFraction} from './narration';

export type SceneInfo = {
	id: string;
	durationInFrames: number;
	narration: string;
	/** Beat-phrase translations for non-English narration (see localizeScenes). */
	anchors?: Record<string, string>;
	/** VO start / length in frames, relative to scene start. */
	voFrom: number;
	voFrames: number;
	/** Frames the content layer starts after scene start (chapter-card scenes). Beats are relative to the content layer. */
	contentOffset: number;
};

const SceneContext = createContext<SceneInfo>({
	id: 'preview',
	durationInFrames: 300,
	narration: '',
	voFrom: 0,
	voFrames: 300,
	contentOffset: 0,
});

export const SceneProvider: React.FC<{value: SceneInfo; children: React.ReactNode}> = ({value, children}) => (
	<SceneContext.Provider value={value}>{children}</SceneContext.Provider>
);

/** Duration / narration info of the scene currently being rendered. */
export const useScene = (): SceneInfo => useContext(SceneContext);

export type Beats = {
	/** Frame (in the current layer) when `phrase` is spoken. Follows the real VO once recorded. */
	on: (phrase: string, occurrence?: number) => number;
	/** Frame at a fraction (0–1) of the VO. */
	at: (fraction: number) => number;
	voStart: number;
	voEnd: number;
	/** Frames available in the current layer. */
	duration: number;
};

/**
 * Narration-synced timing. Visual beats are declared by phrase ("on('1982')"), so
 * when the real voiceover replaces the estimate, animations re-time themselves.
 */
export const useBeats = (): Beats => {
	const s = useScene();
	const start = s.voFrom - s.contentOffset;
	const at = (fraction: number) => Math.round(start + fraction * s.voFrames);
	return {
		on: (phrase, occurrence = 0) => at(phraseFraction(s.narration, s.anchors, phrase, occurrence)),
		at,
		voStart: start,
		voEnd: start + s.voFrames,
		duration: s.durationInFrames - s.contentOffset,
	};
};

/** Same phrase → frame mapping, usable outside React (audio cue placement). */
export const phraseFrame = (info: Pick<SceneInfo, 'narration' | 'anchors' | 'voFrom' | 'voFrames'>, phrase: string): number => {
	return Math.round(info.voFrom + phraseFraction(info.narration, info.anchors, phrase) * info.voFrames);
};
