import type {SubtitleCue} from '../components/Subtitle';
import type {BuiltTimeline} from '../timeline/build';
import {wordCount} from '../timeline/narration';

const MAX_CHARS = 84; // ≈ two lines of 42 characters (broadcast standard)
const MIN_FRAMES = 30;

/** Splits `text` into the fewest parts ≤ max chars, each break placed near an even share. */
const splitBalanced = (text: string, max: number): string[] => {
	const words = text.split(' ');
	const n = Math.ceil(text.length / max);
	const target = text.length / n;
	const parts: string[] = [];
	let cur = '';
	for (const w of words) {
		const next = cur ? `${cur} ${w}` : w;
		if (cur && parts.length < n - 1 && Math.abs(next.length - target) > Math.abs(cur.length - target)) {
			parts.push(cur);
			cur = w;
		} else cur = next;
	}
	parts.push(cur);
	return parts;
};

/** Splits narration into readable subtitle chunks at sentence, then clause, then balanced word boundaries. */
export const chunkNarration = (text: string): string[] => {
	const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
	const out: string[] = [];
	for (const sentence of sentences) {
		if (sentence.length <= MAX_CHARS) {
			out.push(sentence);
			continue;
		}
		const clauses = sentence.split(/(?<=[,:;—])\s+/);
		let buf = '';
		for (const clause of clauses) {
			const candidate = buf ? `${buf} ${clause}` : clause;
			if (candidate.length <= MAX_CHARS) {
				buf = candidate;
				continue;
			}
			if (buf) out.push(buf);
			if (clause.length <= MAX_CHARS) {
				buf = clause;
				continue;
			}
			// Very long clause: split into evenly sized parts at word boundaries.
			const parts = splitBalanced(clause, MAX_CHARS);
			out.push(...parts.slice(0, -1));
			buf = parts[parts.length - 1];
		}
		if (buf) out.push(buf);
	}
	return out;
};

/**
 * Subtitle cues for the whole film. Chunks are timed by word position across each
 * scene's VO window — the same model useBeats() uses, so captions and visual beats agree.
 * For frame-accurate captions from the final VO, replace with a Whisper transcription (see README).
 */
export const buildCues = (timeline: BuiltTimeline): SubtitleCue[] => {
	const cues: SubtitleCue[] = [];
	for (const s of timeline.scenes) {
		if (!s.def.narration) continue;
		const chunks = chunkNarration(s.def.narration);
		const total = Math.max(1, wordCount(s.def.narration));
		const start = s.from + s.voFrom;
		let wordsBefore = 0;
		chunks.forEach((chunk, i) => {
			const from = start + Math.round((wordsBefore / total) * s.voFrames);
			wordsBefore += wordCount(chunk);
			const to = i === chunks.length - 1 ? start + s.voFrames : start + Math.round((wordsBefore / total) * s.voFrames);
			cues.push({from, to: Math.max(to, from + MIN_FRAMES) + 6, text: chunk});
		});
	}
	// Remove overlaps from the +6 hold.
	for (let i = 0; i < cues.length - 1; i++) cues[i].to = Math.min(cues[i].to, cues[i + 1].from);
	return cues;
};

const srtTime = (frame: number, fps: number): string => {
	const ms = Math.round((frame / fps) * 1000);
	const h = Math.floor(ms / 3600000);
	const m = Math.floor((ms % 3600000) / 60000);
	const s = Math.floor((ms % 60000) / 1000);
	const r = ms % 1000;
	const p = (n: number, l = 2) => String(n).padStart(l, '0');
	return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};

export const toSrt = (cues: SubtitleCue[], fps: number): string =>
	cues.map((c, i) => `${i + 1}\n${srtTime(c.from, fps)} --> ${srtTime(c.to, fps)}\n${c.text}\n`).join('\n');
