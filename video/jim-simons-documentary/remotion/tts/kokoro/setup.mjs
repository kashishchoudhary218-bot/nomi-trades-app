// npm run tts:setup — installs the local Kokoro TTS (Python) and downloads its model files
// (Apache-2.0, ~350 MB) into tts-models/ (git-ignored).
import {execFileSync} from 'node:child_process';
import {createWriteStream, existsSync, mkdirSync} from 'node:fs';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const python = process.env.PYTHON ?? 'python3';
execFileSync(python, ['-m', 'pip', 'install', '-q', '-r', `${root}/tts/kokoro/requirements.txt`], {stdio: 'inherit'});

const BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0';
mkdirSync(`${root}/tts-models`, {recursive: true});
for (const f of ['kokoro-v1.0.onnx', 'voices-v1.0.bin']) {
	const dest = `${root}/tts-models/${f}`;
	if (existsSync(dest)) continue;
	console.log(`Downloading ${f}…`);
	const res = await fetch(`${BASE}/${f}`);
	if (!res.ok) throw new Error(`Download failed for ${f}: ${res.status}`);
	await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}
console.log('Kokoro TTS ready.');
