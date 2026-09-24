/**
 * B-roll / image slots used by the film (IDs match STORYBOARD.md §9).
 * Drop a file at `public/<src>` and run `npm run sync:assets` — the placeholder is
 * replaced automatically. Only royalty-free, original or properly licensed media.
 */
export type BrollSlot = {shotId: string; src: string; description: string; sourceNote?: string};

export const BROLL = {
	B01: {shotId: 'B01', src: 'broll/B01-terminal-numbers.mp4', description: 'Macro: scrolling market-data numbers, shallow focus'},
	B02a: {shotId: 'B02a', src: 'broll/B02a-hand-at-screen.mp4', description: 'Hand gesturing at a screen'},
	B02b: {shotId: 'B02b', src: 'broll/B02b-headline-blur.mp4', description: 'Newspaper headline blur (unreadable)'},
	B02c: {shotId: 'B02c', src: 'broll/B02c-trader-rubbing-eyes.mp4', description: 'Trader rubbing their eyes'},
	B03: {shotId: 'B03', src: 'broll/B03-chalkboard.mp4', description: 'Chalkboard equations, chalk-dust macro'},
	B04: {
		shotId: 'B04',
		src: 'images/B04-jim-simons-portrait.jpg',
		description: 'Licensed archival photo of Jim Simons — or backlit silhouette at a chalkboard',
		sourceNote: 'LICENSE REQUIRED (e.g. Getty / AP) — otherwise use a silhouette',
	},
	B07: {shotId: 'B07', src: 'broll/B07-opinion-press.mp4', description: 'Desaturated opinion / newspaper texture (unreadable)'},
} satisfies Record<string, BrollSlot>;
