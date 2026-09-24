import {azure} from './providers/azure';
import {elevenlabs} from './providers/elevenlabs';
import {kokoro} from './providers/kokoro';
import type {VoiceProvider} from './types';

export const PROVIDERS: Record<string, VoiceProvider> = {elevenlabs, azure, kokoro};

/** TTS_PROVIDER env or --provider flag; defaults to the local Kokoro model. */
export const getProvider = (id = process.env.TTS_PROVIDER ?? 'kokoro'): VoiceProvider => {
	const p = PROVIDERS[id];
	if (!p) throw new Error(`Unknown TTS provider "${id}". Available: ${Object.keys(PROVIDERS).join(', ')}`);
	return p;
};

export type {SpeechResult, VoiceProvider, VoiceSettings} from './types';
