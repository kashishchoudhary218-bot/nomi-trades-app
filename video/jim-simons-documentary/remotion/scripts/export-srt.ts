// Writes out/subtitles.<language>.srt from the same cue builder the video uses, for
// uploading closed captions to YouTube alongside (or instead of) the burned-in subtitles.
// Run: npm run srt                 → Hinglish (default)
//      npm run srt -- english      → English
//      npm run srt -- hinglish '{"S01": 11.2}'   (measured VO seconds)
import {mkdirSync, writeFileSync} from 'node:fs';
import {DEFAULT_LANGUAGE, LANGUAGES, localizeScenes} from '../src/data/language';
import {buildCues, toSrt} from '../src/subtitles/buildCues';
import {buildTimeline} from '../src/timeline/build';
import {VIDEO} from '../src/theme/tokens';
import {manifestDurations} from './lib/vo-manifest';

const language = LANGUAGES.find((l) => l === process.argv[2]) ?? DEFAULT_LANGUAGE;
const voArg = process.argv[process.argv[2] === language ? 3 : 2];
const voDurations: Record<string, number> = voArg ? JSON.parse(voArg) : manifestDurations(language);
const timeline = buildTimeline(localizeScenes(language), voDurations, language);
const cues = buildCues(timeline);
mkdirSync('out', {recursive: true});
const file = `out/subtitles.${language}.srt`;
writeFileSync(file, toSrt(cues, VIDEO.fps));
console.log(`Wrote ${file} — ${cues.length} cues, ${(timeline.totalFrames / VIDEO.fps / 60).toFixed(2)} min`);
