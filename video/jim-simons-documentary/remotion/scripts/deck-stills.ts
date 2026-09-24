// Renders one clean still per scene (no subtitles / HUD) for the Hinglish slide deck:
// ../deck/images/<Scene>.jpg, taken when the scene's visuals are fully built.
// Run: npx tsx scripts/deck-stills.ts
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {localizeScenes} from '../src/data/language';
import {buildTimeline} from '../src/timeline/build';
import {manifestDurations} from './lib/vo-manifest';

/** Where in the VO (0–1) each scene looks most complete; default 0.95. */
const AT: Record<string, number> = {S04: -1, S01: 0.9, S08: 0.97, S19: 0.99, S20: 0.99, S23: 0.9, S32: 0.99};

const main = async () => {
	const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
	const inputProps = {language: 'hinglish', showSubtitles: false, showGuides: false};
	const composition = await selectComposition({serveUrl, id: 'Documentary', inputProps, browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || null});
	const t = buildTimeline(localizeScenes('hinglish'), manifestDurations('hinglish'), 'hinglish');
	const out = path.resolve('../deck/images');
	mkdirSync(out, {recursive: true});
	for (const s of t.scenes) {
		if (s.def.id === 'S35' || s.def.id === 'S34') continue;
		const fr = AT[s.def.id] ?? 0.95;
		const local = fr < 0 ? Math.round(s.durationInFrames * 0.6) : Math.round(s.voFrom + fr * s.voFrames);
		const frame = Math.min(s.from + local, s.from + s.durationInFrames - s.transitionOut.frames - 2);
		await renderStill({composition, serveUrl, frame, inputProps, output: path.join(out, `${s.def.id}.jpg`), imageFormat: 'jpeg', jpegQuality: 88, browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE || null});
		console.log(`✔ ${s.def.id} @ frame ${frame}`);
	}
};
main();
