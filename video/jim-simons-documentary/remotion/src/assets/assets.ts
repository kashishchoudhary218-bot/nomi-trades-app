import {staticFile} from 'remotion';
import {AVAILABLE_ASSETS} from './available.generated';

const available = new Set(AVAILABLE_ASSETS);

export const hasAsset = (path: string): boolean => available.has(path);

/** Resolved URL for a file in public/, or null if it hasn't been added yet. */
export const assetUrl = (path: string): string | null => (available.has(path) ? staticFile(path) : null);

/** Finds `base` + any supported audio extension; returns the public/ path or null. */
export const findAudio = (base: string): string | null => {
	for (const ext of ['.mp3', '.wav', '.m4a', '.aac']) {
		if (available.has(base + ext)) return base + ext;
	}
	return null;
};
