// Static checks for every narration language: scenes registered, beat/SFX phrases resolve,
// Hinglish anchors valid, transitions fit, VO/SFX/subtitle/music timing consistent.
// Run: npm run validate            (both languages, estimated VO)
//      npm run validate -- hinglish '{"S01": 11.2}'   (one language, measured VO seconds)
import {readFileSync, readdirSync} from 'node:fs';
import {placeAudio} from '../src/audio/AudioLayer';
import {MUSIC, SFX} from '../src/audio/library';
import {LANGUAGES, localizeScenes, type Language} from '../src/data/language';
import {HINGLISH} from '../src/data/narration.hinglish';
import {SCENES} from '../src/data/scenes';
import {SCENE_COMPONENTS} from '../src/scenes';
import {buildCues} from '../src/subtitles/buildCues';
import {buildTimeline, formatTimecode} from '../src/timeline/build';
import {phraseIndex, resolvePhrase} from '../src/timeline/narration';
import {manifestDurations} from './lib/vo-manifest';

const errors: string[] = [];
const tryPhrase = (label: string, fn: () => unknown) => {
	try {
		fn();
	} catch (e) {
		errors.push(`${label}: ${(e as Error).message}`);
	}
};

// ── Scene data (language-independent) ──
const ids = new Set<string>();
for (const s of SCENES) {
	if (ids.has(s.id)) errors.push(`${s.id}: duplicate scene id`);
	ids.add(s.id);
	if (!MUSIC[s.music]) errors.push(`${s.id}: unknown music cue ${s.music}`);
	for (const cue of s.sfx) if (!SFX[cue.id]) errors.push(`${s.id}: unknown SFX ${cue.id}`);
	if (!SCENE_COMPONENTS[s.id]) errors.push(`${s.id}: not registered in src/scenes/index.ts`);
	if (s.narration && !HINGLISH[s.id]) errors.push(`${s.id}: missing Hinglish narration`);
	if (!s.narration && HINGLISH[s.id]) errors.push(`${s.id}: has Hinglish narration but no English narration`);
}
for (const id of Object.keys(SCENE_COMPONENTS)) if (!ids.has(id)) errors.push(`${id}: registered but missing from data/scenes.ts`);

// ── Hinglish anchor map: every key is a real English phrase, every value a real Hinglish phrase ──
for (const [id, hi] of Object.entries(HINGLISH)) {
	const en = SCENES.find((s) => s.id === id);
	for (const key of Object.keys(hi.anchors)) {
		const [k, kOcc] = key.includes('#') ? [key.split('#')[0], Number(key.split('#')[1])] : [key, 0];
		if (en) tryPhrase(`${id} anchor key`, () => phraseIndex(en.narration, k, kOcc));
		tryPhrase(`${id} anchor value`, () => resolvePhrase(hi.narration, hi.anchors, k, kOcc));
	}
}

