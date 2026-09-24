import {DEFAULT_TRANSITION_FRAMES, type TransitionKind} from '../components/Transition';
import {DEFAULT_LANGUAGE, type Language} from '../data/language';
import type {SceneDef} from '../data/scenes';
import {VIDEO} from '../theme/tokens';
import {estimateVoSeconds} from './narration';

export type BuiltScene = {
	def: SceneDef;
	index: number;
	/** Absolute start frame in the documentary (transitions overlap scenes). */
	from: number;
	durationInFrames: number;
	/** VO start relative to scene start, and VO length. */
	voFrom: number;
	voFrames: number;
	/** true when voFrames comes from a real recording. */
	voMeasured: boolean;
	transitionOut: {kind: TransitionKind; frames: number};
};

export type BuiltTimeline = {scenes: BuiltScene[]; totalFrames: number; language: Language};

const TAIL_SEC = 0.9;
const f = (s: number) => Math.round(s * VIDEO.fps);

/**
 * Lays scenes end-to-end. Each scene lasts at least its storyboard length and
 * always long enough for its voiceover (recorded duration if available, else an estimate).
 */
export const buildTimeline = (
	defs: SceneDef[],
	voDurations: Record<string, number> = {},
	language: Language = DEFAULT_LANGUAGE,
): BuiltTimeline => {
	const scenes: BuiltScene[] = [];
	let cursor = 0;
	defs.forEach((def, index) => {
		const measured = voDurations[def.id];
		const voSec = measured ?? estimateVoSeconds(def.narration);
		const voFrom = f(def.voOffsetSec);
		const voFrames = f(voSec);
		const needed = def.narration ? voFrom + voFrames + f(TAIL_SEC) : 0;
		const durationInFrames = Math.max(f(def.minDurationSec), needed);
		const isLast = index === defs.length - 1;
		const kind: TransitionKind = isLast ? 'cut' : def.transitionOut;
		const frames = kind === 'cut' ? 0 : (def.transitionFrames ?? DEFAULT_TRANSITION_FRAMES[kind]);
		scenes.push({
			def,
			index,
			from: cursor,
			durationInFrames,
			voFrom,
			voFrames,
			voMeasured: measured !== undefined,
			transitionOut: {kind, frames},
		});
		cursor += durationInFrames - frames;
	});
	const last = scenes[scenes.length - 1];
	return {scenes, totalFrames: last.from + last.durationInFrames, language};
};

export const formatTimecode = (frame: number, fps: number = VIDEO.fps): string => {
	const total = frame / fps;
	const m = Math.floor(total / 60);
	const s = Math.floor(total % 60);
	const fr = Math.floor(frame % fps);
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
};
