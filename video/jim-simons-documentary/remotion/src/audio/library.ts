import type {Language} from '../data/language';

/**
 * Audio placeholder library. Drop files into public/ with these base names
 * (.mp3, .wav, .m4a or .aac) and run `npm run sync:assets` — they are picked up
 * automatically. Missing files are simply skipped (and listed by the guides overlay).
 */

export const SFX = {
	'SFX-01': {name: 'Sub-boom hit', path: 'audio/sfx/sfx-01-sub-boom'},
	'SFX-02': {name: 'Digital counter ticks', path: 'audio/sfx/sfx-02-counter-ticks'},
	'SFX-03': {name: 'Soft air whoosh', path: 'audio/sfx/sfx-03-whoosh'},
	'SFX-04': {name: 'Data chirp / UI blip', path: 'audio/sfx/sfx-04-data-blip'},
	'SFX-05': {name: 'Sparse keyboard typing', path: 'audio/sfx/sfx-05-typing'},
	'SFX-06': {name: 'Pen on paper', path: 'audio/sfx/sfx-06-pen-scratch'},
	'SFX-07': {name: 'Static crackle', path: 'audio/sfx/sfx-07-static'},
	'SFX-08': {name: 'Glass tick (correct)', path: 'audio/sfx/sfx-08-glass-tick'},
	'SFX-09': {name: 'Low denied thud', path: 'audio/sfx/sfx-09-denied-thud'},
	'SFX-10': {name: 'Heartbeat kick', path: 'audio/sfx/sfx-10-heartbeat'},
	'SFX-11': {name: 'Reverse cymbal riser', path: 'audio/sfx/sfx-11-riser'},
	'SFX-12': {name: 'Room tone / murmur bed', path: 'audio/sfx/sfx-12-room-tone'},
} as const;

export type SfxId = keyof typeof SFX;

export const MUSIC = {
	M1: {name: 'Pattern — mysterious, precise (~80 BPM)', path: 'audio/music/m1-pattern', volume: 0.4},
	M2: {name: 'Laboratory — curious, forward (~95 BPM)', path: 'audio/music/m2-laboratory', volume: 0.4},
	M3: {name: 'Ground Truth — low drone', path: 'audio/music/m3-ground-truth', volume: 0.45},
	M4: {name: 'Method — confident, bright (~100 BPM)', path: 'audio/music/m4-method', volume: 0.4},
	M5: {name: 'Pressure — tense, heartbeat (~70 BPM)', path: 'audio/music/m5-pressure', volume: 0.4},
	M6: {name: 'Noise — granular, uneasy', path: 'audio/music/m6-noise', volume: 0.4},
	M7: {name: 'Discipline — piano + strings resolve', path: 'audio/music/m7-discipline', volume: 0.45},
} as const;

export type MusicCueId = keyof typeof MUSIC;

/** One VO folder per narration language: audio/vo/hinglish/S01.mp3, audio/vo/english/S01.mp3 … */
export const voPath = (sceneId: string, language: Language) => `audio/vo/${language}/${sceneId}`;

export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac'] as const;