// ── Literal beat phrases in scene code, i.e. b.on('…'), resolve in every language ──
const beatsByScene: Record<string, [string, number][]> = {};
for (const file of readdirSync('src/scenes').filter((f) => f.endsWith('.tsx'))) {
	const parts = readFileSync(`src/scenes/${file}`, 'utf8').split(/export const (S\d\d)\b/);
	for (let i = 1; i < parts.length; i += 2) {
		for (const m of parts[i + 1].matchAll(/b\.on\(\s*(['"])(.*?)\1(?:\s*,\s*(\d+))?\)/g)) {
			(beatsByScene[parts[i]] ??= []).push([m[2], Number(m[3] ?? 0)]);
		}
	}
}

const onlyLang = LANGUAGES.find((l) => l === process.argv[2]);
// Measured VO seconds: explicit JSON arg, else the generated voiceover's manifest.json.
const voArg: Record<string, number> | null = process.argv[onlyLang ? 3 : 2] ? JSON.parse(process.argv[onlyLang ? 3 : 2]) : null;

const checkLanguage = (language: Language) => {
	const voDurations = voArg ?? manifestDurations(language);
	const defs = localizeScenes(language);
	for (const s of defs) {
		for (const cue of s.sfx) if (cue.on) tryPhrase(`${language} ${s.id} SFX`, () => resolvePhrase(s.narration, s.anchors, cue.on!));
		for (const [p, occ] of beatsByScene[s.id] ?? []) tryPhrase(`${language} ${s.id} beat`, () => resolvePhrase(s.narration, s.anchors, p, occ));
	}

	const t = buildTimeline(defs, voDurations, language);
	t.scenes.forEach((s, i) => {
		const next = t.scenes[i + 1];
		if (next && s.transitionOut.frames >= Math.min(s.durationInFrames, next.durationInFrames)) {
			errors.push(`${language} ${s.def.id}: transition longer than a neighbouring scene`);
		}
		if (s.def.narration && s.voFrom + s.voFrames > s.durationInFrames) errors.push(`${language} ${s.def.id}: VO runs past the end of the scene`);
		if (s.def.chapterCard && s.voFrom < 66) errors.push(`${language} ${s.def.id}: VO starts under the chapter card`);
	});

	// Audio sync: no two voiceovers overlap, every SFX lands inside its own scene.
	let audio: ReturnType<typeof placeAudio> | null = null;
	tryPhrase(`${language} audio placement`, () => (audio = placeAudio(t)));
	if (audio) {
		const a: ReturnType<typeof placeAudio> = audio;
		a.vo.forEach((v, i) => {
			const next = a.vo[i + 1];
			if (next && v.from + v.durationInFrames > next.from) errors.push(`${language}: VO ${v.sceneId} overlaps VO ${next.sceneId} by ${v.from + v.durationInFrames - next.from} frames`);
		});
		for (const x of a.sfx) {
			const sc = t.scenes.find((s) => s.def.id === x.sceneId)!;
			if (x.from < sc.from || x.from >= sc.from + sc.durationInFrames) errors.push(`${language}: ${x.id} in ${x.sceneId} falls outside its scene`);
		}
		const musicEnd = a.music.reduce((m, c) => Math.max(m, c.from + c.durationInFrames), 0);
		if (a.music[0].from !== 0 || musicEnd !== t.totalFrames) errors.push(`${language}: music cues do not cover the whole film`);
	}

	// Subtitles: ordered, non-overlapping, inside the film.
	const cues = buildCues(t);
	cues.forEach((c, i) => {
		if (c.to <= c.from) errors.push(`${language}: subtitle ${i + 1} has no duration: "${c.text}"`);
		if (i > 0 && c.from < cues[i - 1].to) errors.push(`${language}: subtitle ${i + 1} overlaps the previous cue`);
		if (c.to > t.totalFrames) errors.push(`${language}: subtitle ${i + 1} runs past the end of the film`);
	});
	return {t, measured: Object.keys(voDurations).length};
};

for (const language of onlyLang ? [onlyLang] : LANGUAGES) {
	const {t, measured} = checkLanguage(language);
	console.log(`\n[${language}] VO: ${measured} scene(s) measured from recordings, the rest estimated`);
	console.log(`[${language}] Scene  Start     Length  VO       Title`);
	for (const s of t.scenes) {
		console.log(
			`[${language}] ${s.def.id.padEnd(6)} ${formatTimecode(s.from)}  ${(s.durationInFrames / 30).toFixed(1).padStart(5)}s  ${(s.voFrames / 30).toFixed(1).padStart(5)}s${s.voMeasured ? '*' : ' '} ${s.def.title}`,
		);
	}
	console.log(`[${language}] Total: ${formatTimecode(t.totalFrames)} (${t.totalFrames} frames @ 30 fps)`);
}

if (errors.length) {
	console.error(`\n✖ ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
	process.exit(1);
}
console.log('\n✔ Scene data valid');
