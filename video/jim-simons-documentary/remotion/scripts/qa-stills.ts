// Bundles once and renders contact-sheet stills of every scene (start / middle / end of VO)
// into out/qa/. Catches runtime errors (e.g. a beat phrase not in the narration) and gives
// a quick visual pass. Run: npm run qa  (optional: npm run qa -- S05 S06; QA_LANGUAGE=english)
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {DEFAULT_LANGUAGE, LANGUAGES, localizeScenes} from '../src/data/language';
import {buildTimeline} from '../src/timeline/build';

const only = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const language = LANGUAGES.find((l) => l === process.env.QA_LANGUAGE) ?? DEFAULT_LANGUAGE;

const main = async () => {
	const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
	const outDir = path.resolve('out/qa');
	mkdirSync(outDir, {recursive: true});
	const timeline = buildTimeline(localizeScenes(language), {}, language);
	console.log(`QA language: ${language}`);
	let failed = 0;
	for (const s of timeline.scenes) {
		if (only.length && !only.includes(s.def.id)) continue;
		const id = `Scene-${s.def.id}`;
		const inputProps = {showGuides: false, language};
		try {
			const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable});
			const vo0 = s.voFrom;
			const frames = [
				Math.min(composition.durationInFrames - 1, vo0 + Math.round(s.voFrames * 0.25)),
				Math.min(composition.durationInFrames - 1, vo0 + Math.round(s.voFrames * 0.6)),
				composition.durationInFrames - 20,
			];
			for (const [k, frame] of frames.entries()) {
				await renderStill({
					composition,
					serveUrl,
					frame,
					inputProps,
					browserExecutable,
					output: path.join(outDir, `${s.def.id}-${['a', 'b', 'c'][k]}.jpg`),
					imageFormat: 'jpeg',
					jpegQuality: 80,
				});
			}
			console.log(`✔ ${s.def.id}`);
		} catch (e) {
			failed++;
			console.error(`✖ ${s.def.id}: ${(e as Error).message.split('\n')[0]}`);
		}
	}
	if (failed) process.exit(1);
};

main();
