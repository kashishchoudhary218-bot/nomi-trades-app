import {HINGLISH} from './narration.hinglish';
import {SCENES, type SceneDef} from './scenes';

export const LANGUAGES = ['hinglish', 'english'] as const;
export type Language = (typeof LANGUAGES)[number];

/** The film is narrated in Hinglish; English stays available as an alternate cut. */
export const DEFAULT_LANGUAGE: Language = 'hinglish';

/**
 * Scene list with narration (and beat anchors) for the chosen language. Visuals,
 * durations, transitions, music and SFX cues are shared — only the spoken words change.
 */
export const localizeScenes = (language: Language): SceneDef[] => {
	if (language === 'english') return SCENES;
	return SCENES.map((s) => {
		if (!s.narration) return s;
		const hi = HINGLISH[s.id];
		if (!hi) throw new Error(`${s.id}: missing Hinglish narration in data/narration.hinglish.ts`);
		return {...s, narration: hi.narration, anchors: hi.anchors};
	});
};
