/** Word-level helpers for syncing visuals and SFX to narration phrases. */

export const tokenize = (text: string): string[] =>
	text
		.split(/\s+/)
		.map((w) => w.toLowerCase().replace(/[^a-z0-9%'-]/g, '').replace(/^[-']+|[-']+$/g, ''))
		.filter(Boolean);

export const wordCount = (text: string): number => tokenize(text).length;

/**
 * Word index where `phrase` starts in `narration` (nth occurrence, 0-based).
 * Throws if the phrase isn't in the narration, so typos are caught in Studio.
 */
export const phraseIndex = (narration: string, phrase: string, occurrence = 0): number => {
	const words = tokenize(narration);
	const target = tokenize(phrase);
	let seen = 0;
	for (let i = 0; i <= words.length - target.length; i++) {
		if (target.every((t, k) => words[i + k] === t)) {
			if (seen === occurrence) return i;
			seen++;
		}
	}
	throw new Error(`Phrase "${phrase}" not found in narration: "${narration.slice(0, 60)}…"`);
};

const withOccurrence = (p: string, occurrence: number): [string, number] => {
	const m = /^(.*)#(\d+)$/.exec(p);
	return m ? [m[1], Number(m[2])] : [p, occurrence];
};

/**
 * Word index of a beat phrase. Beat phrases are written against the English script;
 * `anchors` (from localizeScenes) translates them to the phrase in the active narration.
 */
export const resolvePhrase = (
	narration: string,
	anchors: Record<string, string> | undefined,
	phrase: string,
	occurrence = 0,
): number => {
	const key = occurrence ? `${phrase}#${occurrence}` : phrase;
	const mapped = anchors?.[key];
	if (mapped) {
		const [p, occ] = withOccurrence(mapped, 0);
		return phraseIndex(narration, p, occ);
	}
	return phraseIndex(narration, phrase, occurrence);
};

/**
 * Speech-timing model shared by the VO estimate, visual beats, SFX cues and subtitles.
 * Time per word ∝ its characters (≈17 characters/second, a ~150 wpm documentary read),
 * plus a pause after sentence ends and clause breaks (the / and // marks in the script).
 * Character-based works for English and Hinglish alike — Hinglish has many short function
 * words ("ki", "ke", "hai") that a plain word count would over-weight.
 */
const CHARS_PER_SECOND = 17;
const SENTENCE_PAUSE = 0.35;
const CLAUSE_PAUSE = 0.15;

type SpeechModel = {
	/** Seconds from VO start to the start of each token (index = tokenize() index). */
	starts: number[];
	totalSeconds: number;
};

const speechModel = (text: string): SpeechModel => {
	const starts: number[] = [];
	let t = 0;
	for (const raw of text.split(/\s+/).filter(Boolean)) {
		const isToken = tokenize(raw).length > 0;
		if (isToken) starts.push(t);
		const letters = raw.replace(/[^\p{L}\p{N}]/gu, '').length;
		t += (letters + 1) / CHARS_PER_SECOND;
		if (/[.!?]["'”)]*$/.test(raw)) t += SENTENCE_PAUSE;
		else if (/[,:;—]$/.test(raw) || raw === '—') t += CLAUSE_PAUSE;
	}
	return {starts, totalSeconds: t};
};

/** Estimated VO length (seconds) when no recording exists yet. */
export const estimateVoSeconds = (text: string): number => (text.trim() ? speechModel(text).totalSeconds : 0);

/** Where (0–1) in the read a given token index starts. Scales onto the real VO length once recorded. */
export const tokenFraction = (text: string, tokenIndex: number): number => {
	const m = speechModel(text);
	if (tokenIndex >= m.starts.length) return 1;
	return m.totalSeconds > 0 ? m.starts[tokenIndex] / m.totalSeconds : 0;
};

/** Where (0–1) in the read a beat phrase is spoken (anchors translate English beat phrases). */
export const phraseFraction = (
	narration: string,
	anchors: Record<string, string> | undefined,
	phrase: string,
	occurrence = 0,
): number => tokenFraction(narration, resolvePhrase(narration, anchors, phrase, occurrence));
