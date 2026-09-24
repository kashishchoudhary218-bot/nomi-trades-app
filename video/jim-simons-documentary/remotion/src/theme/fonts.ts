import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Fonts are bundled locally in public/fonts (SIL Open Font License — see the OFL-*.txt
 * files there) so renders are deterministic and work offline. All three are variable
 * fonts, so one file covers every weight used.
 */
const FAMILIES = [
	{family: 'Fraunces', file: 'fonts/Fraunces-Variable-latin.woff2', weight: '100 900'},
	{family: 'Inter Tight', file: 'fonts/InterTight-Variable-latin.woff2', weight: '100 900'},
	{family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-Variable-latin.woff2', weight: '100 800'},
] as const;

// Only in the browser (Studio / render). Node scripts that import scene code skip this.
if (typeof document !== 'undefined') {
	for (const f of FAMILIES) {
		loadFont({family: f.family, url: staticFile(f.file), weight: f.weight, display: 'block'}).catch((err: unknown) => {
			// loadFont already cancels the render via delayRender; this just avoids an unhandled rejection.
			console.error(`Failed to load font ${f.family}`, err);
		});
	}
}

export const fonts = {
	serif: "'Fraunces', Georgia, serif",
	sans: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
	mono: "'JetBrains Mono', 'SFMono-Regular', Menlo, monospace",
} as const;

export type FontName = keyof typeof fonts;
