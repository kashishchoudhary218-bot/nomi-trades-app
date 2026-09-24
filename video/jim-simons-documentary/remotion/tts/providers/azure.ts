import type {SpeechResult, VoiceProvider, VoiceSettings} from '../types';

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Azure AI Speech (alternative). Indian male neural voices: hi-IN-MadhurNeural (Hindi,
 * default — reads mixed Devanagari/English well) or en-IN-PrabhatNeural (Indian English).
 * Env: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION (e.g. centralindia), optional AZURE_SPEECH_VOICE.
 * Network: <region>.tts.speech.microsoft.com must be reachable.
 */
export const azure: VoiceProvider = {
	id: 'azure',
	label: 'Azure AI Speech',
	async checkConfigured() {
		if (!process.env.AZURE_SPEECH_KEY) return 'AZURE_SPEECH_KEY is not set';
		if (!process.env.AZURE_SPEECH_REGION) return 'AZURE_SPEECH_REGION is not set';
		return null;
	},
	defaultSettings(): VoiceSettings {
		return {voice: process.env.AZURE_SPEECH_VOICE ?? 'hi-IN-MadhurNeural', speed: 0.95, language: 'hi-IN'};
	},
	async generateSpeech(text, s): Promise<SpeechResult> {
		const rate = `${Math.round((s.speed - 1) * 100)}%`;
		const ssml = `<speak version="1.0" xml:lang="${s.language}"><voice name="${s.voice}"><prosody rate="${rate}">${xml(text)}</prosody></voice></speak>`;
		const res = await fetch(`https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
			method: 'POST',
			headers: {
				'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY ?? '',
				'Content-Type': 'application/ssml+xml',
				'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
				'User-Agent': 'mathematicians-edge-vo',
			},
			body: ssml,
		});
		if (!res.ok) throw new Error(`Azure Speech ${res.status}: ${(await res.text()).slice(0, 300)}`);
		return {audio: Buffer.from(await res.arrayBuffer()), format: 'mp3'};
	},
};
