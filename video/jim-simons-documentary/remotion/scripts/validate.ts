// Static checks: every scene registered, every SFX phrase exists in its narration,
// transitions shorter than adjacent scenes. Run: npm run validate
import {placeAudio} from '../src/audio/AudioLayer';
import {SFX, MUSIC} from '../src/audio/library';
import {SCENE_COMPONENTS} from '../src/scenes';
import {buildCues} from '../src/subtitles/buildCues';
import {SCENES} from '../src/data/scenes';
import {buildTimeline, formatTimecode} from '../src/timeline/build';
import {phraseIndex} from '../src/timeline/narration';

const errors: string[] = [];
const ids = new Set<string>();
for (const s of SCENES) {
	if (ids.has(s.id)) errors.push(`${s.id}: duplicate scene id`);
	ids.add(s.id);
	if (!MUSIC[s.music]) errors.push(`${s.id}: unknown music cue ${s.music}`);
	for (const cue of s.sfx) {
		if (!SFX[cue.id]) errors.push(`${s.id}: unknown SFX ${cue.id}`);
		if (cue.on) {
			try {
				phraseIndex(s.narration, cue.on);
			} catch (e) {
				errors.push(`${s.id}: ${(e as Error).message}`);
			}
		}
	}
}

// Optional measured VO durations (seconds), e.g. npm run validate -- '{"S01": 11.2}'
const voDurations: Record<string, number> = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const t = buildTimeline(SCENES, voDurations);

for (const s of SCENES) if (!SCENE_COMPONENTS[s.id]) errors.push(`${s.id}: not registered in src/scenes/index.ts`);
for (const id of Object.keys(SCENE_COMPONENTS)) if (!ids.has(id)) errors.push(`${id}: registered but missing from data/scenes.ts`);

t.scenes.forEach((s, i) => {
	const next = t.scenes[i + 1];
	if (next && s.transitionOut.frames >= Math.min(s.durationInFrames, next.durationInFrames)) {
		errors.push(`${s.def.id}: transition longer than a neighbouring scene`);
	}
	if (s.def.narration && s.voFrom + s.voFrames > s.durationInFrames) errors.push(`${s.def.id}: VO runs past the end of the scene`);
	if (s.def.chapterCard && s.voFrom < 66) errors.push(`${s.def.id}: VO starts under the chapter card`);
});

// Audio sync: no two voiceovers overlap, every SFX lands inside its own scene.
const audio = placeAudio(t);
audio.vo.forEach((v, i) => {
	const next = audio.vo[i + 1];
	if (next && v.from + v.durationInFrames > next.from) errors.push(`VO ${v.sceneId} overlaps VO ${next.sceneId} by ${v.from + v.durationInFrames - next.from} frames`);
});
for (const x of audio.sfx) {
	const sc = t.scenes.find((s) => s.def.id === x.sceneId)!;
	if (x.from < sc.from || x.from >= sc.from + sc.durationInFrames) errors.push(`${x.id} in ${x.sceneId} falls outside its scene`);
}
const musicEnd = audio.music.reduce((m, c) => Math.max(m, c.from + c.durationInFrames), 0);
if (audio.music[0].from !== 0 || musicEnd !== t.totalFrames) errors.push('Music cues do not cover the whole film');

// Subtitles: ordered, non-overlapping, inside the film.
const cues = buildCues(t);
cues.forEach((c, i) => {
	if (c.to <= c.from) errors.push(`Subtitle ${i + 1} has no duration: "${c.text}"`);
	if (i > 0 && c.from < cues[i - 1].to) errors.push(`Subtitle ${i + 1} overlaps the previous cue`);
	if (c.to > t.totalFrames) errors.push(`Subtitle ${i + 1} runs past the end of the film`);
});

console.log('Scene  Start     Length  VO(est)  Title');
for (const s of t.scenes) {
	console.log(
		`${s.def.id.padEnd(6)} ${formatTimecode(s.from)}  ${(s.durationInFrames / 30).toFixed(1).padStart(5)}s  ${(s.voFrames / 30).toFixed(1).padStart(5)}s  ${s.def.title}`,
	);
}
console.log(`\nTotal: ${formatTimecode(t.totalFrames)} (${t.totalFrames} frames @ 30 fps)`);

if (errors.length) {
	console.error(`\n✖ ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
	process.exit(1);
}
console.log('✔ Scene data valid');
