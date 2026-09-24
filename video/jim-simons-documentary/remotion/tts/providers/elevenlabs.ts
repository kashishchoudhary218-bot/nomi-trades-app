import type {SpeechResult, VoiceProvider, VoiceSettings} from '../types';

/**
 * ElevenLabs (recommended for the final premium read).
 * Env: ELEVENLABS_API_KEY (required), ELEVENLABS_VOICE_ID (an Indian male voice from the
 * Voice Library), ELEVENLABS_MODEL (default eleven_multilingual_v2 — handles Hinglish well).
 * Network: api.elevenlabs.io must be reachable.
 */
export const elevenlabs: VoiceProvider = {
	id: 'elevenlabs',
	label: 'ElevenLabs',
	async checkConfigured() {
		if (!process.env.ELEVENLABS_API_KEY) return 'ELEVENLABS_API_KEY is not set';
		if (!process.env.ELEVENLABS_VOICE_ID) return 'ELEVENLABS_VOICE_ID is not set (pick an Indian male voice in the ElevenLabs Voice Library)';
		return null;
	},
	defaultSettings(): VoiceSettings {
		return {
			voice: process.env.ELEVENLABS_VOICE_ID ?? '',
			speed: 0.95,
			language: 'hi',
			stability: 0.55,
			similarityBoost: 0.8,
			style: 0.25,
		};
	},
	async generateSpeech(text, s): Promise<SpeechResult> {
		const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(s.voice)}?output_format=mp3_44100_192`, {
			method: 'POST',
			headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY ?? '', 'content-type': 'application/json', accept: 'audio/mpeg'},
			body: JSON.stringify({
				text,
				model_id: process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2',
				previous_text: s.previousText,
				next_text: s.nextText,
				voice_settings: {
					stability: s.stability ?? 0.55,
					similarity_boost: s.similarityBoost ?? 0.8,
					style: s.style ?? 0.25,
					use_speaker_boost: true,
					speed: s.speed,
				},
			}),
		});
		if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
		return {audio: Buffer.from(await res.arrayBuffer()), format: 'mp3'};
	},
};
