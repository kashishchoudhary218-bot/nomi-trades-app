/** Replaceable text-to-speech backend. Add a provider by implementing this and registering it in tts/index.ts. */
export type VoiceSettings = {
	/** Provider-specific voice id (ElevenLabs voice id, Azure voice name, Kokoro voice). */
	voice: string;
	/** Speaking rate multiplier, 1 = provider default. Documentary reads sit around 0.9–1.0. */
	speed: number;
	/** BCP-47-ish language hint for the provider (e.g. "hi", "hi-IN"). */
	language: string;
	/** Expressiveness controls; providers use what they support and ignore the rest. */
	stability?: number;
	similarityBoost?: number;
	style?: number;
	/** Neighbouring narration so providers that support it keep prosody continuous across scenes. */
	previousText?: string;
	nextText?: string;
};

export type SpeechResult = {
	audio: Buffer;
	/** Container of `audio`. */
	format: 'mp3' | 'wav';
};

export interface VoiceProvider {
	readonly id: string;
	readonly label: string;
	/** Returns null when ready, otherwise a human-readable reason (missing key, missing model…). */
	checkConfigured(): Promise<string | null>;
	/** Default voice settings for a documentary-style Indian male Hinglish read. */
	defaultSettings(): VoiceSettings;
	generateSpeech(text: string, settings: VoiceSettings): Promise<SpeechResult>;
}
