// Static checks: every scene registered, every SFX phrase exists in its narration,
// transitions shorter than adjacent scenes. Run: npm run validate
import {SFX, MUSIC} from '../src/audio/library';
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

const t = buildTimeline(SCENES);
t.scenes.forEach((s, i) => {
	const next = t.scenes[i + 1];
	if (next && s.transitionOut.frames >= Math.min(s.durationInFrames, next.durationInFrames)) {
		errors.push(`${s.def.id}: transition longer than a neighbouring scene`);
	}
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
