import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {findAudio} from '../assets/assets';
import {MUSIC, SFX, voPath, type MusicCueId, type SfxId} from './library';
import type {BuiltTimeline} from '../timeline/build';
import {phraseFrame} from '../timeline/SceneContext';
import {VIDEO} from '../theme/tokens';

export type PlacedSfx = {id: SfxId; from: number; volume: number; sceneId: string};
export type PlacedMusic = {id: MusicCueId; from: number; durationInFrames: number};
export type PlacedVo = {sceneId: string; from: number; durationInFrames: number};

const MUSIC_FADE_IN = 20;
const MUSIC_FADE_OUT = 36;
const DUCK_RAMP = 10;
const DUCK_LEVEL = 0.3; // music level under VO, relative to the cue's base volume
const SFX_LEN = 150;

/** Absolute positions of every VO, music and SFX cue in the film. */
export const placeAudio = (timeline: BuiltTimeline) => {
	const vo: PlacedVo[] = timeline.scenes
		.filter((s) => s.def.narration)
		.map((s) => ({sceneId: s.def.id, from: s.from + s.voFrom, durationInFrames: s.voFrames}));

	const music: PlacedMusic[] = [];
	for (const s of timeline.scenes) {
		const end = s.from + s.durationInFrames;
		const prev = music[music.length - 1];
		if (prev && prev.id === s.def.music) prev.durationInFrames = end - prev.from;
		else music.push({id: s.def.music, from: s.from, durationInFrames: end - s.from});
	}

	const sfx: PlacedSfx[] = timeline.scenes.flatMap((s) =>
		s.def.sfx.map((cue) => {
			const local = cue.on
				? phraseFrame({narration: s.def.narration, voFrom: s.voFrom, voFrames: s.voFrames}, cue.on)
				: Math.round((cue.atSec ?? 0) * VIDEO.fps);
			return {id: cue.id, from: s.from + local, volume: cue.volume ?? 0.8, sceneId: s.def.id};
		}),
	);

	return {vo, music, sfx};
};

/** Ducking envelope: 1 when VO is speaking, ramps to 0 away from it. */
const voPresence = (absFrame: number, vo: PlacedVo[]): number => {
	let best = 0;
	for (const w of vo) {
		const a = w.from;
		const b = w.from + w.durationInFrames;
		if (absFrame >= a && absFrame <= b) return 1;
		const d = absFrame < a ? a - absFrame : absFrame - b;
		best = Math.max(best, 1 - d / DUCK_RAMP);
	}
	return Math.max(0, best);
};

/**
 * Mounts every audio cue whose file exists in public/. Missing files are skipped,
 * so the project renders silently until real audio is dropped in.
 */
export const AudioLayer: React.FC<{timeline: BuiltTimeline}> = ({timeline}) => {
	const {vo, music, sfx} = placeAudio(timeline);
	return (
		<>
			{vo.map((v) => {
				const path = findAudio(voPath(v.sceneId));
				if (!path) return null;
				return (
					<Sequence key={`vo-${v.sceneId}`} from={v.from} name={`VO ${v.sceneId}`} layout="none">
						<Audio src={staticFile(path)} volume={1} />
					</Sequence>
				);
			})}
			{music.map((m) => {
				const path = findAudio(MUSIC[m.id].path);
				if (!path) return null;
				const base = MUSIC[m.id].volume;
				return (
					<Sequence key={`music-${m.id}-${m.from}`} from={m.from} durationInFrames={m.durationInFrames} name={`Music ${m.id}`} layout="none">
						<Audio
							src={staticFile(path)}
							loop
							volume={(f) => {
								const fadeIn = Math.min(1, f / MUSIC_FADE_IN);
								const fadeOut = Math.min(1, (m.durationInFrames - f) / MUSIC_FADE_OUT);
								const duck = 1 - voPresence(m.from + f, vo) * (1 - DUCK_LEVEL);
								return Math.max(0, base * duck * Math.min(fadeIn, fadeOut));
							}}
						/>
					</Sequence>
				);
			})}
			{sfx.map((s, i) => {
				const path = findAudio(SFX[s.id].path);
				if (!path) return null;
				return (
					<Sequence key={`sfx-${i}`} from={s.from} durationInFrames={SFX_LEN} name={`${s.id} (${s.sceneId})`} layout="none">
						<Audio src={staticFile(path)} volume={() => s.volume} />
					</Sequence>
				);
			})}
		</>
	);
};
