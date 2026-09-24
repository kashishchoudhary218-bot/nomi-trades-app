import {ALL_FORMATS, Input, UrlSource} from 'mediabunny';
import {staticFile} from 'remotion';

/** Duration in seconds of a file in public/ (audio or video), via Mediabunny. */
export const measureDuration = async (publicPath: string): Promise<number> => {
	const url = new URL(staticFile(publicPath), window.location.href);
	const input = new Input({formats: ALL_FORMATS, source: new UrlSource(url)});
	try {
		return await input.computeDuration();
	} finally {
		input.dispose();
	}
};

/**
 * Measures many files; a file that can't be read is skipped with a warning
 * (the timeline then falls back to its estimate instead of failing the render).
 */
export const measureAll = async (paths: string[]): Promise<Record<string, number>> => {
	const out: Record<string, number> = {};
	await Promise.all(
		paths.map(async (p) => {
			try {
				const d = await measureDuration(p);
				if (Number.isFinite(d) && d > 0) out[p] = d;
			} catch (err) {
				console.warn(`Could not measure public/${p} — using the estimate instead.`, err);
			}
		}),
	);
	return out;
};
