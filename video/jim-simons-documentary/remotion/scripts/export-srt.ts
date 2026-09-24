// Writes out/subtitles.srt from the same cue builder the video uses,
// for uploading closed captions to YouTube alongside the burned-in subtitles.
import {mkdirSync, writeFileSync} from 'node:fs';
import {SCENES} from '../src/data/scenes';
import {buildCues, toSrt} from '../src/subtitles/buildCues';
import {buildTimeline} from '../src/timeline/build';

const voDurations: Record<string, number> = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const timeline = buildTimeline(SCENES, voDurations);
const cues = buildCues(timeline);
mkdirSync('out', {recursive: true});
writeFileSync('out/subtitles.srt', toSrt(cues, 30));
console.log(`Wrote out/subtitles.srt — ${cues.length} cues, ${(timeline.totalFrames / 30 / 60).toFixed(2)} min`);
