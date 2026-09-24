// npm run sound-design — synthesises the 7 music beds + 12 SFX (tts/sound-design.py) and
// encodes them to MP3 at the paths src/audio/library.ts expects. Existing files are kept
// unless --force, so licensed replacements you drop in are never overwritten.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdtempSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const force = process.argv.includes('--force');
const tmp = mkdtempSync(path.join(tmpdir(), 'sound-'));
try {
	execFileSync(process.env.PYTHON ?? 'python3', [path.join(root, 'tts/sound-design.py'), tmp], {stdio: 'inherit'});
	for (const kind of ['music', 'sfx']) {
		for (const f of readdirSync(path.join(tmp, kind))) {
			const dest = path.join(root, 'public/audio', kind, f.replace(/\.wav$/, '.mp3'));
			const others = ['.mp3', '.wav', '.m4a', '.aac'].map((e) => dest.replace(/\.mp3$/, e)).filter(existsSync);
			if (others.length && !force) {
				console.log(`keep   ${path.relative(root, others[0])} (exists — use --force to replace)`);
				continue;
			}
			execFileSync('npx', ['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-i', path.join(tmp, kind, f), '-c:a', 'libmp3lame', '-b:a', kind === 'music' ? '160k' : '192k', dest], {stdio: 'inherit', cwd: root});
		}
	}
	execFileSync('node', [path.join(root, 'scripts/sync-assets.mjs')], {stdio: 'inherit', cwd: root});
} finally {
	rmSync(tmp, {recursive: true, force: true});
}
