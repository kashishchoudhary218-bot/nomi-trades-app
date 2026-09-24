import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import type {Language} from '../../src/data/language';

export type VoEntry = {
	file: string;
	hash: string;
	provider: string;
	voice: string;
	speed: number;
	durationSec: number;
	generatedAt: string;
};
export type VoManifest = Record<string, VoEntry>;

export const manifestPath = (language: Language) => `public/audio/vo/${language}/manifest.json`;

export const readManifest = (language: Language): VoManifest =>
	existsSync(manifestPath(language)) ? JSON.parse(readFileSync(manifestPath(language), 'utf8')) : {};

export const writeManifest = (language: Language, m: VoManifest) =>
	writeFileSync(manifestPath(language), `${JSON.stringify(m, null, '\t')}\n`);

/** Measured VO durations (seconds) for node-side scripts; only entries whose file still exists. */
export const manifestDurations = (language: Language): Record<string, number> => {
	const out: Record<string, number> = {};
	for (const [id, e] of Object.entries(readManifest(language))) if (existsSync(`public/${e.file}`)) out[id] = e.durationSec;
	return out;
};
