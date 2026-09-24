// Writes ../NARRATION_HINGLISH.md — the Hinglish VO script, scene by scene, generated
// from src/data (single source of truth). Run: npm run script:hinglish
import {writeFileSync} from 'node:fs';
import {CHAPTERS} from '../src/data/chapters';
import {localizeScenes} from '../src/data/language';
import {SCENES} from '../src/data/scenes';
import {buildTimeline, formatTimecode} from '../src/timeline/build';

const hi = buildTimeline(localizeScenes('hinglish'), {}, 'hinglish');
const tc = (f: number) => formatTimecode(f).slice(0, 5);
const out: string[] = [
	'# The Mathematician\'s Edge — Hinglish Narration Script',
	'',
	'_Generated from `remotion/src/data/narration.hinglish.ts` by `npm run script:hinglish` — edit the data file, not this page._',
	'',
	'**Read style:** calm, confident, documentary tone. Roman-script Hinglish; trading terms stay in English. Numbers are read naturally in Hindi or English, whichever sounds right (e.g. "66 percent", "1982", "30 saal").',
	'**Kept from the source PDF:** "reportedly", "lagbhag" (approximately) and "fees se pehle" (before fees). Don\'t drop them in the read.',
	'**Files:** record one file per scene as `public/audio/vo/hinglish/<Scene>.mp3` (S04 and S35 have no VO). Scene lengths, subtitles, visual beats and SFX re-time to the recording automatically.',
	'',
	'Timecodes are estimates until the VO is recorded. Visuals and on-screen text are unchanged; see `STORYBOARD.md`.',
	'',
];
let chapter = '';
for (const s of hi.scenes) {
	if (s.def.chapter !== chapter) {
		chapter = s.def.chapter;
		const ch = CHAPTERS[s.def.chapter];
		out.push(`## ${ch.number ? `${ch.number} — ` : ''}${ch.title}`, '');
	}
	out.push(`### ${s.def.id} · ${s.def.title}  \`${tc(s.from)}\``, '');
	if (!s.def.narration) {
		out.push('_(Music only — no narration.)_', '');
		continue;
	}
	out.push(`> ${s.def.narration}`, '');
	const en = SCENES.find((x) => x.id === s.def.id)!;
	out.push(`<sub>EN reference: ${en.narration}</sub>`, '');
}
out.push(`---`, '', `Estimated total runtime (Hinglish): **${tc(hi.totalFrames)}**`, '');
writeFileSync('../NARRATION_HINGLISH.md', out.join('\n'));
console.log('Wrote ../NARRATION_HINGLISH.md');
