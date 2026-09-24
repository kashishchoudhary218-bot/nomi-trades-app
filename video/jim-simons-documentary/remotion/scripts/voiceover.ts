// Generates the narration audio for every scene with the configured TTS provider.
//
//   npm run voiceover                         all scenes, Hinglish, provider from TTS_PROVIDER (default kokoro)
//   npm run voiceover -- --scene S01          one scene (comma-separate for several)
//   npm run voiceover -- --provider elevenlabs --force
//   npm run voiceover -- --language english
//
// Output: public/audio/vo/<language>/<Scene>.mp3 (+ manifest.json with hash & duration).
// Unchanged scenes are skipped (content hash), so re-runs only regenerate what changed.
// Remotion then measures each file and fits scene lengths, beats, SFX and subtitles to it.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {ALL_FORMATS, BufferSource, Input} from 'mediabunny';
import {AUDIO_EXTENSIONS, voPath} from '../src/audio/library';
import {DEFAULT_LANGUAGE, LANGUAGES, localizeScenes, type Language} from '../src/data/language';
import {buildTimeline, formatTimecode} from '../src/timeline/build';
import {getProvider, type VoiceSettings} from '../tts';
import {toHinglishTtsText} from '../tts/pronunciation/hinglish';
import {manifestDurations, readManifest, writeManifest} from './lib/vo-manifest';

if (existsSync('.env')) process.loadEnvFile('.env');

const arg = (name: string) => {
	const i = process.argv.indexOf(`--${name}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const flag = (name: string) => process.argv.includes(`--${name}`);

const language = (LANGUAGES.find((l) => l === arg('language')) ?? DEFAULT_LANGUAGE) as Language;
const provider = getProvider(arg('provider'));
const onlyScenes = arg('scene')?.split(',').map((s) => s.trim().toUpperCase());
const force = flag('force');

const ttsText = (text: string) => (language === 'hinglish' ? toHinglishTtsText(text) : text);

const measure = async (file: string): Promise<number> => {
	const input = new Input({formats: ALL_FORMATS, source: new BufferSource(readFileSync(file))});
	try {
		return await input.computeDuration();
	} finally {
		input.dispose();
	}
};

/**
 * Encode to MP3 with Remotion's bundled ffmpeg. MP3 (not AAC) because it plays in every
 * browser Studio may run in — open-source Chromium builds can't decode AAC.
 */
const toMp3 = (src: string, dest: string) => {
	execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-ac', '1', '-ar', '48000', '-c:a', 'libmp3lame', '-b:a', '192k', dest], {stdio: 'inherit'});
};

const main = async () => {
	const reason = await provider.checkConfigured();
	if (reason) {
		console.error(`✖ ${provider.label} is not configured: ${reason}\n  See README → "Voiceover (AI TTS)".`);
		process.exit(1);
	}
	const scenes = localizeScenes(language).filter((s) => s.narration);
	const targets = onlyScenes ? scenes.filter((s) => onlyScenes.includes(s.id)) : scenes;
	if (onlyScenes && targets.length !== onlyScenes.length) throw new Error(`Unknown or non-narrated scene in --scene ${arg('scene')}`);

	mkdirSync(`public/audio/vo/${language}`, {recursive: true});
	const manifest = readManifest(language);
	const base = provider.defaultSettings();
	const overrides: Partial<VoiceSettings> = {
		...(arg('voice') ? {voice: arg('voice')} : {}),
		...(arg('speed') ? {speed: Number(arg('speed'))} : {}),
	};
	console.log(`Provider: ${provider.label} · voice ${overrides.voice ?? base.voice} · language ${language} · ${targets.length} scene(s)`);

	for (const s of targets) {
		const i = scenes.indexOf(s);
		const text = ttsText(s.narration);
		const settings: VoiceSettings = {
			...base,
			...overrides,
			previousText: i > 0 ? ttsText(scenes[i - 1].narration) : undefined,
			nextText: i < scenes.length - 1 ? ttsText(scenes[i + 1].narration) : undefined,
		};
		const {previousText, nextText, ...stable} = settings;
		const hash = createHash('sha1').update(JSON.stringify({p: provider.id, stable, text, previousText, nextText})).digest('hex').slice(0, 16);
		const out = `${voPath(s.id, language)}.mp3`;
		const prev = manifest[s.id];
		if (!force && prev?.hash === hash && existsSync(`public/${prev.file}`)) {
			console.log(`  ${s.id}  unchanged (${prev.durationSec.toFixed(2)}s) — skipped`);
			continue;
		}

		const t0 = Date.now();
		const speech = await provider.generateSpeech(text, settings);
		const dir = mkdtempSync(path.join(tmpdir(), 'vo-'));
		try {
			const raw = path.join(dir, `raw.${speech.format}`);
			writeFileSync(raw, speech.audio);
			// Remove any other-format file for this scene so the new one is the one used.
			for (const ext of AUDIO_EXTENSIONS) rmSync(`public/${voPath(s.id, language)}${ext}`, {force: true});
			toMp3(raw, `public/${out}`);
		} finally {
			rmSync(dir, {recursive: true, force: true});
		}
		const durationSec = await measure(`public/${out}`);
		manifest[s.id] = {file: out, hash, provider: provider.id, voice: settings.voice, speed: settings.speed, durationSec, generatedAt: new Date().toISOString()};
		writeManifest(language, manifest);
		console.log(`  ${s.id}  ${durationSec.toFixed(2)}s  (${((Date.now() - t0) / 1000).toFixed(1)}s to generate)`);
	}

	execFileSync('node', ['scripts/sync-assets.mjs'], {stdio: 'inherit'});
	const durations = manifestDurations(language);
	const t = buildTimeline(localizeScenes(language), durations, language);
	const missing = scenes.filter((s) => !durations[s.id]).map((s) => s.id);
	console.log(`\nVoiceover: ${Object.keys(durations).length}/${scenes.length} scenes recorded · film length ${formatTimecode(t.totalFrames)}`);
	if (missing.length) console.log(`Still estimated (no audio yet): ${missing.join(', ')}`);
};

main().catch((e) => {
	console.error(`✖ ${(e as Error).message}`);
	process.exit(1);
});
