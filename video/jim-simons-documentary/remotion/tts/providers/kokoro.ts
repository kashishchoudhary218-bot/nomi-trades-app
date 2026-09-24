import {spawn} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import type {SpeechResult, VoiceProvider, VoiceSettings} from '../types';

const ROOT = path.resolve(__dirname, '../..');
const MODEL = path.join(ROOT, 'tts-models/kokoro-v1.0.onnx');
const VOICES = path.join(ROOT, 'tts-models/voices-v1.0.bin');
const SCRIPT = path.join(ROOT, 'tts/kokoro/synth.py');
const PYTHON = process.env.PYTHON ?? 'python3';

/**
 * Kokoro-82M (Apache-2.0) running locally via ONNX — no API key, no network at synthesis
 * time. Hindi male voices: hm_omega (default), hm_psi. Good for drafts and for running the
 * pipeline anywhere; use ElevenLabs/Azure for the premium final read.
 * Setup: npm run tts:setup
 */
export const kokoro: VoiceProvider = {
	id: 'kokoro',
	label: 'Kokoro-82M (local)',
	async checkConfigured() {
		if (!existsSync(MODEL) || !existsSync(VOICES)) return 'Kokoro model files missing — run: npm run tts:setup';
		const ok = await run(PYTHON, ['-c', 'import kokoro_onnx, soundfile'], '').then(
			() => true,
			() => false,
		);
		return ok ? null : 'Python packages missing — run: npm run tts:setup';
	},
	defaultSettings(): VoiceSettings {
		return {voice: process.env.KOKORO_VOICE ?? 'hm_omega', speed: 1.0, language: 'hi'};
	},
	async generateSpeech(text, s): Promise<SpeechResult> {
		const dir = mkdtempSync(path.join(tmpdir(), 'kokoro-'));
		const out = path.join(dir, 'out.wav');
		try {
			await run(PYTHON, [SCRIPT], JSON.stringify({text, voice: s.voice, speed: s.speed, lang: s.language, model: MODEL, voices: VOICES, out}));
			return {audio: readFileSync(out), format: 'wav'};
		} finally {
			rmSync(dir, {recursive: true, force: true});
		}
	},
};

const run = (cmd: string, args: string[], stdin: string): Promise<void> =>
	new Promise((resolve, reject) => {
		const p = spawn(cmd, args, {stdio: ['pipe', 'ignore', 'pipe']});
		let err = '';
		p.stderr.on('data', (d) => (err += d));
		p.on('error', reject);
		p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}: ${err.slice(-600)}`))));
		p.stdin.end(stdin);
	});
